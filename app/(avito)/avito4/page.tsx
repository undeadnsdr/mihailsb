import { works } from '@/lib/content'
import { AvitoShot, BrowserShot } from '@/components/avito/avito-shot'

/**
 * Кадр 4 — второй из трёх однотипных. Отопление берёт другую палитру и
 * другой каркас первого экрана, чем кровля: рядом в галерее это читается
 * как «делает под сферу», а не «подставляет название в один шаблон».
 */
const work = works.find((item) => item.id === 'heating') ?? works[0]

export default function Avito4() {
  return (
    <AvitoShot
      title="Отопление и котлы"
      sub="Другая сфера — другой первый экран, а не тот же шаблон."
      note="Тюмень и область"
    >
      <BrowserShot work={work} priority className="w-[102cqmin]" />
    </AvitoShot>
  )
}
