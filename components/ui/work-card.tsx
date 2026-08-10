'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import type { Work } from '@/lib/content'
import { SiteMockup, PhoneMockup, BlurRegions } from '@/components/ui/site-mockup'

/**
 * Карточка работы: кадр с макетом демо-сайта внутри.
 *
 * Три вида кадра — под три устройства:
 * - desktop (по умолчанию) и tablet-* показывают полный макет сайта
 *   (SiteMockup) со скроллом — по курсору на десктопе, по видимости
 *   на тач-устройствах;
 * - phone показывает мобильную вёрстку сайта (PhoneMockup) статично,
 *   без скролла — контент уже умещается на один экран.
 *
 * Кадр объявлен контейнером (container-type: size), поэтому весь текст
 * внутри макета задан в cqw/cqh и масштабируется вместе с кадром —
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

  const running = (hovered || inView) && !noFx
  const scrollable = device !== 'phone'

  // Соотношения сторон кадра:
  // - phone у heating и septic подобрано так, чтобы высота совпала с
  //   соседней крупной плиткой (span-7 в 4:3) в том же ряду — 5 колонок
  //   из 12 при высоте соседа дают ширину/высоту ≈ 20/21;
  // - tablet-landscape ≈ 4:3 (классический iPad лёжа), tablet-portrait —
  //   его же перевёрнутое соотношение.
  const aspectRatio =
    device === 'phone'
      ? '20 / 21'
      : device === 'tablet-portrait'
        ? '3 / 4'
        : device === 'tablet-landscape'
          ? '4 / 3'
          : '4 / 3'

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex flex-col gap-4"
    >
      <div className="relative">
        <div
          className={cn(
            'relative [container-type:size]',
            device === 'phone'
              ? 'rounded-[9%] bg-foreground p-[3%] pt-[6%] card-shadow'
              : device === 'tablet-landscape' || device === 'tablet-portrait'
                ? 'rounded-[6%] bg-foreground p-[2.8%] card-shadow'
                : 'overflow-hidden rounded-2xl border border-border bg-card card-shadow',
          )}
          style={{ aspectRatio }}
        >
          {device === 'phone' ? (
            <>
              {/* Динамик/камера — сверху экрана, поверх тёмного корпуса */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[2%] z-10 h-[1%] w-[20%] -translate-x-1/2 rounded-full bg-background/35"
              />
              <div className="relative h-full w-full overflow-hidden rounded-[7%] bg-card">
                <PhoneMockup work={work} priority={priority} />
              </div>
              {/* Домашняя полоска — снизу экрана */}
              <span
                aria-hidden="true"
                className="absolute bottom-[1.4%] left-1/2 z-10 h-[0.8%] w-[28%] -translate-x-1/2 rounded-full bg-background/35"
              />
            </>
          ) : device === 'tablet-landscape' || device === 'tablet-portrait' ? (
            <>
              {/* Камера планшета: на длинной кромке — слева в лендскейпе, сверху в портрете */}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute z-10 size-[1.6%] rounded-full bg-background/40',
                  device === 'tablet-landscape'
                    ? 'left-[1.2%] top-1/2 -translate-y-1/2'
                    : 'left-1/2 top-[1.2%] -translate-x-1/2',
                )}
              />
              <div className="relative h-full w-full overflow-hidden rounded-[4%] bg-card [container-type:size]">
                <div className={cn('absolute inset-x-0 top-0', running && 'autoscroll-run')}>
                  <SiteMockup work={work} priority={priority} />
                </div>
                <BlurRegions work={work} />
              </div>
            </>
          ) : (
            <>
              <div className={cn('absolute inset-x-0 top-0', running && 'autoscroll-run')}>
                <SiteMockup work={work} priority={priority} />
              </div>
              <BlurRegions work={work} />
            </>
          )}

          {/* Статус прокрутки — только там, где сайт действительно скроллится */}
          {scrollable && (
            <span
              className={cn(
                'glass-dark absolute bottom-3 right-3 z-10 rounded-full px-3 py-1.5 text-[13px] font-medium transition-opacity',
                running ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
              )}
            >
              {running ? 'прокручивается' : 'наведите'}
            </span>
          )}
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
