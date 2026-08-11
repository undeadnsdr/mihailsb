import { cn } from '@/lib/utils'
import { AvitoShot } from '@/components/avito/avito-shot'

/**
 * Кадр 8 — снятие риска. Главное возражение на этом рынке не «дорого», а
 * «заплачу и пропадёт»: подрядчик уже обжигался на предоплате.
 *
 * Поэтому схема идёт от действия заказчика к деньгам, а не наоборот, и
 * акцентом выделен только последний шаг — оплата стоит четвёртой, после
 * готового сайта. Список вертикальный, а не в четыре колонки: в галерее
 * Авито кадр смотрят с телефона, и четыре узких столбца там не читаются.
 */
const steps = [
  { title: 'Пишете', text: 'Рассказываете о деле, услугах и ценах — в переписке, без созвонов.' },
  { title: 'Смотрите готовое', text: 'Присылаю ссылку на собранный сайт. Тексты и фото уже на местах.' },
  { title: 'Нравится', text: 'Правим цены и фото, подбираем домен. Не нравится — просто расходимся.' },
  { title: 'Оплата', text: '6000 ₽ после того, как увидели результат. Не раньше.' },
]

export default function Avito8() {
  return (
    <AvitoShot
      title="Сначала сайт, потом оплата"
      sub="Никакой предоплаты: сайт вы видите готовым и только потом решаете."
      note="Тюмень и область"
    >
      <ol className="relative flex h-full w-full flex-col justify-center gap-[3.4cqmin]">
        {/* Линия хода: соединяет центры кружков и обрывается на них,
            поэтому идёт от первого номера к последнему, а не по всей
            высоте списка */}
        <span
          aria-hidden="true"
          className="absolute bottom-[7cqmin] left-[4.4cqmin] top-[7cqmin] w-px bg-primary-foreground/20"
        />

        {steps.map((step, index) => {
          const last = index === steps.length - 1
          return (
            <li key={step.title} className="relative flex items-center gap-[3.4cqmin]">
              <span
                className={cn(
                  'flex size-[9cqmin] shrink-0 items-center justify-center rounded-full text-[4cqmin] font-bold',
                  last
                    ? 'bg-highlight-soft text-primary-hover'
                    : 'bg-primary text-primary-foreground/80 ring-1 ring-inset ring-primary-foreground/20',
                )}
              >
                {index + 1}
              </span>
              <span className="flex min-w-0 flex-col gap-[0.4cqmin]">
                <span
                  className={cn(
                    'text-[4.6cqmin] font-bold leading-tight tracking-[-0.01em]',
                    last && 'text-highlight-soft',
                  )}
                >
                  {step.title}
                </span>
                <span className="text-pretty text-[2.9cqmin] leading-snug text-primary-foreground/65">
                  {step.text}
                </span>
              </span>
            </li>
          )
        })}
      </ol>
    </AvitoShot>
  )
}
