// src/app/(main)/products/[id]/page.tsx
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import ProductDetailClient from './ProductDetailClient'
import { parseProductImages } from '@/lib/utils'
import { ProductSchema, BreadcrumbSchema } from '@/components/StructuredData'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://vestior.vercel.app'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('name, description, price, images, category_main')
    .eq('id', id)
    .single()

  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const images = parseProductImages(product.images)
  const firstImage = images[0] || '/og-image.png'

  return {
    title: product.name,
    description:
      product.description ||
      `Shop ${product.name} at VESTIOR — premium tailored menswear.`,
    alternates: {
      canonical: `/products/${id}`,
    },
    openGraph: {
      type: 'website',
      title: product.name,
      description:
        product.description ||
        `Shop ${product.name} at VESTIOR — premium tailored menswear.`,
      images: [
        {
          url: firstImage,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      url: `${SITE_URL}/products/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Shop ${product.name} at VESTIOR.`,
      images: [firstImage],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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
  const productWithParsedImages = { ...product, images }

  return (
    <>
      <ProductSchema product={productWithParsedImages} siteUrl={SITE_URL} />
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: SITE_URL },
          { name: 'Products', url: `${SITE_URL}/products` },
          ...(product.category_main
            ? [
                {
                  name: product.category_main,
                  url: `${SITE_URL}/category/${encodeURIComponent(product.category_main)}`,
                },
              ]
            : []),
          { name: product.name, url: `${SITE_URL}/products/${id}` },
        ]}
      />
      <ProductDetailClient product={productWithParsedImages} />
    </>
  )
}