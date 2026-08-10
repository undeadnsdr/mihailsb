'use client'

import { useEffect, useRef, useState } from 'react'
import { Pause, Play } from 'lucide-react'
import { cn } from '@/lib/utils'

type VoiceNoteProps = {
  src: string
  type?: string
  title?: string
  hint?: string
  /** Длительность в секундах — показывается до загрузки метаданных, чтобы подпись не «прыгала» */
  duration: number
  /** Заранее посчитанные пики 0..1 (scripts/audio-peaks.mjs) */
  peaks: readonly number[]
  unsupportedNote?: string
  downloadLabel?: string
  className?: string
}

function formatTime(totalSeconds: number) {
  const safe = Number.isFinite(totalSeconds) ? Math.max(0, Math.floor(totalSeconds)) : 0
  const minutes = Math.floor(safe / 60)
  const seconds = safe % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

/**
 * Голосовое сообщение с волной, как в мессенджере — знакомый паттерн, объяснять не надо.
 *
 * Волна нарисована делениями (div'ами) по заранее посчитанным пикам, а не canvas:
 * не нужно ждать загрузки и декодирования файла, чтобы что-то показать, и полоска
 * остаётся резкой на любом экране.
 *
 * По волне можно перематывать: сам трек — это <input type="range">, лежащий
 * прозрачным слоем поверх. Так перемотка работает и мышью, и с клавиатуры,
 * и скринридером, без ручной возни с координатами клика.
 */
export function VoiceNote({
  src,
  type,
  title,
  hint,
  duration,
  peaks,
  unsupportedNote,
  downloadLabel,
  className,
}: VoiceNoteProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  // Реальная длительность из файла надёжнее константы, но появляется не сразу
  const [actualDuration, setActualDuration] = useState(duration)
  const [unsupported, setUnsupported] = useState(false)

  const total = actualDuration || duration
  const progress = total > 0 ? Math.min(1, currentTime / total) : 0

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onTime = () => setCurrentTime(audio.currentTime)
    const onMeta = () => {
      // У потоковых ogg длительность иногда приходит Infinity — тогда доверяем константе
      if (Number.isFinite(audio.duration) && audio.duration > 0) setActualDuration(audio.duration)
    }
    const onEnded = () => {
      setPlaying(false)
      setCurrentTime(0)
      audio.currentTime = 0
    }
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => {
      setUnsupported(true)
      setPlaying(false)
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
    }
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      // play() отклоняется, если формат не поддерживается — ловим и показываем скачивание
      audio.play().catch(() => setUnsupported(true))
    }
  }

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    setCurrentTime(value)
    audio.currentTime = value
  }

  return (
    <figure
      className={cn(
        // overflow-hidden — вторая линия защиты: даже если строке ниже не хватит
        // места, лишнее срежется по скруглённому краю, а не вылезет за карточку
        'flex w-full flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5',
        className,
      )}
    >
      {title ? (
        <figcaption className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
          <span className="text-[17px] font-medium leading-snug tracking-[-0.01em]">{title}</span>
          {hint ? <span className="text-[14px] leading-snug text-muted-foreground">{hint}</span> : null}
        </figcaption>
      ) : null}

      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? 'Пауза' : 'Прослушать голосовое сообщение'}
          className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          {playing ? (
            <Pause className="size-5" strokeWidth={2} aria-hidden="true" />
          ) : (
            // Иконка воспроизведения смещена на пиксель: у треугольника центр
            // тяжести левее геометрического, иначе в круге он смотрится сдвинутым
            <Play className="ml-0.5 size-5" strokeWidth={2} aria-hidden="true" />
          )}
        </button>

        {/* min-w-0 снимает с флекс-элемента базовый min-width:auto — без него
            браузер держит ширину волны не меньше суммы гэпов между делениями
            (66 промежутков × 2px), и на очень узких экранах это раздвигало
            строку шире карточки, выталкивая таймер за край */}
        <div className="relative min-w-0 flex-1">
          <div className="flex h-10 items-center gap-[2px] overflow-hidden md:h-12" aria-hidden="true">
            {peaks.map((peak, index) => {
              const played = index / peaks.length < progress
              return (
                <span
                  key={index}
                  className={cn(
                    'flex-1 rounded-full transition-colors duration-150',
                    played ? 'bg-primary' : 'bg-border',
                  )}
                  // Минимум 12%, иначе тишина превращается в невидимые пропуски
                  // и волна выглядит порванной
                  style={{ height: `${Math.max(12, peak * 100)}%` }}
                />
              )
            })}
          </div>

          <input
            type="range"
            min={0}
            max={total}
            step={0.1}
            value={currentTime}
            onChange={(event) => seek(Number(event.target.value))}
            aria-label="Перемотка голосового сообщения"
            aria-valuetext={`${formatTime(currentTime)} из ${formatTime(total)}`}
            className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-moz-range-thumb]:h-10 [&::-moz-range-thumb]:w-1 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-transparent [&::-webkit-slider-thumb]:h-10 [&::-webkit-slider-thumb]:w-1 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:bg-transparent"
          />
        </div>

        <span className="tnum w-11 shrink-0 text-right text-[14px] tabular-nums text-muted-foreground">
          {formatTime(playing || currentTime > 0 ? total - currentTime : total)}
        </span>
      </div>

      {unsupported ? (
        <p className="text-[14px] leading-relaxed text-muted-foreground">
          {unsupportedNote}{' '}
          <a href={src} download className="font-medium text-primary underline underline-offset-4">
            {downloadLabel}
          </a>
        </p>
      ) : null}

      <audio ref={audioRef} preload="metadata" className="sr-only">
        <source src={src} type={type} />
      </audio>
    </figure>
  )
}
