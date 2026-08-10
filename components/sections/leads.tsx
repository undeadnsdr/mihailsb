import { Check, BellRing } from 'lucide-react'
import { leads } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/** Кадр 7: показывает продукт — уведомление о заявке на экране телефона. */
export function Leads() {
  return (
    <Section id="leads" labelledBy="leads-title">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-center md:gap-6">
        <div className="flex flex-col gap-6 md:col-span-6 lg:col-span-7">
          <SectionHeading id="leads-title" title={leads.title} subtitle={leads.subtitle} />
          <Reveal step={1}>
            <ul className="flex flex-col gap-3">
              {leads.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Check className="size-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-[17px] leading-relaxed">{bullet}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal step={2} className="md:col-span-6 lg:col-span-5">
          <BentoCard tone="secondary" padded={false} className="gap-0 p-5 md:p-6">
            {/* Карточка уведомления */}
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 card-shadow">
              <div className="flex items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <BellRing className="size-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="text-[17px] font-medium leading-snug">{leads.demo.title}</span>
                  <span className="text-[13px] text-muted-foreground">{leads.demo.time}</span>
                </span>
              </div>

              <dl className="flex flex-col gap-3 border-t border-border pt-4">
                {leads.demo.fields.map((field) => (
                  <div key={field.label} className="flex flex-col gap-0.5">
                    <dt className="text-[13px] font-medium tracking-[0.01em] text-muted-foreground">
                      {field.label}
                    </dt>
                    <dd className="text-[17px] font-medium leading-snug">{field.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </BentoCard>
        </Reveal>
      </div>
    </Section>
  )
}
