import { Flame, TrendingUp, Zap, MessageCircleOff } from 'lucide-react'
import { pains } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'

/** Иконка на смысл пункта, а не на украшение: тот, кто первый — огонёк,
 *  цена, которая растёт — график, срок в один день — молния, меньше
 *  вопросов вручную — перечёркнутое сообщение. Тот же паттерн иконок в
 *  кружке accent, что в секции «Что входит в 6000 ₽» (includes.tsx). */
const painIcons = {
  first: Flame,
  price: TrendingUp,
  speed: Zap,
  answers: MessageCircleOff,
} as const

/** Аргументы «почему сейчас», а не «когда-нибудь». Ряд 8+4 / 4+4+4 — монотонной сетки нет. */
export function Pains() {
  return (
    <Section id="pains" labelledBy="pains-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading id="pains-title" title={pains.title} subtitle={pains.subtitle} />

        {/* Была сетка из 12 колонок, где каждая карточка занимала 6, а
            ternary выдавал для обеих ветвей одно и то же — то есть ровно
            две равные колонки, только окольным путём. Две колонки прямо
            и описаны, а порог sm вместо md отдаёт вторую колонку уже
            крупному смартфону боком, где на карточку хватает ~320px */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {pains.items.map((item, index) => {
            const Icon = painIcons[item.icon]
            return (
              <Reveal key={item.title} as="li" step={(index % 3) as 0 | 1 | 2}>
                {/* flat, не card: это четыре равных пункта одного списка,
                    ни один не главнее другого — тень здесь не сигнал, а
                    просто фон-шум. Тень оставлена только там, где на
                    странице есть один главный аргумент (цена, кнопки) */}
                <BentoCard tone="flat" className="h-full gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <h3 className="text-pretty text-[19px] font-medium leading-snug tracking-[-0.01em] sm:text-[21px] lg:text-[26px]">
                    {item.title}
                  </h3>
                  <p className="text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
                    {item.text}
                  </p>
                </BentoCard>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </Section>
  )
}
