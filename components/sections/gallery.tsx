'use client'

import { useState } from 'react'
import Image from 'next/image'
import { gallery, services } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

const ALL = 'all'

/**
 * Портфолио с фильтром по направлению.
 *
 * Фильтр собирается из тех направлений, у которых реально есть фотографии,
 * а не из всех семи: кнопка, показывающая пустую сетку, хуже отсутствия
 * кнопки — она выглядит как сломанный сайт, а не как «работ пока нет».
 *
 * Фильтрация идёт через CSS-класс hidden, а не через выкидывание элементов
 * из массива: все снимки остаются в разметке и загружаются один раз, поэтому
 * переключение фильтра не вызывает повторной загрузки картинок.
 */
export function Gallery() {
  const [active, setActive] = useState<string>(ALL)

  const available = services.filter((service) =>
    gallery.items.some((item) => item.service === service.slug),
  )

  const shown =
    active === ALL ? gallery.items.length : gallery.items.filter((i) => i.service === active).length

  return (
    <Section id="portfolio" labelledBy="portfolio-title">
      <div className="flex flex-col gap-8">
        <SectionHeading id="portfolio-title" title={gallery.title} subtitle={gallery.subtitle} />

        {/* role=group, а не tablist: настоящие табы обязаны реагировать на
            стрелки клавиатуры и переключать панели, а здесь одна панель,
            содержимое которой фильтруется. Врать про роль хуже, чем не
            заявлять её вовсе */}
        <Reveal>
          {/* Отрицательный margin с равным padding: на смартфоне лента
              фильтров прокручивается горизонтально и обязана «вытекать»
              за боковые отступы секции, иначе последняя кнопка выглядит
              обрезанной ровно по краю контента и не читается как скролл */}
          <div
            role="group"
            aria-label="Фильтр работ по направлению"
            className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0"
          >
            <FilterButton active={active === ALL} onClick={() => setActive(ALL)}>
              {gallery.allLabel}
            </FilterButton>
            {available.map((service) => (
              <FilterButton
                key={service.slug}
                active={active === service.slug}
                onClick={() => setActive(service.slug)}
              >
                {service.navTitle}
              </FilterButton>
            ))}
          </div>
        </Reveal>

        {/* Счётчик озвучивает результат фильтрации для скринридера: без него
            нажатие кнопки визуально меняет сетку, но вслух не сообщает ничего */}
        <p aria-live="polite" className="sr-only">
          Показано работ: {shown}
        </p>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {gallery.items.map((item, index) => (
            <li
              key={item.src}
              className={cn(
                'overflow-hidden rounded-2xl border border-border bg-card',
                active !== ALL && item.service !== active && 'hidden',
              )}
            >
              <figure className="flex h-full flex-col">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 33vw, 50vw"
                    className="object-cover"
                    // Первые четыре — в первом экране секции на любой сетке,
                    // остальные грузятся лениво
                    loading={index < 4 ? 'eager' : 'lazy'}
                  />
                </div>
                <figcaption className="px-3 py-2.5 text-[13px] leading-snug text-muted-foreground sm:text-[14px]">
                  {item.caption}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'min-h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-[14px] font-medium transition-colors',
        active
          ? 'border-transparent bg-primary text-primary-foreground'
          : 'border-border bg-card text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
