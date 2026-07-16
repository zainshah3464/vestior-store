'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

export default function GoogleAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  // Send page view when route changes
  useEffect(() => {
    if (!GA_ID || typeof window === 'undefined' || !window.gtag) return
    window.gtag('config', GA_ID, {
      page_path: pathname + (searchParams.toString() ? `?${searchParams.toString()}` : ''),
    })
  }, [pathname, searchParams, GA_ID])

  // Load GA script only if ID exists
  if (!GA_ID) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  )
}
