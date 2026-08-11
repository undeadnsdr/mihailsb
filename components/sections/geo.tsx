import { MapPin } from 'lucide-react'
import { geo } from '@/lib/content'
import { Reveal } from '@/components/ui/reveal'
import { Section, SectionHeading } from '@/components/ui/section'

/**
 * География работы — плотное облако населённых пунктов.
 *
 * Карты здесь сознательно нет: интерактивная карта области весит больше
 * всей остальной страницы, а отвечает ровно на один вопрос — «доедете ли
 * до моего села». Список названий отвечает на него быстрее и находится
 * поиском, чего с тайлами карты не происходит.
 */
export function Geo() {
  return (
    <Section id="geo" labelledBy="geo-title">
      <SectionHeading id="geo-title" title={geo.title} subtitle={geo.subtitle} />

      <Reveal className="mt-10 md:mt-12">
        <ul className="flex flex-wrap gap-2">
          {geo.places.map((place) => (
            <li
              key={place}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-sm text-card-foreground"
            >
              <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
              {place}
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal>
        <p className="mt-6 text-sm text-muted-foreground">{geo.note}</p>
      </Reveal>
    </Section>
  )
}
