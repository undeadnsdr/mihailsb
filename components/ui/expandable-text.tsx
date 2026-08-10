'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Длинный текст на смартфоне: показываем три строки крупным кеглем,
 * по тапу разворачиваем целиком. На десктопе (md+) текст всегда полный —
 * там места достаточно и обрезка только мешает.
 */
export function ExpandableText({
  children,
  className,
  lines = 3,
  moreLabel = 'Читать дальше',
  lessLabel = 'Свернуть',
}: {
  children: React.ReactNode
  className?: string
  lines?: 2 | 3 | 4
  moreLabel?: string
  lessLabel?: string
}) {
  const [open, setOpen] = useState(false)
  const id = useId()

  const clamp = { 2: 'max-md:line-clamp-2', 3: 'max-md:line-clamp-3', 4: 'max-md:line-clamp-4' }[lines]

  return (
    <div className="flex flex-col items-start gap-2">
      <div
        id={id}
        className={cn(
          'text-[17px] leading-relaxed text-pretty md:text-lg',
          !open && clamp,
          className,
        )}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={id}
        className="flex min-h-[44px] items-center gap-1 text-sm font-medium tracking-[0.01em] text-primary md:hidden"
      >
        {open ? lessLabel : moreLabel}
        <ChevronDown
          className={cn('size-4 transition-transform', open && 'rotate-180')}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      </button>
    </div>
  )
}
