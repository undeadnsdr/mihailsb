import Image from 'next/image'
import { Phone, Check, Star } from 'lucide-react'
import type { CSSProperties, ReactNode } from 'react'
import type { Work } from '@/lib/content'
import { cn } from '@/lib/utils'

/**
 * Демо-макеты сайтов подрядчиков.
 *
 * Собраны вёрсткой, а не картинкой: текст остаётся резким на любом экране,
 * весит ноль байт (вместо 900 КБ видео на карточку) и правится в content.ts.
 *
 * Раньше все семь проектов рисовались токенами этого сайта (bg-card,
 * text-primary) и одним шаблоном — в слайдшоу листался один и тот же сайт
 * с подменённым текстом. Теперь у каждого проекта своя палитра и свой
 * каркас первого экрана из work.site, а цвета приходят сюда набором
 * CSS-переменных --mk-*: одна подстановка на корне макета вместо
 * условных классов в каждом блоке.
 *
 * Палитра и каркас берутся из проекта, а не из устройства — поэтому
 * ноутбук, планшет и телефон показывают один и тот же сайт в разных
 * адаптациях, а не три разных сайта.
 */

/** Палитра проекта → CSS-переменные на корне макета */
function siteVars(work: Work): CSSProperties {
  const { site } = work
  return {
    '--mk-bg': site.bg,
    '--mk-surface': site.surface,
    '--mk-text': site.text,
    '--mk-muted': site.muted,
    '--mk-line': site.line,
    '--mk-primary': site.primary,
    '--mk-primary-fg': site.primaryFg,
    '--mk-accent': site.accent,
    '--mk-accent-fg': site.accentFg,
    '--mk-scrim': site.heroScrim,
  } as CSSProperties
}

/** Светлый текст поверх фотографии — одинаков во всех палитрах */
const OVER_PHOTO = '#f5f6f8'
const OVER_PHOTO_MUTED = '#dfe4ea'

/**
 * Десктопная версия: полный лендинг на 3–4 экрана кадра.
 *
 * Высота — по содержимому, ни одного flex-1 и ни одного процента от кадра.
 * Раньше макет растягивали до 240% высоты кадра, но тянулись при этом не
 * блоки с текстом, а промежутки между ними: в середине прокрутки посетитель
 * несколько секунд смотрел в пустое белое поле. Теперь длина макета равна
 * сумме его блоков, а прокрутка проезжает ровно этот излишек.
 *
 * Порядок блоков зависит от work.site.layout — это и есть «разные сайты»:
 * у split смета идёт сразу за первым экраном, у centered первым делом
 * галерея работ, у overlay-* сначала услуги. Каркас первого экрана
 * различается сильнее всего, потому что именно его видно на всех превью.
 */
export function SiteMockup({ work, priority = false }: { work: Work; priority?: boolean }) {
  const { mock } = work

  // Порядок блоков приходит из проекта (work.site.blocks), а не выводится
  // из каркаса первого экрана: у двух сайтов с одинаковым hero тело всё
  // равно рассказывает о себе по-разному — где решает смета, цена идёт
  // первой, где решает картинка — галерея
  const blocks: Record<string, ReactNode> = {
    services: <DesktopServices key="services" work={work} />,
    price: <DesktopPrice key="price" work={work} />,
    stats: <DesktopStats key="stats" work={work} />,
    gallery: <DesktopGallery key="gallery" work={work} />,
    steps: <DesktopSteps key="steps" work={work} />,
    review: <DesktopReview key="review" work={work} />,
  }

  return (
    <div
      style={siteVars(work)}
      className="flex w-full flex-col bg-[var(--mk-bg)] text-[var(--mk-text)]"
    >
      <DesktopHeader work={work} />

      <DesktopHero work={work} priority={priority} />
      {work.site.blocks.map((block) => blocks[block])}

      {/* Блок заявки: у настоящего лендинга подрядчика он всегда внизу —
          посетитель дочитал до конца, значит готов оставить телефон */}
      <div className="mx-[4%] mb-[2.4%] flex shrink-0 flex-col gap-[1.2cqw] rounded-lg bg-[var(--mk-accent)] px-[3cqw] py-[2.4cqw] text-[var(--mk-accent-fg)]">
        <p className="text-[1.5cqw] font-bold tracking-[-0.01em]">Рассчитать стоимость</p>
        <div className="flex items-center gap-[1cqw]">
          <span className="flex-1 rounded-md bg-[var(--mk-surface)] px-[1.6cqw] py-[1cqw] text-[1.2cqw] text-[var(--mk-muted)]">
            Телефон для связи
          </span>
          <span className="rounded-md bg-[var(--mk-primary)] px-[2cqw] py-[1cqw] text-[1.2cqw] font-medium text-[var(--mk-primary-fg)]">
            Отправить
          </span>
        </div>
      </div>

      {/* Подвал демо-сайта: здесь у настоящего сайта стоят почта и телефон —
          они и уходят под размытие */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[var(--mk-line)] bg-[var(--mk-surface)] px-[4%] py-[1.6%]">
        <span className="text-[1.2cqw] text-[var(--mk-muted)]">
          {work.niche} · {work.city}
        </span>
        <div className="flex items-center gap-[1.6cqw] text-[1.2cqw] text-[var(--mk-muted)]">
          <Contact blur={2.5}>{mock.email}</Contact>
          <Contact blur={2.5}>{mock.phone}</Contact>
        </div>
        <span className="rounded-md bg-[var(--mk-primary)] px-[1.6cqw] py-[0.9cqw] text-[1.2cqw] font-medium text-[var(--mk-primary-fg)]">
          Оставить заявку
        </span>
      </div>
    </div>
  )
}

/**
 * Контакт заказчика на макете — всегда под размытием.
 *
 * Размытие живёт на самом элементе, а не отдельным слоем в процентах от
 * кадра (как было в BlurRegions): текст едет вместе с прокруткой макета,
 * переносится вместе с ним в мобильную и планшетную вёрстку и не съезжает
 * с телефона при смене устройства. Строка остаётся на месте — сайт выглядит
 * настоящим, у которого просто закрыли контакт, а не макетом с пустотой.
 */
function Contact({
  children,
  blur = 3,
  className,
}: {
  children: ReactNode
  /** Радиус в пикселях: у крупного телефона в шапке нужен больше */
  blur?: number
  className?: string
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('select-none whitespace-nowrap', className)}
      style={{ filter: `blur(${blur}px)` }}
    >
      {children}
    </span>
  )
}

