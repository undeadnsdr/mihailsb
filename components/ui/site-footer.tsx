import { Phone, Clock } from 'lucide-react'
import { site, nav, geo } from '@/lib/content'
import { AvitoIcon } from '@/components/ui/avito-icon'

/**
 * Подвал. Название, телефон и город продублированы в том же виде,
 * что в карточках Яндекс Карт и 2ГИС — NAP-консистентность
 * влияет на локальную выдачу сильнее, чем любые ключевые слова.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      {/* px-4 на смартфоне — те же боковые отступы, что у секций выше:
          иначе подвал визуально «шире» страницы. Три колонки в ряд только
          с lg: на планшете 768px телефон, Авито, часы и меню из 10 ссылок
          не укладывались в одну строку и слипались */}
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 px-4 py-8 sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-1.5">
            <span className="text-[18px] font-bold tracking-[-0.02em] text-primary">{site.domain}</span>
            <p className="max-w-[40ch] text-[14px] leading-relaxed text-muted-foreground">
              Сайты-одностраничники для подрядчиков. {site.city} и {site.region}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {/* 44px на смартфоне — минимум для пальца; на мышиных ширинах
                возвращается компактные 36px, иначе подвал распухает */}
            <a
              href={`tel:${site.phoneRaw}`}
              className="flex min-h-11 items-center gap-1.5 text-[15px] font-medium sm:min-h-[36px]"
            >
              <Phone className="size-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              {site.phone}
            </a>
            <a
              href={site.avitoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-primary sm:min-h-[36px]"
            >
              <AvitoIcon className="size-4 shrink-0" />
              Профиль на Авито
            </a>
            <p className="flex items-center gap-1.5 text-[14px] text-muted-foreground">
              <Clock className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {site.workingHours}
            </p>
          </div>

          <nav aria-label="Разделы страницы" className="flex flex-wrap gap-x-4 gap-y-1">
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

        <div className="flex flex-col gap-1.5 border-t border-border pt-4 text-[13px] leading-relaxed text-muted-foreground">
          <p>Работаю по адресам: {geo.places.join(', ')}.</p>
          <p>
            {site.ownerName}, {site.city}. Сайт сделан на этой же технологии, что и сайты заказчиков.
          </p>
        </div>
      </div>
    </footer>
  )
}
