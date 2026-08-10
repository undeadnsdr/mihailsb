import { works, worksSection } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { WorksSlideshow } from '@/components/ui/works-slideshow'
import { AvitoButton } from '@/components/ui/cta'

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
        <SectionHeading id="works-title" title={worksSection.title} subtitle={worksSection.subtitle} />

        <Reveal>
          <WorksSlideshow works={works} />
        </Reveal>

        <Reveal className="flex flex-col gap-6">
          <p className="max-w-[80ch] text-pretty text-sm leading-relaxed text-muted-foreground">
            {worksSection.disclaimer}
          </p>
          <AvitoButton place="works" className="md:w-auto md:self-start">
            {worksSection.cta}
          </AvitoButton>
        </Reveal>
      </div>
    </Section>
  )
}
