import { works } from '@/lib/content'
import { AvitoShot, BrowserShot } from '@/components/avito/avito-shot'

/**
 * Кадр 2 — охват. Снимает главное возражение подрядчика: «у меня своя
 * специфика, шаблон не подойдёт».
 *
 * Шесть разных сайтов в одном кадре доказывают это без единого слова:
 * у каждого своя палитра, своя шапка и свой первый экран. Текст на
 * миниатюрах не читается — и не должен: работает узнавание «это не одна
 * и та же страница с подменённым названием».
 */
const grid = ['roof', 'heating', 'septic', 'fence', 'house', 'kitchen']
  .map((id) => works.find((work) => work.id === id))
  .filter((work): work is (typeof works)[number] => Boolean(work))

export default function Avito2() {
  return (
    <AvitoShot
      title="Работаю с любой сферой"
      sub="Кровля, отопление, септики, заборы, дома, мебель — под каждую свой первый экран."
      note="Тюмень и область"
    >
      <div className="grid h-full w-full grid-cols-3 content-center gap-x-[3cqmin] gap-y-[2.4cqmin]">
        {grid.map((work, index) => (
          <div key={work.id} className="flex flex-col gap-[1.2cqmin]">
            <BrowserShot work={work} priority={index < 3} />
            <span className="text-[2.3cqmin] font-medium leading-tight text-primary-foreground/65">
              {work.niche}
            </span>
          </div>
        ))}
      </div>
    </AvitoShot>
  )
}
