'use client'

import Image from 'next/image'
import { MapPin, Phone } from 'lucide-react'
import { hero, works } from '@/lib/content'
import { Section } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { BentoCard } from '@/components/ui/bento-card'
import { AvitoButton, ScrollLink } from '@/components/ui/cta'
import { CallbackModal } from '@/components/ui/callback-modal'
import { DeviceFrame } from '@/components/ui/device-frames'
import { SiteMockup, TabletMockup, PhoneMockup } from '@/components/ui/site-mockup'
import { reachGoal } from '@/lib/analytics'

/**
 * Кадр 1 для объявления.
 *
 * Макет: крупное фото слева с заголовком и кнопками поверх, справа —
 * две плитки-цифры и мини-форма заявки. На мобильном фото и форма
 * уходят под заголовок, а не наоборот — H1 и цена обязаны попадать
 * в первый экран без скролла.
 */
export function Hero() {
  return (
    // Section даёт снизу тот же большой отступ, что и сверху (48/56/70px) —
    // он рассчитан на переход между двумя обычными секциями. Сюда следом
    // идёт тонкая бегущая строка с преимуществами, а не полноценная секция,
    // поэтому запас снизу здесь избыточен и визуально отрывает карточки
    // hero от ленты. Переопределяем pb отдельно от pt.
    <Section id="hero" className="pt-2 pb-2 md:pt-4 md:pb-3 lg:pt-6 lg:pb-4" labelledBy="hero-title">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <Reveal className="lg:col-span-7">
          <PhotoCard />
        </Reveal>

        <Reveal step={1} className="flex flex-col gap-4 lg:col-span-5 lg:h-full">
          <div className="grid grid-cols-2 gap-4">
            {hero.tiles.map((tile) => (
              <BentoCard key={tile.label} tone="primary" className="gap-1 p-4 sm:p-5 md:p-6">
                {/* Две плитки в ряд: на экране 300px каждая получает ~126px,
                    поэтому цифра стартует с 28px и добирает кегль по мере
                    роста экрана, а не сразу упирается в края плитки */}
                <span className="tnum text-[28px] font-bold leading-none tracking-[-0.03em] sm:text-[32px] md:text-[36px] lg:text-[40px]">
                  {tile.value}
                  <span className="ml-1 text-base font-medium sm:text-lg">{tile.unit}</span>
                </span>
                <span className="text-[13px] leading-snug text-primary-foreground/75 sm:text-[14px]">
                  {tile.label}
                </span>
              </BentoCard>
            ))}
          </div>

          <CallbackCard />
        </Reveal>
      </div>
    </Section>
  )
}

