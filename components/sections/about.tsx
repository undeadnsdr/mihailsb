import { ChevronDown, MapPin, Quote } from 'lucide-react'
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
      {/* Колонка гео уезжает под текст до lg: на планшете в портрете она
          получала 300px, и список городов рассыпался в столбик по одному
          тегу в строке. Внизу на всю ширину теги укладываются в две строки */}
      <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
        <div className="flex flex-col gap-6 lg:col-span-7">
          <SectionHeading id="about-title" title={about.title} />

          {/* На смартфоне текст сворачивается до 3 строк с шевроном: на этой
              ширине два абзаца целиком отталкивают читателя объёмом раньше,
              чем он увидит голосовое и цену. На sm+ разворачивать нечего —
              оба абзаца и так помещаются без скролла, «Читать дальше» там
              только мешал бы */}
          <Reveal step={1} className="text-muted-foreground">
            <details className="group sm:hidden">
              {/* relative + absolute шеврон вместо соседнего flex-элемента:
                  раньше он лежал под текстом отдельной строкой. pr-6 на
                  тексте — это padding самого -webkit-box, он подрезает
                  все 3 строки одинаково справа, освобождая место под
                  иконку только в правом нижнем углу блока, где заканчивается
                  третья строка (bottom-0 right-0 совпадает с её концом,
                  потому что line-clamp обрезает блок ровно по высоте 3 строк) */}
              <summary className="relative block cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                <p className="text-pretty line-clamp-3 pr-6 group-open:hidden">{about.text.join(' ')}</p>
                <ChevronDown
                  className="absolute bottom-0 right-0 size-5 shrink-0 text-primary transition-transform group-open:hidden"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </summary>
              <div className="flex flex-col gap-4">
                {about.text.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </details>

            <div className="hidden flex-col gap-4 sm:flex">
              {about.text.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          {/* Правая карточка «Работаю по Тюмени» тянется на всю высоту строки
              грида, а этот столбец — flex-col без своей высоты, поэтому
              под голосовым (когда отзыва нет) оставался невидимый зазор
              и низ карточек не совпадал. lg:mt-auto на группе «голосовое +
              отзыв» съедает этот зазор сверху и прижимает низ группы
              к низу строки — к тому же уровню, где кончается гео-карточка */}
          <div className="flex flex-col gap-6 lg:mt-auto">
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
        </div>

        <Reveal step={2} className="lg:col-span-5">
          <BentoCard tone="secondary" className="h-full gap-4">
            <h3 className="flex items-center gap-2 text-[19px] font-medium leading-snug tracking-[-0.01em] sm:text-[21px]">
              <MapPin className="size-5 shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
              {geo.title}
            </h3>
            <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">{geo.text}</p>
            {/* На смартфоне теги ещё мельче и с совсем узкими паддингами —
                так в строку с переносом помещается по 4-5 штук вместо
                2-3, и список читается компактным плотным облаком, а не
                россыпью крупных таблеток. От sm возвращается прежний,
                более крупный размер */}
            <ul className="flex flex-wrap gap-1 sm:gap-2">
              {geo.places.map((place) => (
                <li
                  key={place}
                  className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[11px] font-medium sm:rounded-lg sm:px-3 sm:py-1.5 sm:text-[15px]"
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
