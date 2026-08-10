import { ChevronDown } from 'lucide-react'
import { faq } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { cn } from '@/lib/utils'

/**
 * FAQ на нативных details/summary: работает без JS, доступно с клавиатуры
 * и не тянет ни одного килобайта скриптов.
 *
 * name="faq" на каждом details — нативная эксклюзивная группа (как у
 * радиокнопок): раскрытие одного вопроса браузер сам закрывает
 * предыдущий открытый, без единой строчки JS и без мигания layout при
 * открытии/закрытии. Первый вопрос открыт — он же главное возражение
 * («почему так дешево»).
 */
export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="flex flex-col gap-10 md:gap-12">
        <div className="max-w-[62ch]">
          <SectionHeading id="faq-title" title={faq.title} subtitle={faq.subtitle} />
        </div>

        {/* Две колонки от md: смартфону оставлена одна колонка — вопрос
            вроде «Почему так дешево? В чём подвох?» в узкой половине
            экрана ломался бы на три строки уже в самом табе. С md вопросов
            становится восемь, и одна колонка растягивала бы секцию вдвое
            выше необходимого */}
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {faq.items.map((item, index) => (
            <Reveal key={item.q} as="li" step={(index % 4) as 0 | 1 | 2 | 3}>
              <details
                name="faq"
                open={index === 0}
                className="group h-full rounded-2xl border border-border bg-card"
              >
                {/* min-h 64px — зона нажатия: таб кликабелен целиком, и на
                    смартфоне должен оставаться не меньше 44px даже когда
                    сам текст стал мельче */}
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-pretty text-[16px] font-medium leading-snug sm:text-[17px] [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </summary>
                <p
                  className={cn(
                    'px-5 text-pretty pb-5 text-[15px] leading-relaxed text-muted-foreground sm:text-[16px]',
                  )}
                >
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
