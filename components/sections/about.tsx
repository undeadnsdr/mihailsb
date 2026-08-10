import { ArrowUpRight, MapPin, Quote } from 'lucide-react'
import { about, geo, site } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { ExpandableText } from '@/components/ui/expandable-text'

/**
 * Про меня + гео.
 * Блок отзыва рендерится только когда отзыв реально есть (about.review),
 * чтобы на странице не стояло выдуманной социальной подпорки.
 */
export function About() {
  return (
    <Section id="about" labelledBy="about-title">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        <div className="flex flex-col gap-6 md:col-span-7">
          <SectionHeading id="about-title" title={about.title} />

          <Reveal step={1}>
            <ExpandableText lines={4} className="flex flex-col gap-4 text-muted-foreground">
              {about.text.map((paragraph) => (
                <span key={paragraph} className="block">
                  {paragraph}
                </span>
              ))}
            </ExpandableText>
          </Reveal>

          <Reveal step={2} className="flex">
            <a
              href={site.avitoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-[17px] font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
            >
              {about.avitoLinkLabel}
              <ArrowUpRight className="size-4" strokeWidth={1.75} aria-hidden="true" />
            </a>
          </Reveal>

          {about.review ? (
            <Reveal step={3}>
              <BentoCard tone="secondary" className="gap-3">
                <Quote className="size-6 text-primary" strokeWidth={1.75} aria-hidden="true" />
                <p className="text-pretty text-[17px] leading-relaxed">{about.review.text}</p>
                <p className="text-[15px] font-medium text-muted-foreground">
                  {about.review.author} · {about.review.niche}
                </p>
              </BentoCard>
            </Reveal>
          ) : null}
        </div>

        <Reveal step={2} className="md:col-span-5">
          <BentoCard tone="secondary" className="h-full gap-4">
            <h3 className="flex items-center gap-2 text-[21px] font-medium leading-snug tracking-[-0.01em]">
              <MapPin className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              {geo.title}
            </h3>
            <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">{geo.text}</p>
            <ul className="flex flex-wrap gap-2">
              {geo.places.map((place) => (
                <li
                  key={place}
                  className="rounded-lg border border-border bg-card px-3 py-1.5 text-[15px] font-medium"
                >
                  {place}
                </li>
              ))}
            </ul>
          </BentoCard>
        </Reveal>
      </div>
    </Section>
  )
}
