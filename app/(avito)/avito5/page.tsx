import { works } from '@/lib/content'
import { AvitoShot, BrowserShot } from '@/components/avito/avito-shot'

/**
 * Кадр 5 — третий из трёх однотипных. Заголовок здесь шире одного сайта
 * («Септики, заборы, стройка»), потому что в этих сферах заказчик ищет
 * себя по списку, а не по конкретному названию: септики, заборы и
 * общестрой приходят с одними и теми же вопросами — сроки, техника,
 * цена за метр.
 */
const work = works.find((item) => item.id === 'septic') ?? works[0]

export default function Avito5() {
  return (
    <AvitoShot
      title="Септики, заборы, стройка"
      sub="Работы крупно, этапы и цена — всё, что спрашивают до звонка."
      note="Тюмень и область"
    >
      <BrowserShot work={work} priority className="w-[102cqmin]" />
    </AvitoShot>
  )
}
