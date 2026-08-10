import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Корпуса устройств для слайдшоу работ.
 *
 * Общий принцип: каждый корпус сам себе контейнер запросов
 * ([container-type:size]), поэтому рамка, скругления, кнопки и вырезы
 * заданы в cqh — процентах ВЫСОТЫ САМОГО КОРПУСА, а не сцены под ним.
 * Благодаря этому телефон в горизонтальной ориентации не получает
 * скругление размером в половину экрана: у него короткая сторона — высота,
 * и проценты считаются от неё же.
 *
 * Сцена (родитель) задаёт только габарит: корпус вписывается в неё либо
 * по высоте (вертикальные устройства), либо по ширине (горизонтальные).
 */

export type DeviceKind =
  | 'laptop'
  | 'tablet-portrait'
  | 'tablet-landscape'
  | 'phone-portrait'
  | 'phone-landscape'

/** Габарит корпуса внутри сцены: чем ограничен и какие пропорции */
const box: Record<DeviceKind, string> = {
  // Ноутбук шире экрана: место под основание с петлёй забирает высоту,
  // поэтому крышка получает 84% ширины сцены, а не всю
  laptop: 'inset-x-0 top-1/2 -translate-y-1/2',
  'tablet-portrait': 'inset-y-0 left-1/2 -translate-x-1/2 aspect-[3/4]',
  'tablet-landscape': 'inset-y-0 left-1/2 -translate-x-1/2 aspect-[4/3]',
  'phone-portrait': 'inset-y-0 left-1/2 -translate-x-1/2 aspect-[9/19.5]',
  'phone-landscape': 'inset-x-0 top-1/2 -translate-y-1/2 aspect-[19.5/9]',
}

export function DeviceFrame({ kind, children }: { kind: DeviceKind; children: ReactNode }) {
  return (
    <div
      className={cn(
        'absolute',
        // У ноутбука высота складывается из крышки и основания, поэтому
        // ему нельзя container-type: size — размерная изоляция обнулила бы
        // вклад содержимого, и корпус схлопнулся бы в линию. Хватает
        // inline-size: cqw считается от ширины, а высота остаётся живой
        kind === 'laptop' ? '[container-type:inline-size]' : '[container-type:size]',
        box[kind],
      )}
    >
      {kind === 'laptop' ? <LaptopBody>{children}</LaptopBody> : <SlabBody kind={kind}>{children}</SlabBody>}
    </div>
  )
}

/**
 * Ноутбук: крышка с экраном 16:10 и основание с петлёй.
 *
 * Основание чуть шире крышки — как у настоящего корпуса, где крышка
 * садится внутрь периметра, — и с выемкой под палец по центру кромки.
 */
function LaptopBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[92%] rounded-t-[2.6cqw] rounded-b-[0.7cqw] bg-foreground p-[1.1cqw] card-shadow">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-t-[2.6cqw] rounded-b-[0.7cqw] ring-1 ring-inset ring-background/15"
        />
        {/* Веб-камера в верхней рамке */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[0.3cqw] z-10 size-[0.55cqw] -translate-x-1/2 rounded-full bg-background/45"
        />
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.6cqw] bg-card [container-type:size]">
          {children}
        </div>
      </div>

      {/* Основание: петля и выемка под палец */}
      <div className="relative h-[3.4cqw] w-full rounded-b-[1.6cqw] rounded-t-[0.35cqw] bg-foreground">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-b-[1.6cqw] rounded-t-[0.35cqw] ring-1 ring-inset ring-background/15"
        />
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-1/2 h-[1.2cqw] w-[15%] -translate-x-1/2 rounded-t-full bg-background/20"
        />
      </div>
    </div>
  )
}

/**
 * Планшет или телефон: монолитный корпус с рамкой, камерой и кнопками.
 *
 * short — короткая сторона корпуса: у вертикальных устройств это ширина,
 * у горизонтальных — высота. Все скругления и рамки считаются от неё,
 * поэтому один и тот же телефон, положенный на бок, выглядит одинаково.
 */
