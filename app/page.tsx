import { SiteHeader } from '@/components/ui/site-header'
import { SiteFooter } from '@/components/ui/site-footer'
import { StickyActions } from '@/components/ui/sticky-actions'
import { BenefitsMarquee } from '@/components/ui/benefits-marquee'
import { Hero } from '@/components/sections/hero'
import { TrustBar } from '@/components/sections/trust-bar'
import { Services } from '@/components/sections/services'
import { ServiceDetails } from '@/components/sections/service-detail'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Advantages } from '@/components/sections/advantages'
import { Gallery } from '@/components/sections/gallery'
import { Reviews } from '@/components/sections/reviews'
import { Promos } from '@/components/sections/promos'
import { Geo } from '@/components/sections/geo'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'
import { JsonLd } from '@/components/json-ld'

/**
 * Порядок блоков = порядок, в котором заказчик снимает свои сомнения.
 *
 * Первый экран отвечает «что вы делаете и где», полоса фактов — «можно ли
 * вам верить», меню направлений — «есть ли среди этого моя задача».
 * Дальше семь подробных блоков с прайсами: человек, пришедший за кровлей,
 * попадает по якорю сразу в свой и читает состав работ, этапы и цены,
 * не пролистывая шесть чужих направлений.
 *
 * Процесс и преимущества идут ПОСЛЕ прайсов, а не до: пока не назван
 * порядок цен, «как мы работаем» читать незачем — сначала решают,
 * подходит ли вообще, и только потом интересуются механикой.
 *
 * Портфолио и отзывы — доказательства, они закрывают «а вы вообще это
 * умеете» уже после того, как человек увидел цену и заинтересовался.
 * Акции стоят следом: скидка работает как аргумент только на том, кто
 * уже прицелился, а не на входе, где она читается как уценка.
 * География отвечает последним техническим вопросом — «доедете ли до
 * меня», — и уводит в FAQ и заявку.
 */
export default function Page() {
  return (
    <>
      <JsonLd />
      <div id="top" />
      <SiteHeader />
      <main>
        <Hero />
        <BenefitsMarquee />
        <TrustBar />
        <Services />
        <ServiceDetails />
        <HowItWorks />
        <Advantages />
        <Gallery />
        <Reviews />
        <Promos />
        <Geo />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyActions />
    </>
  )
}
