import { LayoutList, AtSign, Users, Check } from 'lucide-react'
import { showcase } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { ChannelText } from '@/components/ui/channel-text'

/** Иконка на смысл канала: доска объявлений — список строк, соцсети —
 *  собака из ника, сарафан — люди. Тот же приём, что в pains.tsx */
const channelIcons = {
  board: LayoutList,
  social: AtSign,
  word: Users,
} as const

/**
 * «Лендинг — ещё одна витрина».
 *
 * Асимметрия 7/5 вместо двух равных колонок сознательная: слева перечисление
 * (три канала, ни один не главный — flat), справа единственный вывод секции,
 * поэтому только он получает вес primary. Если сделать колонки равными, обе
 * части читаются как «сравнение двух вариантов», хотя мысль другая — каналы
 * остаются, сайт к ним добавляется.
 */
export function Showcase() {
  return (
    <Section id="showcase" labelledBy="showcase-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading id="showcase-title" title={showcase.title} subtitle={showcase.subtitle} />

        {/* До lg колонки идут друг под другом: карточке с чек-листом нужна
            вся ширина, в половине планшетного экрана строки ломаются по
            два-три слова */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 md:gap-6 lg:col-span-7">
            <Reveal>
              <h3 className="text-[17px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                {showcase.channels.title}
              </h3>
            </Reveal>

            <ul className="flex flex-col gap-4 md:gap-6">
              {showcase.channels.items.map((item, index) => {
                const Icon = channelIcons[item.icon]
                return (
                  <Reveal key={item.title} as="li" step={(index % 3) as 0 | 1 | 2}>
                    {/* flat: три работающих канала, ни один не ошибка и не
                        главнее соседнего (см. bento-card.tsx). Ряд внутри
                        карточки, а не колонка — пунктов три, вертикальная
                        раскладка растянула бы левую часть выше правой */}
                    <BentoCard tone="flat" className="h-full flex-row items-start gap-4 p-5 md:p-6">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent">
                        <Icon className="size-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
                      </span>
                      <span className="flex flex-col gap-1.5">
                        <span className="text-pretty text-[18px] font-medium leading-snug tracking-[-0.01em]">
                          {item.title}
                        </span>
                        <ChannelText text={item.text} />
                      </span>
                    </BentoCard>
                  </Reveal>
                )
              })}
            </ul>
          </div>

          <Reveal step={1} className="lg:col-span-5">
            {/* Единственный акцентный блок секции: это её вывод, всё
                остальное — перечисление. h-full, чтобы на десктопе
                вытянуться по высоте трёх карточек слева */}
            <BentoCard tone="primary" className="h-full gap-5">
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-medium uppercase tracking-[0.1em] text-primary-foreground/70">
                  {showcase.site.label}
                </span>
                <h3 className="text-pretty text-[22px] font-semibold leading-snug tracking-[-0.01em] lg:text-[26px]">
                  {showcase.site.title}
                </h3>
              </div>

              <ul className="flex flex-col gap-3">
                {showcase.site.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check
                      className="mt-1 size-4 shrink-0 text-primary-foreground"
                      strokeWidth={2.25}
                      aria-hidden="true"
                    />
                    <span className="text-pretty text-[16px] leading-relaxed text-primary-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>

              <p className="mt-auto border-t border-primary-foreground/20 pt-4 text-pretty text-[15px] leading-relaxed text-primary-foreground/70">
                {showcase.site.note}
              </p>
            </BentoCard>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
