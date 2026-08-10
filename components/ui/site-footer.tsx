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
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-8 px-6 py-12 md:px-10 lg:px-16">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="flex flex-col gap-3">
            <span className="text-[21px] font-bold tracking-[-0.02em] text-primary">{site.domain}</span>
            <p className="max-w-[40ch] text-[15px] leading-relaxed text-muted-foreground">
              Сайты-одностраничники для подрядчиков. {site.city} и {site.region}.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <a
              href={`tel:${site.phoneRaw}`}
              className="flex min-h-[44px] items-center gap-2 text-[17px] font-medium"
            >
              <Phone className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              {site.phone}
            </a>
            <a
              href={site.avitoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-[44px] items-center gap-2 text-[17px] font-medium text-primary"
            >
              <AvitoIcon className="size-5 shrink-0" />
              Профиль на Авито
            </a>
            <p className="flex items-center gap-2 text-[15px] text-muted-foreground">
              <Clock className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {site.workingHours}
            </p>
          </div>

          <nav aria-label="Разделы страницы" className="flex flex-col gap-2">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="min-h-[44px] text-[15px] leading-[44px] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Работаю по адресам: {geo.places.join(', ')}.
        </p>

        <p className="border-t border-border pt-6 text-[13px] text-muted-foreground">
          {site.ownerName}, {site.city}. Сайт сделан на этой же технологии, что и сайты заказчиков.
        </p>
      </div>
    </footer>
  )
}
