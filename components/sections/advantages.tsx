import {
  Camera,
  Clock,
  FileText,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Truck,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { advantages } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

const icons: Record<string, LucideIcon> = {
  file: FileText,
  camera: Camera,
  users: Users,
  shield: ShieldCheck,
  clock: Clock,
  truck: Truck,
  snow: Snowflake,
  broom: Sparkles,
}

/**
 * Восемь причин выбрать нас.
 *
 * Все восемь одного веса: ни одна не должна выглядеть важнее соседней,
 * потому что у разных заказчиков «главное» разное — одному важна
 * фиксированная цена, другому то, что убирают мусор. Поэтому tone="flat"
 * у всех карточек, без выделенной плитки.
 */
export function Advantages() {
  return (
    <Section id="advantages" labelledBy="advantages-title">
      <div className="flex flex-col gap-8">
        <SectionHeading
          id="advantages-title"
          title={advantages.title}
          subtitle={advantages.subtitle}
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {advantages.items.map((item, index) => {
            const Icon = icons[item.icon] ?? ShieldCheck
            return (
              <Reveal as="li" key={item.title} step={(Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
                <BentoCard tone="flat" className="h-full gap-3 p-5">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent">
                    <Icon className="size-5 text-accent-foreground" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="display-caps text-[17px] leading-tight tracking-[0.01em] text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-muted-foreground">{item.text}</p>
                </BentoCard>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
