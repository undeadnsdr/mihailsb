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
  const [noFx, setNoFx] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

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

  const running = (hovered || inView) && !noFx

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
            'relative overflow-hidden rounded-2xl border border-border bg-card card-shadow',
            // container-type: size, а не inline-size: кадру нужны cqh для
            // точного доскролла, а высота и так задана соотношением 4:3
            '[container-type:size]',
          )}
          style={{ aspectRatio: '4 / 3' }}
        >
          <div className={cn('absolute inset-x-0 top-0', running && 'autoscroll-run')}>
            <SiteMockup work={work} priority={priority} />
          </div>

          {/* Слой размытия оставлен для будущих реальных скриншотов клиентов;
              у синтетических демо blurRegions пустые и слой не рендерится */}
          <BlurRegions work={work} />

          {/* Статус прокрутки — единственная стеклянная зона карточки.
              Лежит в правом нижнем углу, где у макета нет текста */}
          <span
            className={cn(
              'glass-dark absolute bottom-3 right-3 rounded-full px-3 py-1.5 text-[13px] font-medium transition-opacity',
              running ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            )}
          >
            {running ? 'прокручивается' : 'наведите'}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
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
