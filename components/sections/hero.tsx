'use client'

import Image from 'next/image'
import { Check, MapPin, Phone } from 'lucide-react'
import { hero, site } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { PhoneButton, TelegramButton } from '@/components/ui/cta'
import { CallbackModal } from '@/components/ui/callback-modal'
import { reachGoal } from '@/lib/analytics'

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

          <Reveal step={1} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <PhoneButton place="hero" variant="primary">
              {hero.primaryCta}
            </PhoneButton>
            <TelegramButton place="hero" variant="outline">
              {hero.secondaryCta}
            </TelegramButton>
            {/* Третий вариант связи — для тех, кому проще ответить на
                входящий, чем звонить или писать самому. Он текстовый, а не
                кнопка: два CTA одинакового веса рядом не говорят, с какого
                начать, а третий сплошной превратил бы блок в кашу */}
            <CallbackModal
              place="hero"
              trigger={
                <button
                  type="button"
                  data-goal="click_callback"
                  data-place="hero"
                  onClick={() => reachGoal('click_callback', { place: 'hero' })}
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 px-2 text-[16px] font-medium leading-none text-muted-foreground underline decoration-border underline-offset-4 transition-colors hover:text-foreground max-sm:w-full"
                >
                  <Phone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
                  Перезвоните мне
                </button>
              }
            />
          </Reveal>

          <Reveal step={2}>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {hero.facts.map((fact) => (
                <li
                  key={fact}
                  className="flex items-center gap-1.5 text-[14px] font-medium text-muted-foreground sm:text-[15px]"
                >
                  <Check className="size-4 shrink-0 text-primary" strokeWidth={2.25} aria-hidden="true" />
                  {fact}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal step={1} className="lg:flex-1 short-landscape:hidden">
          <figure className="relative overflow-hidden rounded-2xl border border-border card-shadow">
            {/* 4/3 на смартфоне и 5/4 от sm: вертикального места на узком
                экране меньше всего, и панорамный кадр отодвигал бы кнопки
                за пределы первого экрана */}
            <div className="relative aspect-[4/3] w-full sm:aspect-[5/4]">
              <Image
                src={hero.image}
                alt={hero.imageAlt}
                fill
                sizes="(min-width: 1024px) 640px, 100vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Плашка светлая, а не затемняющая: снимок и так темнее
                интерфейса на чёрном фоне, и градиент поверх него только
                уводил бы кадр в грязь */}
            <figcaption className="glass-dark absolute bottom-3 left-3 right-3 rounded-xl px-3 py-2 text-[13px] font-medium leading-snug sm:text-[14px]">
              {hero.imageCaption}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  )
}
