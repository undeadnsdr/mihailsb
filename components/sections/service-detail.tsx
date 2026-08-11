'use client'

import { useId, useState } from 'react'
import Image from 'next/image'
import { Check, ChevronDown } from 'lucide-react'
import { type Service, services, servicesDetail, formatPrice, telegramMessage } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { PhoneButton, TelegramButton } from '@/components/ui/cta'
import { reachGoal } from '@/lib/analytics'
import { cn } from '@/lib/utils'

/**
 * Все семь направлений подряд. Список идёт из content.ts, а не перечисляется
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
                Направление {index + 1} из 7
              </p>
              <h2
                id={`${service.slug}-title`}
                className="display-caps text-balance text-[26px] leading-[1.1] sm:text-[30px] md:text-[34px] lg:text-[40px]"
              >
                {service.title}
              </h2>
              <p className="flex items-baseline gap-1.5">
                <span className="text-[14px] text-muted-foreground">от</span>
                <span className="display-caps tnum text-[28px] leading-none text-highlight sm:text-[32px]">
                  {formatPrice(service.priceFrom)}
                </span>
                <span className="text-[14px] text-muted-foreground">{service.priceUnit}</span>
              </p>
            </div>

            <p className="max-w-[64ch] text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              {service.offer}
            </p>

            <div className="flex flex-col gap-3">
              <h3 className="text-[15px] font-semibold tracking-[0.01em] text-foreground">
                {servicesDetail.bulletsTitle}
              </h3>
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
            <figure className="overflow-hidden rounded-2xl border border-border card-shadow">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 640px, 100vw"
                  className="object-cover"
                />
              </div>
            </figure>

            {/* Этапы работ — нумерованный список, и номера здесь несут смысл:
                это реальная последовательность, где шаг нельзя переставить */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[15px] font-semibold tracking-[0.01em] text-foreground">
                {servicesDetail.stepsTitle}
              </h3>
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
          </Reveal>
        </div>

        <PriceList service={service} />
      </div>
    </Section>
  )
}

/** Свёрнутый прайс-лист направления */
function PriceList({ service }: { service: Service }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  const rowsCount = service.priceGroups.reduce((sum, group) => sum + group.rows.length, 0)

  return (
    <Reveal className="overflow-hidden rounded-2xl border border-border bg-card card-shadow">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => {
            setOpen((value) => !value)
            if (!open) reachGoal('open_price', { service: service.slug })
          }}
          className="flex min-h-[60px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary md:px-6"
        >
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="display-caps text-[17px] leading-tight tracking-[0.01em] text-foreground sm:text-[19px]">
              {servicesDetail.priceTitle}: {service.navTitle}
            </span>
            <span className="text-[13px] text-muted-foreground sm:text-[14px]">
              {servicesDetail.rowsCount(rowsCount)}
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2 text-[14px] font-medium text-primary">
            {/* Подпись кнопки скрыта на смартфоне: там рядом с ней уже стоят
                название прайса и счётчик позиций, и третья строка в одну
                кнопку не влезает без переноса */}
            <span className="hidden sm:inline">
              {open ? servicesDetail.closePrice : servicesDetail.openPrice}
            </span>
            <ChevronDown
              className={cn('size-5 shrink-0 transition-transform duration-200', open && 'rotate-180')}
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
        </button>
      </h3>

      {/* hidden, а не условный рендер: позиции остаются в разметке, поэтому
          Ctrl+F и поисковый робот видят весь прайс, а не только раскрытый */}
      <div id={panelId} hidden={!open} className="border-t border-border px-5 py-5 md:px-6">
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

          <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-[14px]">
            {servicesDetail.priceNote}
          </p>
        </div>
      </div>
    </Reveal>
  )
}
