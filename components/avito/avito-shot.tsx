import type { ReactNode } from 'react'
import type { Work } from '@/lib/content'
import { SiteMockup } from '@/components/ui/site-mockup'
import { cn } from '@/lib/utils'

/**
 * Холст под фотографию объявления на Авито.
 *
 * Зачем отдельный слой, а не секция сайта: у карточки объявления свои
 * ограничения, которых нет у страницы.
 *
 * 1. Кадр смотрят дважды и по-разному. Сначала — превью в ленте шириной
 *    ~318px, где успевает прочитаться одна короткая строка; потом — в
 *    галерее объявления, где видно всё. Поэтому подпись всегда сверху и
 *    крупная (7.2% короткой стороны кадра), а доказательство — под ней.
 * 2. На фото Авито нельзя выносить контакты — ни телефон, ни домен, ни
 *    ссылку на мессенджер. Поэтому в сноске внизу только город: он
 *    работает как фильтр «свой/чужой» и под правила не подпадает.
 * 3. Кадр обязан быть 4:3 — в этой пропорции Авито показывает фото в
 *    карточке. Холст поэтому не «во весь экран», а вписан в окно по
 *    короткой стороне: width = min(100vw, 100dvh × 4/3). Скриншот окна
 *    любого размера даёт одну и ту же композицию, а поля вокруг холста
 *    того же цвета — их можно не обрезать.
 *
 * Вся типографика считается в cqmin — процентах короткой стороны холста,
 * поэтому кадр, снятый в окне 643px и в окне 1600px, отличается только
 * резкостью, а не раскладкой.
 *
 * Фон тёмно-синий (--primary-hover) при том, что сайт светлый. Это не
 * смена стиля, а условие читаемости: доказательство здесь — скриншоты
 * светлых лендингов, на белом холсте их края растворялись бы, а сам кадр
 * сливался бы с белым фоном карточки Авито.
 */
export function AvitoShot({
  title,
  sub,
  note,
  children,
  stageClassName,
}: {
  /** Крупная подпись сверху. ReactNode — чтобы выделить цену акцентом */
  title: ReactNode
  /** Вторая строка: снимает возражение, которое поднимает первая */
  sub?: string
  /** Сноска в правом нижнем углу. Левый низ занят счётчиком фото Авито */
  note?: string
  children: ReactNode
  stageClassName?: string
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden bg-primary-hover">
      <div
        data-avito
        className="relative flex flex-col overflow-hidden bg-primary-hover text-primary-foreground [container-type:size]"
        style={{
          width: 'min(100vw, calc(100dvh * 4 / 3))',
          height: 'min(100dvh, calc(100vw * 3 / 4))',
        }}
      >
        {/* Единственный декоративный элемент серии — тёплая полоса по
            верхней кромке. Десять кадров подряд в галерее должны читаться
            как один комплект, и полоса делает это дешевле, чем плашка с
            логотипом, которая съела бы место у доказательства */}
        <span aria-hidden="true" className="h-[0.9cqmin] w-full shrink-0 bg-highlight-soft" />

        <header className="flex shrink-0 flex-col gap-[1.2cqmin] px-[5cqmin] pt-[4.4cqmin]">
          <h1 className="max-w-[88%] text-balance text-[7.2cqmin] font-bold leading-[1.04] tracking-[-0.02em]">
            {title}
          </h1>
          {sub ? (
            <p className="max-w-[82%] text-pretty text-[3.1cqmin] leading-snug text-primary-foreground/70">
              {sub}
            </p>
          ) : null}
        </header>

        <div
          className={cn(
            'flex min-h-0 flex-1 items-center justify-center px-[5cqmin] pb-[5cqmin] pt-[3.6cqmin]',
            stageClassName,
          )}
        >
          {children}
        </div>

        {note ? (
          <span className="pointer-events-none absolute bottom-[2.2cqmin] right-[5cqmin] text-[2.2cqmin] font-medium text-primary-foreground/45">
            {note}
          </span>
        ) : null}
      </div>
    </div>
  )
}

/**
 * Скриншот лендинга в окне браузера.
 *
 * Показывает ровно первый экран: макет положен в кадр с фиксированной
 * пропорцией и обрезан по нижней кромке — как настоящий скриншот, а не
 * как «вся страница мелко». В хроме окна нет адресной строки с текстом:
 * домен на фото — это ссылка, а ссылки на фото Авито запрещены.
 *
 * Окно — собственный контейнер (inline-size), поэтому точки, кромка и
 * скругления считаются от ширины ОКНА, а не холста: одна и та же вёрстка
 * годится и для кадра во весь экран, и для миниатюры в сетке из шести.
 */
export function BrowserShot({
  work,
  priority = false,
  aspect = '16 / 10',
  className,
}: {
  work: Work
  priority?: boolean
  /** Пропорция видимой части: 16/10 показывает шапку и первый экран целиком */
  aspect?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[1.6cqw] bg-card shadow-2xl ring-1 ring-inset ring-primary-foreground/15',
        '[container-type:inline-size]',
        className,
      )}
    >
      <div className="flex items-center gap-[1cqw] border-b border-border bg-secondary px-[1.8cqw] py-[1.2cqw]">
        <span aria-hidden="true" className="size-[1.1cqw] rounded-full bg-muted-foreground/35" />
        <span aria-hidden="true" className="size-[1.1cqw] rounded-full bg-muted-foreground/35" />
        <span aria-hidden="true" className="size-[1.1cqw] rounded-full bg-muted-foreground/35" />
        <span
          aria-hidden="true"
          className="ml-[1.4cqw] h-[2.2cqw] flex-1 rounded-full bg-background"
        />
      </div>

      <div className="relative w-full [container-type:size]" style={{ aspectRatio: aspect }}>
        {/* Высота не задана: макет тянется своим содержимым вниз, а окно
            обрезает всё ниже первого экрана */}
        <div className="absolute inset-x-0 top-0">
          <SiteMockup work={work} priority={priority} />
        </div>
      </div>
    </div>
  )
}

/**
 * Сцена под устройства: система координат в процентах.
 *
 * Вписывается в свободное место кадра по высоте — поэтому пропорция
 * сцены всегда уже, чем пропорция этого места (примерно 1.9:1 при холсте
 * 4:3). DeviceFrame позиционируется абсолютно внутри своей коробки,
 * поэтому каждому корпусу на сцене нужен собственный позиционированный
 * родитель с явными габаритами в процентах.
 */
export function Stage({
  ratio,
  children,
  className,
}: {
  /** Пропорция сцены, например '16 / 9' */
  ratio: string
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn('relative h-full max-w-full', className)}
      style={{ aspectRatio: ratio }}
    >
      {children}
    </div>
  )
}
