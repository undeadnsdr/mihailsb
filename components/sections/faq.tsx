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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6">
        <div className="md:col-span-4">
          <SectionHeading id="faq-title" title={faq.title} />
        </div>

        <ul className="flex flex-col md:col-span-8">
          {faq.items.map((item, index) => (
            <Reveal key={item.q} as="li" step={(index % 3) as 0 | 1 | 2}>
              <details
                open={index === 0}
                className="group border-b border-border first:border-t"
              >
                <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-4 py-4 text-pretty text-[17px] font-medium leading-snug md:text-lg [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown
                    className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </summary>
                <p className="max-w-[72ch] text-pretty pb-5 text-[17px] leading-relaxed text-muted-foreground">
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
