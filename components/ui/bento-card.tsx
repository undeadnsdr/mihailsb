import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * Плитка бенто. Внутри — только flex, вложенных гридов нет.
 * Стекло на плитках сознательно не применяется (правка 4 к ТЗ):
 * на светлом фоне #f5f6f8 оно даёт грязь и стоит производительности.
 */
export function BentoCard({
  children,
  className,
  tone = 'card',
  as = 'div',
  padded = true,
}: {
  children: ReactNode
  className?: string
  tone?: 'card' | 'secondary' | 'primary' | 'accent' | 'outline'
  as?: 'div' | 'li' | 'article'
  padded?: boolean
}) {
  const Tag = as
  return (
    <Tag
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border',
        padded && 'p-6 md:p-8',
        tone === 'card' && 'border-border bg-card text-card-foreground card-shadow',
        tone === 'secondary' && 'border-border bg-secondary text-secondary-foreground',
        tone === 'accent' && 'border-transparent bg-accent text-accent-foreground',
        tone === 'primary' && 'border-transparent bg-primary text-primary-foreground',
        tone === 'outline' && 'border-border bg-transparent text-foreground',
        className,
      )}
    >
      {children}
    </Tag>
  )
}
