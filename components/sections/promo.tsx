import { Gift } from 'lucide-react'
import { promo } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { Countdown } from '@/components/ui/countdown'

/** Кадр 9: акция с таймером. После 01.09.2026 блок показывает только примечание. */
export function Promo() {
  return (
    <Section tight className="py-0 md:py-0 lg:py-0">
      <Reveal>
        <div className="flex flex-col gap-4 rounded-2xl bg-accent p-6 text-accent-foreground md:flex-row md:items-center md:justify-between md:gap-8 md:p-8">
          <div className="flex items-start gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Gift className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1.5">
              <p className="text-pretty text-[21px] font-medium leading-snug tracking-[-0.01em] md:text-[26px]">
                {promo.title}
              </p>
              <p className="max-w-[62ch] text-pretty text-[15px] leading-relaxed text-accent-foreground/80 md:text-base">
                {promo.text}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-1 md:items-end">
            <Countdown
              deadline={promo.deadline}
              expiredSlot={<span className="text-[15px] font-medium">{promo.expiredNote}</span>}
            />
            <span className="text-[13px] font-medium tracking-[0.01em] text-accent-foreground/70">
              до конца акции
            </span>
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