function SlabBody({
  kind,
  children,
}: {
  kind: Exclude<DeviceKind, 'laptop'>
  children: ReactNode
}) {
  const isPhone = kind === 'phone-portrait' || kind === 'phone-landscape'
  const landscape = kind === 'phone-landscape' || kind === 'tablet-landscape'
  // Радиус корпуса: у телефона ~13% короткой стороны, у планшета ~5%.
  // Единица выбирается по ориентации, чтобы процент считался от короткой
  const short = landscape ? 'cqh' : 'cqw'
  const radius = isPhone ? `13${short}` : `5.5${short}`
  const bezel = isPhone ? `1.9${short}` : `2.2${short}`
  const screenRadius = isPhone ? `11.5${short}` : `4${short}`

  return (
    <div
      className="absolute inset-0 bg-foreground card-shadow"
      style={{ borderRadius: radius, padding: bezel }}
    >
      {/* Металлический торец корпуса */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-background/15"
        style={{ borderRadius: radius }}
      />

      {/* Экран — вложенный контейнер: кегли макета считаются от его размера */}
      <div
        className="relative h-full w-full overflow-hidden bg-card [container-type:size]"
        style={{ borderRadius: screenRadius }}
      >
        {children}
      </div>

      {isPhone ? (
        <>
          {/* Островок с камерой на короткой кромке */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute z-10 rounded-full bg-foreground',
              kind === 'phone-portrait'
                ? 'left-1/2 top-[3.4cqw] h-[6.4cqw] w-[26cqw] -translate-x-1/2'
                : 'left-[3.4cqh] top-1/2 h-[26cqh] w-[6.4cqh] -translate-y-1/2',
            )}
          />
          {/* Полоска жеста «домой» */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute z-10 rounded-full bg-background/40',
              kind === 'phone-portrait'
                ? 'bottom-[2.2cqw] left-1/2 h-[1cqw] w-[26cqw] -translate-x-1/2'
                : 'right-[2.2cqh] top-1/2 h-[26cqh] w-[1cqh] -translate-y-1/2',
            )}
          />
          {/* Качелька громкости и кнопка блокировки */}
          {kind === 'phone-portrait' ? (
            <>
              <span
                aria-hidden="true"
                className="absolute -left-[1cqw] top-[18%] h-[6%] w-[1cqw] rounded-l-[0.6cqw] bg-foreground"
              />
              <span
                aria-hidden="true"
                className="absolute -left-[1cqw] top-[27%] h-[6%] w-[1cqw] rounded-l-[0.6cqw] bg-foreground"
              />
              <span
                aria-hidden="true"
                className="absolute -right-[1cqw] top-[24%] h-[9%] w-[1cqw] rounded-r-[0.6cqw] bg-foreground"
              />
            </>
          ) : (
            <>
              <span
                aria-hidden="true"
                className="absolute -bottom-[1cqh] left-[18%] h-[1cqh] w-[6%] rounded-b-[0.6cqh] bg-foreground"
              />
              <span
                aria-hidden="true"
                className="absolute -bottom-[1cqh] left-[27%] h-[1cqh] w-[6%] rounded-b-[0.6cqh] bg-foreground"
              />
              <span
                aria-hidden="true"
                className="absolute -top-[1cqh] left-[24%] h-[1cqh] w-[9%] rounded-t-[0.6cqh] bg-foreground"
              />
            </>
          )}
        </>
      ) : (
        <>
          {/* Камера планшета — по центру длинной кромки */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute z-10 rounded-full bg-background/45',
              kind === 'tablet-landscape'
                ? 'left-[0.6cqh] top-1/2 size-[1cqh] -translate-y-1/2'
                : 'left-1/2 top-[0.6cqw] size-[1cqw] -translate-x-1/2',
            )}
          />
          {/* Кнопка включения и качелька громкости */}
          <span
            aria-hidden="true"
            className={cn(
              'absolute bg-foreground',
              kind === 'tablet-landscape'
                ? '-top-[0.7cqh] right-[12%] h-[0.7cqh] w-[7%] rounded-t-[0.4cqh]'
                : '-top-[0.7cqw] right-[14%] h-[0.7cqw] w-[9%] rounded-t-[0.4cqw]',
            )}
          />
          <span
            aria-hidden="true"
            className={cn(
              'absolute bg-foreground',
              kind === 'tablet-landscape'
                ? '-right-[0.7cqh] top-[14%] h-[11%] w-[0.7cqh] rounded-r-[0.4cqh]'
                : '-right-[0.7cqw] top-[9%] h-[9%] w-[0.7cqw] rounded-r-[0.4cqw]',
            )}
          />
        </>
      )}
    </div>
  )
}
