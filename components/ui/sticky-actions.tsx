'use client'

import { useEffect, useState } from 'react'
import { ArrowUp, Phone } from 'lucide-react'
import { site } from '@/lib/content'
import { reachGoal } from '@/lib/analytics'
import { AvitoIcon } from '@/components/ui/avito-icon'
import { cn } from '@/lib/utils'

const button =
  'glass flex size-11 items-center justify-center rounded-xl text-primary transition-colors hover:text-primary-hover md:size-12'

/**
 * Фиксированная колонка справа. На горизонтальном смартфоне уходит
 * в горизонтальный стек снизу — вертикально там места нет.
 * При появлении формы во вьюпорте панель прячется, чтобы не перекрывать поля.
 */
export function StickyActions() {
  const [showTop, setShowTop] = useState(false)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const target = document.getElementById('contact')
    if (!target) return
    const observer = new IntersectionObserver((entries) => setHidden(entries[0]?.isIntersecting ?? false), {
      threshold: 0.12,
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className={cn(
        'fixed right-4 bottom-4 z-40 flex flex-col gap-3 transition-opacity duration-300 md:right-5 md:bottom-auto md:top-1/2 md:-translate-y-1/2',
        '[@media(max-height:500px)_and_(orientation:landscape)]:top-auto [@media(max-height:500px)_and_(orientation:landscape)]:bottom-3 [@media(max-height:500px)_and_(orientation:landscape)]:right-3 [@media(max-height:500px)_and_(orientation:landscape)]:translate-y-0 [@media(max-height:500px)_and_(orientation:landscape)]:flex-row',
        hidden && 'pointer-events-none opacity-0',
      )}
    >
      <a
        href={site.avitoUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Написать мне на Авито"
        data-goal="click_avito"
        data-place="sticky"
        onClick={() => reachGoal('click_avito', { place: 'sticky' })}
        className={button}
      >
        <AvitoIcon className="size-5 md:size-6" />
      </a>

      <a
        href={`tel:${site.phoneRaw}`}
        aria-label={`Позвонить по номеру ${site.phone}`}
        data-goal="click_phone"
        data-place="sticky"
        onClick={() => reachGoal('click_phone', { place: 'sticky' })}
        className={button}
      >
        <Phone className="size-5 md:size-6" strokeWidth={1.75} aria-hidden="true" />
      </a>

      <button
        type="button"
        aria-label="Наверх страницы"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(button, 'transition-opacity', showTop ? 'opacity-100' : 'pointer-events-none opacity-0')}
      >
        <ArrowUp className="size-5 md:size-6" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  )
}
