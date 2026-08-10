'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type RevealProps = {
  children: ReactNode
  className?: string
  /** Задержка стаггера в шагах по 60 мс, максимум 5 */
  step?: 0 | 1 | 2 | 3 | 4 | 5
  as?: 'div' | 'li' | 'section' | 'article'
}

/**
 * Появление при скролле.
 *
 * Важно: контент рендерится ВИДИМЫМ, класс скрытия навешивается только
 * после монтирования. При отключённом JS страница остаётся читаемой,
 * а не пустой.
 */
export function Reveal({ children, className, step = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [armed, setArmed] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setShown(true)
      return
    }

    setArmed(true)
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true)
            observer.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const Tag = as as 'div'

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn(armed && !shown && 'reveal-hidden', shown && 'reveal-shown', className)}
      style={shown && step ? { transitionDelay: `${step * 60}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
