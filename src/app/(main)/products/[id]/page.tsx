// src/app/(main)/products/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { parseProductImages } from '@/lib/utils'

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }> // 👈 params is a Promise
}) {
  const { id } = await params // 👈 await it
  const supabase = await createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound()
  }

  const images = parseProductImages(product.images)

  return <ProductDetailClient product={{ ...product, images }} />
}