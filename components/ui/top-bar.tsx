'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Phone } from 'lucide-react'
import { site, topBar } from '@/lib/content'
import { reachGoal } from '@/lib/analytics'
import { CallbackModal } from '@/components/ui/callback-modal'
import { cn } from '@/lib/utils'

/**
 * Полоска над навигацией: локация слева, «Перезвоните мне» справа.
 *
 * Раньше правая часть вела в переписку на Авито — то же действие, что и
 * кнопка в навигации чуть ниже. Теперь здесь отдельный сценарий: звонок,
 * а не переписка, поэтому дублирования с навигацией больше нет.
 *
 * По ширине и горизонтальным отступам полоска повторяет контейнер навигации
 * (те же px-6/md:px-10/lg:px-16 и max-w-[1400px]), а верхний отступ равен
 * отступу навигации над её пилюлей — тот же `floating`, что и в хедере,
 * передаётся сюда, чтобы оба отступа уменьшались синхронно при скролле.
 *
 * Заливка цветом идёт не тонкой линией, а на всю высоту полоски: копия
 * содержимого в цвете primary-foreground лежит поверх обычной копии и
 * раскрывается через clip-path слева направо на ширину прогресса скролла.
 * clip-path в процентах считается от размера самого элемента, поэтому
 * эффект работает без замера пикселей и ресайз-обсёрверов.
 */
export function TopBar({ floating }: { floating: boolean }) {
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

  return (
    <div
      className={cn(
        'mx-auto w-full max-w-[1400px] px-6 pt-3 transition-[padding] duration-300 md:px-10 lg:px-16',
        floating && 'pt-2',
      )}
    >
      <div className="relative isolate flex h-11 items-center justify-between gap-4 overflow-hidden rounded-full border border-border bg-card px-5 shadow-sm">
        {/* Базовый слой — обычные цвета, здесь же живёт реальная интерактивная кнопка */}
        <BarContent tone="muted" />

        {/* Слой заливки — декоративная копия, недоступна для указателя и скринридера,
            раскрывается слева направо на ширину прогресса скролла */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-between gap-4 rounded-full bg-primary px-5 text-primary-foreground"
          style={{ clipPath: `inset(0 ${(1 - progress) * 100}% 0 0)` }}
        >
          <BarContent tone="filled" />
        </div>
      </div>
    </div>
  )
}

/**
 * Содержимое полоски. Рендерится дважды (обычным и залитым цветом) —
 * поэтому вынесено в отдельную функцию, чтобы разметка совпадала пиксель
 * в пиксель и заливка не давала швов.
 */
function BarContent({ tone }: { tone: 'muted' | 'filled' }) {
  const muted = tone === 'muted'

  return (
    <>
      <p
        className={cn(
          'flex items-center gap-1.5 text-[13px] font-medium leading-none sm:text-sm',
          muted ? 'text-muted-foreground' : 'text-primary-foreground',
        )}
      >
        <MapPin className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        <span className="truncate">
          {site.city} и {site.region}
        </span>
      </p>

      {muted ? (
        <CallbackModal
          place="topbar"
          trigger={
            <button
              type="button"
              data-goal="click_callback"
              data-place="topbar"
              onClick={() => reachGoal('click_callback', { place: 'topbar' })}
              className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium leading-none text-primary transition-colors hover:text-primary-hover sm:text-sm"
            >
              <Phone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span className="sm:hidden">{topBar.ctaShort}</span>
              <span className="hidden sm:inline">{topBar.cta}</span>
            </button>
          }
        />
      ) : (
        <span className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium leading-none text-primary-foreground sm:text-sm">
          <Phone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          <span className="sm:hidden">{topBar.ctaShort}</span>
          <span className="hidden sm:inline">{topBar.cta}</span>
        </span>
      )}
    </>
  )
}
