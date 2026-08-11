'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { hero, site } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { PhoneButton, TelegramButton } from '@/components/ui/cta'
import { cn } from '@/lib/utils'

/** Как долго держится каждый кадр слайд-шоу, в миллисекундах */
const SLIDE_DURATION_MS = 5000

/**
 * Первый экран.
 *
 * Фотография настоящего объекта, а не абстрактная графика: в строительстве
 * единственное, что человек проверяет глазами до звонка, — как выглядит
 * результат. На десктопе снимок занимает половину кадра, на смартфоне
 * уходит под текст: заголовок и кнопки обязаны попадать в первый экран
 * без скролла, а фотография — нет.
 *
 * Заголовок разбит на две строки вручную (h1Line1/h1Line2): перенос должен
 * приходиться ровно на границу «что делаем / где», иначе на узком экране
 * он распадается на случайные обрывки.
 */
export function Hero() {
  return (
    // Section даёт снизу тот же большой отступ, что и сверху, — он рассчитан
    // на переход между двумя обычными секциями. Следом идёт тонкая бегущая
    // строка, а не секция, поэтому запас снизу здесь избыточен: он отрывал
    // бы ленту от первого экрана. Переопределяем pb отдельно от pt
    <Section id="hero" labelledBy="hero-title" className="pt-4 pb-3 md:pt-6 md:pb-4 lg:pt-8 lg:pb-5">
      <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:gap-12">
        <div className="flex min-w-0 flex-col gap-5 lg:flex-1 short-landscape:gap-3">
          <Reveal className="flex flex-col gap-4 short-landscape:gap-2">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-primary sm:text-[13px]">
              <MapPin className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
              {site.areaServed}
            </p>

            {/* Кегль ступенчатый, а не 30→54 одним прыжком: прыжок приходился
                бы ровно на планшет в портрете, где в узкой колонке заголовок
                ломается на четыре строки. В горизонтальной ориентации
                смартфона высота вьюпорта 320–430px — там кегль отдельно
                урезан, иначе H1 съедает весь экран */}
            <h1
              id="hero-title"
              className="display-caps text-balance text-[30px] leading-[1.05] sm:text-[38px] md:text-[44px] lg:text-[54px] short-landscape:text-[26px]"
            >
              {hero.h1Line1}
              <br />
              <span className="text-primary">{hero.h1Line2}</span>
            </h1>

            {/* Перечисление направлений отдельной строкой, а не внутри
                подзаголовка: это список для сканирования взглядом — человек
                ищет в нём свою задачу, а не читает предложение целиком */}
            <p className="text-pretty text-[15px] leading-relaxed text-foreground/80 sm:text-[16px] short-landscape:hidden">
              {hero.scope}
            </p>

            <p className="max-w-[56ch] text-pretty text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
              {hero.subtitle} <span className="hidden sm:inline">{hero.subtitleTail}</span>
            </p>
          </Reveal>

          {/* Обратный звонок здесь не дублируется: тот же сценарий уже
              доступен в липкой шапке (top-bar), а факты про гарантию,
              бесплатный замер и стаж — в trust-bar сразу под первым
              экраном. Первый экран оставлен только с прямыми действиями:
              позвонить или написать */}
          <Reveal step={1} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <PhoneButton place="hero" variant="primary">
              {hero.primaryCta}
            </PhoneButton>
            <TelegramButton place="hero" variant="outline">
              {hero.secondaryCta}
            </TelegramButton>
          </Reveal>
        </div>

        <Reveal step={1} className="lg:flex-1 short-landscape:hidden">
          <HeroSlideshow />
        </Reveal>
      </div>
    </Section>
  )
}

/**
 * Слайд-шоу первого экрана.
 *
 * Автопрокрутка, а не одна статичная фотография: пять кадров за 5 секунд
 * каждый показывают разнообразие объектов (дом, фундамент, каркас, крыша,
 * фасад) без дополнительного клика — на первом экране лишний контрол
 * только отвлекал бы от кнопок «Замер» / «Telegram».
 *
 * Кадры лежат друг на друге и переключаются прозрачностью, а не сменой
 * `src` в одном `<img>`: так следующая фотография успевает декодироваться
 * заранее, и переход не мигает белым/чёрным кадром между сменами.
 */
function HeroSlideshow() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // ?nofx — полностраничный снимок одним кадром (см. Reveal): таймер
    // автопрокрутки в этом режиме менял бы кадр посреди скриншота
    const noFx = new URLSearchParams(window.location.search).has('nofx')
    if (reduced || noFx) return

    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % hero.slides.length)
    }, SLIDE_DURATION_MS)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <figure className="relative overflow-hidden rounded-2xl border border-border card-shadow">
      {/* 4/3 на смартфоне и 5/4 от sm: вертикального места на узком экране
          меньше всего, и панорамный кадр отодвигал бы кнопки за пределы
          первого экрана */}
      <div className="relative aspect-[4/3] w-full sm:aspect-[5/4]">
        {hero.slides.map((slide, index) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.alt}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className={cn(
              'object-cover transition-opacity duration-700 ease-out',
              index === active ? 'opacity-100' : 'opacity-0',
            )}
            // Первый кадр приоритетный (виден сразу, без ожидания сети),
            // остальные четыре — обычная ленивая загрузка: они почти
            // наверняка успеют декодироваться за первые 5 секунд, пока
            // виден первый слайд, но не задерживают LCP
            priority={index === 0}
          />
        ))}

        {/* Плашка светлая, а не затемняющая: снимок и так темнее интерфейса
            на чёрном фоне, и градиент поверх него только уводил бы кадр
            в грязь. Верхний левый угол вместо нижнего — там подпись не
            перекрывает линию горизонта, которая на большинстве объектов
            проходит по нижней трети кадра */}
        <div className="absolute left-3 top-3 right-3 sm:right-auto">
          <p
            key={hero.slides[active].caption}
            className="glass-dark inline-block rounded-xl px-3 py-2 text-[13px] font-medium leading-snug sm:text-[14px] animate-fade-in"
          >
            {hero.slides[active].caption}
          </p>
        </div>

        {/* Индикаторы кадров — не кнопки: слайд-шоу здесь декоративное
            доказательство разнообразия объектов, а не галерея, которую
            листают вручную. Точки только показывают, что кадр не застыл */}
        <div
          className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5"
          role="presentation"
          aria-hidden="true"
        >
          {hero.slides.map((slide, index) => (
            <span
              key={slide.image}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                index === active ? 'w-5 bg-primary' : 'w-1.5 bg-foreground/40',
              )}
            />
          ))}
        </div>
      </div>
    </figure>
  )
}
