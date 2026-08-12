'use client'

import { useId, useState } from 'react'
import { Check } from 'lucide-react'
import {
  type Service,
  services,
  servicesDetail,
  formatNumber,
  formatPrice,
  telegramMessage,
} from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { PhotoSlideshow } from '@/components/ui/photo-slideshow'
import { PhoneButton, TelegramButton } from '@/components/ui/cta'
import { reachGoal } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * Все направления подряд. Список идёт из content.ts, а не перечисляется
 * в page.tsx: добавить направление должно быть правкой данных в одном месте,
 * иначе меню услуг, якоря навигации и детальные блоки разъезжаются.
 */
export function ServiceDetails() {
  return (
    <>
      {services.map((service, index) => (
        <ServiceDetail key={service.slug} service={service} index={index} />
      ))}
    </>
  )
}

/**
 * Детальный блок направления: оффер, состав, этапы, прайс-лист.
 *
 * Прайс свёрнут по умолчанию и раскрывается кнопкой. Причина не в красоте:
 * в семи направлениях суммарно больше двухсот позиций, и развёрнутыми они
 * превращают страницу в простыню, через которую невозможно доскроллить до
 * следующего направления. Свёрнутый прайс при этом остаётся в разметке —
 * кнопка только переключает видимость, поэтому поиск и Ctrl+F видят все
 * позиции, а не только раскрытые.
 *
 * Порядок внутри блока — от общего к частному: сначала «что это вообще»
 * (оффер и фото), потом «что входит», потом «как проходит», и только
 * в конце цифры. Прайс раньше состава заставлял бы считать деньги за
 * работу, о которой человек ещё не понял, что она включает.
 */
export function ServiceDetail({ service, index }: { service: Service; index: number }) {
  // Чётные направления идут фото справа, нечётные — слева. Иначе семь
  // одинаковых блоков подряд читаются как одна длинная простыня
  const mirrored = index % 2 === 1

  return (
    <Section id={service.slug} labelledBy={`${service.slug}-title`}>
      <div className="flex flex-col gap-8">
        <div
          className={cn(
            'flex flex-col gap-7 lg:flex-row lg:items-start lg:gap-12',
            mirrored && 'lg:flex-row-reverse',
          )}
        >
          <Reveal className="flex min-w-0 flex-col gap-5 lg:flex-1">
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-primary">
                Направление {index + 1} из {services.length}
              </p>
              <h2
                id={`${service.slug}-title`}
                className="display-caps text-balance text-[26px] leading-[1.1] sm:text-[30px] md:text-[34px] lg:text-[40px]"
              >
                {service.title}
              </h2>
              <p className="flex items-baseline gap-1.5">
                <span className="text-[14px] text-muted-foreground">от</span>
                {/* Число без знака рубля: он уже есть в подписи единицы
                    справа (`₽/м²`) — см. тот же приём в карточках Services */}
                <span className="display-caps tnum text-[28px] leading-none text-highlight sm:text-[32px]">
                  {formatNumber(service.priceFrom)}
                </span>
                <span className="text-[14px] text-muted-foreground">{service.priceUnit}</span>
              </p>
            </div>

            <p className="max-w-[64ch] text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              {service.offer}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <PhoneButton place={`service-${service.slug}`} variant="primary">
                {servicesDetail.cta}
              </PhoneButton>
              {/* Сообщение в Телеграм уходит с названием направления, а не
                  общим текстом: подрядчик видит задачу до начала переписки */}
              <TelegramButton
                place={`service-${service.slug}`}
                variant="outline"
                message={`${telegramMessage} по направлению «${service.navTitle}»`}
              >
                {servicesDetail.ctaTelegram}
              </TelegramButton>
            </div>
          </Reveal>

          <Reveal step={1} className="flex flex-col gap-5 lg:flex-1">
            <PhotoSlideshow photos={service.images} />
          </Reveal>
        </div>

        <ServiceTabs service={service} />
      </div>
    </Section>
  )
}

