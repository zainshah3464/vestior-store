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
}

export function ProductSchema({ product, siteUrl }: ProductSchemaProps) {
  const data = {
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