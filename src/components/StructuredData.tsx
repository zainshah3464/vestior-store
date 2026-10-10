/**
 * Structured data components for SEO.
 * Renders schema.org JSON-LD in a script tag.
 */

interface OrganizationProps {
  siteUrl: string
  logoUrl?: string
}

export function OrganizationSchema({ siteUrl, logoUrl }: OrganizationProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VESTIOR',
    url: siteUrl,
    logo: logoUrl || `${siteUrl}/icon-512.png`,
    description: 'Premium tailored men\u2019s fashion — suits, coats, pants, and heritage Gurkha wear.',
    sameAs: [
      // Add your social profiles here when ready
      // 'https://instagram.com/vestior',
      // 'https://twitter.com/vestior',
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface WebsiteProps {
  siteUrl: string
}

export function WebsiteSchema({ siteUrl }: WebsiteProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'VESTIOR',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/products?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

// ─────────────────────────────────────────────────────────────
// Product Schema (with reviews + aggregate rating)
// ─────────────────────────────────────────────────────────────

interface ProductSchemaReviewStats {
  averageRating: number
  totalCount: number
}

interface ProductSchemaReview {
  userName: string
  rating: number
  title: string | null
  comment: string
  createdAt: string
}

interface ProductSchemaProps {
  product: {
    id: string
    name: string
    description: string | null
    price: number
    compare_at_price: number | null
    images: string[]
    stock: number
    category_main: string | null
  }
  siteUrl: string
  reviewStats?: ProductSchemaReviewStats
  reviews?: ProductSchemaReview[]
}

export function ProductSchema({
  product,
  siteUrl,
  reviewStats,
  reviews,
}: ProductSchemaProps) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description:
      product.description ||
      `${product.name} — premium tailored menswear from VESTIOR.`,
    image: product.images.length > 0 ? product.images : [`${siteUrl}/og-image.png`],
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'VESTIOR',
    },
    category: product.category_main || 'Clothing',
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/products/${product.id}`,
      priceCurrency: 'PKR',
      price: product.price,
      availability:
        product.stock > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'VESTIOR',
      },
    },
  }

  // Add aggregate rating (for Google stars in search results)
  if (reviewStats && reviewStats.totalCount > 0) {
    data.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: reviewStats.averageRating.toFixed(1),
      reviewCount: reviewStats.totalCount,
      bestRating: 5,
      worstRating: 1,
    }
  }

  // Add individual reviews
  if (reviews && reviews.length > 0) {
    data.review = reviews.map((r) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.userName },
      datePublished: r.createdAt,
      reviewBody: r.comment,
      ...(r.title ? { name: r.title } : {}),
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
    }))
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface BreadcrumbProps {
  items: { name: string; url: string }[]
}

export function BreadcrumbSchema({ items }: BreadcrumbProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}