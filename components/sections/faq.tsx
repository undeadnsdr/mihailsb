import { ChevronDown } from 'lucide-react'
import { faq } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'

/**
 * FAQ на нативных details/summary: работает без JS, доступно с клавиатуры
 * и не тянет ни одного килобайта скриптов. Первый вопрос открыт —
 * он же главное возражение («почему так дешево»).
 */
export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title">
      {/* Список вопросов уходит под заголовок до lg: в 8 колонках из 12 на
          планшете вопросы вроде «Почему так дешево?» вставали в две строки,
          а ответы сжимались до 45 знаков в строке */}
      <div className="grid grid-cols-1 gap-8 md:gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading id="faq-title" title={faq.title} />
        </div>

        <ul className="flex flex-col lg:col-span-8">
          {faq.items.map((item, index) => (
            <Reveal key={item.q} as="li" step={(index % 3) as 0 | 1 | 2}>
              <details
                open={index === 0}
                className="group border-b border-border first:border-t"
              >
                {/* min-h 64px — это зона нажатия: вопрос кликабелен целиком,
                    и на смартфоне он должен оставаться не меньше 44px даже
                    когда сам текст стал мельче */}
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-3 py-4 text-pretty text-[16px] font-medium leading-snug sm:gap-4 sm:text-[17px] lg:text-lg [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-[72ch] text-pretty pb-5 text-[16px] leading-relaxed text-muted-foreground sm:text-[17px]">
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
