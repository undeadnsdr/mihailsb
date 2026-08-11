'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Описание канала в showcase.tsx.
 *
 * Только на смартфоне текст свёрнут до трёх строк с шевроном на конце
 * третьей (см. .channel-text-collapsed в globals.css) — на sm и шире
 * класс ничего не делает, там текст короткий и виден целиком без кнопки.
 * Поэтому клик по кнопке ничего не меняет визуально от sm: там нечего
 * разворачивать, sm:pointer-events-none снимает с неё курсор и фокус,
 * чтобы не обещать десктопному посетителю действие, которого нет.
 */
export function ChannelText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <button
      type="button"
      onClick={() => setExpanded((value) => !value)}
      aria-expanded={expanded}
      className="block w-full appearance-none border-0 bg-transparent p-0 text-left sm:pointer-events-none"
    >
      <span
        className={cn(
          'text-pretty text-[16px] leading-relaxed text-muted-foreground',
          !expanded && 'channel-text-collapsed',
        )}
      >
        {/* Иконка должна стоять в разметке ДО текста, а не после: приём с
            плавающей распоркой (::before в globals.css) резервирует ей
            высоту двух строк, и следующий float не может встать выше её
            низа — но только если он объявлен следом, а не после того как
            браузер уже разложил весь (не обрезанный) текст ниже. Если
            текст в разметке идёт первым, к моменту описания шеврона поток
            уже прошёл все его строки, и float падает под них, а не на
            третью строку. В развёрнутом состоянии класса-распорки нет —
            здесь тот же элемент просто открывающий текст незачем, поэтому
            стрелка-вверх для сворачивания стоит уже после текста, как
            обычный символ в конце абзаца */}
        {!expanded && (
          <ChevronDown
            className="channel-text-chevron ml-1 inline size-4 shrink-0 translate-y-0.5 text-primary sm:hidden"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        )}
        {text}
        {expanded && (
          <ChevronDown
            className="ml-1 inline size-4 shrink-0 translate-y-0.5 rotate-180 text-primary transition-transform duration-200 sm:hidden"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        )}
      </span>
    </button>
  )
}
