'use client'

import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Work } from '@/lib/content'
import { DeviceFrame, type DeviceKind } from '@/components/ui/device-frames'
import {
  SiteMockup,
  PhoneMockup,
  PhoneLandscapeMockup,
  TabletMockup,
  BlurRegions,
} from '@/components/ui/site-mockup'

/**
 * Все работы — одно слайдшоу.
 *
 * Раньше каждый проект занимал свою полосу и крутил собственную анимацию:
 * шесть блоков одновременно гоняли прокрутку, а листать было нечего —
 * проекты просто лежали друг под другом. Теперь сцена одна, и она
 * рассказывает историю по порядку: страница проекта прокручивается на
 * ноутбуке, потом тот же сайт — на планшете, потом на телефоне, и только
 * после всех пяти устройств сцена берёт следующий проект.
 *
 * Главное здесь — кто задаёт ритм. Не setInterval: время отсчитывает CSS,
 * а JS только слушает animationend полоски под сценой. Длительность у
 * полоски и у прокрутки одна и та же переменная --pass, поэтому кнопка
 * никогда не перещёлкивается посередине экрана — сначала посетитель
 * видит страницу до низа, и только потом её показывают на другой технике.
 */

type Slide = {
  kind: DeviceKind
  label: string
  short: string
  /**
   * Высота полотна внутри кадра. h-auto — по содержимому: столько, сколько
   * занимает страница, и прокрутка проезжает ровно её излишек над кадром.
   * h-full — страница ровно в экран, прокручивать нечего
   */
  height: string
  /** Длительность прохода: у прокрутки — путь до низа, у статики — показ */
  pass: string
  passMs: number
}

/**
 * Прокручиваются только те кадры, где странице действительно не хватает
 * экрана: ноутбук и планшет на боку показывают полную десктопную вёрстку.
 * Портретный планшет и оба положения телефона получают адаптивную вёрстку,
 * которая умещается в экран целиком — это замерено, у них 0.68–0.93 высоты
 * кадра. Растягивать их до «чтобы тоже ехало» нельзя: тянутся не тексты, а
 * пустые промежутки между блоками, и посередине кадра появляется дыра.
 * Поэтому такой кадр просто держат на экране — ровно как на настоящем
 * телефоне, где адаптив укладывает страницу без прокрутки.
 */
const slides: Slide[] = [
  { kind: 'laptop', label: 'Ноутбук', short: 'Ноутбук', height: 'h-auto', pass: '7s', passMs: 7000 },
  {
    kind: 'tablet-landscape',
    label: 'Планшет горизонтально',
    short: 'Планшет ↔',
    height: 'h-auto',
    pass: '7s',
    passMs: 7000,
  },
  {
    kind: 'tablet-portrait',
    label: 'Планшет вертикально',
    short: 'Планшет ↕',
    height: 'h-full',
    pass: '4.5s',
    passMs: 4500,
  },
  {
    kind: 'phone-portrait',
    label: 'Смартфон вертикально',
    short: 'Смартфон ↕',
    height: 'h-full',
    pass: '4.5s',
    passMs: 4500,
  },
  {
    kind: 'phone-landscape',
    label: 'Смартфон горизонтально',
    short: 'Смартфон ↔',
    height: 'h-full',
    pass: '4.5s',
    passMs: 4500,
  },
]

