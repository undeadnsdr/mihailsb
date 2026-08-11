import { site, faq, geo, services } from '@/lib/content'

/**
 * Микроразметка: GeneralContractor + Service по каждому направлению + FAQPage.
 *
 * GeneralContractor, а не общий LocalBusiness: это подтип, который Яндекс и
 * Google понимают именно как «строительный подрядчик», — от него зависит,
 * в какую товарную категорию попадёт карточка в выдаче.
 *
 * Данные берутся из content.ts, поэтому разметка не может разойтись с тем,
 * что человек видит на странице — за расхождение поисковики наказывают.
 * AggregateRating сознательно не размечен: отзывы на странице пока не
 * подтверждены публичным источником, а рейтинг по непроверяемым отзывам —
 * прямой путь к ручным санкциям.
 */
export function JsonLd() {
  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'GeneralContractor',
        '@id': `${site.url}/#business`,
        name: site.name,
        description: site.tagline,
        url: site.url,
        telephone: site.phoneRaw,
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
          opens: '08:00',
          closes: '21:00',
        },
        makesOffer: services.map((service) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service.title },
        })),
      },
      // Отдельный Service на каждое направление: у них разные цены и разная
      // поисковая выдача, и один общий «строительные работы» не даёт шанса
      // попасть в результат по запросу «подъём дома замена венцов»
      ...services.map((service) => ({
        '@type': 'Service',
        '@id': `${site.url}/#${service.slug}`,
        name: service.title,
        serviceType: service.navTitle,
        description: service.short,
        provider: { '@id': `${site.url}/#business` },
        areaServed: { '@type': 'AdministrativeArea', name: site.region },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'RUB',
          availability: 'https://schema.org/InStock',
          // priceSpecification с минимумом, а не price: прайс построчный,
          // и единственного числа у направления не существует. Минимум —
          // единственная честная цифра, которую можно назвать до замера
          priceSpecification: {
            '@type': 'PriceSpecification',
            minPrice: service.priceFrom,
            priceCurrency: 'RUB',
          },
        },
      })),
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