/**
 * Шапка демо-сайта: три разных варианта.
 *
 * plain   — подпись слева, меню и кнопка справа (самая частая схема)
 * centered — логотип по центру, меню строкой под ним: так делают там,
 *            где сайт продаёт вид, а не срочность
 * contact — телефон крупно рядом с кнопкой: у кровли и заборов половина
 *           заявок приходит звонком, а не через форму
 */
function DesktopHeader({ work }: { work: Work }) {
  const { mock, site } = work
  const menu =
    site.header === 'centered'
      ? ['Проекты', 'Услуги', 'Смета', 'Этапы', 'Отзывы', 'Контакты']
      : ['Услуги', 'Цены', 'Работы', 'Контакты']

  const call = (
    <span className="flex items-center gap-1 rounded-full bg-[var(--mk-primary)] px-[1.6cqw] py-[0.8cqw] text-[1.2cqw] font-medium text-[var(--mk-primary-fg)]">
      <Phone className="size-[1.4cqw]" strokeWidth={1.75} aria-hidden="true" />
      Позвонить
    </span>
  )

  if (site.header === 'centered') {
    return (
      <div className="flex shrink-0 flex-col items-center gap-[0.9cqw] border-b border-[var(--mk-line)] bg-[var(--mk-surface)] px-[4%] py-[1.4%]">
        <span className="text-[1.7cqw] font-bold uppercase tracking-[0.18em] text-[var(--mk-primary)]">
          {work.niche}
        </span>
        <div className="flex items-center gap-[1.8cqw] text-[1.15cqw] text-[var(--mk-muted)]">
          {menu.map((item) => (
            <span key={item}>{item}</span>
          ))}
          <Contact blur={2.5}>{mock.phone}</Contact>
        </div>
      </div>
    )
  }

  if (site.header === 'contact') {
    return (
      <div className="flex shrink-0 items-center justify-between gap-[2cqw] border-b border-[var(--mk-line)] bg-[var(--mk-surface)] px-[4%] py-[1.4%]">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[1.5cqw] font-bold tracking-[-0.01em] text-[var(--mk-primary)]">
            {work.niche}
          </span>
          <span className="text-[1.05cqw] text-[var(--mk-muted)]">{work.city} и область</span>
        </div>
        <div className="flex items-center gap-[1.4cqw] text-[1.15cqw] text-[var(--mk-muted)]">
          {menu.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-[1.4cqw]">
          <Contact blur={4} className="text-[1.9cqw] font-bold text-[var(--mk-text)]">
            {mock.phone}
          </Contact>
          {call}
        </div>
      </div>
    )
  }

  return (
    <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[var(--mk-line)] bg-[var(--mk-surface)] px-[4%] py-[1.6%]">
      <span className="truncate text-[1.5cqw] font-bold tracking-[-0.01em] text-[var(--mk-primary)]">
        {mock.headline}
      </span>
      <div className="flex items-center gap-[1.6cqw]">
        <div className="flex items-center gap-[1.4cqw] text-[1.15cqw] text-[var(--mk-muted)]">
          {menu.map((item) => (
            <span key={item}>{item}</span>
          ))}
          <Contact blur={2.5}>{mock.email}</Contact>
        </div>
        {call}
      </div>
    </div>
  )
}

/** Первый экран: четыре разных каркаса под work.site.layout */
function DesktopHero({ work, priority }: { work: Work; priority: boolean }) {
  const { mock, site } = work

  const photo = (
    <Image
      src={work.image}
      alt={work.imageAlt}
      fill
      sizes="(max-width: 768px) 100vw, 50vw"
      placeholder="blur"
      blurDataURL={work.blurDataURL}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      className="object-cover"
    />
  )

  const cta = (
    <span className="w-fit rounded-md bg-[var(--mk-primary)] px-[2cqw] py-[1cqw] text-[1.3cqw] font-medium text-[var(--mk-primary-fg)]">
      Бесплатный замер
    </span>
  )

  // Заголовок на цветной половине, фотография во второй: сайт узнаётся
  // по первому экрану, даже когда текста на превью не разобрать
  if (site.layout === 'split') {
    return (
      <div className="flex shrink-0" style={{ aspectRatio: '16 / 9' }}>
        <div className="flex w-[52%] flex-col justify-center gap-[1.4cqw] bg-[var(--mk-accent)] px-[4%] text-[var(--mk-accent-fg)]">
          <span className="w-fit rounded-full border border-current/30 px-[1.4cqw] py-[0.6cqw] text-[1.1cqw] font-medium opacity-80">
            {work.city}
          </span>
          <p className="text-[2.9cqw] font-bold leading-[1.05] tracking-[-0.02em]">{mock.headline}</p>
          <p className="text-[1.4cqw] leading-snug opacity-80">{mock.sub}</p>
          {cta}
        </div>
        <div className="relative flex-1">{photo}</div>
      </div>
    )
  }

  // Фото на весь экран, заголовок по центру, под ним строка преимуществ
  if (site.layout === 'centered') {
    return (
      <div className="relative shrink-0" style={{ aspectRatio: '16 / 9' }}>
        {photo}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, rgba(${site.heroScrim},0.88) 0%, rgba(${site.heroScrim},0.45) 100%)`,
          }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[1.4cqw] px-[10%] text-center">
          <p
            className="text-[2.8cqw] font-bold leading-[1.1] tracking-[-0.02em]"
            style={{ color: OVER_PHOTO }}
          >
            {mock.headline}
          </p>
          <p className="text-[1.4cqw] leading-snug" style={{ color: OVER_PHOTO_MUTED }}>
            {mock.sub}
          </p>
          {cta}
          <div
            className="mt-[1cqw] flex items-center gap-[2.4cqw] text-[1.15cqw]"
            style={{ color: OVER_PHOTO_MUTED }}
          >
            {mock.stats.map((item) => (
              <span key={item.label} className="flex items-center gap-[0.6cqw]">
                <Check
                  className="size-[1.3cqw] text-[var(--mk-primary)]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // overlay-bottom: крупный заголовок прижат к нижнему краю фотографии
  if (site.layout === 'overlay-bottom') {
    return (
      <div className="relative shrink-0" style={{ aspectRatio: '16 / 9' }}>
        {photo}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, rgba(${site.heroScrim},0.94) 8%, rgba(${site.heroScrim},0.15) 100%)`,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-[3cqw] px-[4%] pb-[3.6%]">
          <div className="flex flex-col gap-[1.2cqw]">
            <p
              className="max-w-[80%] text-[3.4cqw] font-bold leading-[1.02] tracking-[-0.03em]"
              style={{ color: OVER_PHOTO }}
            >
              {mock.headline}
            </p>
            <p className="max-w-[62%] text-[1.4cqw] leading-snug" style={{ color: OVER_PHOTO_MUTED }}>
              {mock.sub}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-[0.8cqw]">
            <span className="text-[1.2cqw]" style={{ color: OVER_PHOTO_MUTED }}>
              {mock.priceLabel}
            </span>
            <span
              className="tnum text-[2.4cqw] font-bold leading-none tracking-[-0.02em] text-[var(--mk-primary)]"
            >
              {mock.price}
            </span>
            {cta}
          </div>
        </div>
      </div>
    )
  }

  // overlay-left — классический первый экран: фото, текст слева
  return (
    <div className="relative shrink-0" style={{ aspectRatio: '16 / 9' }}>
      {photo}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `linear-gradient(90deg, rgba(${site.heroScrim},0.86) 0%, rgba(${site.heroScrim},0.2) 100%)`,
        }}
      />
      <div className="absolute inset-0 flex flex-col justify-center gap-[1.4cqw] px-[4%]">
        <p
          className="max-w-[62%] text-[2.6cqw] font-bold leading-[1.1] tracking-[-0.02em]"
          style={{ color: OVER_PHOTO }}
        >
          {mock.headline}
        </p>
        <p className="max-w-[52%] text-[1.4cqw] leading-snug" style={{ color: OVER_PHOTO_MUTED }}>
          {mock.sub}
        </p>
        {cta}
      </div>
    </div>
  )
}

