import { Check } from 'lucide-react'
import { benefitsMarquee } from '@/lib/content'

/**
 * Бегущая строка условий работы сразу под первым экраном.
 *
 * Снимает базовые возражения («а замер платный?», «а договор будет?»)
 * до того, как человек дойдёт до цен, и делает это одной строкой вместо
 * блока: на первом экране уже есть кнопка и телефон, второй смысловой
 * блок там конкурировал бы с ними за внимание. Дат и таймеров здесь
 * сознательно нет — строка не «протухает» и не требует правок к сроку.
 *
 * Внешний контейнер повторяет ширину и отступы TopBar (тот же
 * max-w-[1400px] и px-6/md:px-10/lg:px-16), поэтому овальная пилюля с
 * лентой ровно совпадает по ширине с пилюлей локации/звонка над ней.
 * Высота пилюли (h-7) и размер текста/иконок внутри тоже скопированы у
 * TopBar, чтобы обе полоски выглядели одной парой, а не разными по весу.
 *
 * pt-1 сверху — тот же зазор, что у TopBar до навигационной пилюли под
 * ней в floating-состоянии (py-1 на обёртке nav в SiteHeader при
 * floating). Хедер — sticky и переходит в floating уже через 24px
 * скролла, а сама лента всегда ниже первого экрана, поэтому в момент,
 * когда её видно, хедер уже гарантированно floating — значит сравнивать
 * нужно именно с его floating-отступом, а не с исходным (нефлоатящим).
 *
 * Дорожка отрендерена дважды подряд (aria-hidden у второй копии), а CSS
 * анимация двигает контейнер на -50% его собственной ширины — ровно на
 * длину одной копии. Так стык между концом первой и началом второй копии
 * не виден, и бесконечный цикл получается без измерения пикселей и без JS.
 */
export function BenefitsMarquee() {
  return (
    // px-4 на узком экране — те же боковые отступы, что у TopBar, шапки и
    // секций. Здесь стояло px-6 без sm-ступени: до 640px лента была на 16px
    // уже пилюли локации над ней и карточки hero под ней, и три овала в
    // столбик визуально не совпадали по краям
    <div className="mx-auto w-full max-w-[1400px] px-4 pt-1 sm:px-6 md:px-10 lg:px-16">
      <div
        aria-label="Преимущества"
        className="flex h-7 w-full items-center overflow-hidden rounded-full bg-primary text-primary-foreground"
      >
        <div className="marquee-track flex w-max shrink-0">
          <MarqueeTrack />
          <MarqueeTrack aria-hidden />
        </div>
      </div>
    </div>
  )
}

function MarqueeTrack({ 'aria-hidden': ariaHidden }: { 'aria-hidden'?: boolean }) {
  return (
    <ul aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {benefitsMarquee.map((item, index) => (
        <li
          key={index}
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap px-3 text-xs font-medium leading-none sm:text-[13px]"
        >
          <Check className="size-3.5 shrink-0" strokeWidth={2} aria-hidden="true" />
          {item}
          <span className="ml-3 text-primary-foreground/40" aria-hidden="true">
            •
          </span>
        </li>
      ))}
    </ul>
  )
}
