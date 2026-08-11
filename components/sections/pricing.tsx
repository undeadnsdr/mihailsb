import { ChevronDown, Info } from 'lucide-react'
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
 * Цена, разбивка и приписка должны прижиматься к верху (первое, что видит
 * взгляд), а лишнюю высоту съедает mt-auto на кнопке: она остаётся там же,
 * где стояла раньше, просто теперь её позиция определяется отступом сверху,
 * а не justify-end на всём блоке.
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
            <BentoCard className="h-full gap-6 lg:p-10">
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
                  и в горизонтальной ориентации смартфона занимала всю строку.
                  До sm паддинги карточки (p-6) съедали столько ширины, что
                  «Написать на Авито» при базовых px-6/text-17px переносилось
                  на две строки — та же компактная мобильная гарнитура, что
                  и у кнопки в hero, отдаёт тексту недостающие пиксели */}
              <AvitoButton
                place="pricing"
                className="mt-auto max-sm:gap-1.5 max-sm:px-4 max-sm:text-[15px] sm:w-auto sm:self-start"
                iconClassName="size-4 sm:size-5"
              >
                {pricing.main.cta}
              </AvitoButton>
            </BentoCard>
          </Reveal>

          <div className="flex flex-col gap-4 md:gap-6 lg:col-span-5">
            <Reveal step={1} className="flex-1">
              {/* bg-secondary-strong чуть темнее bg-secondary у блока
                  «Если нужно ещё больше» ниже — так первый, более весомый
                  блок визуально отделяется от второго, не прибегая к
                  тени или рамке */}
              <BentoCard tone="secondary" className="h-full gap-4 bg-secondary-strong">
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
                {/* На смартфоне описание длиннее трёх строк — здесь оно
                    спрятано за <details>: кликабельна вся область текста
                    (нативное поведение summary), а шеврон сидит в правом
                    нижнем углу третьей строки за счёт pr-6 на summary.
                    group-open:line-clamp-none снимает обрезку при раскрытии.
                    От sm карточка шире, клэмп и шеврон не нужны вовсе —
                    line-clamp-none включён всегда, а chevron скрыт. */}
                <details className="group">
                  <summary className="relative cursor-pointer list-none pr-6 sm:cursor-default sm:pr-0 [&::-webkit-details-marker]:hidden">
                    <p className="line-clamp-3 text-pretty text-[15px] leading-relaxed text-muted-foreground group-open:line-clamp-none sm:line-clamp-none">
                      {pricing.renewal.text}
                    </p>
                    <ChevronDown
                      className="absolute bottom-0 right-0 size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180 sm:hidden"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </summary>
                </details>
              </BentoCard>
            </Reveal>
          </div>
        </div>
      </div>
    </Section>
  )
}
