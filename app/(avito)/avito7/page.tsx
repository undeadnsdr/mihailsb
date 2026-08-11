import { Check, ChevronLeft } from 'lucide-react'
import { leads } from '@/lib/content'
import { DeviceFrame } from '@/components/ui/device-frames'
import { TelegramIcon } from '@/components/ui/telegram-icon'
import { AvitoShot, Stage } from '@/components/avito/avito-shot'

/**
 * Кадр 7 — про механику, а не про красоту. Подрядчик не проверяет почту
 * и не заходит в админку: заявка должна прийти туда, где он и так сидит.
 *
 * В переписке на экране нет ни адреса бота, ни телефона мастера — только
 * заявка. Правила Авито запрещают контакты на фотографиях, а телефон
 * клиента в демо-заявке и без того замаскирован в content.ts.
 */
export default function Avito7() {
  return (
    <AvitoShot
      title="Заявка приходит вам в телефон"
      sub="Имя, номер и что нужно — одним сообщением, сразу после отправки формы."
      note="Тюмень и область"
    >
      <Stage ratio="16 / 9" className="flex items-center gap-[6cqmin]">
        <ul className="flex flex-1 flex-col gap-[4cqmin]">
          {[
            'Имя, телефон и суть заявки — в одном сообщении',
            'Приходит сразу: ничего не надо проверять на почте',
            'Звонок и ответ — в одно нажатие, прямо из уведомления',
          ].map((item) => (
            <li key={item} className="flex items-start gap-[2.4cqmin]">
              <span className="mt-[0.6cqmin] flex size-[4.4cqmin] shrink-0 items-center justify-center rounded-full bg-highlight-soft">
                <Check
                  className="size-[3cqmin] text-primary-hover"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </span>
              <span className="text-pretty text-[3.2cqmin] leading-snug text-primary-foreground/85">
                {item}
              </span>
            </li>
          ))}
        </ul>

        <div className="relative h-full w-[34%] shrink-0">
          <DeviceFrame kind="phone-portrait">
            <LeadScreen />
          </DeviceFrame>
        </div>
      </Stage>
    </AvitoShot>
  )
}

/**
 * Экран мессенджера внутри корпуса. Кегли в cqw — процентах ширины
 * ЭКРАНА телефона, а не кадра: тот же экран будет уместен и в кадре, где
 * телефон стоит крупнее.
 */
function LeadScreen() {
  return (
    <div className="absolute inset-0 flex flex-col bg-secondary">
      <div className="flex shrink-0 items-center gap-[3cqw] border-b border-border bg-card px-[4cqw] pb-[3.5cqw] pt-[11cqw]">
        <ChevronLeft className="size-[5cqw] shrink-0 text-primary" aria-hidden="true" />
        <span className="flex size-[11cqw] shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <TelegramIcon className="size-[6cqw]" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[4.4cqw] font-medium leading-tight">Заявки с сайта</span>
          <span className="text-[3.2cqw] leading-tight text-muted-foreground">бот · онлайн</span>
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-[3.5cqw] px-[4cqw] pb-[5cqw]">
        <span className="mx-auto rounded-full bg-card px-[3.5cqw] py-[1.2cqw] text-[3cqw] text-muted-foreground">
          сегодня
        </span>

        {/* Свёрнутая заявка часом раньше: пустая лента над единственным
            сообщением читалась бы как «за всё время пришла одна штука» */}
        <div className="flex w-[82%] flex-col gap-[1.4cqw] rounded-2xl rounded-bl-md bg-card p-[3.4cqw]">
          <span className="text-[3.6cqw] font-medium leading-tight text-primary">
            {leads.demo.title}
          </span>
          <span className="text-[3.2cqw] leading-tight text-muted-foreground">
            Ирина · Замена кровли, 90 м²
          </span>
          <span className="self-end text-[2.9cqw] text-muted-foreground">11:40</span>
        </div>

        <div className="flex w-[94%] flex-col gap-[3cqw] rounded-2xl rounded-bl-md bg-card p-[4cqw] card-shadow">
          <span className="text-[4.2cqw] font-bold leading-tight text-primary">
            {leads.demo.title}
          </span>

          <dl className="flex flex-col gap-[2.4cqw] border-t border-border pt-[3cqw]">
            {leads.demo.fields.map((field) => (
              <div key={field.label} className="flex flex-col gap-[0.4cqw]">
                <dt className="text-[3cqw] leading-tight text-muted-foreground">{field.label}</dt>
                <dd className="text-pretty text-[3.9cqw] font-medium leading-tight">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>

          <span className="self-end text-[2.9cqw] text-muted-foreground">{leads.demo.time}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-[3cqw] border-t border-border bg-card px-[4cqw] pb-[7cqw] pt-[3.5cqw]">
        <span className="h-[8cqw] flex-1 rounded-full bg-secondary" aria-hidden="true" />
        <span
          className="size-[8cqw] shrink-0 rounded-full bg-primary"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}
