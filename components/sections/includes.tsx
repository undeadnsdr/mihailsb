import { MonitorSmartphone, MapPinned, MessageSquareText, Check } from 'lucide-react'
import { includes } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

const groupIcons = {
  site: MonitorSmartphone,
  found: MapPinned,
  contact: MessageSquareText,
} as const

/**
 * Кадр 9б: что входит в 6000 ₽.
 *
 * Пункты разложены по трём плиткам-группам, а не одним списком на девять
 * строк: так видно не «сколько всего дают», а что закрыт весь путь клиента —
 * сайт есть, вас находят, с вами связываются.
 *
 * У каждого пункта свой min-h: три карточки — это три независимых flex-
 * колонки (не общая сетка), поэтому без явной высоты строка с однострочным
 * текстом в одной карточке не совпадёт по высоте со строкой с текстом
 * на два переноса в соседней, и разделители между пунктами разъедутся.
 */
export function Includes() {
  return (
    <Section id="includes" labelledBy="includes-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading id="includes-title" title={includes.title} subtitle={includes.subtitle} />

        {/* Три колонки включались на md, то есть ровно на планшете в
            портрете: 768px минус отступы делилось на три по ~200px, из-за
            чего «Чтобы вас находили» ломалось на три строки, а описания
            переносились по два слова. Третья колонка теперь появляется
            только с lg (планшет боком и десктоп), а планшет в портрете
            получает две — там на карточку приходится ~340px */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {includes.groups.map((group, index) => {
            const Icon = groupIcons[group.icon]
            return (
              <Reveal key={group.title} step={(index % 3) as 0 | 1 | 2}>
                {/* flat: три равные группы пунктов, не три отдельных
                    предложения — тень тут читалась бы как «выбери одну
                    из трёх», хотя нужны все три (см. bento-card.tsx) */}
                <BentoCard tone="flat" className="h-full gap-5">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
                      <Icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <h3 className="text-pretty text-[19px] font-medium leading-snug tracking-[-0.01em]">
                      {group.title}
                    </h3>
                  </div>

                  <ul className="flex flex-col divide-y divide-border border-t border-border">
                    {group.items.map((item) => (
                      <li
                        key={item.title}
                        // min-h нужен только когда карточки стоят рядом:
                        // он держит разделители на одной линии в соседних
                        // колонках. На смартфоне карточки идут друг под
                        // другом — выравнивать не с чем, а фиксированная
                        // высота добавляла к каждому пункту пустое поле
                        className="flex items-start gap-3 pt-4 sm:min-h-[132px] lg:min-h-[108px] [&:not(:last-child)]:pb-4"
                      >
                        <Check
                          className="mt-1 size-4 shrink-0 text-primary"
                          strokeWidth={2.25}
                          aria-hidden="true"
                        />
                        <span className="flex flex-col gap-1">
                          <span className="text-[16px] font-medium leading-snug">{item.title}</span>
                          {/* min-h-[3lh] держит одинаковую высоту под описание на
                              смартфоне: тексты разной длины — от одной строки до
                              трёх — иначе пункты внутри карточки визуально
                              «прыгали» бы по высоте. От sm высоту уже держит
                              min-h на самом <li>, поэтому здесь его убираем */}
                          <span className="min-h-[3lh] text-[15px] leading-relaxed text-muted-foreground sm:min-h-0">
                            {item.text}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </BentoCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </Section>
  )
}
