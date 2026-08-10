import { works, worksSection } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { WorkShowcase } from '@/components/ui/work-showcase'
import { AvitoButton } from '@/components/ui/cta'

/**
 * Работы: по одному проекту на экран, в шахматном порядке.
 *
 * Раньше это была сетка бенто, и в ней каждая работа получала свой
 * случайный размер — на маленьких плитках демо-сайт превращался в
 * нечитаемую миниатюру, а разные устройства выглядели как разные проекты.
 * Теперь у каждого проекта своя полоса во всю ширину: слева слайдшоу из
 * пяти устройств, справа описание, и стороны меняются местами через
 * проект. Разделяют полосы линии во всю ширину экрана — они держат ритм
 * лучше, чем рамки карточек, и не спорят с корпусами устройств внутри.
 */
export function Works() {
  return (
    <Section id="works" labelledBy="works-title">
      <div className="flex flex-col gap-10 md:gap-12">
        <SectionHeading id="works-title" title={worksSection.title} subtitle={worksSection.subtitle} />

        <div className="flex flex-col">
          {works.map((work, index) => (
            <div key={work.id} className="relative">
              {/* Линия во всю ширину экрана. body с overflow-x: clip,
                  поэтому 100vw не добавляет горизонтальной прокрутки */}
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute left-1/2 top-0 h-px w-screen -translate-x-1/2 bg-border/70"
                />
              ) : null}
              <Reveal className="py-10 md:py-14">
                <WorkShowcase work={work} index={index} reversed={index % 2 === 1} />
              </Reveal>
            </div>
          ))}
        </div>

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
