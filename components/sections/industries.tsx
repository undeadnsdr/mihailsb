import { industries } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/**
 * Кому подойдёт. Формулировки взяты как поисковые фразы («сайт для
 * кровельной компании», «сайт для монтажа отопления») — это те же слова,
 * которыми подрядчики описывают себя в объявлениях.
 */
export function Industries() {
  return (
    <Section id="industries" labelledBy="industries-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading
          id="industries-title"
          title={industries.title}
          subtitle={industries.subtitle}
        />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {industries.groups.map((group, index) => (
            <Reveal key={group.title} as="li" step={(index % 3) as 0 | 1 | 2}>
              <BentoCard className="h-full gap-2">
                <h3 className="text-[21px] font-medium leading-snug tracking-[-0.01em]">{group.title}</h3>
                <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">{group.text}</p>
              </BentoCard>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <p className="text-pretty text-[17px] font-medium leading-relaxed">{industries.fallback}</p>
        </Reveal>
      </div>
    </Section>
  )
}
