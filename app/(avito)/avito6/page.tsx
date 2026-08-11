import { works } from '@/lib/content'
import { DeviceFrame } from '@/components/ui/device-frames'
import { SiteMockup, TabletMockup, PhoneMockup } from '@/components/ui/site-mockup'
import { AvitoShot, Stage } from '@/components/avito/avito-shot'

/**
 * Кадр 6 — снимает возражение «на телефоне всё поедет».
 *
 * Один и тот же сайт в трёх корпусах, а не три разных: на планшете и
 * телефоне это не уменьшенная десктопная страница, а своя раскладка —
 * поэтому в кадре именно адаптации из портфолио, а не одна вёрстка,
 * зажатая по ширине.
 */
const work = works.find((item) => item.id === 'house') ?? works[0]

export default function Avito6() {
  return (
    <AvitoShot
      title="Работает на любом экране"
      sub="Проверяю на телефоне и планшете, в обеих ориентациях. Ничего не разъезжается."
      note="Тюмень и область"
    >
      <Stage ratio="16 / 9">
        {/* Ширины подобраны так, чтобы устройства перекрывались только
            краями корпусов: планшет заходит на ноутбук на пару процентов,
            телефон на планшет — примерно так же. Больший нахлёст съедает
            первый экран у нижнего макета, и вместо трёх работающих
            адаптаций в кадре остаются три полоски */}
        <div className="absolute left-0 top-1/2 z-10 h-[74%] w-[60%] -translate-y-1/2">
          <DeviceFrame kind="laptop">
            <div className="absolute inset-x-0 top-0">
              <SiteMockup work={work} priority />
            </div>
          </DeviceFrame>
        </div>

        <div className="absolute bottom-0 right-[13%] z-20 h-[86%] w-[24%]">
          <DeviceFrame kind="tablet-portrait">
            <div className="absolute inset-x-0 top-0">
              <TabletMockup work={work} priority />
            </div>
          </DeviceFrame>
        </div>

        <div className="absolute bottom-0 right-0 z-30 h-[58%] w-[15%]">
          <DeviceFrame kind="phone-portrait">
            <div className="absolute inset-x-0 top-0">
              <PhoneMockup work={work} />
            </div>
          </DeviceFrame>
        </div>
      </Stage>
    </AvitoShot>
  )
}
