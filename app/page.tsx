import { SiteHeader } from '@/components/ui/site-header'
import { SiteFooter } from '@/components/ui/site-footer'
import { StickyActions } from '@/components/ui/sticky-actions'
import { BenefitsMarquee } from '@/components/ui/benefits-marquee'
import { Hero } from '@/components/sections/hero'
import { Pains } from '@/components/sections/pains'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Works } from '@/components/sections/works'
import { Stack } from '@/components/sections/stack'
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
 * Бегущая строка с преимуществами идёт сразу под первым экраном — она
 * заменила блок акции с таймером, но, в отличие от него, не истекает и не
 * занимает отдельный экран прокрутки. «Про меня» стоит следом: тот, кто
 * заинтересовался предложением, дальше спрашивает «а кто мне это сделает».
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
        <About />
        <Pains />
        <Works />
        <Stack />
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
