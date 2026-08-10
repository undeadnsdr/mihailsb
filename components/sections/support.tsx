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
      {/* Заголовок уезжает наверх на всю ширину до lg: в колонке 5/12 на
          планшете «Менять тексты и фото буду я» ломалось на четыре строки */}
      <div className="grid grid-cols-1 gap-8 md:gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="support-title" title={support.title} subtitle={support.lead} />
        </div>

        <ul className="flex flex-col gap-4 md:gap-6 lg:col-span-7">
          {support.items.map((item, index) => (
            <Reveal key={item.title} as="li" step={(index % 3) as 0 | 1 | 2}>
              {/* Двухколоночная строка внутри карточки — только с lg:
                  на планшете 34% под заголовок давало 90px, и короткий
                  заголовок вставал в четыре строки рядом с текстом */}
              <BentoCard className="gap-1.5 lg:flex-row lg:items-baseline lg:gap-6">
                <h3 className="shrink-0 text-[16px] font-medium leading-snug sm:text-[17px] lg:w-[34%]">
                  {item.title}
                </h3>
                <p className="text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                  {item.text}
                </p>
              </BentoCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
