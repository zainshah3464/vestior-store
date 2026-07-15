import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/ProductGrid'
import { Sparkles } from 'lucide-react'
import { parseProductImages } from '@/lib/utils'

export default async function FeaturedPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, compare_at_price, images, stock, is_new_arrival')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })

  const parsedProducts = (products || []).map((product) => ({
    ...product,
    images: parseProductImages(product.images),
  }))

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4">
            <Sparkles size={14} className="text-blue-500" />
            <span className="text-xs text-blue-400 tracking-wide">PREMIUM SELECTION</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Collection</h1>
          <p className="text-gray-400 max-w-lg mx-auto">Curated pieces for the discerning gentleman</p>
        </div>

        {parsedProducts.length > 0 ? (
          <ProductGrid products={parsedProducts} />
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">No featured products at the moment.</p>
          </div>
        )}
      </div>
    </div>
  )
}