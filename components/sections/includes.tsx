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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
          {includes.groups.map((group, index) => {
            const Icon = groupIcons[group.icon]
            return (
              <Reveal key={group.title} step={(index % 3) as 0 | 1 | 2} className="md:col-span-4">
                <BentoCard className="h-full gap-5">
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
                        className="flex min-h-[108px] items-start gap-3 pt-4 [&:not(:last-child)]:pb-4"
                      >
                        <Check
                          className="mt-1 size-4 shrink-0 text-primary"
                          strokeWidth={2.25}
                          aria-hidden="true"
                        />
                        <span className="flex flex-col gap-1">
                          <span className="text-[16px] font-medium leading-snug">{item.title}</span>
                          <span className="text-[15px] leading-relaxed text-muted-foreground">{item.text}</span>
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
