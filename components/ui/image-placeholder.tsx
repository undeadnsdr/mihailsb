import { ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Заглушка вместо фотографии.
 *
 * Используется везде, где раньше стоял `next/image` с реальным снимком
 * объекта: карточки услуг, слайд-шоу первого экрана, портфолио и слайд-шоу
 * направления. Alt-текст никуда не пропадает — он остаётся в разметке для
 * скринридера (`sr-only`), просто визуально место фотографии занимает
 * нейтральная плитка с иконкой.
 *
 * `absolute inset-0`, а не `fill` из next/image: заглушка — обычный div,
 * а не картинка, поэтому просто растягивается на родителя с `position:
 * relative` и заданным аспектом (тот же паттерн, что был у `<Image fill />`).
 */
export function ImagePlaceholder({
  alt,
  className,
  active = true,
}: {
  alt: string
  className?: string
  /** Для слоёв, наложенных друг на друга (слайд-шоу): скрывает неактивный кадр от скринридера */
  active?: boolean
}) {
  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center justify-center bg-muted',
        className,
      )}
      role="img"
      aria-label={active ? alt : undefined}
      aria-hidden={active ? undefined : true}
    >
      <ImageIcon className="size-8 text-muted-foreground/40 sm:size-10" strokeWidth={1.5} aria-hidden="true" />
    </div>
  )
}
