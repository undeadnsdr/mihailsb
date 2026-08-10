/**
 * Статический экспорт включается флагом STATIC_EXPORT=1 (`pnpm build:static`),
 * а не по умолчанию: в режиме export Next игнорирует headers(), и на Vercel
 * тогда не применились бы заголовки безопасности. Для шаред-хостинга те же
 * заголовки лежат в public/.htaccess и уезжают вместе со статикой.
 */
const isStaticExport = process.env.STATIC_EXPORT === '1'

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Report-Only: ссылку на страницу вставляют в превью мессенджеров и Авито,
  // поэтому сначала собираем нарушения, а не ломаем живой сайт.
  // X-Frame-Options намеренно не ставим — страница должна встраиваться в превью.
  {
    key: 'Content-Security-Policy-Report-Only',
    value: [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://va.vercel-scripts.com",
      "connect-src 'self' https://mc.yandex.ru https://va.vercel-scripts.com",
      "frame-src https://mc.yandex.ru",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
    ].join('; '),
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(isStaticExport ? { output: 'export' } : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Оптимизатор Next недоступен на шаред-хостинге, поэтому WebP и размеры
    // подготовлены заранее скриптом scripts/optimize-images.mjs
    unoptimized: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}

export default nextConfig
