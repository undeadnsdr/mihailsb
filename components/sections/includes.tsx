import { MonitorSmartphone, MapPinned, MessageSquareText, Check, Minus } from 'lucide-react'
import { includes, limits } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { AvitoButton } from '@/components/ui/cta'

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
 * сайт есть, вас находят, с вами связываются. Ниже пара плиток-итогов:
 * «0 ₽ доплат» и честное «чего нет». Ограничение стоит рядом с ценой
 * сознательно — оно снимает возвраты лучше, чем обещание всего сразу.
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
                      <li key={item.title} className="flex items-start gap-3 pt-4 [&:not(:last-child)]:pb-4">
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

          <Reveal className="md:col-span-5">
            {/* Итог набран крупно, как цена в секции «Цены»: главное здесь —
                не список, а то, что доплат сверх 6000 ₽ не будет */}
            <BentoCard tone="primary" className="h-full gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-medium tracking-[0.01em] text-primary-foreground/70">
                  {includes.total.label}
                </span>
                <span className="tnum text-[56px] font-bold leading-none tracking-[-0.04em] md:text-[72px]">
                  {includes.total.value}
                </span>
              </div>
              <p className="text-pretty text-[16px] leading-relaxed text-primary-foreground/85">
                {includes.total.note}
              </p>
              <AvitoButton
                place="includes"
                className="mt-auto border-primary-foreground/30 bg-primary-foreground text-primary hover:bg-primary-foreground/90 md:w-auto md:self-start"
              >
                {includes.total.cta}
              </AvitoButton>
            </BentoCard>
          </Reveal>

          <Reveal step={1} className="md:col-span-7">
            <BentoCard tone="secondary" className="h-full gap-4">
              <h3 className="text-pretty text-[21px] font-medium leading-snug tracking-[-0.01em] md:text-[26px]">
                {limits.title}
              </h3>
              <p className="text-pretty text-[17px] font-medium leading-relaxed">{limits.lead}</p>
              <ul className="flex flex-col gap-3">
                {limits.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Minus
                      className="mt-1 size-4 shrink-0 text-muted-foreground"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    <span className="text-[15px] leading-relaxed text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </BentoCard>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
