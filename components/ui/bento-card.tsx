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
  /**
   * card — единственный сигнальный вес на странице: тень + белый фон.
   * Оставлен только там, где карточка несёт главное число секции или
   * первичное действие (цена, кнопки звонка/переписки, форма заявки).
   * flat — тот же белый фон, но без тени: для карточек-элементов
   * одноуровневого списка (проблемы, ниши, шаги стека), где ни одна
   * карточка не должна выглядеть важнее соседней. Раньше все они тоже
   * получали card-shadow, и в результате тень ничего не сигнализировала —
   * она стояла везде, поэтому не выделяла нигде.
   */
  tone?: 'card' | 'flat' | 'secondary' | 'primary' | 'accent' | 'outline'
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
        tone === 'flat' && 'border-border bg-card text-card-foreground',
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
