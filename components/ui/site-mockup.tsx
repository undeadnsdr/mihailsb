import Image from 'next/image'
import { Phone, Check, Star } from 'lucide-react'
import type { Work } from '@/lib/content'
import { cn } from '@/lib/utils'

/**
 * Демо-макет сайта подрядчика.
 *
 * Собран вёрсткой, а не картинкой: текст остаётся резким на любом экране,
 * весит ноль байт (вместо 900 КБ видео на карточку) и правится в content.ts.
 *
 * Высоту задаёт обёртка-скроллер, а не сам макет: слайдшоу считает по ней
 * длительность прохода, поэтому высота должна быть в одном месте. Здесь
 * h-full — макет просто занимает столько, сколько ему выделили.
 */
export function SiteMockup({ work, priority = false }: { work: Work; priority?: boolean }) {
  const { mock } = work

  return (
    <div className="flex h-full w-full flex-col bg-card text-card-foreground">
      {/* Шапка демо-сайта */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-[4%] py-[1.6%]">
        <span className="truncate text-[1.5cqw] font-bold tracking-[-0.01em] text-primary">
          {mock.headline}
        </span>
        <span className="flex items-center gap-1 rounded-full bg-primary px-[1.6cqw] py-[0.8cqw] text-[1.2cqw] font-medium text-primary-foreground">
          <Phone className="size-[1.4cqw]" strokeWidth={1.75} aria-hidden="true" />
          Позвонить
        </span>
      </div>

      {/* Первый экран демо-сайта */}
      <div className="relative shrink-0" style={{ aspectRatio: '16 / 9' }}>
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
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(90deg, rgba(17,24,39,0.78) 0%, rgba(17,24,39,0.25) 100%)' }}
        />
        <div className="absolute inset-0 flex flex-col justify-center gap-[1.4cqw] px-[4%]">
          <p className="max-w-[62%] text-[2.6cqw] font-bold leading-[1.1] tracking-[-0.02em] text-[#f5f6f8]">
            {mock.headline}
          </p>
          <p className="max-w-[52%] text-[1.4cqw] leading-snug text-[#dce6f2]">{mock.sub}</p>
          <span className="w-fit rounded-md bg-[#f5f6f8] px-[2cqw] py-[1cqw] text-[1.3cqw] font-medium text-[#163a5f]">
            Бесплатный замер
          </span>
        </div>
      </div>

      {/* Услуги */}
      <div className="flex flex-1 flex-col gap-[1.4cqw] px-[4%] py-[2.4%]">
        <p className="text-[1.7cqw] font-bold tracking-[-0.01em]">Что делаем</p>
        <div className="flex flex-wrap gap-[1.2cqw]">
          {mock.services.map((service) => (
            <span
              key={service}
              className="flex items-center gap-[0.6cqw] rounded-md bg-secondary px-[1.6cqw] py-[1cqw] text-[1.25cqw] font-medium text-secondary-foreground"
            >
              <Check className="size-[1.3cqw] text-primary" strokeWidth={1.75} aria-hidden="true" />
              {service}
            </span>
          ))}
        </div>
      </div>

      {/* Цена */}
      <div className="mx-[4%] flex shrink-0 items-end justify-between gap-2 rounded-lg bg-accent px-[3cqw] py-[2cqw] text-accent-foreground">
        <span className="text-[1.4cqw] font-medium">{mock.priceLabel}</span>
        <span className="text-[2.4cqw] font-bold tracking-[-0.02em] tnum">{mock.price}</span>
      </div>

      {/* Отзыв и гарантия */}
      <div className="flex flex-1 flex-col justify-center gap-[1cqw] px-[4%] py-[2.4%]">
        <div className="flex gap-[0.4cqw]" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} className="size-[1.4cqw] fill-primary text-primary" strokeWidth={1.75} />
          ))}
        </div>
        <p className="text-[1.3cqw] leading-snug text-muted-foreground">
          «Приехали на замер в день звонка, сделали в срок, мусор вывезли.»
        </p>
        <p className="text-[1.25cqw] font-medium">{mock.guarantee}</p>
      </div>

      {/* Подвал демо-сайта */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border px-[4%] py-[1.6%]">
        <span className="text-[1.2cqw] text-muted-foreground">
          {work.niche} · {work.city}
        </span>
        <span className="rounded-md bg-primary px-[1.6cqw] py-[0.9cqw] text-[1.2cqw] font-medium text-primary-foreground">
          Оставить заявку
        </span>
      </div>
    </div>
  )
}

