import { CalendarDays, FileText, Home, Ruler, ShieldCheck } from 'lucide-react'
import { trustBar } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'

const icons = {
  calendar: CalendarDays,
  home: Home,
  shield: ShieldCheck,
  ruler: Ruler,
  file: FileText,
} as const

/**
 * Полоса фактов сразу под первым экраном.
 *
 * Ни одна цифра не декоративная: каждая отвечает на конкретное возражение —
 * «давно ли вы работаете», «сколько уже построили», «что если треснет»,
 * «сколько стоит приезд», «на чём держится договорённость». Поэтому это
 * ряд из пяти, а не бенто с разными весами: все пять равнозначны, и
 * выделение любой из них соврало бы про приоритет.
 */
export function TrustBar() {
  return (
    <Section tight aria-label="Факты о компании">
      {/* 2 колонки на смартфоне, 3 на планшете, 5 в ряд с lg. Пятый элемент
          на смартфоне остаётся один в последней строке и растягивается на
          всю ширину — так он не выглядит обрубком сетки */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {trustBar.map((item, index) => {
          const Icon = icons[item.icon]
          return (
            <Reveal
              as="li"
              key={item.label}
              step={(Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5)}
              className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 max-sm:last:col-span-2 sm:max-lg:last:col-span-3"
            >
              <Icon className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              <span className="display-caps tnum text-[22px] leading-none tracking-[0.01em] text-foreground sm:text-[26px]">
                {item.value}
              </span>
              <span className="text-[13px] leading-snug text-muted-foreground sm:text-[14px]">
                {item.label}
              </span>
            </Reveal>
          )
        })}
      </ul>
    </Section>
  )
}
