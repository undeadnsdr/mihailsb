import { Check, BellRing, ChevronDown } from 'lucide-react'
import { leads } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/** Кадр 7: показывает продукт — уведомление о заявке на экране телефона. */
export function Leads() {
  return (
    <Section id="leads" labelledBy="leads-title">
      {/* Карточка уведомления — это скриншот телефона: рядом с текстом в
          половину планшетной ширины она сжималась до 340px и подписи полей
          («Чем занимается») начинали переноситься. До lg идёт под текстом */}
      <div className="grid grid-cols-1 gap-8 md:gap-6 lg:grid-cols-12 lg:items-center">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <SectionHeading id="leads-title" title={leads.title} />

          {/* На смартфоне описание сворачивается до 3 строк с шевроном
              в правом нижнем углу (тот же паттерн, что в about.tsx):
              подпись длиннее, чем в других секциях, и полностью съедала
              на этой ширине место буллетов и карточки-уведомления выше
              первого экрана. На sm+ снова обычный абзац без сворачивания —
              там текст и так укладывается в пару строк. relative + absolute
              шеврон, а не соседний flex-элемент: pr-6 на самом тексте —
              это padding -webkit-box, он подрезает все 3 строки одинаково
              справа, и bottom-0 right-0 совпадает с концом третьей строки,
              потому что line-clamp обрезает блок ровно по её высоте */}
          <Reveal step={1} className="text-muted-foreground">
            <details className="group sm:hidden">
              <summary className="relative block cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <p className="max-w-[62ch] text-pretty line-clamp-3 pr-6 text-[16px] leading-relaxed group-open:hidden">
                  {leads.subtitle}
                </p>
                <ChevronDown
                  className="absolute bottom-0 right-0 size-5 shrink-0 text-primary transition-transform group-open:hidden"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </summary>
              <p className="max-w-[62ch] text-pretty text-[16px] leading-relaxed">{leads.subtitle}</p>
            </details>

            <p className="hidden max-w-[62ch] text-pretty text-[16px] leading-relaxed sm:block sm:text-[17px] lg:text-lg">
              {leads.subtitle}
            </p>
          </Reveal>

          <Reveal step={2}>
            <ul className="flex flex-col gap-3">
              {leads.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Check className="size-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="text-[16px] leading-relaxed sm:text-[17px]">{bullet}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* max-w: это макет телефонного уведомления, растянутый на 768px
            он перестаёт читаться как экран телефона. На lg ограничение
            снимается — там колонка сама задаёт ширину */}
        <Reveal step={2} className="mx-auto w-full max-w-[520px] lg:col-span-5 lg:mx-0 lg:max-w-none">
          <BentoCard tone="secondary" padded={false} className="gap-0 p-4 sm:p-5 md:p-6">
            {/* Карточка уведомления */}
            <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 card-shadow sm:p-5">
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
