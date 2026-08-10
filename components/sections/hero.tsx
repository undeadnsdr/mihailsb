import { MapPin, Check } from 'lucide-react'
import { hero, works } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { AvitoButton, ScrollLink } from '@/components/ui/cta'
import { PhoneMockup } from '@/components/ui/site-mockup'

/**
 * Кадр 1 для объявления.
 * На мобильном H1, цена и primary CTA обязаны попадать в первый экран
 * без скролла — поэтому макет справа уходит ПОД кнопки, а не над ними.
 */
export function Hero() {
  return (
    <Section id="hero" className="pt-8 md:pt-12 lg:pt-16" labelledBy="hero-title">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-6">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <Reveal className="flex">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium tracking-[0.01em] text-accent-foreground">
              <MapPin className="size-4" strokeWidth={1.75} aria-hidden="true" />
              {hero.badge}
            </span>
          </Reveal>

          <Reveal step={1}>
            <h1
              id="hero-title"
              className="text-balance text-[34px] font-bold leading-[1.1] tracking-[-0.03em] md:text-[52px] lg:text-[64px]"
            >
              {hero.h1}
            </h1>
          </Reveal>

          <Reveal step={2}>
            <p className="max-w-[52ch] text-pretty text-[17px] leading-relaxed text-muted-foreground md:text-lg">
              {hero.subtitle}
            </p>
          </Reveal>

          <Reveal step={3} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <AvitoButton place="hero">{hero.primaryCta}</AvitoButton>
            <ScrollLink to="#works" className="sm:w-auto">
              {hero.secondaryCta}
            </ScrollLink>
          </Reveal>

          <Reveal step={4}>
            <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {hero.trustLine.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[15px] text-muted-foreground">
                  <Check className="size-4 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Бенто-стопка: макет телефона + две плитки-цифры */}
        <Reveal step={2} className="lg:col-span-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-stretch lg:flex-col">
            <div className="mx-auto w-full max-w-[300px] md:mx-0 md:max-w-[260px] lg:max-w-[300px]">
              <PhoneFrame />
            </div>

            <div className="flex gap-4 md:flex-col md:justify-center lg:flex-row">
              {hero.tiles.map((tile) => (
                <BentoCard key={tile.label} tone="card" className="flex-1 gap-1">
                  <span className="tnum text-[40px] font-bold leading-none tracking-[-0.04em] text-primary md:text-[48px]">
                    {tile.value}
                    <span className="ml-1 text-xl font-medium">{tile.unit}</span>
                  </span>
                  <span className="text-[15px] leading-snug text-muted-foreground">{tile.label}</span>
                </BentoCard>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}

/** Корпус телефона с живым демо-макетом внутри */
function PhoneFrame() {
  return (
    <div className="relative rounded-[2.25rem] border border-border bg-card p-2.5 card-shadow">
      <div
        className="relative overflow-hidden rounded-[1.75rem] bg-card [container-type:inline-size]"
        style={{ aspectRatio: '9 / 17' }}
      >
        <PhoneMockup work={works[0]} priority />
        {/* Плашка-«островок» */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-2 h-4 w-16 -translate-x-1/2 rounded-full bg-foreground/85"
        />
      </div>
    </div>
  )
}
