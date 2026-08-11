import { howItWorks } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { AvitoButton } from '@/components/ui/cta'

/**
 * Кадр 8 для объявления: снимает возражение «а вдруг кинет».
 * Нумерация здесь оправдана — это реальная последовательность шагов.
 */
export function HowItWorks() {
  return (
    <Section id="how-it-works" labelledBy="how-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading id="how-title" title={howItWorks.title} subtitle={howItWorks.subtitle} />

        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
          {howItWorks.steps.map((step, index) => (
            <Reveal key={step.title} as="li" step={(index % 5) as 0 | 1 | 2 | 3 | 4}>
              <BentoCard
                tone={index === 3 ? 'primary' : 'card'}
                className="h-full gap-3"
              >
                {/* Номер шага — навигация, а не заголовок: на четырёх
                    колонках десктопа 40px нормально, но на смартфоне такая
                    цифра весила больше самого шага, поэтому стартует с 32px */}
                <span
                  className={
                    index === 3
                      ? 'tnum text-[32px] font-bold leading-none tracking-[-0.04em] text-primary-foreground/45 sm:text-[40px]'
                      : 'tnum text-[32px] font-bold leading-none tracking-[-0.04em] text-accent sm:text-[40px]'
                  }
                >
                  {index + 1}
                </span>
                <h3 className="text-pretty text-[19px] font-medium leading-snug tracking-[-0.01em] sm:text-[21px]">
                  {step.title}
                </h3>
                <p
                  className={
                    index === 3
                      ? 'text-pretty text-[16px] leading-relaxed text-primary-foreground/85 sm:text-[17px]'
                      : 'text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]'
                  }
                >
                  {step.text}
                </p>
                {/* Кнопка живёт внутри последней карточки, а не отдельным
                    блоком под сеткой — «Приступайте!» и есть сам призыв нажать.
                    whitespace-nowrap держит текст в одну строку на смартфоне,
                    где кнопка растягивается на всю ширину карточки. */}
                {index === 3 ? (
                  <AvitoButton
                    place="how-it-works"
                    className="mt-1 whitespace-nowrap border-primary-foreground/30 bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  >
                    {howItWorks.cta}
                  </AvitoButton>
                ) : null}
              </BentoCard>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  )
}
