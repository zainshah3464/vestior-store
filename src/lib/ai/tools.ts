import 'server-only'
import { tool } from 'ai'
import { z } from 'zod'
import { supabasePublic } from '@/lib/supabase/public'
import { createClient } from '@/lib/supabase/server'
import { parseProductImages } from '@/lib/utils'

/**
 * AI Tools — functions the LLM can call to fetch real data.
 *
 * AI SDK v5 API:
 *   • tool({ inputSchema, execute })  ← `inputSchema` (not `parameters`)
 *   • execute receives (input, options)
 *   • All tools return JSON-serializable results
 *
 * Security:
 *   • Tools run server-side only
 *   • Public tools (products) use supabasePublic
 *   • Auth-required tools (orders) use createClient + RLS
 */




// ─────────────────────────────────────────────────────────────
// searchProducts
// ─────────────────────────────────────────────────────────────
export const searchProductsTool = tool({
  description:
    'Search for products by name, category, or price range. Use this when the customer asks "do you have X" or "show me suits under ₹20,000". Returns up to 5 matching products.',
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe('Product name or keyword (e.g., "navy suit", "gurkha pants")'),
    category: z
      .string()
      .optional()
      .describe(
        'Category name (Pants, Shirts, Coats, Waistcoats, Suits, Gurkha, 2 Piece, 3 Piece)'
      ),
    maxPrice: z.number().optional().describe('Maximum price in PKR'),
    minPrice: z.number().optional().describe('Minimum price in PKR'),
  }),
  execute: async ({ query, category, maxPrice, minPrice }) => {
    try {
      let q = supabasePublic
        .from('products')
        .select('id, name, price, compare_at_price, category_main, stock, images')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)

      if (query) q = q.ilike('name', `%${query}%`)
      if (category) q = q.eq('category_main', category)
      if (maxPrice !== undefined) q = q.lte('price', maxPrice)
      if (minPrice !== undefined) q = q.gte('price', minPrice)

      const { data, error } = await q

      if (error) {
        return { success: false, error: 'Search failed', products: [] }
      }

      if (!data || data.length === 0) {
        return {
          success: true,
          count: 0,
          products: [],
          message: 'No products matched those filters.',
        }
      }

      return {
        success: true,
        count: data.length,
        products: data.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          compareAtPrice: p.compare_at_price,
          category: p.category_main,
          inStock: p.stock > 0,
          stock: p.stock,
          url: `/products/${p.id}`,
        })),
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Search error',
        products: [],
      }
    }
  },
})

// ─────────────────────────────────────────────────────────────
// getProductById
// ─────────────────────────────────────────────────────────────
export const getProductByIdTool = tool({
  description:
    'Get detailed information about a specific product by ID. Use this when the customer asks follow-up questions about a product you previously found.',
  inputSchema: z.object({
    id: z.string().uuid().describe('Product UUID'),
  }),
  execute: async ({ id }) => {
    try {
      const { data, error } = await supabasePublic
        .from('products')
        .select(
          'id, name, description, price, compare_at_price, category, category_main, stock, images, is_new_arrival, is_featured'
        )
        .eq('id', id)
        .eq('is_active', true)
        .single()

      if (error || !data) {
        return { success: false, error: 'Product not found' }
      }

      const images = parseProductImages(data.images)

      return {
        success: true,
        product: {
          id: data.id,
          name: data.name,
          description: data.description,
          price: data.price,
          compareAtPrice: data.compare_at_price,
          category: data.category_main,
          subcategory: data.category,
          inStock: data.stock > 0,
          stock: data.stock,
          isNewArrival: data.is_new_arrival,
          isFeatured: data.is_featured,
          image: images[0] ?? null,
          url: `/products/${data.id}`,
        },
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Fetch error',
      }
    }
  },
})

// ─────────────────────────────────────────────────────────────
// getCategories
// ─────────────────────────────────────────────────────────────
export const getCategoriesTool = tool({
  description:
    'List all available product categories. Use when customer asks "what do you sell?" or "what categories do you have?"',
  inputSchema: z.object({}),
  execute: async () => {
    try {
      const { data } = await supabasePublic
        .from('products')
        .select('category_main')
        .eq('is_active', true)

      const categories = Array.from(
        new Set((data ?? []).map((p) => p.category_main).filter(Boolean))
      ).sort()

      return {
        success: true,
        categories,
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Fetch error',
        categories: [],
      }
    }
  },
})

// ─────────────────────────────────────────────────────────────
// getMyOrders (auth-required)
// ─────────────────────────────────────────────────────────────
export const getMyOrdersTool = tool({
  description:
    "Retrieve the current user's recent order history. Only works if the customer is logged in. Use when customer asks \"where is my order\" or \"show my orders\".",
  inputSchema: z.object({
    limit: z
      .number()
      .min(1)
      .max(5)
      .optional()
      .describe('How many recent orders to return (max 5)'),
  }),
  execute: async ({ limit = 3 }) => {
    try {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return {
          success: false,
          error: 'User is not logged in',
          requiresAuth: true,
        }
      }

      const { data, error } = await supabase
        .from('orders')
        .select('id, status, payment_status, total, created_at, items')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        return { success: false, error: error.message, orders: [] }
      }

      return {
        success: true,
        count: data?.length ?? 0,
        orders: (data ?? []).map((o) => ({
          id: o.id,
          shortId: o.id.slice(0, 8).toUpperCase(),
          status: o.status,
          paymentStatus: o.payment_status,
          total: o.total,
          itemCount: Array.isArray(o.items) ? o.items.length : 0,
          createdAt: o.created_at,
          url: `/orders/${o.id}`,
        })),
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Fetch error',
        orders: [],
      }
    }
  },
})

// ─────────────────────────────────────────────────────────────
// Export all tools
// ─────────────────────────────────────────────────────────────
export const vestiorTools = {
  searchProducts: searchProductsTool,
  getProductById: getProductByIdTool,
  getCategories: getCategoriesTool,
  getMyOrders: getMyOrdersTool,
}