import { ChevronDown } from 'lucide-react'
import { works, worksSection } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { WorksSlideshow } from '@/components/ui/works-slideshow'

/**
 * Работы: одна сцена на все проекты.
 *
 * Сначала это была сетка бенто, где каждая работа получала случайный
 * размер и на мелких плитках демо-сайт превращался в нечитаемую миниатюру.
 * Потом — шесть полос с разделителями, по проекту на полосу: читалось
 * лучше, но шесть блоков одновременно крутили анимации, а листать было
 * нечего. Теперь сцена одна и она сама ведёт показ: прокручивает страницу
 * на одном устройстве, переключается на следующее, а после пятого берёт
 * следующий проект. Разделители не нужны — делить больше нечего.
 */
export function Works() {
  return (
    <Section id="works" labelledBy="works-title">
      <div className="flex flex-col gap-10 md:gap-12">
        <div className="flex flex-col gap-3">
          <SectionHeading id="works-title" title={worksSection.title} />

          {/* На смартфоне описание сворачивается до 3 строк с шевроном в
              конце последней строки — тот же приём, что и в блоке «Про
              меня» (about.tsx): на узком экране абзац целиком отталкивает
              объёмом раньше, чем читатель доберётся до самой сцены со
              слайдшоу. От sm разворачивать нечего — там уже действует
              обычный subtitle из SectionHeading без прыжка макета */}
          <Reveal step={1} className="sm:hidden">
            <details className="group">
              <summary className="relative block cursor-pointer list-none text-pretty text-[16px] leading-relaxed text-muted-foreground [&::-webkit-details-marker]:hidden">
                <p className="line-clamp-3 pr-6 group-open:hidden">{worksSection.subtitle}</p>
                <ChevronDown
                  className="absolute bottom-0 right-0 size-5 shrink-0 text-primary transition-transform group-open:hidden"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </summary>
              <p className="text-pretty leading-relaxed">{worksSection.subtitle}</p>
            </details>
          </Reveal>

          <Reveal
            step={1}
            className="hidden max-w-[62ch] text-pretty text-[17px] leading-relaxed text-muted-foreground sm:block lg:text-lg"
          >
            {worksSection.subtitle}
          </Reveal>
        </div>

        <Reveal>
          <WorksSlideshow works={works} />
        </Reveal>
      </div>
    </Section>
  )
}
