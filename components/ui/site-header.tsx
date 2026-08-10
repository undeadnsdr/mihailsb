'use client'

import { useEffect, useState } from 'react'
import { nav, site } from '@/lib/content'
import { TopBar } from '@/components/ui/top-bar'
import { AvitoButton } from '@/components/ui/cta'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [floating, setFloating] = useState(false)

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40">
      <TopBar />
      {/* Плавающая стеклянная панель — одна из трёх зон, где стекло разрешено */}
      <div
        className={cn(
          'mx-auto w-full max-w-[1400px] px-6 py-3 transition-all duration-300 md:px-10 lg:px-16',
          floating && 'py-2',
        )}
      >
        <nav
          aria-label="Основная навигация"
          className={cn(
            'flex items-center justify-between gap-4 rounded-xl px-4 py-2.5 transition-all duration-300',
            floating ? 'glass' : 'border border-transparent',
          )}
        >
          <a href="#top" className="flex items-baseline gap-2 whitespace-nowrap">
            <span className="text-[17px] font-bold tracking-[-0.02em] text-primary">{site.domain}</span>
          </a>

          <ul className="hidden items-center gap-6 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm font-medium tracking-[0.01em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* На смартфоне вместо кнопки — номер: кнопка «Написать»
              дублировала бы нижнюю панель, а телефона в ней нет подписанного */}
          <a
            href={`tel:${site.phoneRaw}`}
            data-goal="click_phone"
            data-place="header"
            onClick={() => reachGoal('click_phone', { place: 'header' })}
            className="flex min-h-[44px] items-center gap-1.5 whitespace-nowrap text-[15px] font-medium text-primary transition-colors hover:text-primary-hover sm:hidden"
          >
            <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {site.phone}
          </a>

          <AvitoButton
            place="header"
            className="hidden min-h-[44px] px-4 text-[15px] max-md:w-auto sm:inline-flex"
          >
            Написать
          </AvitoButton>
        </nav>
      </div>
    </header>
  )
}
