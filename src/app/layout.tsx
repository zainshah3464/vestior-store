import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "react-hot-toast"
import AuthProvider from "@/providers/AuthProvider"
import WishlistProvider from "@/components/WishlistProvider"
import TrackingProvider from "@/components/TrackingProvider"
import CartTracker from "@/components/CartTracker"
import ChatWidget from '@/components/chat/ChatWidget'
import ServiceWorkerRegister from '@/components/pwa/ServiceWorkerRegister'
import InstallPrompt from '@/components/pwa/InstallPrompt'
import GoogleAnalytics from "@/components/GoogleAnalytics"
import { OrganizationSchema, WebsiteSchema } from "@/components/StructuredData"
import { Suspense } from "react"
import "./globals.css"

// ---- Fonts ----
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

// ---- Metadata ----
export const metadata: Metadata = {
  title: {
    default: "VESTIOR – Premium Tailored Fashion",
    template: "%s | VESTIOR",
  },
  description:
    "Discover hand‑crafted suits, coats, pants, and heritage Gurkha wear",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://vestior.vercel.app"
  ),
  applicationName: "VESTIOR",
  creator: "VESTIOR Studio",
  authors: [{ name: "VESTIOR", url: "https://vestior.vercel.app" }],
  keywords: [
    "suits",
    "coats",
    "pants",
    "waistcoats",
    "gurkha",
    "premium fashion",
    "tailored clothing",
    "pakistani suits",
    "luxury wear",
    "online boutique",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vestior.vercel.app",
    siteName: "VESTIOR",
    title: "VESTIOR – Premium Tailored Fashion",
    description:
      "Hand‑crafted suits, coats, pants, and heritage Gurkha wear. Premium fabrics, timeless design.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VESTIOR – Premium Tailored Fashion",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@VESTIOR",
    creator: "@VESTIOR",
    title: "VESTIOR – Premium Tailored Fashion",
    description:
      "Hand‑crafted suits, coats, pants, and heritage Gurkha wear. Premium fabrics, timeless design.",
    images: ["/og-image.png"],
  },

  icons: {
    // Modern SVG — preferred by all modern browsers
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    // Legacy fallback for older browsers
    shortcut: "/favicon.svg",
    // iOS Safari
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/icon.svg",
        color: "#3B82F6",
      },
    ],
  },

  manifest: "/manifest.json",

  other: {
    "theme-color": "#0A0A0A",
    "apple-mobile-web-app-title": "VESTIOR",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
}

// ---- Viewport ----
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // maximum-scale + user-scalable removed — Lighthouse flags these as WCAG violations.
  // Users must be able to zoom for accessibility.
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
    { media: "(prefers-color-scheme: light)", color: "#0A0A0A" },
  ],
}

// ---- Root Layout ----
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Supabase */}
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL}
        />
        <link
          rel="dns-prefetch"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL}
        />

        {/* Google Fonts — preconnect speeds up Geist fonts */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className="font-sans bg-[#0A0A0A] text-white antialiased"
        suppressHydrationWarning
      >
        {/* Skip link for keyboard / screen reader users (WCAG AA) */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Skip to main content
        </a>

        <OrganizationSchema
          siteUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://vestior.vercel.app'}
        />
        <WebsiteSchema
          siteUrl={process.env.NEXT_PUBLIC_SITE_URL || 'https://vestior.vercel.app'}
        />
        <AuthProvider>
          <WishlistProvider>
            <TrackingProvider />
            <CartTracker />
            {children}
            <ChatWidget />
          </WishlistProvider>
        </AuthProvider>

        {/* Toaster — aria-live wrapper so screen readers announce toasts */}
        <div aria-live="polite" aria-atomic="true">
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1f1f1f",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              },
              duration: 3000,
              ariaProps: {
                role: 'status',
                'aria-live': 'polite',
              },
            }}
          />
        </div>

        {/* GA4 Tracking for page views & device/browser data */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>

        {/* PWA — service worker + install prompt */}
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  )
}