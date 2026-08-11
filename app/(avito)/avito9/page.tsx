import { pricing } from '@/lib/content'
import { AvitoShot } from '@/components/avito/avito-shot'

/**
 * Кадр 9 — цена, разобранная на части.
 *
 * Круглая цифра «6000» без расшифровки на этом рынке читается как
 * приманка: подрядчик по опыту ждёт, что домен, хостинг и «настройка»
 * всплывут отдельными счетами. Поэтому в кадре не цена, а смета из двух
 * строк — и итог, который равен их сумме, а не превышает её.
 *
 * Суммы берутся из прайса на сайте, а не переписаны сюда: объявление и
 * страница обязаны показывать одно и то же число.
 */
export default function Avito9() {
  return (
    <AvitoShot
      title="Других платежей нет"
      sub="Полная стоимость сайта под ключ. Домен и хостинг на первый год уже внутри."
      note="Тюмень и область"
    >
      <div className="w-[88cqmin] rounded-[3cqmin] bg-primary p-[5.4cqmin] ring-1 ring-inset ring-primary-foreground/15">
        <dl className="flex flex-col">
          {pricing.main.breakdown.map((row) => (
            <div
              key={row.label}
              className="flex items-baseline justify-between gap-[4cqmin] border-b border-primary-foreground/15 pb-[3cqmin] pt-[3cqmin] first:pt-0"
            >
              <dt className="text-pretty text-[3.4cqmin] leading-snug text-primary-foreground/75">
                {row.label}
              </dt>
              <dd className="shrink-0 text-[4.4cqmin] font-bold tabular-nums">{row.value}</dd>
            </div>
          ))}

          <div className="flex items-baseline justify-between gap-[4cqmin] pt-[4cqmin]">
            <dt className="text-[4.2cqmin] font-bold leading-snug">{pricing.main.title}</dt>
            <dd className="shrink-0 text-[11cqmin] font-bold leading-none tracking-[-0.02em] tabular-nums text-highlight-soft">
              {pricing.main.price} {pricing.main.currency}
            </dd>
          </div>
        </dl>

        <p className="mt-[4cqmin] border-t border-primary-foreground/15 pt-[3.4cqmin] text-[2.9cqmin] leading-snug text-primary-foreground/60">
          {pricing.main.note} Со второго года домен и хостинг — 1500 ₽ в год, и это
          единственный обязательный платёж.
        </p>
      </div>
    </AvitoShot>
  )
}
