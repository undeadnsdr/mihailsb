import { SiteHeader } from '@/components/ui/site-header'
import { SiteFooter } from '@/components/ui/site-footer'
import { StickyActions } from '@/components/ui/sticky-actions'
import { Hero } from '@/components/sections/hero'
import { Promo } from '@/components/sections/promo'
import { Pains } from '@/components/sections/pains'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Works } from '@/components/sections/works'
import { Includes } from '@/components/sections/includes'
import { Leads } from '@/components/sections/leads'
import { PwaSection } from '@/components/sections/pwa-section'
import { Industries } from '@/components/sections/industries'
import { Pricing } from '@/components/sections/pricing'
import { Support } from '@/components/sections/support'
import { About } from '@/components/sections/about'
import { Faq } from '@/components/sections/faq'
import { FinalCta } from '@/components/sections/final-cta'
import { JsonLd } from '@/components/json-ld'

/**
 * Порядок секций = порядок снятия возражений:
 * узнавание (боли) → доказательство (работы) → механика (как это работает,
 * что входит) → цена → снятие рисков (сопровождение, про меня, FAQ) → заявка.
 * Акция стоит сразу под первым экраном, пока внимание максимально, а «Про
 * меня» — сразу за ней: тот, кто заинтересовался скидкой, дальше спрашивает
 * «а кто мне это сделает».
 */
export default function Page() {
  return (
    <>
      <JsonLd />
      <div id="top" />
      <SiteHeader />
      <main>
        <Hero />
        <Promo />
        <About />
        <Pains />
        <Works />
        <HowItWorks />
        <Includes />
        <Leads />
        <PwaSection />
        <Pricing />
        <Industries />
        <Support />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyActions />
    </>
  )
}
