'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Work } from '@/lib/content'
import { SiteMockup, PhoneMockup, TabletMockup, BlurRegions } from '@/components/ui/site-mockup'

/**
 * Карточка работы: демо-сайт в корпусе устройства.
 *
 * Два слоя, и это важно для выравнивания рядов:
 * 1. Слот — невидимая область под устройство. У desktop и планшетов он
 *    задан своим соотношением сторон, у телефона растянут на всю высоту
 *    ряда (flex-1), поэтому телефонная плитка выходит ровно той же высоты,
 *    что и крупная плитка рядом с ней в том же ряду.
 * 2. Корпус — по центру слота, со своими честными пропорциями: телефон
 *    9:19.5, планшет 4:3 (или 3:4 в портрете). Пропорции корпуса не зависят
 *    от размеров слота, поэтому телефон не «раздувается» в квадрат.
 *
 * Размеры рамки, кнопок и вырезов заданы в cqh — процентах высоты слота.
 * За счёт этого корпус остаётся пропорциональным и в плитке 300px,
 * и в скриншоте 1920px: толщина рамки и радиус скругления масштабируются
 * вместе с устройством, а не остаются фиксированными пикселями.
 *
 * Экран объявлен вложенным контейнером, поэтому кегли внутри макета
 * считаются от ширины экрана, а не от ширины карточки.
 */
export function WorkCard({
  work,
  large = false,
  priority = false,
  inView = false,
  onVisibility,
}: {
  work: Work
  large?: boolean
  priority?: boolean
  /** Родитель разрешил автопрокрутку: карточка в центре экрана */
  inView?: boolean
  onVisibility?: (id: string, ratio: number) => void
}) {
  const [hovered, setHovered] = useState(false)
  const [noFx, setNoFx] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const device = work.device ?? 'desktop'

  // ?nofx — кадры для объявления снимаются с начала макета, без прокрутки
  useEffect(() => {
    setNoFx(new URLSearchParams(window.location.search).has('nofx'))
  }, [])

  useEffect(() => {
    if (!onVisibility) return
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) onVisibility(work.id, entry.intersectionRatio)
      },
      { threshold: [0, 0.3, 0.6, 0.9] },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [onVisibility, work.id])

  // Прокрутка нужна там, где в корпус помещён полный десктопный макет.
  // Телефон и планшет в портрете показывают адаптивную вёрстку — она
  // умещается на один экран целиком, прокручивать нечего.
  const scrollable =
    device === 'desktop' || device === 'tablet-landscape' || device === 'laptop' || device === 'monitor'
  const running = (hovered || inView) && !noFx

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex h-full flex-col gap-4"
    >
      <div
        className={cn(
          'relative [container-type:size]',
          // Телефон и планшет в портрете тянутся на всю высоту ряда — её
          // задаёт широкая плитка рядом. На мобильном ряд из одной карточки,
          // тянуться не за чем, поэтому там слот получает своё соотношение.
          device === 'phone'
            ? 'max-md:aspect-[2/3] md:min-h-0 md:flex-1'
            : device === 'tablet-portrait'
              ? 'max-md:aspect-[3/4] md:min-h-0 md:flex-1'
              : 'aspect-[4/3]',
        )}
      >
        {device === 'desktop' ? (
          <div className="absolute inset-0 overflow-hidden rounded-xl border border-border bg-card [container-type:size]">
            <div className={cn('absolute inset-x-0 top-0', running && 'autoscroll-run')}>
              <SiteMockup work={work} priority={priority} />
            </div>
            <BlurRegions work={work} />
          </div>
        ) : device === 'phone' ? (
          <DeviceBody kind="phone">
            <PhoneMockup work={work} priority={priority} />
          </DeviceBody>
        ) : device === 'laptop' ? (
          <LaptopBody>
            <div className={cn('absolute inset-x-0 top-0', running && 'autoscroll-run')}>
              <SiteMockup work={work} priority={priority} />
            </div>
            <BlurRegions work={work} />
          </LaptopBody>
        ) : device === 'monitor' ? (
          <MonitorBody>
            <div className={cn('absolute inset-x-0 top-0', running && 'autoscroll-run')}>
              <SiteMockup work={work} priority={priority} />
            </div>
            <BlurRegions work={work} />
          </MonitorBody>
        ) : device === 'tablet-portrait' ? (
          // В портрете планшет показывает планшетную вёрстку: десктопный
          // макет дал бы на таком экране кегль в 6px, мобильный — не влез
          // бы по высоте
          <DeviceBody kind="tablet-portrait">
            <TabletMockup work={work} priority={priority} />
          </DeviceBody>
        ) : (
          <DeviceBody kind="tablet-landscape">
            <div className={cn('absolute inset-x-0 top-0', running && 'autoscroll-run')}>
              <SiteMockup work={work} priority={priority} />
            </div>
            <BlurRegions work={work} />
          </DeviceBody>
        )}

        {scrollable && (
          <span
            className={cn(
              'glass-dark absolute bottom-3 right-3 z-20 rounded-full px-3 py-1.5 text-[13px] font-medium transition-opacity',
              running ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            )}
          >
            {running ? 'прокручивается' : 'наведите'}
          </span>
        )}
      </div>

      <div className="flex shrink-0 flex-col gap-1">
        <h3 className={cn('font-semibold tracking-[-0.02em]', large ? 'text-xl' : 'text-lg')}>
          {work.niche} · {work.city}
        </h3>
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          {work.mock.headline} — {work.mock.priceLabel.toLowerCase()} {work.mock.price}
        </p>
      </div>
    </article>
  )
}

