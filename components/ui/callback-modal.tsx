'use client'

import { useState } from 'react'
import { Check, Phone } from 'lucide-react'
import { callbackModal } from '@/lib/content'
import { useCallbackForm } from '@/lib/callback-form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

/**
 * Модалка обратного звонка. Заменяет собой мини-виджет на первом экране —
 * тот вёл в переписку на Авито и дублировал соседнюю кнопку «Написать»,
 * не давая ничего сверх неё.
 *
 * Триггер передаётся снаружи (кнопка в TopBar или в Hero), поэтому
 * форма и её состояние переиспользуются, а внешний вид кнопки — нет.
 */
export function CallbackModal({ trigger, place }: { trigger: ReactNode; place: string }) {
  const [open, setOpen] = useState(false)
  const { name, setName, industry, setIndustry, industryOther, setIndustryOther, phone, setPhone, isOther, sent, handleSubmit, reset } =
    useCallbackForm(place)

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) reset()
      }}
    >
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[21px] font-medium tracking-[-0.01em]">{callbackModal.title}</DialogTitle>
          <DialogDescription>{callbackModal.subtitle}</DialogDescription>
        </DialogHeader>

        {sent ? (
          <p className="flex items-start gap-2 rounded-xl border border-border bg-secondary p-4 text-[15px] leading-relaxed text-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
            {callbackModal.successText}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Field label={callbackModal.fields.nameLabel} htmlFor="callback-name">
              <input
                id="callback-name"
                name="name"
                required
                autoComplete="name"
                placeholder={callbackModal.fields.namePlaceholder}
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-border bg-card px-4 text-[16px] text-foreground placeholder:text-muted-foreground"
              />
            </Field>

            <Field label={callbackModal.fields.industryLabel} htmlFor="callback-industry">
              <select
                id="callback-industry"
                name="industry"
                required
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-border bg-card px-4 text-[16px] text-foreground"
              >
                <option value="" disabled>
                  {callbackModal.fields.industryPlaceholder}
                </option>
                {callbackModal.industryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            {isOther ? (
              <Field label={callbackModal.fields.industryOtherLabel} htmlFor="callback-industry-other">
                <input
                  id="callback-industry-other"
                  name="industryOther"
                  required
                  placeholder={callbackModal.fields.industryOtherPlaceholder}
                  value={industryOther}
                  onChange={(event) => setIndustryOther(event.target.value)}
                  className="min-h-[48px] w-full rounded-xl border border-border bg-card px-4 text-[16px] text-foreground placeholder:text-muted-foreground"
                />
              </Field>
            ) : null}

            <Field label={callbackModal.fields.phoneLabel} htmlFor="callback-phone">
              <input
                id="callback-phone"
                name="phone"
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder={callbackModal.fields.phonePlaceholder}
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-border bg-card px-4 text-[16px] text-foreground placeholder:text-muted-foreground"
              />
            </Field>

            <button
              type="submit"
              data-goal="form_submit"
              data-place={place}
              className={cn(
                'inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[16px] font-medium leading-none text-primary-foreground transition-colors hover:bg-primary-hover',
              )}
            >
              <Phone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {callbackModal.fields.submit}
            </button>

            {/* Две версии подписи вместо одной: на смартфоне короткая,
                от sm — полная. Переключение классами, а не через JS,
                чтобы разметка совпадала на сервере и клиенте */}
            <p className="text-[14px] leading-relaxed text-muted-foreground">
              <span className="sm:hidden">{callbackModal.microcopyMobile}</span>
              <span className="hidden sm:inline">{callbackModal.microcopy}</span>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-[14px] font-medium tracking-[0.01em] text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}
