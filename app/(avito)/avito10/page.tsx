import Image from 'next/image'
import { works } from '@/lib/content'
import { AvitoShot } from '@/components/avito/avito-shot'

/**
 * Кадр 10 — про работу, а не про сайт. Последнее возражение подрядчика:
 * «мне некогда собирать материалы, у меня нет ни текстов, ни прайса».
 *
 * Поэтому в кадре не общий вид страницы, а её увеличенный кусок — ровно
 * те два блока, которые заказчик считает «своей частью работы»: таблица
 * цен за квадрат и галерея «до/после». Оба собраны мной, и кадр
 * показывает уровень проработки, который на общем плане не виден.
 *
 * Палитра берётся из проекта в портфолио (work.site), а не из токенов
 * этого сайта: кусок обязан выглядеть как фрагмент чужого лендинга.
 */
const work = works.find((item) => item.id === 'roof') ?? works[0]
const { site } = work

/** Демо-прайс кровельщика — часть макета, как и остальные данные в content.ts */
const prices = [
  { label: 'Металлочерепица', value: 'от 450 ₽/м²' },
  { label: 'Профнастил', value: 'от 390 ₽/м²' },
  { label: 'Мягкая кровля', value: 'от 520 ₽/м²' },
  { label: 'Утепление кровли', value: 'от 210 ₽/м²' },
]

/**
 * Порядок кадров обратный порядку в галерее проекта: «до» — это стройка
 * с открытой обрешёткой, «после» — готовая крыша. Кровельщик считывает
 * этап работ с фотографии за полсекунды, и перепутанная пара обесценила
 * бы весь кадр быстрее, чем любая опечатка в прайсе.
 */
const gallery = [
  { src: work.gallery[1], label: 'До', alt: 'Кровля в работе: обрешётка и укладка профлиста' },
  { src: work.gallery[0], label: 'После', alt: 'Готовая кровля частного дома после монтажа' },
]

export default function Avito10() {
  return (
    <AvitoShot
      title="Тексты, цены, фото — соберу сам"
      sub="Вы рассказываете, как работаете. Остальное собираю я."
      note="Тюмень и область"
    >
      <div
        className="flex h-full w-full overflow-hidden rounded-[2cqmin] ring-1 ring-inset ring-primary-foreground/15"
        style={{ background: site.bg, color: site.text }}
      >
        <div className="flex w-[54%] flex-col gap-[3cqmin] p-[4cqmin]">
          <div className="flex flex-col gap-[1cqmin]">
            <span
              className="text-[2.4cqmin] font-bold uppercase tracking-[0.16em]"
              style={{ color: site.primary }}
            >
              Прайс
            </span>
            <span className="text-[4.4cqmin] font-bold leading-tight tracking-[-0.01em]">
              Цены на монтаж кровли
            </span>
          </div>

          <dl className="flex flex-col">
            {prices.map((row) => (
              <div
                key={row.label}
                className="flex items-baseline justify-between gap-[3cqmin] border-b py-[2.2cqmin] first:pt-0"
                style={{ borderColor: site.line }}
              >
                <dt className="text-pretty text-[2.9cqmin] leading-snug">{row.label}</dt>
                <dd
                  className="shrink-0 text-[3.2cqmin] font-bold tabular-nums"
                  style={{ color: site.primary }}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>

          <span
            className="mt-auto w-fit rounded-md px-[3cqmin] py-[1.8cqmin] text-[2.7cqmin] font-medium"
            style={{ background: site.accent, color: site.accentFg }}
          >
            Замер и смета — бесплатно, в день обращения
          </span>
        </div>

        <div
          className="flex flex-1 flex-col gap-[2.4cqmin] p-[4cqmin]"
          style={{ background: site.surface }}
        >
          <span className="text-[3.4cqmin] font-bold leading-tight tracking-[-0.01em]">
            Объект в Каскаре, 140 м²
          </span>

          <div className="grid flex-1 grid-cols-2 gap-[2.4cqmin]">
            {gallery.map((shot) => (
              <figure key={shot.label} className="relative overflow-hidden rounded-[1.4cqmin]">
                <Image
                  src={shot.src || '/placeholder.svg'}
                  alt={shot.alt}
                  fill
                  sizes="25vw"
                  priority
                  className="object-cover"
                />
                <figcaption
                  className="absolute left-[1.6cqmin] top-[1.6cqmin] rounded-md px-[1.8cqmin] py-[0.8cqmin] text-[2.4cqmin] font-bold"
                  style={{ background: site.primary, color: site.primaryFg }}
                >
                  {shot.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </AvitoShot>
  )
}
