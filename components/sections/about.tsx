import Image from 'next/image'
import { MapPin, Quote } from 'lucide-react'
import { about, geo } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { VoiceNote } from '@/components/ui/voice-note'

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
          {/* Фото рядом с заголовком подтверждает «сайт делает реальный
              человек», но не должно спорить с заголовком за внимание —
              поэтому размер держится чуть выше высоты заглавной буквы h2
              (28px/44px, cap-height ≈ 0.7 от кегля), а не вровень со всей
              строкой целиком, как было раньше (56/80px) */}
          <div className="flex items-center gap-4 md:gap-5">
            <Image
              src="/avatar.webp"
              alt="Илья, автор сайта"
              width={40}
              height={40}
              className="size-6 shrink-0 rounded-full border border-border object-cover md:size-10"
            />
            <SectionHeading id="about-title" title={about.title} className="flex-1" />
          </div>

          {/* Текст теперь два коротких абзаца — «Читать дальше» тут только мешает,
              прятать нечего, а лишний тап отделял бы читателя от голосового ниже */}
          <Reveal step={1} className="flex flex-col gap-4 text-muted-foreground">
            {about.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal step={2}>
            <VoiceNote
              src={about.voice.src}
              type={about.voice.type}
              title={about.voice.title}
              hint={about.voice.hint}
              duration={about.voice.duration}
              peaks={about.voice.peaks}
              unsupportedNote={about.voice.unsupportedNote}
              downloadLabel={about.voice.downloadLabel}
            />
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
