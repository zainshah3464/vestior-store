// src/app/(main)/products/page.tsx
import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/ProductGrid'
import { Filter } from 'lucide-react'
import Link from 'next/link'
import { parseProductImages } from '@/lib/utils'

const categories = ['Pants', 'Shirts', 'Coats', 'Waistcoats', 'Suits', 'Gurkha', '2 Piece', '3 Piece']

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams

  const supabase = await createClient()
  let query = supabase
    .from('products')
    .select('id, name, price, compare_at_price, images, stock, is_new_arrival, category_main')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category_main', category)
  }

  const { data: products } = await query

  const parsedProducts = (products || []).map((product) => ({
    ...product,
    images: parseProductImages(product.images),
  }))

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">
              {category || 'All Products'}
            </h1>
            <p className="text-gray-400 mt-1">
              {category ? `Showing ${category}` : 'Browse our complete collection'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
            <Link
              href="/products"
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                !category
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                  category === cat
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>

        {parsedProducts.length > 0 ? (
          <ProductGrid products={parsedProducts} />
        ) : (
          <div className="text-center py-16">
            <Filter size={32} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}