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

// ---- Metadata (unchanged — SEO protected) ----
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
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
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

// ---- Viewport (unchanged — accessibility preserved) ----
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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

        {/* Google Fonts */}
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
      </head>
      <body
        className="font-sans bg-[#0A0A0A] text-white antialiased selection:bg-blue-500/30 selection:text-white"
        suppressHydrationWarning
      >
        {/* ─────────────────────────────────────────────
            Skip link — enhanced focus state
           ───────────────────────────────────────────── */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-5 focus:py-2.5 focus:bg-blue-600 focus:text-white focus:text-sm focus:font-medium focus:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/60 focus:ring-offset-2 focus:ring-offset-[#0A0A0A] focus:shadow-2xl focus:shadow-blue-500/30 transition-all"
        >
          Skip to main content
        </a>

        <OrganizationSchema
          siteUrl={
            process.env.NEXT_PUBLIC_SITE_URL || 'https://vestior.vercel.app'
          }
        />
        <WebsiteSchema
          siteUrl={
            process.env.NEXT_PUBLIC_SITE_URL || 'https://vestior.vercel.app'
          }
        />
        <AuthProvider>
          <WishlistProvider>
            <TrackingProvider />
            <CartTracker />
            {children}
            <ChatWidget />
          </WishlistProvider>
        </AuthProvider>

        {/* ─────────────────────────────────────────────
            Toaster — aria-live wrapper for screen readers
           ───────────────────────────────────────────── */}
        <div aria-live="polite" aria-atomic="true">
          <Toaster
            position="top-right"
            gutter={12}
            containerClassName="!z-[9999]"
            toastOptions={{
              duration: 3000,
              style: {
                background: "rgba(18, 18, 18, 0.95)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                borderRadius: "14px",
                fontSize: "13px",
                fontWeight: 500,
                padding: "12px 16px",
                boxShadow:
                  "0 10px 30px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.02)",
                maxWidth: "380px",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#0A0A0A",
                },
                style: {
                  background: "rgba(16, 185, 129, 0.08)",
                  color: "#fff",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  padding: "12px 16px",
                  boxShadow:
                    "0 10px 30px -10px rgba(16, 185, 129, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.1)",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#0A0A0A",
                },
                style: {
                  background: "rgba(239, 68, 68, 0.08)",
                  color: "#fff",
                  border: "1px solid rgba(239, 68, 68, 0.25)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  borderRadius: "14px",
                  fontSize: "13px",
                  fontWeight: 500,
                  padding: "12px 16px",
                  boxShadow:
                    "0 10px 30px -10px rgba(239, 68, 68, 0.25), 0 0 0 1px rgba(239, 68, 68, 0.1)",
                },
              },
              loading: {
                iconTheme: {
                  primary: "#3b82f6",
                  secondary: "#0A0A0A",
                },
              },
              ariaProps: {
                role: 'status',
                'aria-live': 'polite',
              },
            }}
          />
        </div>

        {/* GA4 */}
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>

        {/* PWA */}
        <ServiceWorkerRegister />
        <InstallPrompt />
      </body>
    </html>
  )
}