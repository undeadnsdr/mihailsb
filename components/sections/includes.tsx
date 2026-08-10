import { Check, Minus } from 'lucide-react'
import { includes, limits } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/**
 * Кадр 9б: что входит в 6000 ₽.
 * Плитка «чего нет» стоит рядом сознательно — честное ограничение
 * повышает доверие сильнее, чем обещание всего сразу, и снимает возвраты.
 */
export function Includes() {
  return (
    <Section id="includes" labelledBy="includes-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading id="includes-title" title={includes.title} subtitle={includes.subtitle} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
          <Reveal className="md:col-span-7 lg:col-span-8">
            <BentoCard className="h-full gap-5">
              <ul className="flex flex-col gap-4 sm:grid sm:grid-cols-2 sm:gap-x-8">
                {includes.items.map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent">
                      <Check className="size-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[17px] font-medium leading-snug">{item.title}</span>
                      <span className="text-[15px] leading-relaxed text-muted-foreground">{item.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </BentoCard>
          </Reveal>

          <Reveal step={1} className="md:col-span-5 lg:col-span-4">
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
