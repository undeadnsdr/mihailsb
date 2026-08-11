import { site, nav, footerServices, geo } from '@/lib/content'

// Список ниш делится на две колонки поровну: первая половина — «в центре»,
// вторая — «справа» (см. запрос по вёрстке подвала).
const servicesLeft = footerServices.slice(0, 4)
const servicesRight = footerServices.slice(4)

/**
 * Подвал. Название и город продублированы в том же виде, что в карточках
 * Яндекс Карт и 2ГИС — NAP-консистентность влияет на локальную выдачу
 * сильнее, чем любые ключевые слова.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      {/* px-4 на смартфоне — те же боковые отступы, что у секций выше:
          иначе подвал визуально «шире» страницы. lg:flex-row кладёт три
          колонки в один ряд только на широких экранах — на телефоне и
          планшете они идут друг под другом, иначе список из 8 ниш сжался
          бы до нечитаемой ширины */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-4 py-8 sm:px-6 md:px-10 lg:flex-row lg:items-start lg:justify-between lg:gap-6 lg:px-16">
        <div className="flex flex-col gap-1.5 lg:max-w-[280px] lg:shrink-0">
          <span className="text-[18px] font-bold tracking-[-0.02em] text-primary">{site.domain}</span>
          <p className="max-w-[40ch] text-[14px] leading-relaxed text-muted-foreground">
            Сайты-одностраничники для бизнеса. {site.city} и {site.region}.
          </p>

          <nav aria-label="Разделы страницы" className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                // leading задаёт высоту строки под min-h, иначе текст
                // прижимается к верху увеличенной зоны нажатия
                className="min-h-11 text-[14px] leading-[44px] text-muted-foreground transition-colors hover:text-foreground sm:min-h-[36px] sm:leading-[36px]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Перечень сфер — «в центре» и «справа» — все ссылки ведут наверх
            (#top), это не разделы, а витрина ниш, чтобы посетитель узнал
            себя в списке. sm:grid-cols-2 кладёт обе колонки рядом уже на
            смартфоне в альбомной ориентации и на планшете; на узком
            смартфоне портретом они идут одна под другой */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:flex lg:gap-10">
          <nav aria-label="Сферы для сайта" className="flex flex-col gap-2">
            {servicesLeft.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[14px] leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <nav aria-label="Сферы для сайта" className="flex flex-col gap-2">
            {servicesRight.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[14px] leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-1.5 border-t border-border pt-4 pb-8 text-[13px] leading-relaxed text-muted-foreground">
          <p>Работаю по адресам: {geo.places.join(', ')}.</p>
          <p>
            {site.ownerName}, {site.city}. Сайт сделан на этой же технологии, что и сайты заказчиков.
          </p>
        </div>
      </div>
    </footer>
  )
}
