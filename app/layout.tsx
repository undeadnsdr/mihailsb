import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { seo, site } from '@/lib/content'
import { Metrika } from '@/components/metrika'
import { ServiceWorker } from '@/components/service-worker'
import './globals.css'

/**
 * Inter — единственный шрифт страницы: у него полный русский набор,
 * табличные цифры для цен и таймера, и он не тянет второй файл под
 * заголовки. Кириллица подгружается вместе с латиницей.
 */
const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: seo.title,
  description: seo.description,
  keywords: [...seo.keywords],
  applicationName: site.name,
  generator: 'v0.app',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: site.url,
    siteName: site.domain,
    title: seo.ogTitle,
    description: seo.ogDescription,
  },
  twitter: { card: 'summary_large_image', title: seo.ogTitle, description: seo.ogDescription },
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Масштабирование не запрещаем: подрядчики читают прайс, увеличивая цифры
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light',
  themeColor: '#163a5f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} bg-background`}>
      {/* Запас снизу под мобильную панель связи, чтобы она не накрывала подвал */}
      <body className="font-sans antialiased pb-[72px] md:pb-0">
        {children}
        <Metrika />
        <ServiceWorker />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
