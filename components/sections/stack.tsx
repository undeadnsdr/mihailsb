import { Monitor, Server, Database } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { stack } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/**
 * Единственная техническая секция страницы: снимает возражение
 * «а это не конструктор ли на коленке». Бенто из трёх плиток —
 * фронтенд и бэкенд в одном ряду (равные по весу половины стека),
 * базы данных широкой плиткой под ними: это не про текущий сайт,
 * а про то, куда он может вырасти, поэтому и стоит отдельно.
 */
export function Stack() {
  return (
    <Section id="stack" labelledBy="stack-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading id="stack-title" title={stack.title} subtitle={stack.subtitle} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <Reveal>
            <StackCard icon={Monitor} title={stack.frontend.title} lead={stack.frontend.lead} items={stack.frontend.items} />
          </Reveal>

          <Reveal step={1}>
            <StackCard icon={Server} title={stack.backend.title} lead={stack.backend.lead} items={stack.backend.items} />
          </Reveal>

          <Reveal step={2} className="md:col-span-2">
            <StackCard
              icon={Database}
              title={stack.database.title}
              lead={stack.database.lead}
              items={stack.database.items}
              note={stack.database.note}
              wide
            />
          </Reveal>
        </div>
      </div>
    </Section>
  )
}

function StackCard({
  icon: Icon,
  title,
  lead,
  items,
  note,
  wide,
}: {
  icon: LucideIcon
  title: string
  lead: string
  items: readonly { readonly title: string; readonly text: string }[]
  note?: string
  wide?: boolean
}) {
  return (
    <BentoCard className="h-full gap-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
          <Icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h3 className="text-pretty text-[21px] font-medium leading-snug tracking-[-0.01em] md:text-[26px]">
          {title}
        </h3>
      </div>

      <p className="text-pretty text-[17px] leading-relaxed text-muted-foreground">{lead}</p>

      {/* Широкая плитка получает вторую колонку с md и четыре с lg —
          иначе четыре пункта растягиваются в одну длинную кишку */}
      <ul className={wide ? 'grid gap-4 md:grid-cols-2 md:gap-x-8 lg:grid-cols-4' : 'flex flex-col gap-4'}>
        {items.map((item) => (
          <li key={item.title} className="flex flex-col gap-1 border-t border-border pt-3">
            <span className="text-[15px] font-medium leading-snug">{item.title}</span>
            <span className="text-[15px] leading-relaxed text-muted-foreground">{item.text}</span>
          </li>
        ))}
      </ul>

      {note ? <p className="text-[15px] leading-relaxed text-muted-foreground">{note}</p> : null}
    </BentoCard>
  )
}
