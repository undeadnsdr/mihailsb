import { support } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/**
 * Отсутствие админки подано как решение, а не как ограничение:
 * подрядчику не нужен ещё один интерфейс, ему нужно, чтобы работало.
 */
export function Support() {
  return (
    <Section id="support" labelledBy="support-title" tight>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-5">
          <SectionHeading id="support-title" title={support.title} subtitle={support.lead} />
        </div>

        <ul className="flex flex-col gap-4 md:col-span-7 md:gap-6">
          {support.items.map((item, index) => (
            <Reveal key={item.title} as="li" step={(index % 3) as 0 | 1 | 2}>
              <BentoCard className="gap-1.5 md:flex-row md:items-baseline md:gap-6">
                <h3 className="shrink-0 text-[17px] font-medium leading-snug md:w-[34%]">{item.title}</h3>
                <p className="text-pretty text-[17px] leading-relaxed text-muted-foreground">{item.text}</p>
              </BentoCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
