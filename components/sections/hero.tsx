'use client'

import Image from 'next/image'
import { MapPin, Check, Phone } from 'lucide-react'
import { hero, site } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { AvitoButton, ScrollLink } from '@/components/ui/cta'
import { CallbackModal } from '@/components/ui/callback-modal'
import { reachGoal } from '@/lib/analytics'

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
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <Reveal className="lg:col-span-7">
          <PhotoCard />
        </Reveal>

        <Reveal step={1} className="flex flex-col gap-4 lg:col-span-5 lg:h-full">
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

          <CallbackCard />
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
 * Карточка обратного звонка рядом с плитками-цифрами.
 *
 * Раньше здесь была мини-форма заявки, которая вела всё в ту же переписку
 * на Авито, что и кнопка на фото слева — то же действие продублировано,
 * а предзаполнить сообщение в Авито и так нельзя. Теперь тут отдельный
 * сценарий: звонок, для тех, кому проще ответить на входящий, чем писать.
 */
function CallbackCard() {
  return (
    <BentoCard className="flex-1 justify-center gap-3 p-5 md:p-6">
      <h2 className="text-pretty text-[19px] font-medium leading-snug tracking-[-0.01em]">{hero.callbackTitle}</h2>
      <p className="text-pretty text-[14px] leading-relaxed text-muted-foreground">{hero.callbackText}</p>

      <CallbackModal
        place="hero"
        trigger={
          <button
            type="button"
            data-goal="click_callback"
            data-place="hero"
            onClick={() => reachGoal('click_callback', { place: 'hero' })}
            className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[16px] font-medium leading-none text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            <Phone className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
            {hero.callbackCta}
          </button>
        }
      />

      <p className="text-[14px] text-muted-foreground">Отвечаю {site.responseTime}. Звонок за мой счёт.</p>
    </BentoCard>
  )
}
