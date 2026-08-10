'use client'

import { useEffect, useState } from 'react'

type Left = { days: number; hours: number; minutes: number; seconds: number }

function diff(deadline: number): Left | null {
  const ms = deadline - Date.now()
  if (ms <= 0) return null
  const total = Math.floor(ms / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Отсчёт до фиксированной даты. После её наступления рендерится expiredSlot,
 * а не нули. Ширина контейнера цифр фиксирована через tabular-nums и ch —
 * layout shift при тике исключён. aria-live="off": скринридер не должен
 * зачитывать каждую секунду.
 */
export function Countdown({
  deadline,
  expiredSlot,
}: {
  deadline: string
  expiredSlot?: React.ReactNode
}) {
  const target = new Date(deadline).getTime()
  const [left, setLeft] = useState<Left | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLeft(diff(target))
    const id = window.setInterval(() => setLeft(diff(target)), 1000)
    return () => window.clearInterval(id)
  }, [target])

  // До монтирования и при истёкшем сроке цифры не показываем
  if (!mounted) {
    return <span className="tnum inline-block h-[1.2em] w-[14ch]" aria-hidden="true" />
  }

  if (!left) return <>{expiredSlot ?? null}</>

  return (
    <span aria-live="off" className="tnum inline-flex items-baseline gap-2 whitespace-nowrap">
      <span className="text-2xl font-bold text-destructive md:text-3xl">{left.days}</span>
      <span className="text-sm font-medium text-muted-foreground">
        {left.days % 10 === 1 && left.days % 100 !== 11 ? 'день' : left.days % 10 >= 2 && left.days % 10 <= 4 && (left.days % 100 < 10 || left.days % 100 >= 20) ? 'дня' : 'дней'}
      </span>
      <span className="inline-block w-[8ch] text-2xl font-bold text-destructive md:text-3xl">
        {pad(left.hours)}:{pad(left.minutes)}:{pad(left.seconds)}
      </span>
    </span>
  )
}
