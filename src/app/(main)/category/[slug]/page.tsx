import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/ProductGrid'
import { parseProductImages } from '@/lib/utils'

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const decodedSlug = decodeURIComponent(slug)

  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, compare_at_price, images, stock, is_new_arrival')
    .eq('category_main', decodedSlug)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  const parsedProducts = (products || []).map(p => ({
    ...p,
    images: parseProductImages(p.images),
  }))

  return (
    <div className="min-h-screen bg-black pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">{decodedSlug}</h1>
        {parsedProducts.length > 0 ? (
          <ProductGrid products={parsedProducts} />
        ) : (
          <p className="text-gray-500">No products in this category.</p>
        )}
      </div>
    </div>
  )
}