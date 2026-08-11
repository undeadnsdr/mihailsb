import { howItWorks } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { PhoneButton } from '@/components/ui/cta'

/**
 * Шесть шагов от звонка до сдачи объекта. Снимает возражение
 * «а вдруг возьмут предоплату и исчезнут».
 *
 * Нумерация здесь — единственное место на странице, где номера оправданы:
 * это настоящая последовательность, в которой шаг нельзя переставить и
 * нельзя пропустить. Тонкая линия слева связывает шаги в одну цепочку —
 * без неё шесть карточек читаются как несвязанный список свойств.
 */
export function HowItWorks() {
  return (
    <Section id="how" labelledBy="how-title">
      <div className="flex flex-col gap-8">
        <SectionHeading id="how-title" title={howItWorks.title} subtitle={howItWorks.subtitle} />

        <ol className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {howItWorks.steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              step={(Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5)}
              // Линия слева — border, а не отдельный элемент: она обязана
              // тянуться на всю высоту карточки, включая текст в три строки,
              // и border делает это без замеров и без absolute
              className="flex flex-col gap-1.5 border-l-2 border-border pl-4 transition-colors hover:border-primary"
            >
              <span className="display-caps tnum text-[14px] leading-none tracking-[0.06em] text-primary">
                Шаг {index + 1}
              </span>
              <h3 className="display-caps text-[18px] leading-tight tracking-[0.01em] text-foreground">
                {step.title}
              </h3>
              <p className="text-[14px] leading-relaxed text-muted-foreground sm:text-[15px]">
                {step.text}
              </p>
            </Reveal>
          ))}
        </ol>

        <Reveal>
          <PhoneButton place="how-it-works" variant="primary" className="sm:w-auto">
            {howItWorks.cta}
          </PhoneButton>
        </Reveal>
      </div>
    </Section>
  )
}
