import type { Metadata } from 'next'

/**
 * Страницы-кадры для объявления на Авито (/avito1…/avito10).
 *
 * Это не страницы сайта, а холсты под скриншот, и в выдаче им делать
 * нечего: десять почти одинаковых по разметке страниц с теми же
 * формулировками, что и на главной, — это ровно тот дубликат, за который
 * поисковик режет основную страницу. noindex/nofollow объявлен один раз
 * здесь, а не копией в каждом из десяти файлов.
 *
 * Группа маршрутов (avito) не попадает в URL: адреса остаются /avito1 и
 * далее — их удобно диктовать и открывать вручную.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AvitoLayout({ children }: { children: React.ReactNode }) {
  return children
}
