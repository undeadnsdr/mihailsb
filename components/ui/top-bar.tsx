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
        'mx-auto w-full max-w-[1400px] px-4 pt-2 transition-[padding] duration-300 sm:px-6 md:px-10 lg:px-16',
        floating && 'pt-1.5',
        // В горизонтальной ориентации смартфона высота экрана 320–430px:
        // полоска скрывается целиком. Оба её элемента дублируются рядом —
        // город есть в бейдже на фото первого экрана, а «Перезвоните мне»
        // в нижней панели связи, — поэтому потери смысла нет, а шапка
        // становится ниже на 36px, это почти 10% такого экрана
        'short-landscape:hidden',
      )}
    >
      <div
        className={cn(
          'relative isolate flex h-7 items-center justify-between gap-2 overflow-hidden rounded-full border border-border px-4 shadow-sm transition-all duration-300 sm:gap-4',
          floating ? 'glass' : 'bg-card',
        )}
      >
        {/* Базовый слой — обычные цвета, здесь же живёт реальная интерактивная кнопка */}
        <BarContent tone="muted" />

        {/* Слой заливки — декоративная копия, недоступна для указателя и скринридера,
            раскрывается слева направо на ширину прогресса скролла */}
        <div
          aria-hidden="true"
          // gap и px обязаны совпадать с базовым слоем до пикселя, иначе
          // заливка съезжает относительно текста под ней. Раньше здесь
          // стояло px-5 против px-4 у базы — на узком экране разница
          // в 4px была видна как дребезг текста на границе заливки
          className="pointer-events-none absolute inset-0 flex items-center justify-between gap-2 rounded-full bg-primary px-4 text-primary-foreground sm:gap-4"
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
          // min-w-0 — то, из-за чего на экране 300px кнопка «Звонок»
          // уезжала на 20px за правый край. У flex-элемента min-width
          // по умолчанию auto, поэтому этот блок отказывался сжиматься
          // ниже длины «Тюмень и Тюменская область», truncate не имел
          // никакого эффекта, а кнопка справа (shrink-0) выдавливалась
          // наружу. С min-w-0 обрезка наконец работает
          'flex min-w-0 items-center gap-1 text-xs font-medium leading-none sm:text-[13px]',
          muted ? 'text-muted-foreground' : 'text-primary-foreground',
        )}
      >
        <MapPin className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
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
              className="flex shrink-0 items-center gap-1 text-xs font-medium leading-none text-primary transition-colors hover:text-primary-hover sm:text-[13px]"
            >
              <Phone className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span className="sm:hidden">{topBar.ctaShort}</span>
              <span className="hidden sm:inline">{topBar.cta}</span>
            </button>
          }
        />
      ) : (
        <span className="flex shrink-0 items-center gap-1 text-xs font-medium leading-none text-primary-foreground sm:text-[13px]">
          <Phone className="size-3.5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
          <span className="sm:hidden">{topBar.ctaShort}</span>
          <span className="hidden sm:inline">{topBar.cta}</span>
        </span>
      )}
    </>
  )
}
