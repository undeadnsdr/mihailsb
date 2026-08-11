import { Phone } from 'lucide-react'
import { site, services, footer, geo, telegramLink } from '@/lib/content'
import { TelegramIcon } from '@/components/ui/telegram-icon'

/**
 * Подвал. Название, телефон и город продублированы в том же виде, что в
 * карточках Яндекс Карт и 2ГИС — NAP-консистентность влияет на локальную
 * выдачу сильнее, чем любые ключевые слова.
 */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary">
      {/* px-4 на смартфоне — те же боковые отступы, что у секций выше:
          иначе подвал визуально «шире» страницы. Четыре колонки в ряд
          только с lg — на планшете список направлений сжался бы
          до нечитаемой ширины */}
      <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 md:px-10 lg:grid-cols-4 lg:gap-6 lg:px-16">
        <div className="flex flex-col gap-3">
          <span className="display-caps text-[20px] tracking-[0.02em] text-foreground">{site.name}</span>
          <p className="max-w-[42ch] text-[14px] leading-relaxed text-muted-foreground">{footer.about}</p>
        </div>

        <nav aria-label={footer.servicesTitle} className="flex flex-col gap-2">
          <h2 className="text-[14px] font-semibold tracking-[0.01em] text-foreground">
            {footer.servicesTitle}
          </h2>
          {services.map((item) => (
            <a
              key={item.slug}
              href={`#${item.slug}`}
              className="text-[14px] leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.navTitle}
            </a>
          ))}
        </nav>

        <nav aria-label={footer.companyTitle} className="flex flex-col gap-2">
          <h2 className="text-[14px] font-semibold tracking-[0.01em] text-foreground">
            {footer.companyTitle}
          </h2>
          {footer.companyLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[14px] leading-relaxed text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex flex-col gap-3">
          <h2 className="text-[14px] font-semibold tracking-[0.01em] text-foreground">
            {footer.contactsTitle}
          </h2>
          {/* Номер крупнее остального подвала и набран Oswald: это последний
              экран страницы, и здесь он основная точка контакта, а не сноска */}
          <a
            href={`tel:${site.phoneRaw}`}
            data-goal="click_phone"
            data-place="footer"
            className="display-caps flex min-h-11 items-center gap-2 text-[19px] tracking-[0.01em] text-primary transition-colors hover:text-primary-hover"
          >
            <Phone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            {site.phone}
          </a>
          <a
            href={telegramLink()}
            target="_blank"
            rel="noopener noreferrer"
            data-goal="click_telegram"
            data-place="footer"
            className="flex min-h-11 items-center gap-2 text-[14px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <TelegramIcon className="size-4 shrink-0" />
            Написать в Telegram
          </a>
          <p className="text-[14px] leading-relaxed text-muted-foreground">{site.workingHours}</p>
          <p className="text-[14px] leading-relaxed text-muted-foreground">{site.areaServed}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-10 lg:px-16">
        <div className="flex flex-col gap-1.5 border-t border-border pt-4 pb-8 text-[13px] leading-relaxed text-muted-foreground">
          <p>Выезжаем: {geo.places.join(', ')}.</p>
          <p>{footer.privacyNote}</p>
          <p>
            {footer.copyright} {footer.legal}.
          </p>
        </div>
      </div>
    </footer>
  )
}
