'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { gallery, services, type GalleryItem } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { ImagePlaceholder } from '@/components/ui/image-placeholder'
import { cn } from '@/lib/utils'

const ALL = 'all'
/** Сколько снимков показываем сразу статичным рядом, без прокрутки */
const FEATURED_COUNT = 3

/**
 * Портфолио с фильтром по направлению.
 *
 * Фильтр собирается из тех направлений, у которых реально есть фотографии,
 * а не из всех семи: кнопка, показывающая пустую сетку, хуже отсутствия
 * кнопки — она выглядит как сломанный сайт, а не как «работ пока нет».
 *
 * Фильтрация идёт через отдельный подсчёт, а не через выкидывание элементов
 * из массива: первые четыре снимка выбранного направления всегда видны
 * рядом, остальные уходят в слайд-шоу ниже — так раздел не разрастается
 * в бесконечную сетку, когда по направлению набралось много фотографий.
 */
export function Gallery() {
  const [active, setActive] = useState<string>(ALL)

  const available = services.filter((service) =>
    gallery.items.some((item) => item.service === service.slug),
  )

  const filtered =
    active === ALL ? gallery.items : gallery.items.filter((item) => item.service === active)
  const featured = filtered.slice(0, FEATURED_COUNT)
  const rest = filtered.slice(FEATURED_COUNT)

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
          Показано работ: {filtered.length}
        </p>

        {featured.length > 0 ? (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
            {featured.map((item, index) => (
              <GalleryCard key={item.src} item={item} eager={index < 3} />
            ))}
          </ul>
        ) : (
          <p className="text-[15px] text-muted-foreground">
            По этому направлению пока нет фотографий — задача уже в работе.
          </p>
        )}

        {rest.length > 0 && <GalleryCarousel key={active} items={rest} />}
      </div>
    </Section>
  )
}

function GalleryCard({ item, eager }: { item: GalleryItem; eager?: boolean }) {
  return (
    <li className="overflow-hidden rounded-2xl border border-border bg-card">
      <figure className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full">
          <ImagePlaceholder alt={item.alt} />
        </div>
        <figcaption className="px-3 py-2.5 text-[13px] leading-snug text-muted-foreground sm:text-[14px]">
          {item.caption}
        </figcaption>
      </figure>
    </li>
  )
}

/**
 * Остальные снимки направления — горизонтальная лента с кнопками вперёд/
 * назад вместо бесконечной сетки. Лента листается на ширину видимой
 * области (2 карточки на смартфоне, 3–4 на большом экране), а не на одну
 * карточку: иначе для тридцати снимков понадобилось бы тридцать нажатий.
 *
 * Кнопки блокируются на краях по факту прокрутки (onScroll), а не по
 * заранее посчитанному числу страниц: ширина карточки завязана на
 * брейкпоинт, и пересчитывать её в JS избыточно, когда это умеет сам скролл.
 */
function GalleryCarousel({ items }: { items: GalleryItem[] }) {
  const trackRef = useRef<HTMLUListElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const updateArrows = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    trackRef.current?.scrollTo({ left: 0 })
    updateArrows()
  }, [items, updateArrows])

  function scrollByPage(direction: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[14px] text-muted-foreground">Ещё {items.length} фото по направлению</p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canPrev}
            aria-label="Показать предыдущие фото"
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/60 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-5" strokeWidth={2} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canNext}
            aria-label="Показать следующи�� фото"
            className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:border-primary/60 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-5" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>

      <ul
        ref={trackRef}
        onScroll={updateArrows}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-1 sm:mx-0 sm:px-0 lg:gap-4"
      >
        {items.map((item) => (
          <li
            key={item.src}
            className="w-[calc(50%-6px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card sm:w-[calc(33.333%-8px)] lg:w-[calc(25%-9px)]"
          >
            <figure className="flex h-full flex-col">
              <div className="relative aspect-[4/3] w-full">
                <ImagePlaceholder alt={item.alt} />
              </div>
              <figcaption className="px-3 py-2.5 text-[13px] leading-snug text-muted-foreground sm:text-[14px]">
                {item.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
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
