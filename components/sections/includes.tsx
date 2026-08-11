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

        {/* Три диапазона:
            - до sm (смартфон): все три группы друг под другом.
            - sm–lg (планшет): «Сам сайт» и «Чтобы вас находили» — две
              колонки в верхней строке, «Чтобы вам писали» — целиком под
              ними на всю ширину (col-span-2), а пункты внутри неё лежат
              в одну линию (см. ниже переключение <ul> на grid-cols-3).
            - от lg (планшет боком и десктоп): прежние три равные колонки —
              на 768px в портрете «Чтобы вас находили» ломалось на три
              строки, поэтому третья колонка появляется только начиная
              с lg, где на карточку уже приходится достаточно ширины. */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
          {includes.groups.map((group, index) => {
            const Icon = groupIcons[group.icon]
            const isContact = group.icon === 'contact'
            return (
              <Reveal
                key={group.title}
                step={(index % 3) as 0 | 1 | 2}
                className={isContact ? 'sm:col-span-2 lg:col-span-1' : undefined}
              >
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

                  {/* «Чтобы вам писали» получает во всю ширину секции на
                      sm–lg, поэтому её три пункта на этом диапазоне встают
                      в одну линию (grid-cols-3) вместо списка друг под
                      другом — иначе вся выгода от полной ширины ушла бы
                      просто на более длинные строки текста. На смартфоне
                      и от lg (там у карточки снова только 1/3 ширины)
                      возвращается обычный вертикальный список. */}
                  <ul
                    className={
                      isContact
                        ? 'grid grid-cols-1 divide-y divide-border border-t border-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x sm:border-t-0 sm:border-b lg:grid-cols-1 lg:divide-x-0 lg:divide-y lg:border-b-0 lg:border-t'
                        : 'flex flex-col divide-y divide-border border-t border-border'
                    }
                  >
                    {group.items.map((item) => (
                      <li
                        key={item.title}
                        // min-h нужен только когда карточки стоят рядом:
                        // он держит разделители на одной линии в соседних
                        // колонках. На смартфоне карточки идут друг под
                        // другом — выравнивать не с чем, а фиксированная
                        // высота добавляла к каждому пункту пустое поле.
                        // В линии «Чтобы вам писали» на sm–lg пункты сами
                        // друг с другом не выравниваются по высоте текста
                        // (это три раздельные колонки, не строки одной
                        // сетки), поэтому там min-h не нужен — high-строку
                        // держит сама карточка через articles одинаковой
                        // длины в контенте.
                        className={
                          isContact
                            ? 'flex items-start gap-3 px-0 pt-4 sm:px-4 sm:pt-0 sm:first:pl-0 sm:last:pr-0 lg:px-0 lg:pt-4 lg:min-h-[108px] [&:not(:last-child)]:pb-4 sm:[&:not(:last-child)]:pb-0 lg:[&:not(:last-child)]:pb-4'
                            : 'flex items-start gap-3 pt-4 sm:min-h-[132px] lg:min-h-[108px] [&:not(:last-child)]:pb-4'
                        }
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
                              min-h на самом <li>, поэтому здесь его убираем
                              (кроме линии «Чтобы вам писали» на sm–lg — там
                              min-h на <li> тоже снят, три раздельные колонки
                              не обязаны совпадать по высоте построчно) */}
                          <span
                            className={
                              isContact
                                ? 'min-h-[3lh] text-[15px] leading-relaxed text-muted-foreground sm:min-h-0 lg:min-h-0'
                                : 'min-h-[3lh] text-[15px] leading-relaxed text-muted-foreground sm:min-h-0'
                            }
                          >
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