/** Крупное фото с заголовком, подзаголовком и кнопками поверх */
function PhotoCard() {
  return (
    // На мобильном и планшете высота держится на aspect-ratio — своей
    // высоты у контента нет (текст лежит поверх фото absolute-позицией).
    // На lg aspect-ratio снят и заменён на h-full: карточка растягивается
    // грид-строкой ровно до высоты правой колонки (плитки-цифры + карточка
    // звонка), а не по собственным пропорциям — так обе колонки совпадают
    // по высоте вплоть до пикселя.
    // В горизонтальной ориентации смартфона по ширине уже действует sm,
    // и фото получало пропорцию 16/10 — на экране 667×375 это 387px
    // высоты, то есть картинка одна была выше всего вьюпорта, и H1 с
    // кнопками уходили за нижний край. 16/7 укладывает карточку ровно
    // в высоту, оставшуюся от шапки и панели связи
    // Раньше высоту задавал aspect-[3/4]. На экране 300px это 357px, а
    // текстовый блок поверх фото (H1 в три строки + подзаголовок + две
    // кнопки в столбик) занимает 388px. Он прижат к bottom-0 и растёт
    // вверх, поэтому первая строка H1 уходила выше границы фото и
    // обрезалась overflow-hidden, а бейдж города накрывал заголовок.
    // Теперь пропорцию держит невидимая распорка внутри (см. ниже), а
    // сама карточка тянется по контенту, если текст в пропорцию не влез
    <div className="relative overflow-hidden rounded-2xl border border-border lg:h-full">
      <Image
        src="/hero/master-photo.png"
        alt={hero.photoAlt}
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        priority
        // saturate/contrast — общая цветокоррекция для обоих фото hero
        // (см. такой же класс на callback-photo ниже). Сама фотография
        // уже графична сама по себе, поэтому здесь только небольшая
        // добавка, а не смена настроения — что-то держащее оба кадра
        // в одной цветовой обработке
        className="object-cover saturate-[1.05] contrast-[1.05]"
      />
      {/* Градиент только там, где лежит текст — не затемняет всё фото */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(0deg, rgba(17,24,39,0.88) 0%, rgba(17,24,39,0.35) 45%, transparent 70%)' }}
      />

      {/* До 380px текст занимает почти всю высоту карточки и бейдж
          наезжает на первую строку H1. Города он там не сообщает ничего
          нового — он уже есть в верхней полоске над шапкой, — поэтому
          на самых узких экранах бейдж просто не показываем.
          Ровно та же причина в горизонтальной ориентации смартфона, только
          по другой оси: карточка там низкая (24/7), а текстовый блок под
          неё не сжимается — он прижат к низу и растёт вверх, поэтому первая
          строка H1 доходит до самого верха карточки и оказывается под
          бейджем. Оба условия — про одно и то же: бейдж скрывается там,
          где под него нет свободного поля над заголовком */}
      <span className="absolute left-5 top-5 hidden items-center gap-1.5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-sm min-[380px]:inline-flex short-landscape:hidden">
        <MapPin className="size-3.5 text-primary" strokeWidth={1.75} aria-hidden="true" />
        {hero.badge}
      </span>

      {/* Сетка в одну колонку: распорка и текст лежат в одной и той же
          ячейке (оба в row 1), поэтому не складываются по высоте. Распорка
          задаёт минимум — прежнюю пропорцию карточки, — а текст выравнен по
          низу ячейки и, если он выше распорки, растит ячейку под себя.
          Это и есть то, чего не мог aspect-ratio на самой карточке.
          На lg высоту диктует грид-строка, и хватает обычного h-full */}
      {/* grid-cols-1 явно (minmax(0,1fr)), а не implicit-колонка по умолчанию:
          без явного шаблона авто-трек тянет ширину по max-content самого
          широкого grid-элемента в ячейке — тут это H1 в одну строку без
          переноса. При aspect-[3/4] на распорке это давало едва заметное
          переполнение (страховалось overflow-hidden карточки), а при
          горизонтальном aspect-[16/9] браузер посчитал max-content иначе,
          и колонка расползлась до ~667px — H1 перестал оборачиваться и
          обрезался по краю карточки. minmax(0,1fr) обрезает эту зависимость
          от контента: колонка всегда равна ширине родителя */}
      <div className="relative grid grid-cols-1 lg:h-full">
        <div
          aria-hidden="true"
          // База (смартфон в портрете): раньше здесь стояла вертикальная
          // 3/4 — по просьбе сделать блок горизонтальным она заменена на
          // 16/9, ту же пропорцию, что уже была на md. Кнопки под фото
          // уменьшены отдельно (см. AvitoButton/ScrollLink ниже) именно
          // из-за этого — при вертикальной 3/4 текстовый блок был выше
          // распорки и раздвигал карточку сам, а на низкой 16/9 высоты
          // для двух кнопок в 52px по столбику уже не хватает.
          // md (планшет в портрете): 16/10 давало 440px высоты, и вместе с
          // плитками-цифрами и карточкой звонка первый экран 1024px
          // заканчивался посередине фото — кнопка «Перезвоните мне» в кадр
          // не попадала. 16/9 отдаёт эти 44px вниз, ничего не меняя по смыслу
          // Горизонтальная ориентация: 16/7 при ширине 932px (iPhone 15 Pro
          // Max боком) — это 407px высоты фото на вьюпорте 430px, и нижняя
          // панель связи накрывала собственные кнопки первого экрана.
          // 24/7 держит карточку выше панели на любой ширине этого класса
          className="col-start-1 row-start-1 aspect-[16/9] w-full sm:aspect-[16/10] md:aspect-[16/9] lg:hidden short-landscape:aspect-[24/7]"
        />
        <div className="col-start-1 row-start-1 flex flex-col justify-end gap-4 self-end p-5 md:p-8">
        <h1
          id="hero-title"
          className="text-balance text-[27px] font-bold leading-[1.1] tracking-[-0.03em] text-background sm:text-[32px] md:text-[38px] lg:text-[48px] short-landscape:text-[26px]"
        >
          {hero.h1}
        </h1>
        <p className="max-w-[46ch] text-pretty text-[16px] leading-relaxed text-background/85 lg:text-lg short-landscape:text-[15px]">
          {hero.subtitle}{' '}
          {/* «Оплата — только если понравится» появляется от sm: на смартфоне
              герой и без неё занимает весь экран. */}
          <span className="hidden sm:inline">{hero.subtitleTail}</span>
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          {/* На смартфоне блок стал горизонтальным (16/9 вместо 3/4) —
              высоты под две кнопки по 52px в столбик уже нет, поэтому
              здесь они мельче: ниже, с уже паддингами и мельче текстом
              и иконкой. От sm возвращается прежний крупный размер */}
          <AvitoButton
            place="hero"
            className="min-h-[38px] gap-1.5 px-3.5 text-[13px] sm:min-h-[52px] sm:gap-2 sm:px-6 sm:text-[17px]"
            iconClassName="size-4 sm:size-5"
          >
            {hero.primaryCta}
          </AvitoButton>
          <ScrollLink
            to="#works"
            className="min-h-[38px] border-background/30 bg-background/10 px-3.5 text-[13px] text-background hover:bg-background/20 sm:min-h-[52px] sm:w-auto sm:px-6 sm:text-[17px]"
          >
            {hero.secondaryCta}
          </ScrollLink>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Карточка обратного звонка рядом с плитками-цифрами.
 *
 * Раньше здесь была мини-форма заявки, которая вела всё в ту же переписку
 * на Авито, что и кнопка на фото слева — то же действие продублировано,
 * а предзаполнить сообщение в Авито и так нельзя. Теперь тут отдельный
 * сценарий: звонок, для тех, кому проще ответить на входящий, чем писать.
 */
function CallbackCard() {
  // Один и тот же демо-сайт, что и в слайдшоу работ ниже — тот же продукт,
  // просто показанный крупным планом на трёх экранах сразу, а не по одному
  const work = works[0]

  return (
    <BentoCard className="flex-1 justify-end gap-3" padded={false}>
      {/* Три устройства вместо фото: планшет, ноутбук и смартфон с тем же
          демо-сайтом, но в своей вёрстке под каждый экран — наглядно
          показывает то, что фото само по себе не объясняло: сайт
          выглядит завершённым на любом устройстве клиента. Порядок —
          планшет-ноутбук-смартфон, средний по размеру между двумя
          крайними, а не по возрастанию/убыванию.
          bg-secondary/60 отделяет панель от фото главного кадра слева —
          это не снимок, а витрина. rounded-t-2xl вместо родительского
          overflow-hidden: у карточки нет паддинга, и без явного скругления
          здесь были бы острые верхние углы поверх скруглённой карточки. */}
      <div className="flex shrink-0 items-end justify-center gap-2.5 rounded-t-2xl bg-secondary/60 px-3 pt-5 pb-4 sm:gap-4 sm:px-5 sm:pt-6 sm:pb-5">
        {/* Планшет — портрет 3:4, тот же корпус и та же вёрстка, что и в
            слайдшоу работ (TabletMockup), просто без анимации и в статике */}
        <div className="relative h-16 shrink-0 sm:h-[72px] md:h-20" style={{ aspectRatio: '3 / 4' }}>
          <DeviceFrame kind="tablet-portrait">
            <TabletMockup work={work} />
          </DeviceFrame>
        </div>

        {/* Ноутбук — самый широкий из трёх, поэтому и самый заметный.
            13/8 — не точная пропорция экрана 16/10, а пропорция всего
            корпуса целиком (крышка с рамкой + основание с петлёй),
            подобранная так, чтобы корпус в высоту H давал ширину без
            зазоров сверху/снизу внутри рамки. SiteMockup выше кадра —
            обрезается overflow-hidden экрана ровно как в слайдшоу, здесь
            статикой виден только первый экран сайта */}
        <div className="relative h-[74px] shrink-0 sm:h-[92px] md:h-[104px]" style={{ aspectRatio: '13 / 8' }}>
          <DeviceFrame kind="laptop">
            <SiteMockup work={work} />
          </DeviceFrame>
        </div>

        {/* Смартфон — уже планшета: 9/19.5, тот же корпус, что и в
            слайдшоу. Самый узкий из трёх, стоит с краю справа */}
        <div className="relative h-16 shrink-0 sm:h-[72px] md:h-20" style={{ aspectRatio: '9 / 19.5' }}>
          <DeviceFrame kind="phone-portrait">
            <PhoneMockup work={work} />
          </DeviceFrame>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-3 p-5 pt-0 md:p-6 md:pt-0">
        {/* Обводка, а не сплошная заливка: сплошная кнопка «Написать на
            Авито» уже стоит на фото слева, в той же первой прокрутке.
            Два одинаково сплошных CTA рядом не говорят, с какого начать —
            глаз читает их как один и тот же вес. Здесь звонок — запасной
            путь для тех, кому проще ответить на входящий, чем писать,
            поэтому и выглядит вторым: обводка вместо заливки */}
        <CallbackModal
          place="hero"
          trigger={
            <button
              type="button"
              data-goal="click_callback"
              data-place="hero"
              onClick={() => reachGoal('click_callback', { place: 'hero' })}
              className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-[16px] font-medium leading-none text-primary transition-colors hover:bg-secondary"
            >
              <Phone className="size-5 shrink-0" strokeWidth={1.75} aria-hidden="true" />
              {hero.callbackCta}
            </button>
          }
        />

        <h2 className="text-pretty text-center text-[14px] text-muted-foreground">{hero.callbackTitle}</h2>
      </div>
    </BentoCard>
  )
}
