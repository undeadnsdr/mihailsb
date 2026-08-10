'use client'

import type { ReactNode } from 'react'
import { Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { site } from '@/lib/content'
import { reachGoal } from '@/lib/analytics'
import { AvitoIcon } from '@/components/ui/avito-icon'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl text-[17px] font-medium leading-none transition-colors min-h-[52px] px-6 max-md:w-full'

/** Основная кнопка: ведёт в переписку на Авито */
export function AvitoButton({
  children,
  className,
  variant = 'primary',
  place,
}: {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'outline'
  /** Откуда нажали — уходит в параметры цели Метрики */
  place: string
}) {
  return (
    <a
      href={site.avitoUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-goal="click_avito"
      data-place={place}
      onClick={() => reachGoal('click_avito', { place })}
      className={cn(
        base,
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary-hover',
        variant === 'outline' && 'border border-border bg-card text-foreground hover:bg-secondary',
        className,
      )}
    >
      <AvitoIcon className="size-5 shrink-0" />
      <span>{children}</span>
    </a>
  )
}

export function PhoneButton({
  children,
  className,
  place,
  variant = 'outline',
}: {
  children: ReactNode
  className?: string
  place: string
  variant?: 'primary' | 'outline'
}) {
  return (
    <a
      href={`tel:${site.phoneRaw}`}
      data-goal="click_phone"
      data-place={place}
      onClick={() => reachGoal('click_phone', { place })}
      className={cn(
        base,
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary-hover',
        variant === 'outline' && 'border border-border bg-card text-foreground hover:bg-secondary',
        className,
      )}
    >
      <Phone className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
      <span>{children}</span>
    </a>
  )
}

/** Ссылка-скролл к секции. Плавность обеспечивает scroll-behavior в globals.css */
export function ScrollLink({
  to,
  children,
  className,
}: {
  to: string
  children: ReactNode
  className?: string
}) {
  return (
    <a
      href={to}
      className={cn(base, 'border border-border bg-card text-foreground hover:bg-secondary', className)}
    >
      {children}
    </a>
  )
}
