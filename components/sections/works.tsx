'use client'

import { useCallback, useRef, useState } from 'react'
import { works, worksSection } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'
import { WorkCard } from '@/components/ui/work-card'
import { AvitoButton } from '@/components/ui/cta'

/**
 * Кадры 2–5 для объявления.
 *
 * Одновременно прокручивается не более одного демо: галерея собирает
 * ratio всех карточек и включает ту, что ближе к центру экрана (правка 2
 * к ТЗ — на тач-устройствах ховера нет, иначе половина аудитории фичу
 * не увидела бы вовсе).
 */
export function Works() {
  const ratios = useRef<Map<string, number>>(new Map())
  const [activeId, setActiveId] = useState<string | null>(null)

  const onVisibility = useCallback((id: string, ratio: number) => {
    ratios.current.set(id, ratio)
    let bestId: string | null = null
    let best = 0.6 // порог из ТЗ: карточка должна быть заметно в кадре
    for (const [key, value] of ratios.current) {
      if (value > best) {
        best = value
        bestId = key
      }
    }
    setActiveId(bestId)
  }, [])

  // Первая плитка крупнее: ряд 7+5, затем 4+4+4
  const spans = [
    'md:col-span-7',
    'md:col-span-5',
    'md:col-span-4',
    'md:col-span-4',
    'md:col-span-4',
    'md:col-span-6 lg:col-span-6',
  ]

  return (
    <Section id="works" labelledBy="works-title">
      <div className="flex flex-col gap-8 md:gap-10">
        <SectionHeading id="works-title" title={worksSection.title} subtitle={worksSection.subtitle} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
          {works.map((work, index) => (
            <Reveal key={work.id} step={(index % 3) as 0 | 1 | 2} className={spans[index]}>
              <WorkCard
                work={work}
                large={index === 0}
                inView={activeId === work.id}
                onVisibility={onVisibility}
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="flex flex-col gap-6">
          <p className="max-w-[80ch] text-pretty text-sm leading-relaxed text-muted-foreground">
            {worksSection.disclaimer}
          </p>
          <AvitoButton place="works" className="md:w-auto md:self-start">
            {worksSection.cta}
          </AvitoButton>
        </Reveal>
      </div>
    </Section>
  )
}
