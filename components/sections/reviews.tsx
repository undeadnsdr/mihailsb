import { Quote } from 'lucide-react'
import { reviews } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/**
 * Отзывы заказчиков.
 *
 * Без звёзд и без сводного рейтинга: рейтинг, который невозможно
 * проверить, не добавляет доверия — он его отнимает, потому что пять
 * звёзд у всех шести отзывов читаются как выдумка. Работает другое:
 * имя, конкретный объект и населённый пункт.
 */
export function Reviews() {
  return (
    <Section id="reviews" labelledBy="reviews-title">
      <div className="flex flex-col gap-8">
        <SectionHeading id="reviews-title" title={reviews.title} subtitle={reviews.subtitle} />

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.items.map((item, index) => (
            <Reveal as="li" key={item.name + item.object} step={(Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5)}>
              <BentoCard as="article" tone="flat" className="h-full gap-3 p-5">
                <Quote className="size-5 shrink-0 text-primary" strokeWidth={2} aria-hidden="true" />
                <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground/85">
                  {item.text}
                </blockquote>
                {/* footer, а не div: это атрибуция цитаты, и разметка должна
                    это сообщать — иначе имя читается как ещё одна фраза
                    отзыва */}
                <footer className="flex flex-col gap-0.5 border-t border-border pt-3">
                  <span className="display-caps text-[16px] leading-none tracking-[0.01em] text-foreground">
                    {item.name}
                  </span>
                  <span className="text-[13px] text-muted-foreground">{item.object}</span>
                </footer>
              </BentoCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
