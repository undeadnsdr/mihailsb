import { site, faq, pricing, geo } from '@/lib/content'

/**
 * Микроразметка: LocalBusiness + Service с ценой + FAQPage.
 * Данные берутся из content.ts, поэтому разметка не может разойтись
 * с тем, что человек видит на странице — за расхождение Яндекс наказывает.
 *
 * Скрипт отдаётся как строка в dangerouslySetInnerHTML: это единственный
 * поддерживаемый способ вставить ld+json, содержимое статично и не
 * приходит от пользователя.
 */
export function JsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${site.url}/#business`,
        name: site.name,
        description:
          'Разработка сайтов-одностраничников для строительных подрядчиков и частных мастеров. Срок — один день, цена 6000 ₽ вместе с доменом и хостингом.',
        url: site.url,
        telephone: site.phoneRaw,
        priceRange: '6000 ₽',
        areaServed: geo.places.map((place) => ({ '@type': 'City', name: place })),
        address: {
          '@type': 'PostalAddress',
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: 'RU',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday',
            'Sunday',
          ],
          opens: '09:00',
          closes: '21:00',
        },
      },
      {
        '@type': 'Service',
        name: 'Сайт-одностраничник под ключ',
        serviceType: 'Разработка сайта',
        provider: { '@id': `${site.url}/#business` },
        areaServed: { '@type': 'AdministrativeArea', name: site.region },
        offers: {
          '@type': 'Offer',
          price: pricing.main.price,
          priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock',
          description:
            'Сайт на одну страницу, домен .ru или .рф и хостинг на первый год. Оплата после сдачи работы.',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.items.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
