import { createClient } from '@/lib/supabase/server'
import { parseProductImages } from '@/lib/utils'
import ProductsTable from '@/components/admin/ProductsTable'

export default async function AdminProductsPage() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, stock, is_active, images, category_main')
    .order('created_at', { ascending: false })

  const safeProducts = (products || []).map(product => ({
    ...product,
    images: parseProductImages(product.images)
  }))

  return <ProductsTable products={safeProducts} />
}