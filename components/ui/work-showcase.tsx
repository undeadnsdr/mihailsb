'use client'

import { useEffect, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Work } from '@/lib/content'
import { DeviceFrame, type DeviceKind } from '@/components/ui/device-frames'
import {
  SiteMockup,
  PhoneMockup,
  PhoneLandscapeMockup,
  TabletMockup,
  BlurRegions,
} from '@/components/ui/site-mockup'

/**
 * Один проект — один экран: слайдшоу устройств и описание рядом.
 *
 * Пять кадров показывают одну и ту же страницу на разной технике. Это и
 * есть доказательство заголовка секции: заказчик своими глазами видит, что
 * сайт не «поплывёт» на планшете и не превратится в мелкий текст на
 * телефоне, положенном на бок.
 *
 * Слайды меняются сами, но только пока проект в кадре: иначе шесть блоков
 * крутили бы анимации одновременно и грели процессор впустую. Ховер
 * останавливает смену — иначе невозможно рассмотреть кадр, а клик по
 * названию устройства переключает вручную и выключает автосмену совсем.
 */

type Slide = { kind: DeviceKind; label: string; short: string }

const slides: Slide[] = [
  { kind: 'laptop', label: 'Ноутбук', short: 'Ноутбук' },
  { kind: 'tablet-landscape', label: 'Планшет горизонтально', short: 'Планшет' },
  { kind: 'tablet-portrait', label: 'Планшет вертикально', short: 'Планшет ↕' },
  { kind: 'phone-portrait', label: 'Смартфон вертикально', short: 'Смартфон' },
  { kind: 'phone-landscape', label: 'Смартфон горизонтально', short: 'Смартфон ↔' },
]

export function WorkShowcase({
  work,
  index,
  reversed = false,
}: {
  work: Work
  index: number
  reversed?: boolean
}) {
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [manual, setManual] = useState(false)
  const [noFx, setNoFx] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)

  // ?nofx — кадры для объявления снимаются статично, без автосмены
  useEffect(() => {
    setNoFx(new URLSearchParams(window.location.search).has('nofx'))
  }, [])

  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.intersectionRatio > 0.35)
      },
      { threshold: [0, 0.35, 0.7] },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const rotating = inView && !hovered && !manual && !noFx

  useEffect(() => {
    if (!rotating) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length)
    }, 3800)
    return () => window.clearInterval(timer)
  }, [rotating])

  const slide = slides[active]
  const scrollable = slide.kind === 'laptop' || slide.kind === 'tablet-landscape'
  const running = scrollable && !noFx && (inView || hovered)

  return (
    <article
      className={cn(
        'grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-14',
        // Порядок колонок в шахматном порядке меняется только на десктопе:
        // на мобильном устройство всегда сверху, описание под ним, иначе
        // половина проектов начиналась бы с текста без картинки
        reversed && 'lg:[&>*:first-child]:order-2',
      )}
    >
      <div className="flex flex-col gap-4">
        <div
          ref={stageRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          // Пропорции сцены не зависят от активного устройства: иначе при
          // автосмене кадров блок дёргал бы высоту и уводил страницу из-под
          // пальца. На узком экране сцена квадратная — в 4:3 вертикальный
          // телефон выходил шириной в палец
          className="relative aspect-square w-full sm:aspect-[4/3] [container-type:size]"
        >
          <DeviceFrame kind={slide.kind}>
            {slide.kind === 'laptop' || slide.kind === 'tablet-landscape' ? (
              <>
                <div className={cn('absolute inset-x-0 top-0', running && 'autoscroll-run')}>
                  <SiteMockup work={work} priority={index === 0} />
                </div>
                <BlurRegions work={work} />
              </>
            ) : slide.kind === 'tablet-portrait' ? (
              <TabletMockup work={work} />
            ) : slide.kind === 'phone-portrait' ? (
              <PhoneMockup work={work} />
            ) : (
              <PhoneLandscapeMockup work={work} />
            )}
          </DeviceFrame>
        </div>

        {/* Переключатель устройств: он же индикатор слайдшоу */}
        <div role="group" aria-label={`Устройства: ${work.niche}`} className="flex flex-wrap gap-2">
          {slides.map((item, itemIndex) => (
            <button
              key={item.kind}
              type="button"
              aria-pressed={itemIndex === active}
              onClick={() => {
                setActive(itemIndex)
                setManual(true)
              }}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors',
                itemIndex === active
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
              )}
            >
              <span className="hidden sm:inline">{item.label}</span>
              <span className="sm:hidden">{item.short}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {work.city}
          </span>
          <h3 className="text-pretty text-[26px] font-bold leading-[1.15] tracking-[-0.02em] md:text-[34px]">
            {work.niche}
          </h3>
        </div>

        <p className="max-w-[46ch] text-pretty text-[17px] leading-relaxed text-muted-foreground">
          {work.about}
        </p>

        <ul className="flex flex-col gap-2">
          {work.mock.services.map((service) => (
            <li key={service} className="flex items-center gap-2.5 text-[15px]">
              <Check className="size-4 shrink-0 text-primary" strokeWidth={2} aria-hidden="true" />
              {service}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-border pt-4">
          <span className="text-[15px] text-muted-foreground">{work.mock.priceLabel}</span>
          <span className="tnum text-xl font-bold tracking-[-0.02em]">{work.mock.price}</span>
          <span className="w-full text-[15px] text-muted-foreground">{work.mock.guarantee}</span>
        </div>
      </div>
    </article>
  )
}
