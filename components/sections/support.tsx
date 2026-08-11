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

        {/* Три пункта («Первый месяц» / «Дальше по необходимости» / «Если
            менять часто») — это не длинный список, а три равных по весу
            варианта, поэтому на планшете (sm–lg) они встают в три колонки
            рядом, а не друг под другом: так сразу видно, что это три
            альтернативы, а не последовательность шагов. На смартфоне и от
            lg (там у списка уже другая, горизонтальная раскладка строк)
            сетка возвращается к одной колонке. */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:gap-6 lg:col-span-7 lg:flex lg:flex-col">
          {support.items.map((item, index) => (
            <Reveal key={item.title} as="li" step={(index % 3) as 0 | 1 | 2} className="lg:contents">
              {/* Двухколоночная строка внутри карточки — только с lg:
                  на планшете 34% под заголовок давало 90px, и короткий
                  заголовок вставал в четыре строки рядом с текстом */}
              {/* flat: список того, что входит в сопровождение, — равные
                  строки одного перечня (см. bento-card.tsx) */}
              <BentoCard tone="flat" className="h-full gap-1.5 lg:flex-row lg:items-baseline lg:gap-6">
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
