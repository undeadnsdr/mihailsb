import { works } from '@/lib/content'
import { DeviceFrame } from '@/components/ui/device-frames'
import { SiteMockup, PhoneMockup } from '@/components/ui/site-mockup'
import { AvitoShot, Stage } from '@/components/avito/avito-shot'

/**
 * Кадр 1 — главный. Его и только его видно в ленте поиска, поэтому он
 * отвечает на два вопроса сразу: что продают и сколько это стоит.
 *
 * Телефон впереди и крупно, ноутбук позади вполоборота: заказчик-подрядчик
 * смотрит Авито с телефона и сверяет увиденное со своим экраном. Ноутбук
 * нужен не сам по себе, а как доказательство «сайт, а не визитка в
 * мессенджере» — поэтому он в кадре, но вторым планом.
 */
const work = works.find((item) => item.id === 'roof') ?? works[0]

export default function Avito1() {
  return (
    <AvitoShot
      title={
        <>
          Сайт за 1 день · <span className="text-highlight-soft">6000 ₽</span>
        </>
      }
      sub="Одна страница под вашу услугу: цены, работы, заявка. Тексты и фото — с меня."
      note="Тюмень и область"
    >
      <Stage ratio="16 / 9">
        {/* Ноутбук вторым планом: слегка развёрнут, чтобы читался как
            предмет на столе, а не как вторая картинка в коллаже */}
        <div className="absolute left-1/2 top-[6%] h-[64%] w-[70%] -translate-x-1/2 -rotate-[4deg]">
          <DeviceFrame kind="laptop">
            <div className="absolute inset-x-0 top-0">
              <SiteMockup work={work} priority />
            </div>
          </DeviceFrame>
        </div>

        <div className="absolute bottom-0 left-1/2 z-10 h-[88%] w-[30%] -translate-x-1/2">
          <DeviceFrame kind="phone-portrait">
            <div className="absolute inset-x-0 top-0">
              <PhoneMockup work={work} priority />
            </div>
          </DeviceFrame>
        </div>
      </Stage>
    </AvitoShot>
  )
}
