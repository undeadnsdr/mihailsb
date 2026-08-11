'use client'

import type { ReactNode } from 'react'
import { Phone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { site, telegramLink, telegramMessage } from '@/lib/content'
import { reachGoal } from '@/lib/analytics'
import { TelegramIcon } from '@/components/ui/telegram-icon'

// max-sm, а не max-md: на всю ширину кнопка растягивается только на узком
// смартфоне, где рядом с ней ничего не встанет. В горизонтальной ориентации
// ширины хватает на две кнопки в ряду, и w-full там разносил бы их по
// строкам без причины. min-h 52px держит зону нажатия по всей вёрстке
const base =
  'inline-flex items-center justify-center gap-2 rounded-full text-[17px] font-medium leading-none transition-colors min-h-[52px] px-6 max-sm:w-full'

/**
 * Кнопка звонка — основное действие сайта.
 *
 * У строительного заказа звонок стоит выше переписки: человек с текущей
 * крышей или треснувшим фундаментом хочет говорить сейчас, а не ждать
 * ответа в мессенджере. Поэтому именно она идёт вариантом primary там,
 * где нужно одно главное действие.
 */
export function PhoneButton({
  children,
  className,
  place,
  variant = 'primary',
}: {
  children: ReactNode
  className?: string
  /** Откуда нажали — уходит в параметры цели Метрики */
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

/**
 * Кнопка перехода в Телеграм с предзаполненным сообщением.
 *
 * Текст можно переопределить (message) — из блока конкретного направления
 * уходит «хочу замер по кровле», а не общая фраза: так подрядчик видит
 * задачу до того, как начнёт переписку.
 */
export function TelegramButton({
  children,
  className,
  iconClassName,
  variant = 'outline',
  place,
  message = telegramMessage,
}: {
  children: ReactNode
  className?: string
  /** Переопределяет размер иконки — там, где сама кнопка мельче обычного */
  iconClassName?: string
  variant?: 'primary' | 'outline'
  place: string
  message?: string
}) {
  return (
    <a
      href={telegramLink(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-goal="click_telegram"
      data-place={place}
      onClick={() => reachGoal('click_telegram', { place })}
      className={cn(
        base,
        variant === 'primary' && 'bg-primary text-primary-foreground hover:bg-primary-hover',
        variant === 'outline' && 'border border-border bg-card text-foreground hover:bg-secondary',
        className,
      )}
    >
      <TelegramIcon className={cn('size-5 shrink-0', iconClassName)} />
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
