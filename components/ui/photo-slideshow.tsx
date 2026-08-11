'use client'

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { cn } from '@/lib/utils'

/** Как долго держится каждый кадр автопрокрутки, в миллисекундах */
const SLIDE_DURATION_MS = 6000

type Photo = { src: string; alt: string }

/**
 * Слайд-шоу фотографий направления (используется в детальном блоке услуги).
 *
 * В отличие от decorативного слайд-шоу первого экрана, тут кадры листает
 * сам посетитель: это фотографии конкретных объектов по конкретному
 * направлению, и стрелки/точки — не украшение, а способ рассмотреть
 * каждую. Автопрокрутка остаётся как фон для тех, кто не кликает, но
 * останавливается при наведении и при `prefers-reduced-motion`.
 *
 * Если фотография всего одна, стрелки и точки не рендерятся вовсе —
 * контролы без выбора выглядят как сломанная кнопка, а не как слайд-шоу.
 */
export function PhotoSlideshow({ photos, className }: { photos: Photo[]; className?: string }) {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const hasMultiple = photos.length > 1

  useEffect(() => {
    if (!hasMultiple || paused) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const noFx = new URLSearchParams(window.location.search).has('nofx')
    if (reduced || noFx) return

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % photos.length)
    }, SLIDE_DURATION_MS)
    return () => window.clearInterval(timer)
  }, [hasMultiple, paused, photos.length])

  function goTo(index: number) {
    setActive(((index % photos.length) + photos.length) % photos.length)
  }

  return (
    <figure
      className={cn('group relative overflow-hidden rounded-2xl border border-border card-shadow', className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative aspect-[4/3] w-full">
        {photos.map((photo, index) => (
          <ImagePlaceholder
            key={photo.src}
            alt={photo.alt}
            active={index === active}
            className={cn(
              'transition-opacity duration-700 ease-out',
              index === active ? 'opacity-100' : 'opacity-0',
            )}
          />
        ))}

        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              aria-label="Предыдущее фото"
              className="absolute left-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 sm:size-10"
            >
              <ChevronLeft className="size-5" strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => goTo(active + 1)}
              aria-label="Следующее фото"
              className="absolute right-2 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/80 text-foreground opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 sm:size-10"
            >
              <ChevronRight className="size-5" strokeWidth={2} aria-hidden="true" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {photos.map((photo, index) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Показать фото ${index + 1} из ${photos.length}`}
                  aria-current={index === active}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    index === active ? 'w-5 bg-primary' : 'w-1.5 bg-foreground/40 hover:bg-foreground/70',
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </figure>
  )
}
