'use client'

import { finalCta, site } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { AvitoButton, PhoneButton } from '@/components/ui/cta'
import { useTelegramLeadForm } from '@/lib/lead-form'
import { Check, Clock, Send } from 'lucide-react'

/**
 * Финальный экран.
 *
 * Форма сознательно без бэкенда: у страницы нет базы и почтового сервиса,
 * а заявка, ушедшая в никуда, хуже отсутствия формы. Поэтому по отправке
 * открывается переписка в Телеграме с уже готовым текстом сообщения —
 * человеку остаётся только нажать «Отправить» в самом мессенджере.
 *
 * Левая плитка ниже, чем правая (заголовок + форма из 3 полей), поэтому
 * grid растягивает её на всю высоту строки (stretch по умолчанию), а
 * justify-end внутри BentoCard прижимает контент к нижней границе —
 * иначе плитка была бы растянута, но с пустым полем сверху.
 */
export function FinalCta() {
  const { industry, setIndustry, name, setName, contact, setContact, sent, handleSubmit } =
    useTelegramLeadForm('final')

  return (
    <Section id="contact" labelledBy="contact-title">
      {/* Две колонки по половине включались на md: на планшете в портрете
          форма с полями по 52px и подписями оставалась в 340px, а рядом
          с ней — сжатый призыв. До lg блоки идут друг под другом, форма
          получает всю ширину, и оба блока читаются в полный размер */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-6">
          <BentoCard tone="primary" className="h-full justify-end gap-6 md:p-8 lg:p-10 xl:p-12">
            <h2
              id="contact-title"
              className="text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[30px] md:text-[34px] lg:text-[44px]"
            >
              {finalCta.title}
            </h2>
            <p className="max-w-[46ch] text-pretty text-[16px] leading-relaxed text-primary-foreground/85 sm:text-[17px] lg:text-lg">
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

        <Reveal step={1} className="lg:col-span-6">
          <BentoCard className="h-full gap-5 md:p-8 lg:p-10">
            <h3 className="text-pretty text-[19px] font-medium leading-snug tracking-[-0.01em] sm:text-[21px]">
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

              {/* id поля — contact-field, а не contact: id="contact" занят
                  самой секцией, а дубль ломает якорь #contact из нижней панели */}
              <Field label={finalCta.fields.contactLabel} htmlFor="contact-field">
                <input
                  id="contact-field"
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
                className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[17px] font-medium leading-none text-primary-foreground transition-colors hover:bg-primary-hover"
              >
                <Send className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {finalCta.fields.submit}
              </button>

              <p aria-live="polite" className="text-center text-[15px] leading-relaxed text-muted-foreground">
                {sent ? (
                  <span className="flex items-center justify-center gap-2 font-medium text-foreground">
                    <Check className="size-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
                    Открылся Телеграм с готовым сообщением — нажмите «Отправить» там.
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
