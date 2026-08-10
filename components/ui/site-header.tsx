'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Phone } from 'lucide-react'
import { nav, site } from '@/lib/content'
import { TopBar } from '@/components/ui/top-bar'
import { AvitoButton } from '@/components/ui/cta'
import { reachGoal } from '@/lib/analytics'
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
      <TopBar floating={floating} />
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
            'flex items-center justify-between gap-4 rounded-full border border-border px-5 py-2.5 shadow-sm transition-all duration-300',
            floating ? 'glass' : 'bg-card',
          )}
        >
          <a href="#top" className="flex min-w-0 flex-1 items-center gap-3">
            {/* Фото автора — сайты делает реальный человек, не студия.
                Круглый кроп по лицу, размер равен высоте кнопки «Написать на Авито» справа */}
            <Image
              src="/avatar.webp"
              alt="Илья, автор сайта"
              width={44}
              height={44}
              className="size-9 shrink-0 rounded-full border border-border object-cover sm:size-11"
              priority
            />
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate text-[17px] font-bold tracking-[-0.02em] text-primary">{site.domain}</span>
              <span className="hidden truncate text-[13px] font-medium text-muted-foreground sm:block">
                {site.headerTagline}
              </span>
            </span>
          </a>

          <ul className="hidden shrink-0 items-center gap-6 lg:flex">
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
            className="flex min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap text-[15px] font-medium text-primary transition-colors hover:text-primary-hover sm:hidden"
          >
            <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
            {site.phone}
          </a>

          <AvitoButton
            place="header"
            className="hidden min-h-[44px] shrink-0 px-4 text-[15px] max-md:w-auto sm:inline-flex"
          >
            Написать на Авито
          </AvitoButton>
        </nav>
      </div>
    </header>
  )
}
