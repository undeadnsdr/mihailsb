import Image from 'next/image'
import { Check, WifiOff } from 'lucide-react'
import { pwa, works } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/** Кадр 6: сайт как приложение. Плитка 16:9. */
export function PwaSection() {
  return (
    <Section id="pwa" labelledBy="pwa-title">
      <Reveal>
        <BentoCard tone="primary" className="gap-8 md:gap-10 md:p-8 lg:p-10 xl:p-12">
          {/* Макет домашнего экрана телефона (9:17) рядом с текстом в
              половину планшета выглядел щепкой — до lg он уходит под текст
              и центрируется, сохраняя свою ширину 280px */}
          <div className="grid grid-cols-1 gap-8 md:gap-6 lg:grid-cols-12 lg:items-center">
            <div className="flex flex-col gap-5 lg:col-span-7">
              <h2
                id="pwa-title"
                className="text-balance text-[26px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[30px] md:text-[34px] lg:text-[44px]"
              >
                {pwa.title}
              </h2>
              <p className="max-w-[56ch] text-pretty text-[16px] leading-relaxed text-primary-foreground/85 sm:text-[17px] lg:text-lg">
                {pwa.lead}
              </p>

              <p className="flex items-start gap-3 rounded-xl bg-primary-foreground/10 p-4 text-pretty text-[16px] font-medium leading-relaxed sm:text-[17px]">
                <WifiOff className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                {pwa.keyLine}
              </p>

              {/* Три коротких пункта теперь помещаются в одну строку даже
                  на телефоне. w-full + justify-center центрируют их по
                  всей ширине текстовой колонки, а не прижимают к левому
                  краю, как остальной текст выше */}
              <ul className="flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {pwa.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2 text-[15px] text-primary-foreground/85">
                    <Check className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>

            {/* Домашний экран телефона с иконкой сайта */}
            <div className="lg:col-span-5">
              {/* В горизонтальной ориентации смартфона макет телефона 9:17
                  высотой 500px+ выдавливал бы всё остальное из кадра —
                  там он уменьшается до 200px */}
              <div className="mx-auto w-full max-w-[280px] short-landscape:max-w-[200px]">
                <HomeScreen />
              </div>
            </div>
          </div>
        </BentoCard>
      </Reveal>
    </Section>
  )
}

function HomeScreen() {
  const icons = works.slice(0, 3)

  return (
    <div className="rounded-[2.25rem] border border-primary-foreground/25 bg-primary-hover p-2.5">
      <div
        className="relative flex flex-col justify-end gap-5 overflow-hidden rounded-[1.75rem] bg-[#0b1c30] p-5"
        style={{ aspectRatio: '9 / 17' }}
      >
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-3 h-4 w-16 -translate-x-1/2 rounded-full bg-primary-foreground/15"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="relative size-16 overflow-hidden rounded-[1.1rem] border border-primary-foreground/20">
            <Image
              src="/icons/icon-192.png"
              alt="Иконка сайта на домашнем экране телефона"
              fill
              sizes="64px"
              className="object-cover"
            />
          </div>
          <span className="text-[13px] font-medium text-primary-foreground/90">Ваш сайт</span>
        </div>

        <div className="flex justify-center gap-4 opacity-35" aria-hidden="true">
          {icons.map((work) => (
            <span key={work.id} className="size-11 rounded-[0.9rem] bg-primary-foreground/25" />
          ))}
        </div>
      </div>
    </div>
  )
}
