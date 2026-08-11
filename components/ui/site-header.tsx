'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Menu, Phone } from 'lucide-react'
import { nav, site } from '@/lib/content'
import { TopBar } from '@/components/ui/top-bar'
import { AvitoButton } from '@/components/ui/cta'
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { reachGoal } from '@/lib/analytics'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const [floating, setFloating] = useState(false)

  useEffect(() => {
    const onScroll = () => setFloating(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-40">
      <TopBar floating={floating} />
      {/* Плавающая стеклянная панель — одна из трёх зон, где стекло разрешено */}
      <div
        className={cn(
          'mx-auto w-full max-w-[1400px] px-4 py-1.5 transition-all duration-300 sm:px-6 md:px-10 lg:px-16',
          floating && 'py-1',
          // Верхняя полоска в горизонтальной ориентации скрыта, поэтому
          // шапка сама прижимается к краю экрана — свой отступ ей нужен
          'short-landscape:py-1',
        )}
      >
        <nav
          aria-label="Основная навигация"
          className={cn(
            // px = py, поэтому отступ до лого/кнопки слева-справа равен отступу сверху-снизу.
            // На планшете (sm–lg) третья колонка убирается: меню <ul> там всё
            // ещё скрыто (display:none), но сама явная колонка под него
            // раньше оставалась в grid-template-columns и «съедала» gap-4
            // с обеих сторон впустую — кнопка «Написать на Авито» стояла
            // на 16px левее правого края хедера, хотя отступ сверху/снизу
            // был 7px. Без третьей колонки gap полностью уходит в 1fr слева
            // от лого, и кнопка встаёт вплотную к правому padding хедера —
            // так gap справа равен gap сверху и снизу (оба = px-1.5/py-1.5).
            // На смартфоне (<sm) оставлена прежняя раскладка в три колонки —
            // там этот сдвиг не был частью задачи.
            // С lg меню появляется, и обе боковые колонки становятся равными 1fr — тогда среднее меню
            // центрируется относительно всего хедера, а не свободного места между лого и кнопкой.
            'grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-4 rounded-full border border-border px-1.5 py-1.5 shadow-sm transition-all duration-300 sm:grid-cols-[minmax(0,1fr)_auto] lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]',
            floating ? 'glass' : 'bg-card',
          )}
        >
          {/* Без justify-self-start: в grid это выравнивание переключает
              элемент на размер по содержимому, и логотип занимал 163px
              вместо своей колонки в 56px — он наезжал на телефон справа
              на 91px, а truncate не срабатывал вообще. По умолчанию
              (stretch) элемент равен колонке, и обрезка работает.
              Влево он и так прижат, так как это первая колонка */}
          <a href="#top" className="flex min-w-0 items-center gap-3">
            {/* Фото автора — сайты делает реальный человек, не студия.
                Круглый кроп по лицу, размер пропорционален уменьшенной высоте панели */}
            <Image
              src="/avatar.webp"
              alt="Илья, автор сайта"
              width={44}
              height={44}
              // На смартфоне (портрет) аватар крупнее, чем на sm+ — там
              // дескриптор рядом стал короче («за 1 день и 6000 ₽» вместо
              // полного названия услуги), и панель хедера может позволить
              // себе более заметное фото автора. В горизонтальной
              // ориентации смартфона он возвращается к мелкому размеру —
              // там высота панели зажата short-landscape-отступами
              className="size-11 shrink-0 rounded-full border border-border object-cover sm:size-10 short-landscape:size-8"
              priority
            />
            <span className="flex min-w-0 flex-col leading-tight">
              {/* На смартфоне название мельче: рядом появляется дескриптор,
                  и двум строкам вместе нужно на несколько пикселей меньше,
                  чем одному крупному названию раньше */}
              <span className="truncate text-[15px] font-bold tracking-[-0.02em] text-primary sm:text-[17px]">
                {site.domain}
              </span>
              {/* Два варианта подписи вместо одной строки: на смартфоне
                  только «за 1 день и 6000 ₽», от sm — с названием услуги.
                  Переключение классами, а не по ширине через JS, чтобы
                  разметка совпадала на сервере и клиенте */}
              <span className="truncate text-[11px] font-medium text-muted-foreground sm:text-[13px]">
                <span className="sm:hidden">{site.headerTagline}</span>
                <span className="hidden sm:inline short-landscape:hidden">{site.headerTaglineWide}</span>
                {/* В горизонтальной ориентации смартфона высота панели
                    зажата, а справа появляется номер телефона — там
                    возвращаем короткий вариант */}
                <span className="hidden short-landscape:inline">{site.headerTagline}</span>
              </span>
            </span>
          </a>

          <ul className="hidden items-center gap-6 justify-self-center lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  // Меню включается на lg — то есть первым его получает
                  // планшет в горизонтальной ориентации, а это тач. Ссылки
                  // высотой 17px там не нажать: flex + min-h-10 расширяет
                  // зону до 40px, не меняя вид самой строки
                  className="flex min-h-10 items-center text-sm font-medium tracking-[0.01em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-self-end">
            {/* Портрет смартфона: бургер с якорями вместо номера — разделы
                страницы теперь достижимы и без десктопного меню, а связь
                и так всегда на виду в нижней панели */}
            <Sheet>
              <SheetTrigger
                aria-label="Открыть меню разделов"
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:text-primary sm:hidden short-landscape:hidden"
              >
                <Menu className="size-5" strokeWidth={1.75} aria-hidden="true" />
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs">
                <SheetHeader>
                  <SheetTitle>Разделы страницы</SheetTitle>
                </SheetHeader>
                <nav aria-label="Мобильная навигация" className="flex flex-col gap-1 px-2 pb-4">
                  {nav.map((item) => (
                    <SheetClose
                      key={item.href}
                      nativeButton={false}
                      render={
                        <a
                          href={item.href}
                          className="flex min-h-12 items-center rounded-lg px-3 text-[16px] font-medium text-foreground transition-colors hover:bg-secondary"
                        />
                      }
                    >
                      {item.label}
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>

            {/* Номер остаётся только в горизонтальной ориентации: там
                нижняя панель связи скрыта, а кнопка «Написать на Авито»
                тоже не показывается — без номера не осталось бы ни одной
                точки контакта в кадре */}
            <a
              href={`tel:${site.phoneRaw}`}
              data-goal="click_phone"
              data-place="header"
              onClick={() => reachGoal('click_phone', { place: 'header' })}
              className="hidden min-h-10 shrink-0 items-center gap-1.5 whitespace-nowrap text-[15px] font-medium text-primary transition-colors hover:text-primary-hover short-landscape:flex"
            >
              <Phone className="size-4" strokeWidth={1.75} aria-hidden="true" />
              {site.phone}
            </a>

            {/* В горизонтальной ориентации смартфона нижняя панель связи
                остаётся на экране, и кнопка в шапке была бы третьим
                «Написать на Авито» в одном кадре — там возвращаем телефон */}
            <AvitoButton
              place="header"
              className="hidden min-h-10 shrink-0 px-4 text-[15px] max-md:w-auto sm:inline-flex short-landscape:hidden"
            >
              Написать на Авито
            </AvitoButton>
          </div>
        </nav>
      </div>
    </header>
  )
}
