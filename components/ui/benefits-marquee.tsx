import { Check } from 'lucide-react'
import { benefitsMarquee } from '@/lib/content'

/**
 * Бегущая строка преимуществ прямо под хедером.
 *
 * Заменила блок акции с таймером на первом экране: та же задача — снять
 * возражения сразу, пока внимание максимально, — но без даты окончания,
 * поэтому блок никогда не «протухает» и не пропадает с сайта сам по себе.
 *
 * Дорожка отрендерена дважды подряд (aria-hidden у второй копии), а CSS
 * анимация двигает контейнер на -50% его собственной ширины — ровно на
 * длину одной копии. Так стык между концом первой и началом второй копии
 * не виден, и бесконечный цикл получается без измерения пикселей и без JS.
 */
export function BenefitsMarquee() {
  return (
    <div
      aria-label="Преимущества"
      className="w-full overflow-hidden bg-primary py-2.5 text-primary-foreground"
    >
      <div className="marquee-track flex w-max shrink-0">
        <MarqueeTrack />
        <MarqueeTrack aria-hidden />
      </div>
    </div>
  )
}

function MarqueeTrack({ 'aria-hidden': ariaHidden }: { 'aria-hidden'?: boolean }) {
  return (
    <ul aria-hidden={ariaHidden} className="flex shrink-0 items-center">
      {benefitsMarquee.map((item, index) => (
        <li key={index} className="flex shrink-0 items-center gap-2 whitespace-nowrap px-4 text-sm font-medium">
          <Check className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
          {item}
          <span className="ml-4 text-primary-foreground/40" aria-hidden="true">
            •
          </span>
        </li>
      ))}
    </ul>
  )
}
