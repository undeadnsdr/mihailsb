import { Info } from 'lucide-react'
import { pricing } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { AvitoButton } from '@/components/ui/cta'

/**
 * Кадр 10. Цифра 6000 набрана 96px — это главный аргумент страницы.
 *
 * Правая колонка — это два блока друг под другом («Если нужно больше» +
 * «Если нужно ещё больше»), их суммарная высота почти всегда больше, чем
 * естественная высота левой плитки с ценой. Grid по умолчанию тянет все
 * колонки строки на одинаковую высоту (stretch), поэтому левая плитка
 * растягивается сама — h-full на BentoCard просто использует эту высоту.
 * А вот содержимое внутри неё без явного justify-end осталось бы прижатым
 * к верху с пустым полем снизу, поэтому контент внутри плитки выровнен
 * по нижней границе.
 */
export function Pricing() {
  return (
    <Section id="pricing" labelledBy="pricing-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading id="pricing-title" title={pricing.title} subtitle={pricing.subtitle} />

        {/* Раскладка 7/5 включалась на md — на планшете в портрете плитка
            цены получала 390px, цифра 96px почти упиралась в края, а
            grid растягивал плитку под высоту правой колонки, из-за чего
            сверху зияло пустое поле в треть карточки. До lg колонки идут
            друг под другом: цена получает всю ширину, растягивать нечего */}
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <BentoCard className="h-full justify-end gap-6 lg:p-10">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-medium tracking-[0.01em] text-muted-foreground">
                  {pricing.main.title}
                </span>
                {/* Главный аргумент страницы, поэтому кегль максимальный,
                    какой выдерживает ширина: на 300px это 52px, к планшету
                    в портрете 76px, и только на десктопе заявленные 96px.
                    Цвет — text-highlight, а не text-primary: primary тут же
                    ниже носит кнопка «Написать на Авито», и одним цветом
                    были размечены и «сколько стоит», и «нажми, чтобы
                    купить» — два разных сообщения теряли разницу */}
                <span className="tnum flex items-baseline gap-2 text-[52px] font-bold leading-none tracking-[-0.04em] text-highlight sm:text-[64px] md:text-[76px] lg:text-[96px]">
                  {pricing.main.price}
                  <span className="text-[26px] font-medium sm:text-[32px] md:text-[38px] lg:text-[44px]">
                    {pricing.main.currency}
                  </span>
                </span>
              </div>

              <dl className="flex flex-col divide-y divide-border border-y border-border">
                {pricing.main.breakdown.map((row) => (
                  <div key={row.label} className="flex items-baseline justify-between gap-4 py-3">
                    <dt className="text-[17px] leading-snug text-muted-foreground">{row.label}</dt>
                    <dd className="tnum shrink-0 text-[17px] font-medium">{row.value}</dd>
                  </div>
                ))}
              </dl>

              <p className="text-[17px] font-medium leading-relaxed">{pricing.main.note}</p>

              {/* Порог sm — тот же, на котором кнопка в базовых классах
                  перестаёт быть во всю ширину: раньше она тянулась до 768px
                  и в горизонтальной ориентации смартфона занимала всю строку */}
              <AvitoButton place="pricing" className="sm:w-auto sm:self-start">
                {pricing.main.cta}
              </AvitoButton>
            </BentoCard>
          </Reveal>

          <div className="flex flex-col gap-4 md:gap-6 lg:col-span-5">
            <Reveal step={1} className="flex-1">
              <BentoCard tone="secondary" className="h-full gap-4">
                <h3 className="text-[21px] font-medium leading-snug tracking-[-0.01em]">Если нужно больше</h3>
                <dl className="flex flex-col divide-y divide-border">
                  {pricing.extras.map((extra) => (
                    <div key={extra.title} className="flex items-baseline justify-between gap-4 py-3">
                      <dt className="text-[15px] leading-snug">{extra.title}</dt>
                      <dd className="tnum shrink-0 text-[15px] font-medium">{extra.price}</dd>
                    </div>
                  ))}
                </dl>
              </BentoCard>
            </Reveal>

            <Reveal step={2}>
              {/* Раньше этот блок был предупреждением про скрытый платёж
                  (красная рамка, tone="outline"). Второй год — это не риск,
                  а обычное продление, поэтому тон и цвет теперь такие же,
                  как у «Если нужно больше» рядом: секция про цены не должна
                  заканчиваться тревожной нотой */}
              <BentoCard tone="secondary" className="gap-3">
                <span className="flex items-center gap-2 text-[15px] font-medium tracking-[0.01em]">
                  <Info className="size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden="true" />
                  {pricing.renewal.title}
                </span>
                <p className="text-pretty text-[15px] leading-relaxed text-muted-foreground">
                  {pricing.renewal.text}
                </p>
              </BentoCard>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}
