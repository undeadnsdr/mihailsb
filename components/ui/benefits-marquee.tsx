import { Check } from 'lucide-react'
import { benefitsMarquee } from '@/lib/content'

/**
 * Бегущая строка преимуществ под хедером/хero.
 *
 * Заменила блок акции с таймером на первом экране: та же задача — снять
 * возражения сразу, пока внимание максимально, — но без даты окончания,
 * поэтому блок никогда не «протухает» и не пропадает с сайта сам по себе.
 *
 * Внешний контейнер повторяет ширину и отступы TopBar (тот же
 * max-w-[1400px] и px-6/md:px-10/lg:px-16), поэтому овальная пилюля с
 * лентой ровно совпадает по ширине с пилюлей локации/звонка над ней.
 * Высота пилюли (h-7) и размер текста/иконок внутри тоже скопированы у
 * TopBar, чтобы обе полоски выглядели одной парой, а не разными по весу.
 *
 * pt-1.5 сверху — тот же зазор, что у TopBar до навигационной пилюли под
 * ней (py-1.5 на обёртке nav в SiteHeader): расстояние строки до hero
 * над ней визуально повторяет расстояние верхней строки до хедера.
 *
 * Дорожка отрендерена дважды подряд (aria-hidden у второй копии), а CSS
 * анимация двигает контейнер на -50% его собственной ширины — ровно на
 * длину одной копии. Так стык между концом первой и началом второй копии
 * не виден, и бесконечный цикл получается без измерения пикселей и без JS.
 */
export function BenefitsMarquee() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 pt-1.5 md:px-10 lg:px-16">
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
