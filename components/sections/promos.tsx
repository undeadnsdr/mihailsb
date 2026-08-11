import { promos } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { PhoneButton } from '@/components/ui/cta'

/**
 * Акции и скидки.
 *
 * Без таймера обратного отсчёта: срок, который истечёт, превращает блок в
 * мусор через месяц, а перезапускающийся счётчик посетитель считает
 * обманом — и правильно считает. Здесь только условия, которые действуют
 * постоянно, поэтому блок не может «протухнуть» сам по себе.
 *
 * Скидка вынесена крупной цифрой вперёд: в этом блоке она и есть то, за
 * чем сюда смотрят, — заголовок карточки без неё лишь пояснение.
 */
export function Promos() {
  return (
    <Section id="promos" labelledBy="promos-title">
      <div className="flex flex-col gap-8">
        <SectionHeading id="promos-title" title={promos.title} subtitle={promos.subtitle} />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promos.items.map((item, index) => (
            <Reveal as="li" key={item.title} step={(Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
              {/* Первая карточка — максимальная скидка, единственная
                  залитая жёлтым: она обязана читаться первой, остальные
                  идут ровным списком */}
              <BentoCard tone={index === 0 ? 'primary' : 'flat'} className="h-full gap-2 p-5">
                <span
                  className={
                    index === 0
                      ? 'display-caps tnum text-[34px] leading-none text-primary-foreground'
                      : 'display-caps tnum text-[34px] leading-none text-highlight'
                  }
                >
                  {item.value}
                </span>
                <h3
                  className={
                    index === 0
                      ? 'display-caps text-[17px] leading-tight tracking-[0.01em] text-primary-foreground'
                      : 'display-caps text-[17px] leading-tight tracking-[0.01em] text-foreground'
                  }
                >
                  {item.title}
                </h3>
                <p
                  className={
                    index === 0
                      ? 'text-[14px] leading-relaxed text-primary-foreground/80'
                      : 'text-[14px] leading-relaxed text-muted-foreground'
                  }
                >
                  {item.text}
                </p>
              </BentoCard>
            </Reveal>
          ))}
        </ul>

        <Reveal>
          <PhoneButton place="promos" variant="primary" className="sm:w-auto">
            Узнать свою скидку
          </PhoneButton>
        </Reveal>
      </div>
    </Section>
  )
}
