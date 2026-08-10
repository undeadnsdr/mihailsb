import Image from 'next/image'
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
              {/* flat: список ниш — равные пункты, тень не должна выделять
                  ни одну сферу услуг над другой (см. bento-card.tsx).
                  padded=false: фото должно доходить до краёв плитки и
                  скругляться вместе с ней (overflow-hidden в BentoCard),
                  а не сидеть с отступом внутри рамки — иначе выглядит как
                  иконка, а не как фото объекта. Паддинг возвращаем вручную
                  только для текстового блока под фото. */}
              <BentoCard tone="flat" className="h-full gap-0" padded={false}>
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={group.image}
                    alt={group.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 p-6 md:p-8">
                  {/* text-pretty: названия ниш длинные («Кровля, фасады и
                      водосток»), в двух колонках на планшете без него в
                      последней строке оставалось одно слово */}
                  <h3 className="text-pretty text-[19px] font-medium leading-snug tracking-[-0.01em] sm:text-[21px]">
                    {group.title}
                  </h3>
                  <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">{group.text}</p>
                </div>
              </BentoCard>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <p className="text-pretty text-[16px] font-medium leading-relaxed sm:text-[17px]">
            {industries.fallback}
          </p>
        </Reveal>
      </div>
    </Section>
  )
}
