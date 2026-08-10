'use client'

import { useEffect, useState } from 'react'
import { ArrowUp, Phone } from 'lucide-react'
import { site } from '@/lib/content'
import { reachGoal } from '@/lib/analytics'
import { AvitoIcon } from '@/components/ui/avito-icon'
import { cn } from '@/lib/utils'

const fab =
  'glass flex size-12 items-center justify-center rounded-xl text-primary transition-colors hover:text-primary-hover'

/**
 * Постоянный доступ к связи.
 *
 * На смартфоне это нижняя панель с подписанной кнопкой: круглые иконки
 * у правого края накрывали контент карточек и не объясняли, куда ведут.
 * На десктопе — колонка иконок справа, там места хватает.
 *
 * Когда форма во вьюпорте, панель прячется: две конкурирующие точки
 * входа в одном экране только мешают.
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
    <>
      {/* Смартфон: нижняя панель */}
      <div
        className={cn(
          'fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md transition-transform duration-300 md:hidden',
          hidden && 'translate-y-full',
        )}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <a
            href={site.avitoUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-goal="click_avito"
            data-place="sticky"
            onClick={() => reachGoal('click_avito', { place: 'sticky' })}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[15px] font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <AvitoIcon className="size-5" />
            Написать на Авито
          </a>
          <a
            href={`tel:${site.phoneRaw}`}
            aria-label={`Позвонить по номеру ${site.phone}`}
            data-goal="click_phone"
            data-place="sticky"
            onClick={() => reachGoal('click_phone', { place: 'sticky' })}
            className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary text-primary transition-colors hover:text-primary-hover"
          >
            <Phone className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Десктоп: колонка справа */}
      <div
        className={cn(
          'fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 transition-opacity duration-300 md:flex',
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
          className={fab}
        >
          <AvitoIcon className="size-6" />
        </a>

        <a
          href={`tel:${site.phoneRaw}`}
          aria-label={`Позвонить по номеру ${site.phone}`}
          data-goal="click_phone"
          data-place="sticky"
          onClick={() => reachGoal('click_phone', { place: 'sticky' })}
          className={fab}
        >
          <Phone className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </a>

        <button
          type="button"
          aria-label="Наверх страницы"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className={cn(fab, showTop ? 'opacity-100' : 'pointer-events-none opacity-0')}
        >
          <ArrowUp className="size-6" strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
    </>
  )
}
