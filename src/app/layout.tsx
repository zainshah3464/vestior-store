import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "react-hot-toast"
import AuthProvider from "@/providers/AuthProvider"
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

// ---- Metadata (updated domain + icons) ----
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
  robots: "index, follow",

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
        url: "/og-image.png", // 1200x630 PNG
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
    icon: "/favicon.ico",       // root of public/
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "192x192",
        url: "/icon-192.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "512x512",
        url: "/icon-512.png",
      },
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#0A0A0A",
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
  maximumScale: 1,
  userScalable: false,
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL}
        />
        <link
          rel="dns-prefetch"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL}
        />
      </head>
      <body
        className="font-sans bg-[#0A0A0A] text-white antialiased"
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1f1f1f",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
            duration: 3000,
          }}
        />
      </body>
    </html>
  )
}