/**
 * Корпус ноутбука: крышка с экраном и основание с петлёй.
 *
 * Экран 16:10 — пропорция крышки современных ноутбуков. Основание чуть
 * шире крышки (как у настоящего корпуса, где крышка садится внутрь
 * периметра), с выемкой под палец по центру передней кромки.
 *
 * Высота корпуса складывается из содержимого, а не задаётся жёстко:
 * крышка получает высоту от aspect-ratio экрана, основание — от cqh
 * слота. Поэтому ноутбук всегда влезает в слот, какой бы тот ни был.
 */
function LaptopBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="relative w-[88%] rounded-t-[2.2cqh] rounded-b-[0.6cqh] bg-foreground p-[1cqh] card-shadow">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-t-[2.2cqh] rounded-b-[0.6cqh] ring-1 ring-inset ring-background/15"
        />
        {/* Веб-камера в верхней рамке */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[0.25cqh] z-10 size-[0.5cqh] -translate-x-1/2 rounded-full bg-background/45"
        />
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.4cqh] bg-card [container-type:size]">
          {children}
        </div>
      </div>

      {/* Основание: петля, выемка под палец */}
      <div className="relative h-[3.2cqh] w-[104%] rounded-b-[1.4cqh] rounded-t-[0.3cqh] bg-foreground">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-b-[1.4cqh] rounded-t-[0.3cqh] ring-1 ring-inset ring-background/15"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-[1.1cqh] w-[16%] -translate-x-1/2 rounded-t-full bg-background/20"
        />
      </div>
    </div>
  )
}

/**
 * Корпус монитора: панель 16:9 на ножке с подставкой.
 *
 * Рамка тонкая по трём сторонам и утолщённая снизу — там «подбородок»
 * с индикатором питания, как у настоящих мониторов. Ножка и стопа
 * отрисованы в cqh слота, поэтому пропорции держатся на любом размере.
 */
function MonitorBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="relative w-[94%] rounded-[1.4cqh] bg-foreground px-[0.9cqh] pb-[3cqh] pt-[0.9cqh] card-shadow">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[1.4cqh] ring-1 ring-inset ring-background/15"
        />
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[0.7cqh] bg-card [container-type:size]">
          {children}
        </div>
        {/* Индикатор питания на подбородке */}
        <span
          aria-hidden="true"
          className="absolute bottom-[1.1cqh] left-1/2 size-[0.6cqh] -translate-x-1/2 rounded-full bg-primary/70"
        />
      </div>

      {/* Ножка и стопа подставки */}
      <span aria-hidden="true" className="h-[7cqh] w-[9%] bg-foreground" />
      <span aria-hidden="true" className="h-[1.4cqh] w-[32%] rounded-[0.7cqh] bg-foreground card-shadow" />
    </div>
  )
}

