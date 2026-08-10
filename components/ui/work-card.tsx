'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Work } from '@/lib/content'
import { SiteMockup, BlurRegions } from '@/components/ui/site-mockup'

/**
 * Карточка работы: кадр 4:3, внутри свёрстанный демо-сайт, который
 * прокручивается сам. На десктопе — по курсору, на тач-устройствах —
 * когда карточка попала в центр экрана (решение правки 2 к ТЗ).
 *
 * Кадр объявлен контейнером (container-type: inline-size), поэтому
 * весь текст внутри макета задан в cqw и масштабируется вместе с кадром —
 * от плитки 300px до скриншота 1920px пропорции не меняются.
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
  const ref = useRef<HTMLDivElement>(null)

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

  const running = hovered || inView

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col gap-4"
    >
      <div className="relative">
        {/* Кадр 4:3 — тот самый, что нарезается для объявления */}
        <div
          className={cn(
            'corner-cut relative overflow-hidden rounded-2xl border border-border bg-card card-shadow',
            '[container-type:inline-size]',
          )}
          style={{ aspectRatio: '4 / 3' }}
        >
          <div className={cn('absolute inset-x-0 top-0', running && 'autoscroll-run')}>
            <SiteMockup work={work} priority={priority} />
          </div>

          <BlurRegions work={work} />

          {/* Стеклянный бейдж — одна из трёх разрешённых зон стекла */}
          <span className="glass-dark absolute left-3 top-3 rounded-full px-3 py-1.5 text-[13px] font-medium">
            {work.niche} · {work.city}
          </span>
        </div>

        {/* Управляющий элемент, вложенный в вырез */}
        <span
          aria-hidden="true"
          className={cn(
            'absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-primary text-[13px] font-medium text-primary-foreground transition-transform',
            large ? 'size-20' : 'size-16',
            running && 'scale-105',
          )}
        >
          {running ? 'идёт' : 'смотреть'}
        </span>
      </div>

      <p className="text-[15px] leading-relaxed text-muted-foreground">
        {work.mock.headline} — {work.mock.priceLabel.toLowerCase()} {work.mock.price}
      </p>
    </article>
  )
}