/**
 * Мобильная версия макета — для корпуса телефона в hero и в секции PWA.
 * Отдельная вёрстка, а не тот же макет в узкой рамке: в контейнере 280px
 * кегли из кадра 4:3 превратились бы в нечитаемые 4px.
 */
export function PhoneMockup({ work, priority = false }: { work: Work; priority?: boolean }) {
  const { mock } = work

  return (
    <div className="flex h-full w-full flex-col bg-card text-card-foreground">
      <div className="flex shrink-0 items-center justify-between gap-2 px-[6%] pb-[3%] pt-[9%]">
        <span className="truncate text-[4.6cqw] font-bold tracking-[-0.02em] text-primary">
          {work.niche}
        </span>
        <span className="flex size-[9cqw] items-center justify-center rounded-full bg-primary">
          <Phone className="size-[4.6cqw] text-primary-foreground" strokeWidth={1.75} aria-hidden="true" />
        </span>
      </div>

      <div className="relative shrink-0" style={{ aspectRatio: '4 / 3' }}>
        <Image
          src={work.image}
          alt={work.imageAlt}
          fill
          sizes="300px"
          placeholder="blur"
          blurDataURL={work.blurDataURL}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(0deg, rgba(17,24,39,0.82) 0%, rgba(17,24,39,0.15) 100%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[2cqw] px-[6%] pb-[5%]">
          <p className="text-[6.4cqw] font-bold leading-[1.1] tracking-[-0.03em] text-[#f5f6f8]">
            {mock.headline}
          </p>
          <p className="text-[3.8cqw] leading-snug text-[#dce6f2]">{mock.sub}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[3cqw] px-[6%] py-[5%]">
        <div className="flex items-end justify-between gap-2 rounded-lg bg-accent px-[4cqw] py-[3.4cqw] text-accent-foreground">
          <span className="text-[3.6cqw] font-medium leading-tight">{mock.priceLabel}</span>
          <span className="tnum whitespace-nowrap text-[5.4cqw] font-bold tracking-[-0.02em]">
            {mock.price}
          </span>
        </div>

        <div className="flex flex-col gap-[2.2cqw]">
          <p className="text-[3.4cqw] font-bold tracking-[-0.01em]">Что делаем</p>
          {mock.services.map((service) => (
            <span key={service} className="flex items-center gap-[2cqw] text-[3.8cqw] font-medium">
              <Check className="size-[4cqw] shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              {service}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-[2.4cqw] border-t border-border pt-[4cqw]">
          <div className="flex gap-[1cqw]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star key={i} className="size-[3.6cqw] fill-primary text-primary" strokeWidth={1.75} />
            ))}
          </div>
          <p className="text-[3.4cqw] leading-snug text-muted-foreground">
            «Приехали на замер в день звонка, сделали в срок.»
          </p>
          <p className="text-[3.4cqw] font-medium leading-snug">{mock.guarantee}</p>
          <span className="flex items-center justify-center rounded-lg bg-primary px-[4cqw] py-[3.6cqw] text-[4cqw] font-medium text-primary-foreground">
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
  const { mock } = work

  return (
    <div className="flex h-full w-full flex-col bg-card text-card-foreground">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-[5%] py-[2.4%]">
        <span className="truncate text-[3.4cqw] font-bold tracking-[-0.01em] text-primary">
          {work.niche}
        </span>
        <span className="flex items-center gap-[1cqw] rounded-full bg-primary px-[3cqw] py-[1.4cqw] text-[2.6cqw] font-medium text-primary-foreground">
          <Phone className="size-[2.8cqw]" strokeWidth={1.75} aria-hidden="true" />
          Позвонить
        </span>
      </div>

      <div className="relative shrink-0" style={{ aspectRatio: '16 / 9' }}>
        <Image
          src={work.image}
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
          style={{ background: 'linear-gradient(0deg, rgba(17,24,39,0.85) 10%, rgba(17,24,39,0.2) 100%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[1.6cqw] px-[5%] pb-[4%]">
          <p className="text-[5cqw] font-bold leading-[1.1] tracking-[-0.03em] text-[#f5f6f8]">
            {mock.headline}
          </p>
          <p className="max-w-[80%] text-[2.9cqw] leading-snug text-[#dce6f2]">{mock.sub}</p>
        </div>
      </div>

      <div className="flex flex-1 gap-[4cqw] px-[5%] py-[4%]">
        <div className="flex flex-1 flex-col gap-[2.4cqw]">
          <p className="text-[3cqw] font-bold tracking-[-0.01em]">Что делаем</p>
          {mock.services.map((service) => (
            <span key={service} className="flex items-center gap-[1.6cqw] text-[2.9cqw] font-medium">
              <Check className="size-[3cqw] shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              {service}
            </span>
          ))}
          <div className="mt-auto flex flex-col gap-[1.4cqw]">
            <div className="flex gap-[0.8cqw]" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-[2.8cqw] fill-primary text-primary" strokeWidth={1.75} />
              ))}
            </div>
            <p className="text-[2.6cqw] leading-snug text-muted-foreground">{mock.guarantee}</p>
          </div>
        </div>

        <div className="flex w-[42%] shrink-0 flex-col gap-[2.4cqw]">
          <div className="flex flex-col gap-[0.8cqw] rounded-lg bg-accent px-[3cqw] py-[2.4cqw] text-accent-foreground">
            <span className="text-[2.6cqw] font-medium">{mock.priceLabel}</span>
            <span className="tnum text-[4.4cqw] font-bold leading-none tracking-[-0.02em]">
              {mock.price}
            </span>
          </div>
          <p className="text-[2.6cqw] leading-snug text-muted-foreground">
            {/* Город не подставляю: work.city в именительном падеже,
                а здесь нужен предложный — вышло бы «по Тюмень» */}
            Замер бесплатно, смета в день обращения. Выезжаем по городу и области.
          </p>
          <span className="mt-auto flex items-center justify-center rounded-lg bg-primary px-[2cqw] py-[2.6cqw] text-[2.9cqw] font-medium text-primary-foreground">
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
  const { mock } = work

  return (
    <div className="flex h-full w-full bg-card text-card-foreground">
      <div className="relative w-[44%] shrink-0">
        <Image
          src={work.image}
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
          style={{ background: 'linear-gradient(0deg, rgba(17,24,39,0.88) 0%, rgba(17,24,39,0.25) 100%)' }}
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-[1.6cqh] px-[7%] pb-[7%]">
          <p className="text-[8cqh] font-bold leading-[1.05] tracking-[-0.03em] text-[#f5f6f8]">
            {mock.headline}
          </p>
          <p className="text-[4.6cqh] leading-snug text-[#dce6f2]">{mock.sub}</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-[2.4cqh] px-[4%] py-[3.4%]">
        <div className="flex items-center justify-between gap-[2cqh]">
          <span className="truncate text-[5cqh] font-bold tracking-[-0.02em] text-primary">
            {work.niche}
          </span>
          <span className="flex items-center gap-[1.2cqh] rounded-full bg-primary px-[3cqh] py-[1.6cqh] text-[4cqh] font-medium text-primary-foreground">
            <Phone className="size-[4.2cqh]" strokeWidth={1.75} aria-hidden="true" />
            Позвонить
          </span>
        </div>

        <div className="flex items-center justify-between gap-[2cqh] rounded-[2cqh] bg-accent px-[3cqh] py-[2.2cqh] text-accent-foreground">
          <span className="text-[4cqh] font-medium">{mock.priceLabel}</span>
          <span className="tnum whitespace-nowrap text-[6cqh] font-bold tracking-[-0.02em]">
            {mock.price}
          </span>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-x-[2.4cqh] gap-y-[1.6cqh] content-start">
          {mock.services.map((service) => (
            <span key={service} className="flex items-center gap-[1.4cqh] text-[4cqh] font-medium">
              <Check className="size-[4.2cqh] shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              <span className="truncate">{service}</span>
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-[2cqh]">
          <p className="text-[3.8cqh] leading-snug text-muted-foreground">{mock.guarantee}</p>
          <span className="shrink-0 rounded-[1.6cqh] bg-primary px-[3cqh] py-[2cqh] text-[4cqh] font-medium text-primary-foreground">
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
