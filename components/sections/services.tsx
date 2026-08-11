import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { services, servicesIntro, formatPrice } from '@/lib/content'
import { Section, SectionHeading } from '@/components/ui/section'
import { Reveal } from '@/components/ui/reveal'

/**
 * Меню направлений — семь карточек-ссылок на детальные блоки ниже.
 *
 * Задача блока не «рассказать», а «дать себя найти»: человек приходит с
 * одной конкретной задачей («нужна кровля»), и ему нужен указатель, а не
 * текст. Поэтому в карточке ровно четыре вещи: фото, название, одна строка
 * состава и цена «от».
 *
 * Цена стоит уже здесь, а не только в детальном блоке: без неё карточка
 * заставляет открывать все семь, чтобы понять порядок сумм.
 */
export function Services() {
  return (
    <Section id="services" labelledBy="services-title">
      <div className="flex flex-col gap-8">
        <SectionHeading
          id="services-title"
          title={servicesIntro.title}
          subtitle={servicesIntro.subtitle}
        />

        {/* Семь карточек: 1 колонка на смартфоне, 2 на планшете, 3 с lg.
            Седьмая при трёх колонках остаётся одна в последней строке —
            растягиваем её на две, чтобы ряд не выглядел обрубленным */}
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal
              as="li"
              key={service.slug}
              step={(Math.min(index, 5) as 0 | 1 | 2 | 3 | 4 | 5)}
              className="lg:last:col-span-2"
            >
              <a
                href={`#${service.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/60"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="display-caps text-[19px] leading-tight tracking-[0.01em] text-foreground">
                    {service.navTitle}
                  </h3>
                  <p className="flex-1 text-[14px] leading-relaxed text-muted-foreground">
                    {service.short}
                  </p>

                  <p className="mt-1 flex items-center justify-between gap-3">
                    <span className="flex items-baseline gap-1">
                      <span className="text-[13px] text-muted-foreground">от</span>
                      <span className="display-caps tnum text-[22px] leading-none text-highlight">
                        {formatPrice(service.priceFrom)}
                      </span>
                      <span className="text-[13px] text-muted-foreground">{service.priceUnit}</span>
                    </span>
                    <ArrowRight
                      className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                      strokeWidth={1.75}
                      aria-hidden="true"
                    />
                  </p>
                </div>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  )
}