/**
 * Корпус устройства: рамка, вырез камеры и боковые кнопки.
 *
 * Все размеры — в cqh родительского слота, поэтому корпус пропорционален
 * на любом размере карточки. Кнопки выступают за край рамки, поэтому
 * overflow-hidden висит на экране, а не на корпусе.
 */
function DeviceBody({
  kind,
  children,
}: {
  kind: 'phone' | 'tablet-landscape' | 'tablet-portrait'
  children: React.ReactNode
}) {
  const isPhone = kind === 'phone'

  return (
    <div
      className={cn(
        'absolute inset-y-0 left-1/2 -translate-x-1/2 bg-foreground card-shadow',
        // Радиус и рамка: у телефона скругление ~13% ширины корпуса,
        // у планшета ~5% короткой стороны — как у настоящих устройств
        isPhone
          ? 'aspect-[9/19.5] rounded-[6cqh] p-[0.9cqh]'
          : kind === 'tablet-landscape'
            ? 'aspect-[4/3] rounded-[4.5cqh] p-[1.6cqh]'
            : 'aspect-[3/4] rounded-[4.5cqh] p-[1.6cqh]',
      )}
    >
      {/* Металлический торец корпуса */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 ring-1 ring-inset ring-background/15',
          isPhone ? 'rounded-[6cqh]' : 'rounded-[4.5cqh]',
        )}
      />

      {/* Экран: вложенный контейнер, от его ширины считаются кегли макета */}
      <div
        className={cn(
          'relative h-full w-full overflow-hidden bg-card [container-type:size]',
          isPhone ? 'rounded-[5.2cqh]' : 'rounded-[3.2cqh]',
        )}
      >
        {children}
      </div>

      {isPhone ? (
        <>
          {/* Островок с камерой поверх экрана */}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-[1.7cqh] z-10 h-[3.2cqh] w-[13cqh] -translate-x-1/2 rounded-full bg-foreground"
          />
          {/* Полоска жеста «домой» */}
          <span
            aria-hidden="true"
            className="absolute bottom-[1.1cqh] left-1/2 z-10 h-[0.5cqh] w-[13cqh] -translate-x-1/2 rounded-full bg-background/40"
          />
          {/* Качелька громкости и кнопка блокировки */}
          <span
            aria-hidden="true"
            className="absolute -left-[0.5cqh] top-[17%] h-[4%] w-[0.5cqh] rounded-l-[0.3cqh] bg-foreground"
          />
          <span
            aria-hidden="true"
            className="absolute -left-[0.5cqh] top-[24%] h-[7%] w-[0.5cqh] rounded-l-[0.3cqh] bg-foreground"
          />
          <span
            aria-hidden="true"
            className="absolute -left-[0.5cqh] top-[33%] h-[7%] w-[0.5cqh] rounded-l-[0.3cqh] bg-foreground"
          />
          <span
            aria-hidden="true"
            className="absolute -right-[0.5cqh] top-[26%] h-[9%] w-[0.5cqh] rounded-r-[0.3cqh] bg-foreground"
          />
        </>
      ) : (
        <>
          {/* Камера планшета — по центру длинной кромки */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute z-10 size-[0.8cqh] rounded-full bg-background/45',
              kind === 'tablet-landscape'
                ? 'left-[0.4cqh] top-1/2 -translate-y-1/2'
                : 'left-1/2 top-[0.4cqh] -translate-x-1/2',
            )}
          />
          {/* Кнопка включения и качелька громкости на верхней кромке */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute bg-foreground',
              kind === 'tablet-landscape'
                ? '-top-[0.5cqh] right-[12%] h-[0.5cqh] w-[7%] rounded-t-[0.3cqh]'
                : '-top-[0.5cqh] right-[14%] h-[0.5cqh] w-[9%] rounded-t-[0.3cqh]',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'absolute bg-foreground',
              kind === 'tablet-landscape'
                ? '-right-[0.5cqh] top-[14%] h-[11%] w-[0.5cqh] rounded-r-[0.3cqh]'
                : '-right-[0.5cqh] top-[9%] h-[9%] w-[0.5cqh] rounded-r-[0.3cqh]',
            )}
          />
        </>
      )}
    </div>
  )
}