export function WorksSlideshow({ works }: { works: readonly Work[] }) {
  const [workIndex, setWorkIndex] = useState(0)
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [noFx, setNoFx] = useState(false)
  const [reduced, setReduced] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  // Какой проход уже зачтён: страховочный таймер и animationend могут
  // сработать оба, а шаг должен случиться один
  const steppedRef = useRef('')

  const work = works[workIndex]
  const slide = slides[active]
  const passKey = `${work.id}:${slide.kind}`

  useEffect(() => {
    // ?nofx — кадры для объявления снимаются статично
    setNoFx(new URLSearchParams(window.location.search).has('nofx'))
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  // Слайдшоу живёт только в кадре: за пределами экрана нет смысла
  // прокручивать макеты и греть процессор
  useEffect(() => {
    const node = stageRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setInView(entry.intersectionRatio > 0.3)
      },
      { threshold: [0, 0.3, 0.6] },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const running = inView && !noFx && !reduced

  const step = useCallback(() => {
    if (steppedRef.current === passKey) return
    steppedRef.current = passKey
    if (active < slides.length - 1) {
      setActive(active + 1)
      return
    }
    // Показали проект на всех пяти экранах — берём следующий
    setActive(0)
    setWorkIndex((current) => (current + 1) % works.length)
  }, [active, passKey, works.length])

  // Страховка на случай, если animationend не придёт: например вкладка
  // была в фоне и браузер придержал анимацию. Шаг всё равно один — его
  // сторожит steppedRef
  useEffect(() => {
    if (!running || hovered) return
    const timer = window.setTimeout(step, slide.passMs + 1200)
    return () => window.clearTimeout(timer)
  }, [running, hovered, slide.passMs, step])

  const passStyle = {
    '--pass': slide.pass,
    animationPlayState: hovered ? 'paused' : 'running',
  } as CSSProperties

  // Эти два кадра показывают десктопную вёрстку: она длиннее экрана, её и
  // прокручивают. Ей же нужен слой размытия названий заказчика
  const scrolls = slide.kind === 'laptop' || slide.kind === 'tablet-landscape'

  return (
    <div className="flex flex-col gap-8 md:gap-10">
      {/* Выбор проекта: он же оглавление слайдшоу */}
      <div role="group" aria-label="Проекты" className="flex flex-wrap gap-2">
        {works.map((item, itemIndex) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={itemIndex === workIndex}
            onClick={() => {
              setWorkIndex(itemIndex)
              setActive(0)
            }}
            className={cn(
              // min-h-11 (44px): выбор проекта — основной орган управления
              // слайдшоу, а по вертикали он давал 38px, меньше пальца.
              // Порог lg, а не sm: планшет в обеих ориентациях — тоже тач,
              // и 38px там так же неудобны, как на смартфоне
              'inline-flex min-h-11 items-center rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors lg:min-h-0',
              itemIndex === workIndex
                ? 'border-foreground bg-foreground text-background'
                : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
            )}
          >
            {item.niche}
          </button>
        ))}
      </div>

      {/* 6-колоночная сетка: 3/6 сцена + 1/6 воздух + 2/6 описание.
          Сцена шире описания — она несёт основной вес блока, текст рядом
          с ней остаётся компактной подписью, а не второй половиной макета */}
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[3fr_1fr_2fr] lg:gap-0">
        <div className="flex flex-col gap-4">
          <div
            ref={stageRef}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            // Пропорции сцены одни для всех устройств: иначе при смене
            // кадра блок дёргал бы высоту и уводил страницу из-под пальца
            // В горизонтальной ориентации смартфона по ширине действует sm,
            // и сцена брала пропорцию 4/3 — при 667px это 500px высоты,
            // больше всего вьюпорта. 16/9 оставляет место переключателям
            // устройств под сценой
            className="relative aspect-square w-full sm:aspect-[4/3] [container-type:size] short-landscape:aspect-[16/9]"
          >
            <DeviceFrame kind={slide.kind}>
              {/* key — это перезапуск: у нового прохода новый элемент, а
                  значит анимация начинается с начала, без сброса вручную */}
              <div
                key={passKey}
                style={passStyle}
                className={cn(
                  'absolute inset-x-0 top-0',
                  slide.height,
                  running && scrolls && 'autoscroll-once',
                )}
              >
                {slide.kind === 'laptop' || slide.kind === 'tablet-landscape' ? (
                  <SiteMockup work={work} priority={workIndex === 0} />
                ) : slide.kind === 'tablet-portrait' ? (
                  <TabletMockup work={work} />
                ) : slide.kind === 'phone-portrait' ? (
                  <PhoneMockup work={work} />
                ) : (
                  <PhoneLandscapeMockup work={work} />
                )}
              </div>
              {scrolls ? <BlurRegions work={work} /> : null}
            </DeviceFrame>
          </div>

          {/* Полоска хода прохода — и она же его хронометр.
              Шаг делает animationend именно этой полоски, а не прокрутки:
              полоска есть у любого кадра, а прокрутка — только у двух.
              Один источник времени вместо двух, и разойтись им негде */}
          <div aria-hidden="true" className="h-0.5 w-full overflow-hidden rounded-full bg-border">
            <div
              key={passKey}
              onAnimationEnd={step}
              style={passStyle}
              className={cn(
                'h-full w-full origin-left scale-x-0 bg-primary',
                running && 'pass-progress',
              )}
            />
          </div>

          {/* Переключатель устройств: он же индикатор слайдшоу */}
          <div role="group" aria-label={`Устройства: ${work.niche}`} className="flex flex-wrap gap-2">
            {slides.map((item, itemIndex) => (
              <button
                key={item.kind}
                type="button"
                aria-pressed={itemIndex === active}
                onClick={() => setActive(itemIndex)}
                className={cn(
                  'inline-flex min-h-11 items-center rounded-full border px-3 py-1.5 text-[13px] font-medium transition-colors lg:min-h-0',
                  itemIndex === active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                {/* Пять кнопок в ряд: полные подписи («Планшет горизонтально»)
                    появляются только с lg, где на них есть ширина. До этого
                    короткие «Планшет ↔» — на планшете в портрете полные
                    названия занимали три строки кнопок вместо одной */}
                <span className="hidden lg:inline">{item.label}</span>
                <span className="lg:hidden">{item.short}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Пустая колонка-отступ: только на десктопе, только для ширины сетки */}
        <div aria-hidden="true" className="hidden lg:block" />

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {work.city} · {workIndex + 1} из {works.length}
            </span>
            <h3 className="text-pretty text-[22px] font-bold leading-[1.15] tracking-[-0.02em] sm:text-[26px] lg:text-[30px] xl:text-[34px]">
              {work.niche}
            </h3>
          </div>

          <div className="flex max-w-[46ch] flex-col gap-3">
            <p className="text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              <span className="mr-1.5 font-semibold text-foreground">Задача.</span>
              {work.task}
            </p>
            <p className="text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              <span className="mr-1.5 font-semibold text-foreground">Решение.</span>
              {work.solution}
            </p>
          </div>

          <ul className="flex flex-col gap-2">
            {work.mock.services.map((service) => (
              <li key={service} className="flex items-center gap-2.5 text-[15px]">
                <Check className="size-4 shrink-0 text-primary" strokeWidth={2} aria-hidden="true" />
                {service}
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-border pt-4">
            <span className="text-[15px] text-muted-foreground">{work.mock.priceLabel}</span>
            <span className="tnum text-xl font-bold tracking-[-0.02em]">{work.mock.price}</span>
            <span className="w-full text-[15px] text-muted-foreground">{work.mock.guarantee}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
