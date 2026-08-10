'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin } from 'lucide-react'
import { site } from '@/lib/content'
import { reachGoal } from '@/lib/analytics'
import { AvitoIcon } from '@/components/ui/avito-icon'

/**
 * Строка над хедером: локация слева, кнопка связи справа.
 * По мере прокрутки заполняется цветом слева направо — заодно служит
 * индикатором прочитанного, а не просто украшением.
 */
export function TopBar() {
  const [progress, setProgress] = useState(0)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const update = () => {
      frame.current = null
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const value = scrollable > 0 ? window.scrollY / scrollable : 0
      setProgress(Math.min(1, Math.max(0, value)))
    }

    const onScroll = () => {
      if (frame.current === null) frame.current = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame.current !== null) window.cancelAnimationFrame(frame.current)
    }
  }, [])

  const filled = progress > 0.02

  return (
    <div className="relative isolate overflow-hidden border-b border-border bg-secondary">
      {/* Заливка. Меняется только transform — перерисовки макета нет */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 origin-left bg-primary"
        style={{ transform: `scaleX(${progress})`, willChange: 'transform' }}
      />
      <div className="mx-auto flex h-10 w-full max-w-[1400px] items-center justify-between gap-4 px-6 md:px-10 lg:px-16">
        <p
          className="flex items-center gap-1.5 text-[13px] font-medium leading-none transition-colors duration-300 sm:text-sm"
          style={{ color: filled ? 'var(--primary-foreground)' : 'var(--muted-foreground)' }}
        >
          <MapPin className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          <span className="truncate">
            {site.city} и {site.region}
          </span>
        </p>
        <a
          href={site.avitoUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-goal="click_avito"
          data-place="topbar"
          onClick={() => reachGoal('click_avito', { place: 'topbar' })}
          className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium leading-none underline decoration-transparent underline-offset-4 transition-colors duration-300 hover:decoration-current sm:text-sm"
          style={{ color: progress > 0.85 ? 'var(--primary-foreground)' : 'var(--primary)' }}
        >
          <AvitoIcon className="size-4 shrink-0" />
          <span>Написать на Авито</span>
        </a>
      </div>
    </div>
  )
}
