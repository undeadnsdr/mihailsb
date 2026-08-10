'use client'

import Image from 'next/image'
import { MapPin, Check, Clock } from 'lucide-react'
import { hero, finalCta, site } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { AvitoButton, ScrollLink } from '@/components/ui/cta'
import { AvitoIcon } from '@/components/ui/avito-icon'
import { useAvitoLeadForm } from '@/lib/lead-form'

/**
 * Кадр 1 для объявления.
 *
 * Макет: крупное фото слева с заголовком и кнопками поверх, справа —
 * две плитки-цифры и мини-форма заявки. На мобильном фото и форма
 * уходят под заголовок, а не наоборот — H1 и цена обязаны попадать
 * в первый экран без скролла.
 */
export function Hero() {
  return (
    <Section id="hero" className="pt-8 md:pt-12 lg:pt-16" labelledBy="hero-title">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <Reveal className="lg:col-span-7">
          <PhotoCard />
        </Reveal>

        <Reveal step={1} className="flex flex-col gap-4 lg:col-span-5">
          <div className="grid grid-cols-2 gap-4">
            {hero.tiles.map((tile) => (
              <BentoCard key={tile.label} tone="primary" className="gap-1 p-5 md:p-6">
                <span className="tnum text-[32px] font-bold leading-none tracking-[-0.03em] md:text-[40px]">
                  {tile.value}
                  <span className="ml-1 text-lg font-medium">{tile.unit}</span>
                </span>
                <span className="text-[14px] leading-snug text-primary-foreground/75">{tile.label}</span>
              </BentoCard>
            ))}
          </div>

          <LeadWidget />
        </Reveal>
      </div>
    </Section>
  )
}

/** Крупное фото с заголовком, подзаголовком и кнопками поверх */
function PhotoCard() {
  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-border sm:aspect-[16/10] lg:aspect-[4/3]">
      <Image
        src="/hero/master-photo.webp"
        alt={hero.photoAlt}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        priority
        className="object-cover"
      />
      {/* Градиент только там, где лежит текст — не затемняет всё фото */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(0deg, rgba(17,24,39,0.88) 0%, rgba(17,24,39,0.35) 45%, transparent 70%)' }}
      />

      <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-card/90 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm">
        <MapPin className="size-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
        {hero.badge}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 md:p-8">
        <h1
          id="hero-title"
          className="text-balance text-[30px] font-bold leading-[1.1] tracking-[-0.03em] text-background md:text-[44px] lg:text-[48px]"
        >
          {hero.h1}
        </h1>
        <p className="max-w-[46ch] text-pretty text-[16px] leading-relaxed text-background/85 md:text-lg">
          {hero.subtitle}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <AvitoButton place="hero">{hero.primaryCta}</AvitoButton>
          <ScrollLink
            to="#works"
            className="border-background/30 bg-background/10 text-background hover:bg-background/20 sm:w-auto"
          >
            {hero.secondaryCta}
          </ScrollLink>
        </div>

        <p className="flex items-center gap-2 text-[14px] text-background/70">
          <Check className="size-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
          {hero.trustLine[0]} · {hero.trustLine[1]}
        </p>
      </div>
    </div>
  )
}

/**
 * Мини-форма заявки — упрощённая версия финальной формы (без имени):
 * выбрал сферу, оставил телефон, дальше открывается переписка на Авито.
 * Логика общая с финальной формой (lib/lead-form.ts), поэтому обе формы
 * шлют одинаковое сообщение и цель Метрики с разным `place`.
 */
function LeadWidget() {
  const { industry, setIndustry, contact, setContact, copied, handleSubmit } = useAvitoLeadForm('hero')

  return (
    <BentoCard className="flex-1 gap-4 p-5 md:p-6">
      <h2 className="text-pretty text-[19px] font-medium leading-snug tracking-[-0.01em]">{hero.widgetTitle}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <select
          id="hero-industry"
          name="industry"
          required
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
          aria-label={finalCta.fields.industryLabel}
          className="min-h-[52px] w-full rounded-xl border border-border bg-card px-4 text-[16px] text-foreground"
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

        <input
          id="hero-contact"
          name="contact"
          required
          inputMode="text"
          autoComplete="tel"
          placeholder={finalCta.fields.contactPlaceholder}
          aria-label={finalCta.fields.contactLabel}
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          className="min-h-[52px] w-full rounded-xl border border-border bg-card px-4 text-[16px] text-foreground placeholder:text-muted-foreground"
        />

        <button
          type="submit"
          data-goal="form_submit"
          data-place="hero"
          className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 text-[16px] font-medium leading-none text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <AvitoIcon className="size-5 shrink-0" />
          {hero.widgetSubmit}
        </button>

        <p aria-live="polite" className="flex items-start gap-2 text-[14px] leading-relaxed text-muted-foreground">
          {copied ? (
            <>
              <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-foreground">Сообщение скопировано — вставьте в переписку.</span>
            </>
          ) : (
            <>
              <Clock className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              <span>Отвечаю {site.responseTime}. Платить сейчас не нужно.</span>
            </>
          )}
        </p>
      </form>
    </BentoCard>
  )
}