/** Услуги: плитки с иконками, чипы в строку или нумерованные строки */
function DesktopServices({ work }: { work: Work }) {
  const { mock, site } = work

  return (
    <div className="flex shrink-0 flex-col gap-[1.4cqw] px-[4%] py-[2.6%]">
      <p className="text-[1.7cqw] font-bold tracking-[-0.01em]">Что делаем</p>
      {site.services === 'cards' ? (
        <div className="grid grid-cols-4 gap-[1.2cqw]">
          {mock.services.map((service) => (
            <div
              key={service}
              className="flex flex-col gap-[0.8cqw] rounded-lg border border-[var(--mk-line)] bg-[var(--mk-surface)] px-[1.6cqw] py-[1.6cqw]"
            >
              <Check
                className="size-[1.8cqw] text-[var(--mk-primary)]"
                strokeWidth={2}
                aria-hidden="true"
              />
              <span className="text-[1.25cqw] font-medium leading-snug">{service}</span>
            </div>
          ))}
        </div>
      ) : site.services === 'chips' ? (
        <div className="flex flex-wrap gap-[1.2cqw]">
          {mock.services.map((service) => (
            <span
              key={service}
              className="flex items-center gap-[0.6cqw] rounded-md bg-[var(--mk-surface)] px-[1.6cqw] py-[1cqw] text-[1.25cqw] font-medium"
            >
              <Check
                className="size-[1.3cqw] text-[var(--mk-primary)]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              {service}
            </span>
          ))}
        </div>
      ) : (
        /* rows — прайс-лист строками: слева работа, справа «от … ₽».
           Так устроены сайты, где выбирают не набор услуг, а конкретную
           позицию с ценой напротив */
        <div className="grid grid-cols-2 gap-x-[3cqw]">
          {mock.services.map((service) => (
            <div
              key={service}
              className="flex items-baseline justify-between gap-[1.4cqw] border-b border-[var(--mk-line)] py-[1.1cqw]"
            >
              <span className="text-[1.3cqw] font-medium">{service}</span>
              <span className="text-[1.15cqw] text-[var(--mk-muted)]">по замеру</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/** Цифры: плашка акцентным цветом или открытые колонки по линии сверху */
function DesktopStats({ work }: { work: Work }) {
  const { mock, site } = work

  if (site.stats === 'plain') {
    return (
      <div className="mx-[4%] grid shrink-0 grid-cols-3 gap-[2cqw] py-[2.2%]">
        {mock.stats.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-[0.5cqw] border-t-2 border-[var(--mk-primary)] pt-[1.2cqw]"
          >
            <span className="tnum text-[2.6cqw] font-bold leading-none tracking-[-0.02em]">
              {item.value}
            </span>
            <span className="text-[1.15cqw] leading-snug text-[var(--mk-muted)]">{item.label}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mx-[4%] grid shrink-0 grid-cols-3 gap-[2cqw] rounded-lg bg-[var(--mk-accent)] px-[3cqw] py-[2.4cqw] text-[var(--mk-accent-fg)]">
      {mock.stats.map((item) => (
        <div key={item.label} className="flex flex-col gap-[0.4cqw]">
          <span className="tnum text-[2.4cqw] font-bold leading-none tracking-[-0.02em] text-[var(--mk-primary)]">
            {item.value}
          </span>
          <span className="text-[1.15cqw] leading-snug opacity-80">{item.label}</span>
        </div>
      ))}
    </div>
  )
}

/** Цена */
function DesktopPrice({ work }: { work: Work }) {
  const { mock } = work
  return (
    <div className="mx-[4%] mt-[2%] flex shrink-0 items-end justify-between gap-2 rounded-lg border border-[var(--mk-line)] bg-[var(--mk-surface)] px-[3cqw] py-[2cqw]">
      <span className="text-[1.4cqw] font-medium">{mock.priceLabel}</span>
      <span className="tnum text-[2.4cqw] font-bold tracking-[-0.02em] text-[var(--mk-primary)]">
        {mock.price}
      </span>
    </div>
  )
}

/** Один кадр галереи — картинка проекта, обрезанная по пропорции слота */
function Shot({
  src,
  ratio,
  className,
}: {
  src: string
  ratio: string
  className?: string
}) {
  return (
    <div
      className={cn('relative overflow-hidden rounded-lg', className)}
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={src}
        alt=""
        aria-hidden="true"
        fill
        sizes="240px"
        loading="lazy"
        className="object-cover"
      />
    </div>
  )
}

/**
 * Галерея работ: три собственные фотографии проекта в одной из трёх
 * раскладок. Раньше здесь трижды повторялась фотография первого экрана
 * с разным object-position — на превью это читалось как один кадр,
 * продублированный от нехватки материала.
 */
function DesktopGallery({ work }: { work: Work }) {
  const { site } = work
  const [first, second, third] = work.gallery

  return (
    <div className="flex shrink-0 flex-col gap-[1.4cqw] px-[4%] py-[2.6%]">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-[1.7cqw] font-bold tracking-[-0.01em]">Наши работы</p>
        <span className="text-[1.2cqw] text-[var(--mk-muted)]">{work.city} и область</span>
      </div>

      {site.gallery === 'mosaic' ? (
        /* Мозаика: один крупный кадр и два мелких рядом — так верстают
           там, где главный объект надо показать целиком */
        <div className="grid grid-cols-3 grid-rows-2 gap-[1.2cqw]">
          <Shot src={first} ratio="16 / 11" className="col-span-2 row-span-2 h-full" />
          <Shot src={second} ratio="4 / 3" className="h-full" />
          <Shot src={third} ratio="4 / 3" className="h-full" />
        </div>
      ) : site.gallery === 'strip' ? (
        /* Лента вертикальных кадров: четвёртый обрезан правым краем —
           видно, что галерея листается дальше */
        <div className="grid grid-cols-4 gap-[1.2cqw]">
          <Shot src={first} ratio="3 / 4" />
          <Shot src={second} ratio="3 / 4" />
          <Shot src={third} ratio="3 / 4" />
          <div className="relative">
            <Shot src={first} ratio="3 / 4" className="opacity-45" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-[1.2cqw]">
          <Shot src={first} ratio="4 / 3" />
          <Shot src={second} ratio="4 / 3" />
          <Shot src={third} ratio="4 / 3" />
        </div>
      )}
    </div>
  )
}

/** Этапы работы: настоящая последовательность, поэтому и нумерация */
function DesktopSteps({ work }: { work: Work }) {
  return (
    <div className="flex shrink-0 flex-col gap-[1.4cqw] px-[4%] py-[2.6%]">
      <p className="text-[1.7cqw] font-bold tracking-[-0.01em]">Как работаем</p>
      <div className="grid grid-cols-4 gap-[1.2cqw]">
        {['Заявка', 'Замер', 'Смета', 'Работы'].map((stage, stageIndex) => (
          <div
            key={stage}
            className="flex flex-col gap-[0.6cqw] border-t-2 border-[var(--mk-primary)] pt-[1cqw]"
          >
            <span className="tnum text-[1.1cqw] font-medium text-[var(--mk-muted)]">
              Шаг {stageIndex + 1}
            </span>
            <span className="text-[1.3cqw] font-medium">{stage}</span>
          </div>
        ))}
      </div>
      <span className="mt-[0.6cqw] text-[1.2cqw] text-[var(--mk-muted)]">{work.mock.guarantee}</span>
    </div>
  )
}

/** Отзывы: три карточки вместо одной цитаты — это ещё треть экрана длины */
function DesktopReview({ work }: { work: Work }) {
  const reviews = [
    { name: 'Сергей', text: '«Приехали на замер в день звонка, сделали в срок, мусор вывезли.»' },
    { name: 'Ирина', text: '«Цену назвали сразу и не поменяли в конце. Работой довольна.»' },
    { name: 'Алексей', text: '«Связь держали каждый день, по срокам не сдвинулись ни разу.»' },
  ]
  return (
    <div className="flex shrink-0 flex-col gap-[1.4cqw] px-[4%] py-[2.6%]">
      <p className="text-[1.7cqw] font-bold tracking-[-0.01em]">Отзывы клиентов</p>
      <div className="grid grid-cols-3 gap-[1.2cqw]">
        {reviews.map((review) => (
          <div
            key={review.name}
            className="flex flex-col gap-[0.8cqw] rounded-lg border border-[var(--mk-line)] bg-[var(--mk-surface)] px-[1.8cqw] py-[1.6cqw]"
          >
            <div className="flex gap-[0.4cqw]" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="size-[1.2cqw] fill-[var(--mk-primary)] text-[var(--mk-primary)]"
                  strokeWidth={1.75}
                />
              ))}
            </div>
            <p className="text-[1.2cqw] leading-snug text-[var(--mk-muted)]">{review.text}</p>
            <p className="text-[1.2cqw] font-medium">
              {review.name}, {work.city}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Мобильная версия макета — для корпуса телефона в hero и в секции PWA.
 * Отдельная вёрстка, а не тот же макет в узкой рамке: в контейнере 280px
 * кегли из кадра 4:3 превратились бы в нечитаемые 4px.
 *
 * Это тот же сайт проекта: палитра и первый экран наследуют work.site,
 * меняется только раскладка под ширину телефона.
 */
export function PhoneMockup({ work, priority = false }: { work: Work; priority?: boolean }) {
  const { mock, site } = work
  // Centered — единственный каркас, который на телефоне заметно отличается
  // от остальных: на широких экранах он центрирует первый экран, и мобильная
  // адаптация обязана это повторить, иначе это уже другой сайт
  const centered = site.layout === 'centered'

  return (
    <div
      style={siteVars(work)}
      className="flex h-full w-full flex-col bg-[var(--mk-bg)] text-[var(--mk-text)]"
    >
      <div className="flex shrink-0 items-center justify-between gap-[2cqw] bg-[var(--mk-surface)] px-[6%] pb-[3%] pt-[9%]">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-[4.6cqw] font-bold tracking-[-0.02em] text-[var(--mk-primary)]">
            {work.niche}
          </span>
          {/* Телефон в мобильной шапке — то, ради чего заходят с улицы,
              поэтому он есть и здесь, и здесь же уходит под размытие */}
          <Contact blur={2.5} className="text-[3cqw] text-[var(--mk-muted)]">
            {mock.phone}
          </Contact>
        </div>
        <span className="flex size-[9cqw] shrink-0 items-center justify-center rounded-full bg-[var(--mk-primary)]">
          <Phone
            className="size-[4.6cqw] text-[var(--mk-primary-fg)]"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </span>
      </div>

      {/* Обложка на телефоне — не та же фотография, что на ноутбуке:
          у адаптивной вёрстки свой кадр под вертикальный экран, и это
          заодно отличает слайды слайдшоу друг от друга */}
      <div className="relative shrink-0" style={{ aspectRatio: '4 / 3' }}>
        <Image
          src={work.gallery[0]}
          alt={work.imageAlt}
          fill
          sizes="300px"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, rgba(${site.heroScrim},0.9) 0%, rgba(${site.heroScrim},0.15) 100%)`,
          }}
        />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 flex flex-col gap-[2cqw] px-[6%] pb-[5%]',
            centered && 'items-center text-center',
          )}
        >
          <p
            className="text-[6.4cqw] font-bold leading-[1.1] tracking-[-0.03em]"
            style={{ color: OVER_PHOTO }}
          >
            {mock.headline}
          </p>
          <p className="text-[3.8cqw] leading-snug" style={{ color: OVER_PHOTO_MUTED }}>
            {mock.sub}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[3cqw] px-[6%] py-[5%]">
        {/* Порядок блоков — тот же, что на широком экране: это одна
            страница в адаптиве, а не другой сайт. Из списка проекта
            берутся блоки, которые имеют смысл на узком экране */}
        {work.site.blocks
          .filter((block) => block === 'price' || block === 'stats' || block === 'services')
          .map((block) =>
            block === 'price' ? (
              <div
                key="price"
                className="flex items-end justify-between gap-2 rounded-lg bg-[var(--mk-accent)] px-[4cqw] py-[3.4cqw] text-[var(--mk-accent-fg)]"
              >
                <span className="text-[3.6cqw] font-medium leading-tight">{mock.priceLabel}</span>
                <span className="tnum whitespace-nowrap text-[5.4cqw] font-bold tracking-[-0.02em] text-[var(--mk-primary)]">
                  {mock.price}
                </span>
              </div>
            ) : block === 'stats' ? (
              /* Цифры из полосы на десктопе: на телефоне они ужимаются
                 в одну строку, но остаются теми же */
              <div key="stats" className="flex items-start justify-between gap-[2cqw]">
                {mock.stats.map((item) => (
                  <div key={item.label} className="flex flex-col gap-[0.6cqw]">
                    <span className="tnum text-[4.4cqw] font-bold leading-none tracking-[-0.02em] text-[var(--mk-primary)]">
                      {item.value}
                    </span>
                    <span className="text-[2.6cqw] leading-tight text-[var(--mk-muted)]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div key="services" className="flex flex-col gap-[2.2cqw]">
                <p className="text-[3.4cqw] font-bold tracking-[-0.01em]">Что делаем</p>
                {mock.services.map((service) => (
                  <span
                    key={service}
                    className="flex items-center gap-[2cqw] text-[3.8cqw] font-medium"
                  >
                    <Check
                      className="size-[4cqw] shrink-0 text-[var(--mk-primary)]"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {service}
                  </span>
                ))}
              </div>
            ),
          )}

        <div className="mt-auto flex flex-col gap-[2.4cqw] border-t border-[var(--mk-line)] pt-[4cqw]">
          <div className="flex gap-[1cqw]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                className="size-[3.6cqw] fill-[var(--mk-primary)] text-[var(--mk-primary)]"
                strokeWidth={1.75}
              />
            ))}
          </div>
          <p className="text-[3.4cqw] leading-snug text-[var(--mk-muted)]">
            «Приехали на замер в день звонка, сделали в срок.»
          </p>
          <p className="text-[3.4cqw] font-medium leading-snug">{mock.guarantee}</p>
          <span className="flex items-center justify-center rounded-lg bg-[var(--mk-primary)] px-[4cqw] py-[3.6cqw] text-[4cqw] font-medium text-[var(--mk-primary-fg)]">
            Вызвать на замер
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Планшетная версия макета — для корпуса планшета в портретной ориентации.
 *
 * Третья вёрстка нужна из-за геометрии: экран планшета в портрете имеет
 * пропорции ~3:4, и ни один из двух готовых макетов в него не годится.
 * Десктопный при ширине экрана 400px дал бы кегль в 6px, мобильный —
 * не влез бы по высоте (в нём одна обложка 4:3 съедает половину экрана).
 * Поэтому здесь обложка 16:9, а нижняя половина разложена в две колонки:
 * услуги слева, цена и заявка справа. Так контент умещается на один экран
 * целиком — прокручивать нечего, как и на настоящем планшете с адаптивом.
 */
export function TabletMockup({ work, priority = false }: { work: Work; priority?: boolean }) {
  const { mock, site } = work
  const centered = site.layout === 'centered'
  // Порядок из списка блоков проекта: если цена там раньше услуг, значит
  // в этой сфере считают смету — и на планшете она тоже идёт первой
  const priceFirst = site.blocks.indexOf('price') < site.blocks.indexOf('services')

  return (
    <div
      style={siteVars(work)}
      className="flex h-full w-full flex-col bg-[var(--mk-bg)] text-[var(--mk-text)]"
    >
      <div className="flex shrink-0 items-center justify-between gap-[2cqw] border-b border-[var(--mk-line)] bg-[var(--mk-surface)] px-[5%] py-[2.4%]">
        <span className="truncate text-[3.4cqw] font-bold tracking-[-0.01em] text-[var(--mk-primary)]">
          {work.niche}
        </span>
        <div className="flex shrink-0 items-center gap-[2cqw]">
          {/* На планшете в шапку помещается телефон текстом — как на
              настоящем адаптиве между мобильной иконкой и десктопной
              строкой. Он тоже под размытием */}
          <Contact blur={2.5} className="text-[2.6cqw] text-[var(--mk-muted)]">
            {mock.phone}
          </Contact>
          <span className="flex items-center gap-[1cqw] rounded-full bg-[var(--mk-primary)] px-[3cqw] py-[1.4cqw] text-[2.6cqw] font-medium text-[var(--mk-primary-fg)]">
            <Phone className="size-[2.8cqw]" strokeWidth={1.75} aria-hidden="true" />
            Позвонить
          </span>
        </div>
      </div>

      {/* Свой кадр обложки: на планшете это второе фото проекта, а не то,
          что стоит на ноутбуке и телефоне — слайды слайдшоу не должны
          отличаться только рамкой корпуса */}
      <div className="relative shrink-0" style={{ aspectRatio: '16 / 9' }}>
        <Image
          src={work.gallery[1]}
          alt={work.imageAlt}
          fill
          sizes="420px"
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, rgba(${site.heroScrim},0.9) 10%, rgba(${site.heroScrim},0.2) 100%)`,
          }}
        />
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 flex flex-col gap-[1.6cqw] px-[5%] pb-[4%]',
            centered && 'items-center text-center',
          )}
        >
          <p
            className="text-[5cqw] font-bold leading-[1.1] tracking-[-0.03em]"
            style={{ color: OVER_PHOTO }}
          >
            {mock.headline}
          </p>
          <p
            className={cn('text-[2.9cqw] leading-snug', !centered && 'max-w-[80%]')}
            style={{ color: OVER_PHOTO_MUTED }}
          >
            {mock.sub}
          </p>
        </div>
      </div>

      {/* Цифры: плашка или открытые колонки — тот же вариант, что на
          широком экране, иначе это выглядело бы как другой сайт */}
      <div
        className={cn(
          'flex shrink-0 justify-between gap-[2cqw] px-[5%] py-[2.4%]',
          site.stats === 'band'
            ? 'bg-[var(--mk-accent)] text-[var(--mk-accent-fg)]'
            : 'border-b border-[var(--mk-line)]',
        )}
      >
        {mock.stats.map((item) => (
          <div
            key={item.label}
            className={cn(
              'flex flex-col gap-[0.4cqw]',
              site.stats === 'plain' && 'border-t-2 border-[var(--mk-primary)] pt-[1.2cqw]',
            )}
          >
            <span
              className={cn(
                'tnum text-[3.6cqw] font-bold leading-none tracking-[-0.02em]',
                site.stats === 'band' && 'text-[var(--mk-primary)]',
              )}
            >
              {item.value}
            </span>
            <span
              className={cn(
                'text-[2.2cqw] leading-tight',
                site.stats === 'band' ? 'opacity-80' : 'text-[var(--mk-muted)]',
              )}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Колонки местами: у проектов, где в списке блоков цена стоит
          раньше услуг, смета и на планшете идёт первой — слева */}
      <div
        className={cn(
          'flex flex-1 gap-[4cqw] px-[5%] py-[4%]',
          priceFirst && 'flex-row-reverse',
        )}
      >
        <div className="flex flex-1 flex-col gap-[2.4cqw]">
          <p className="text-[3cqw] font-bold tracking-[-0.01em]">Что делаем</p>
          {mock.services.map((service) =>
            site.services === 'rows' ? (
              /* Прайс-лист строками — как на широком экране у этих сфер */
              <span
                key={service}
                className="flex items-baseline justify-between gap-[1.6cqw] border-b border-[var(--mk-line)] pb-[1.2cqw] text-[2.9cqw] font-medium"
              >
                {service}
                <span className="text-[2.4cqw] text-[var(--mk-muted)]">по замеру</span>
              </span>
            ) : (
              <span
                key={service}
                className="flex items-center gap-[1.6cqw] text-[2.9cqw] font-medium"
              >
                <Check
                  className="size-[3cqw] shrink-0 text-[var(--mk-primary)]"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                {service}
              </span>
            ),
          )}
          <div className="mt-auto flex flex-col gap-[1.4cqw]">
            <div className="flex gap-[0.8cqw]" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className="size-[2.8cqw] fill-[var(--mk-primary)] text-[var(--mk-primary)]"
                  strokeWidth={1.75}
                />
              ))}
            </div>
            <p className="text-[2.6cqw] leading-snug text-[var(--mk-muted)]">{mock.guarantee}</p>
          </div>
        </div>

        <div className="flex w-[42%] shrink-0 flex-col gap-[2.4cqw]">
          <div className="flex flex-col gap-[0.8cqw] rounded-lg border border-[var(--mk-line)] bg-[var(--mk-surface)] px-[3cqw] py-[2.4cqw]">
            <span className="text-[2.6cqw] font-medium">{mock.priceLabel}</span>
            <span className="tnum text-[4.4cqw] font-bold leading-none tracking-[-0.02em] text-[var(--mk-primary)]">
              {mock.price}
            </span>
          </div>
          <p className="text-[2.6cqw] leading-snug text-[var(--mk-muted)]">
            {/* Город не подставляю: work.city в именительном падеже,
                а здесь нужен предложный — вышло бы «по Тюмень» */}
            Замер бесплатно, смета в день обращения. Выезжаем по городу и области.
          </p>
          <span className="mt-auto flex items-center justify-center rounded-lg bg-[var(--mk-primary)] px-[2cqw] py-[2.6cqw] text-[2.9cqw] font-medium text-[var(--mk-primary-fg)]">
            Вызвать на замер
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Телефон, положенный на бок.
 *
 * Отдельная вёрстка нужна из-за геометрии: экран 19.5:9 — это очень
 * широкая и очень низкая полоса. Мобильный макет в ней получил бы кегль
 * в 2px по высоте, десктопный не влез бы даже шапкой. Поэтому здесь
 * контент разложен в две колонки: обложка с заголовком слева, цена,
 * услуги и кнопка справа. Кегли заданы в cqh, а не cqw — в горизонтальной
 * ориентации ограничитель именно высота, и текст обязан считаться от неё.
 */
export function PhoneLandscapeMockup({ work, priority = false }: { work: Work; priority?: boolean }) {
  const { mock, site } = work

  return (
    <div
      style={siteVars(work)}
      className="flex h-full w-full bg-[var(--mk-bg)] text-[var(--mk-text)]"
    >
      {/* Третий кадр проекта: у каждой адаптации своя обложка, поэтому
          четыре слайда слайдшоу показывают четыре разные фотографии */}
      <div className="relative w-[44%] shrink-0">
        <Image
          src={work.gallery[2]}
          alt={work.imageAlt}
          fill
          sizes="420px"
          placeholder="blur"
          blurDataURL={work.blurDataURL}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background: `linear-gradient(0deg, rgba(${site.heroScrim},0.92) 0%, rgba(${site.heroScrim},0.25) 100%)`,
          }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[1.6cqh] px-[7%] pb-[7%]">
          <p
            className="text-[8cqh] font-bold leading-[1.05] tracking-[-0.03em]"
            style={{ color: OVER_PHOTO }}
          >
            {mock.headline}
          </p>
          <p className="text-[4.6cqh] leading-snug" style={{ color: OVER_PHOTO_MUTED }}>
            {mock.sub}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[2.4cqh] px-[4%] py-[3.4%]">
        <div className="flex items-center justify-between gap-[2cqh]">
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[5cqh] font-bold tracking-[-0.02em] text-[var(--mk-primary)]">
              {work.niche}
            </span>
            <Contact blur={2} className="text-[3.4cqh] text-[var(--mk-muted)]">
              {mock.phone}
            </Contact>
          </div>
          <span className="flex shrink-0 items-center gap-[1.2cqh] rounded-full bg-[var(--mk-primary)] px-[3cqh] py-[1.6cqh] text-[4cqh] font-medium text-[var(--mk-primary-fg)]">
            <Phone className="size-[4.2cqh]" strokeWidth={1.75} aria-hidden="true" />
            Позвонить
          </span>
        </div>

        <div className="flex items-center justify-between gap-[2cqh] rounded-[2cqh] bg-[var(--mk-accent)] px-[3cqh] py-[2.2cqh] text-[var(--mk-accent-fg)]">
          <span className="text-[4cqh] font-medium">{mock.priceLabel}</span>
          <span className="tnum whitespace-nowrap text-[6cqh] font-bold tracking-[-0.02em] text-[var(--mk-primary)]">
            {mock.price}
          </span>
        </div>

        <div className="grid flex-1 grid-cols-2 content-start gap-x-[2.4cqh] gap-y-[1.6cqh]">
          {mock.services.map((service) => (
            <span key={service} className="flex items-center gap-[1.4cqh] text-[4cqh] font-medium">
              <Check
                className="size-[4.2cqh] shrink-0 text-[var(--mk-primary)]"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <span className="truncate">{service}</span>
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-[2cqh]">
          <p className="text-[3.8cqh] leading-snug text-[var(--mk-muted)]">{mock.guarantee}</p>
          <span className="shrink-0 rounded-[1.6cqh] bg-[var(--mk-primary)] px-[3cqh] py-[2cqh] text-[4cqh] font-medium text-[var(--mk-primary-fg)]">
            Вызвать на замер
          </span>
        </div>
      </div>
    </div>
  )
}

/** Слой размытия поверх макета: закрывает название и домен заказчика */
export function BlurRegions({ work, className }: { work: Work; className?: string }) {
  if (!work.blurRegions?.length) return null
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)}>
      {work.blurRegions.map((region, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: `${region.top}%`,
            left: `${region.left}%`,
            width: `${region.width}%`,
            height: `${region.height}%`,
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            background: 'rgba(238, 241, 245, 0.35)',
            borderRadius: '4px',
          }}
        />
      ))}
    </div>
  )
}