/**
 * Три информативных блока направления — состав, этапы и прайс — живут
 * в одной карточке как вкладки. Раньше это были три независимых
 * контейнера со своими бордерами и своими механизмами раскрытия, и на
 * все направления давало по две лишние рамки и две разные механики
 * («переключить вкладку» против «развернуть прайс»).
 *
 * Именно вкладки, а не аккордеон из трёх пунктов: у вкладок ровно одна
 * панель открыта всегда, поэтому высота секции предсказуема и все
 * направления скроллятся ровно. Аккордеон допускает состояние «всё
 * закрыто» — карточка вырождается в пустую полоску, а высота секции
 * прыгает на каждом клике.
 *
 * Порядок вкладок — от общего к частному: сначала «что входит», потом
 * «как проходит», и только потом цифры. Прайс первым заставлял бы
 * считать деньги за работу, состава которой человек ещё не видел.
 */
function ServiceTabs({ service }: { service: Service }) {
  const [active, setActive] = useState<'bullets' | 'steps' | 'price'>('bullets')
  const tabsId = useId()

  const rowsCount = service.priceGroups.reduce((sum, group) => sum + group.rows.length, 0)

  const tabs = [
    {
      key: 'bullets' as const,
      label: servicesDetail.bulletsTitle,
      short: servicesDetail.bulletsTitleShort,
    },
    {
      key: 'steps' as const,
      label: servicesDetail.stepsTitle,
      short: servicesDetail.stepsTitleShort,
    },
    {
      key: 'price' as const,
      label: servicesDetail.priceTitle,
      short: servicesDetail.priceTitleShort,
      // Счётчик позиций — единственное, что мотивирует открыть прайс:
      // без него третья вкладка выглядит пустым ярлыком
      badge: rowsCount,
    },
  ]

  function selectTab(key: (typeof tabs)[number]['key']) {
    setActive(key)
    // Цель на прайсе осталась от свёрнутой карточки: по ней видно, какие
    // направления реально проверяют по деньгам
    if (key === 'price') reachGoal('open_price', { service: service.slug })
  }

  // Стрелки переключают вкладку и сразу переносят фокус на неё. Активная
  // вкладка — единственная с tabIndex=0, иначе Tab с клавиатуры молча
  // проходил бы через скрытые вкладки
  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const currentIndex = tabs.findIndex((tab) => tab.key === active)
    const nextIndex =
      event.key === 'ArrowRight'
        ? (currentIndex + 1) % tabs.length
        : (currentIndex - 1 + tabs.length) % tabs.length
    const nextKey = tabs[nextIndex].key
    selectTab(nextKey)
    document.getElementById(`${tabsId}-${nextKey}-tab`)?.focus()
  }

  return (
    <Reveal className="overflow-hidden rounded-2xl border border-border bg-card card-shadow">
      <div
        role="tablist"
        aria-label={`${service.navTitle}: состав работ, этапы и прайс-лист`}
        className="flex border-b border-border"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            id={`${tabsId}-${tab.key}-tab`}
            aria-selected={active === tab.key}
            aria-controls={`${tabsId}-${tab.key}-panel`}
            tabIndex={active === tab.key ? 0 : -1}
            onKeyDown={handleKeyDown}
            onClick={() => selectTab(tab.key)}
            className={cn(
              // Активная вкладка подчёркнута снизу изнутри: рамка карточки
              // одна, поэтому «выступающий» таб пришлось бы рисовать
              // отрицательными отступами по чужому бордеру
              'relative flex min-h-[56px] flex-1 items-center justify-center gap-1.5 px-2 py-4 text-center text-[14px] font-semibold tracking-[0.01em] transition-colors sm:px-4 sm:text-[15px]',
              active === tab.key
                ? 'bg-card text-foreground after:absolute after:inset-x-0 after:bottom-[-1px] after:h-[2px] after:bg-primary'
                : 'bg-secondary/60 text-muted-foreground hover:text-foreground',
            )}
          >
            <span className="sm:hidden">{tab.short}</span>
            <span className="hidden sm:inline">{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'tnum rounded-md px-1.5 py-0.5 text-[11px] font-semibold leading-none transition-colors sm:text-[12px]',
                  active === tab.key
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-border/70 text-muted-foreground',
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Все три панели остаются в разметке под hidden, а не рендерятся
          условно: Ctrl+F и поисковый робот видят и состав, и этапы, и все
          двести позиций прайса, а не только открытую вкладку */}
      <div
        role="tabpanel"
        id={`${tabsId}-bullets-panel`}
        aria-labelledby={`${tabsId}-bullets-tab`}
        hidden={active !== 'bullets'}
        className="px-5 py-5 md:px-6"
      >
        <ul className="flex flex-col gap-2">
          {service.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
              <Check
                className="mt-1 size-4 shrink-0 text-primary"
                strokeWidth={2.25}
                aria-hidden="true"
              />
              <span className="text-foreground/85">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Этапы работ — нумерованный список, и номера здесь несут смысл: это
          реальная последовательность, где шаг нельзя переставить */}
      <div
        role="tabpanel"
        id={`${tabsId}-steps-panel`}
        aria-labelledby={`${tabsId}-steps-tab`}
        hidden={active !== 'steps'}
        className="px-5 py-5 md:px-6"
      >
        <ol className="flex flex-col gap-3">
          {service.steps.map((step, stepIndex) => (
            <li key={step.title} className="flex gap-3">
              <span
                aria-hidden="true"
                className="display-caps tnum flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent text-[14px] leading-none text-accent-foreground"
              >
                {stepIndex + 1}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-semibold leading-snug text-foreground">
                  {step.title}
                </span>
                <span className="text-[14px] leading-relaxed text-muted-foreground">
                  {step.text}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div
        role="tabpanel"
        id={`${tabsId}-price-panel`}
        aria-labelledby={`${tabsId}-price-tab`}
        hidden={active !== 'price'}
      >
        <PriceTable service={service} />
      </div>
    </Reveal>
  )
}

/**
 * Прайс-лист направления внутри вкладки.
 *
 * Высота ограничена, прокрутка внутренняя: в прайсе бывает до сорока
 * позиций, и без потолка третья вкладка раздувала бы карточку в разы
 * против первых двух — полоса вкладок уезжала бы за верх экрана, и
 * вернуться к «Что входит» было бы нечем. С потолком все семь
 * направлений держат одинаковую предсказуемую высоту.
 *
 * Примечание про единицу измерения намеренно вынесено из прокрутки: оно
 * относится ко всем строкам сразу, поэтому обязано быть видимым до того,
 * как человек начнёт читать цифры, а не после сорока строк.
 */
function PriceTable({ service }: { service: Service }) {
  const rowsCount = service.priceGroups.reduce((sum, group) => sum + group.rows.length, 0)

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-5 pb-4 pt-5 md:px-6">
        <p className="max-w-[62ch] text-[13px] leading-relaxed text-muted-foreground sm:text-[14px]">
          {servicesDetail.priceNote(
            servicesDetail.priceUnitWords[service.priceUnit] ?? 'за работу',
          )}
        </p>
        <p className="shrink-0 text-[13px] text-muted-foreground sm:text-[14px]">
          {servicesDetail.rowsCount(rowsCount)}
        </p>
      </div>

      <div className="max-h-[420px] overflow-y-auto border-t border-border px-5 py-5 md:px-6">
        <div className="flex flex-col gap-6">
          {service.priceGroups.map((group) => (
            <div key={group.title} className="flex flex-col gap-2">
              <h4 className="text-[14px] font-semibold uppercase tracking-[0.06em] text-primary">
                {group.title}
              </h4>
              <ul className="flex flex-col">
                {group.rows.map((row) => (
                  <li
                    key={row.name}
                    // Точечный лидер между названием и ценой не нужен:
                    // justify-between с границей снизу читается так же, а
                    // на узком экране название переносится на две строки —
                    // и цена всё равно остаётся привязанной к своей строке
                    className="flex items-baseline justify-between gap-3 border-b border-border/60 py-2 last:border-b-0"
                  >
                    <span className="min-w-0 text-[14px] leading-snug text-foreground/85 sm:text-[15px]">
                      {row.name}
                    </span>
                    <span className="shrink-0 whitespace-nowrap text-[14px] sm:text-[15px]">
                      {row.from === null ? (
                        <span className="text-muted-foreground">
                          {row.note ?? servicesDetail.negotiable}
                        </span>
                      ) : (
                        <>
                          <span className="text-muted-foreground">от </span>
                          <span className="tnum font-semibold text-highlight">
                            {formatPrice(row.from)}
                          </span>
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
