'use client'

import { useState } from 'react'
import { Check, Clock } from 'lucide-react'
import { finalCta, site, avitoMessage } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { AvitoButton, PhoneButton } from '@/components/ui/cta'
import { AvitoIcon } from '@/components/ui/avito-icon'
import { reachGoal, getUtmSuffix } from '@/lib/analytics'

/**
 * Финальный экран.
 *
 * Форма сознательно без бэкенда: у страницы нет базы и почтового сервиса,
 * а заявка, ушедшая в никуда, хуже отсутствия формы. Поэтому по отправке
 * готовое сообщение копируется в буфер и открывается переписка на Авито —
 * человеку остаётся только вставить текст. Все переписки остаются в одном
 * месте, где лежат отзывы и рейтинг.
 */
export function FinalCta() {
  const [industry, setIndustry] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // UTM попадает в текст сообщения — только так видно, из какого
    // объявления пришёл человек: Авито не передаёт рефереры в переписку
    const message = [
      avitoMessage + getUtmSuffix() + '.',
      industry ? `Сфера: ${industry}.` : '',
      name ? `Меня зовут ${name}.` : '',
      contact ? `Связь: ${contact}.` : '',
    ]
      .filter(Boolean)
      .join(' ')

    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch {
      // Буфер недоступен (старый Safari, отказ в разрешении) — не блокируем переход
      setCopied(false)
    }

    reachGoal('form_submit', { industry: industry || 'не выбрана' })
    window.open(site.avitoUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <Reveal className="md:col-span-6">
          <BentoCard tone="primary" className="h-full justify-center gap-6 md:p-10 lg:p-12">
            <h2
              id="contact-title"
              className="text-balance text-[28px] font-bold leading-[1.1] tracking-[-0.02em] md:text-[44px]"
            >
              {finalCta.title}
            </h2>
            <p className="max-w-[46ch] text-pretty text-[17px] leading-relaxed text-primary-foreground/85 md:text-lg">
              {finalCta.subtitle}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <AvitoButton
                place="final"
                className="bg-primary-foreground text-primary hover:bg-accent sm:w-auto"
              >
                {finalCta.primary}
              </AvitoButton>
              <PhoneButton
                place="final"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 sm:w-auto"
              >
                {finalCta.secondary}
              </PhoneButton>
            </div>

            <p className="flex items-center gap-2 text-[15px] text-primary-foreground/70">
              <Clock className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {site.workingHours} · отвечаю {site.responseTime}
            </p>
          </BentoCard>
        </Reveal>

        <Reveal step={1} className="md:col-span-6">
          <BentoCard className="h-full gap-5 md:p-10">
            <h3 className="text-pretty text-[21px] font-medium leading-snug tracking-[-0.01em]">
              {finalCta.formTitle}
            </h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label={finalCta.fields.industryLabel} htmlFor="industry">
                <select
                  id="industry"
                  name="industry"
                  required
                  value={industry}
                  onChange={(event) => setIndustry(event.target.value)}
                  className="min-h-[52px] w-full rounded-xl border border-border bg-card px-4 text-[17px] text-foreground"
                >
                  <option value="" disabled>
                    {finalCta.fields.industryPlaceholder}
                  </option>
                  {finalCta.industryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={finalCta.fields.nameLabel} htmlFor="name">
                <input
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder={finalCta.fields.namePlaceholder}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="min-h-[52px] w-full rounded-xl border border-border bg-card px-4 text-[17px] text-foreground placeholder:text-muted-foreground"
                />
              </Field>

              <Field label={finalCta.fields.contactLabel} htmlFor="contact">
                <input
                  id="contact"
                  name="contact"
                  required
                  inputMode="text"
                  autoComplete="tel"
                  placeholder={finalCta.fields.contactPlaceholder}
                  value={contact}
                  onChange={(event) => setContact(event.target.value)}
                  className="min-h-[52px] w-full rounded-xl border border-border bg-card px-4 text-[17px] text-foreground placeholder:text-muted-foreground"
                />
              </Field>

              <button
                type="submit"
                data-goal="form_submit"
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[17px] font-medium leading-none text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <AvitoIcon className="size-5 shrink-0" />
                {finalCta.fields.submit}
              </button>

              <p aria-live="polite" className="text-[15px] leading-relaxed text-muted-foreground">
                {copied ? (
                  <span className="flex items-start gap-2 font-medium text-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
                    Сообщение скопировано — вставьте его в переписку, там уже всё написано.
                  </span>
                ) : (
                  finalCta.microcopy
                )}
              </p>
            </form>
          </BentoCard>
        </Reveal>
      </div>
    </Section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[15px] font-medium tracking-[0.01em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
