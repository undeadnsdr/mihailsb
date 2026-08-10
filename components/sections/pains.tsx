import { pains } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/** Узнавание себя. Ряд 8+4 / 4+4+4 — монотонной сетки нет. */
export function Pains() {
  return (
    <Section id="pains" labelledBy="pains-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading id="pains-title" title={pains.title} subtitle={pains.subtitle} />

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
          {pains.items.map((item, index) => (
            <Reveal
              key={item.title}
              as="li"
              step={(index % 3) as 0 | 1 | 2}
              className={index < 2 ? 'md:col-span-6' : 'md:col-span-6 lg:col-span-6'}
            >
              <BentoCard className="h-full gap-2">
                <h3 className="text-pretty text-[21px] font-medium leading-snug tracking-[-0.01em] md:text-[26px]">
                  {item.title}
                </h3>
                <p className="text-pretty text-[17px] leading-relaxed text-muted-foreground">{item.text}</p>
              </BentoCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
