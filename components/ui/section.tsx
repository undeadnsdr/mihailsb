import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/ui/reveal'

/**
 * Контейнер страницы: max-width 1400px, боковые отступы 24/40/64px.
 * Вертикальный ритм — расстояние между секциями: 96px мобильно,
 * 140px десктоп. Это сумма отступов двух соседних секций, поэтому
 * padding вдвое меньше: 48 и 70. Раньше стояло по 140 с каждой стороны —
 * между блоками зияло 280px, и на ноутбуке в кадр попадал один заголовок.
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
        'mx-auto w-full max-w-[1400px] px-4 sm:px-6 md:px-10 lg:px-16',
        // липкая шапка ~112px: без scroll-mt переход по якорю прятал заголовок под неё.
        // В горизонтальной ориентации смартфона верхняя полоска скрыта,
        // шапка ниже — иначе якорь оставлял над заголовком пустое поле
        'scroll-mt-28 short-landscape:scroll-mt-20',
        tight ? 'py-8 md:py-12' : 'py-12 md:py-14 lg:py-[70px]',
        // Раньше здесь стояло py-12 — ровно то же значение, что и в базе,
        // то есть отступ в горизонтальной ориентации не сокращался вообще,
        // хотя коммент обещал «вдвое». Теперь сокращается на самом деле
        tight ? 'short-landscape:py-5' : 'short-landscape:py-6',
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
      {/* Шкала заголовка ступенчатая, а не 28→44 одним прыжком на md.
          Прыжок приходился ровно на планшет в портрете (768px): там сразу
          включался десктопный кегль 44px, из-за чего заголовок в узкой
          колонке ломался на три строки. Теперь размер догоняет 44px только
          к lg (планшет в горизонтальной ориентации и десктоп) */}
      <h2
        id={id}
        className="text-pretty text-[26px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[30px] md:text-[34px] lg:text-[44px]"
      >
        {title}
      </h2>
      {subtitle ? (
        <p
          className={cn(
            'max-w-[62ch] text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px] lg:text-lg',
            align === 'center' && 'mx-auto',
          )}
        >
          {subtitle}
        </p>
      ) : null}
    </Reveal>
  )
}
