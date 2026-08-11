import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Manrope, Oswald } from 'next/font/google'
import { seo, site } from '@/lib/content'
import { Metrika } from '@/components/metrika'
import { ServiceWorker } from '@/components/service-worker'
import './globals.css'

/**
 * Пара шрифтов, оба с полной кириллицей.
 *
 * Oswald — заголовки и цифры цен. Узкий индустриальный гротеск: в него
 * влезает «СТРОИТЕЛЬСТВО ФУНДАМЕНТА» одной строкой там, где обычный
 * гротеск ломается на две, — а прайс-лист состоит именно из таких
 * длинных названий работ. Характер тоже по делу: это шрифт строительной
 * вывески и трафарета, а не корпоративной презентации.
 *
 * Manrope — весь текст, прайсы и FAQ. Гуманистический гротеск с открытыми
 * формами: он читается в длинных абзацах, чего Oswald не умеет, и не
 * спорит с ним по рисунку, потому что решает другую задачу.
 *
 * Два шрифта — предел: третий пришлось бы тянуть отдельным файлом,
 * а сайт открывают с телефона в поле, на мобильном интернете.
 */
const oswald = Oswald({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-oswald',
})

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-manrope',
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
    title: seo.title,
    description: seo.description,
  },
  twitter: { card: 'summary_large_image', title: seo.title, description: seo.description },
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
  // Масштабирование не запрещаем: прайс-лист читают, увеличивая цифры
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'dark',
  themeColor: '#161717',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${manrope.variable} ${oswald.variable} bg-background`}>
      {/* Запас снизу под панель связи вынесен в globals.css, а не задан
          классами: он обязан включаться ровно тем же условием, что и сама
          панель, а у трёх конкурирующих утилит (pb-[72px] / md:pb-0 /
          short-landscape:pb-14) исход зависел бы от порядка их вывода в
          CSS, а не от порядка в className */}
      <body className="font-sans antialiased">
        {children}
        <Metrika />
        <ServiceWorker />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
