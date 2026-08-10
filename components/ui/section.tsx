import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/reveal'

/**
 * Контейнер страницы: max-width 1400px, боковые отступы 24/40/64px.
 * Вертикальный ритм: 96px мобильно, 140px десктоп.
 * В горизонтальной ориентации смартфона отступы сокращаются вдвое —
 * иначе на экране 400px высотой не видно ничего кроме заголовка.
 */
export function Section({
  id,
  children,
  className,
  labelledBy,
  tight,
}: {
  id?: string
  children: ReactNode
  className?: string
  labelledBy?: string
  tight?: boolean
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        'mx-auto w-full max-w-[1400px] px-6 md:px-10 lg:px-16',
        tight ? 'py-12 md:py-16' : 'py-16 max-[930px]:max-h-none max-md:py-14 md:py-24 lg:py-[140px]',
        '[@media(max-height:500px)_and_(orientation:landscape)]:py-12',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function SectionHeading({
  id,
  title,
  subtitle,
  align = 'left',
  className,
}: {
  id?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <Reveal className={cn('flex flex-col gap-3', align === 'center' && 'items-center text-center', className)}>
      <h2
        id={id}
        className="text-pretty text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[44px]"
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            'max-w-[62ch] text-pretty text-[17px] leading-relaxed text-muted-foreground md:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  )
}
