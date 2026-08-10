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
                <span
                  className={
                    index === 3
                      ? 'tnum text-[40px] font-bold leading-none tracking-[-0.04em] text-primary-foreground/45'
                      : 'tnum text-[40px] font-bold leading-none tracking-[-0.04em] text-accent'
                  }
                >
                  {index + 1}
                </span>
                <h3 className="text-pretty text-[21px] font-medium leading-snug tracking-[-0.01em]">
                  {step.title}
                </h3>
                <p
                  className={
                    index === 3
                      ? 'text-pretty text-[17px] leading-relaxed text-primary-foreground/85'
                      : 'text-pretty text-[17px] leading-relaxed text-muted-foreground'
                  }
                >
                  {step.text}
                </p>
                {/* Кнопка живёт внутри последней карточки, а не отдельным
                    блоком под сеткой — «Приступайте!» и есть сам призыв нажать. */}
                {index === 3 ? (
                  <AvitoButton place="how-it-works" className="mt-1 border-primary-foreground/30 bg-primary-foreground text-primary hover:bg-primary-foreground/90">
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
