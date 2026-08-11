'use client'

import { Check, Clock, Send } from 'lucide-react'
import { finalCta, site } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { PhoneButton } from '@/components/ui/cta'
import { useTelegramLeadForm } from '@/lib/lead-form'

/**
 * Финальный блок заявки.
 *
 * Форма без бэкенда: у сайта нет ни базы, ни почтового сервиса, а заявка,
 * ушедшая в никуда, хуже отсутствия формы. По отправке открывается
 * переписка в Telegram с готовым текстом — человеку остаётся нажать
 * «Отправить» в самом мессенджере.
 *
 * Слева призыв и телефон, справа поля. Разделение не декоративное: у
 * строительного заказа звонок и переписка — разные пути к одному, и тот,
 * кто готов говорить, не должен сначала пролистывать форму.
 */
export function FinalCta() {
  const { service, setService, name, setName, phone, setPhone, comment, setComment, sent, handleSubmit } =
    useTelegramLeadForm('final')

  return (
    <Section id="contact" labelledBy="contact-title">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 md:gap-6">
        {/* Левая плитка ниже правой (в правой четыре поля), поэтому grid
            растягивает её по высоте строки, а justify-end прижимает текст
            к нижнему краю — иначе сверху зияло бы пустое поле */}
        <Reveal className="lg:col-span-5">
          <BentoCard tone="primary" className="h-full justify-end gap-6 md:p-8 lg:p-10">
            <h2
              id="contact-title"
              className="display-caps text-balance text-[26px] leading-[1.05] sm:text-[30px] md:text-[34px] lg:text-[40px]"
            >
              {finalCta.title}
            </h2>
            <p className="max-w-[46ch] text-pretty text-[16px] leading-relaxed text-primary-foreground/80 sm:text-[17px]">
              {finalCta.subtitle}
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-[15px] font-medium text-primary-foreground/70">
                {finalCta.callInstead}
              </p>
              {/* Кнопка на жёлтой плитке инвертирована: сплошной жёлтый на
                  жёлтом не читался бы, а обводка цветом текста плитки
                  оставляет её главным действием этой половины */}
              <PhoneButton
                place="final"
                className="border border-primary-foreground/35 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 sm:w-auto"
              >
                {site.phone}
              </PhoneButton>
            </div>

            <p className="flex items-center gap-2 text-[15px] text-primary-foreground/70">
              <Clock className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              Отвечаем в течение часа
            </p>
          </BentoCard>
        </Reveal>

        <Reveal step={1} className="lg:col-span-7">
          <BentoCard className="h-full gap-5 md:p-8 lg:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Два поля в ряд от sm: имя и телефон короткие, и в одну
                  колонку форма из четырёх полей уезжает ниже сгиба */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={finalCta.fields.nameLabel} htmlFor="lead-name">
                  <input
                    id="lead-name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder={finalCta.fields.namePlaceholder}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className={fieldClass}
                  />
                </Field>

                <Field label={finalCta.fields.phoneLabel} htmlFor="lead-phone">
                  <input
                    id="lead-phone"
                    name="phone"
                    required
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder={finalCta.fields.phonePlaceholder}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    className={fieldClass}
                  />
                </Field>
              </div>

              <Field label={finalCta.fields.serviceLabel} htmlFor="lead-service">
                <select
                  id="lead-service"
                  name="service"
                  required
                  value={service}
                  onChange={(event) => setService(event.target.value)}
                  className={fieldClass}
                >
                  <option value="" disabled>
                    {finalCta.fields.servicePlaceholder}
                  </option>
                  {finalCta.serviceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label={finalCta.fields.commentLabel} htmlFor="lead-comment">
                <textarea
                  id="lead-comment"
                  name="comment"
                  rows={3}
                  placeholder={finalCta.fields.commentPlaceholder}
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  className="w-full resize-y rounded-xl border border-border bg-secondary px-4 py-3 text-[17px] leading-relaxed text-foreground placeholder:text-muted-foreground"
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

              <p
                aria-live="polite"
                className="text-center text-[14px] leading-relaxed text-muted-foreground"
              >
                {sent ? (
                  <span className="flex items-center justify-center gap-2 font-medium text-foreground">
                    <Check
                      className="size-4 shrink-0 text-primary"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                    {finalCta.successText}
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

const fieldClass =
  'min-h-[52px] w-full rounded-xl border border-border bg-secondary px-4 text-[17px] text-foreground placeholder:text-muted-foreground'

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
      <label
        htmlFor={htmlFor}
        className="text-[15px] font-medium tracking-[0.01em] text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
