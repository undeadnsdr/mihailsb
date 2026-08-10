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
 * Порядок секций = порядок снятия возражений, а не порядок готовности
 * блоков к показу:
 *
 * узнавание (кто говорит) → узнавание (боли) → самоидентификация (ниши) →
 * доказательство (работы) → цена → расшифровка цены (что входит) →
 * механика (как проходит работа) → заявки/бонус → технические детали для
 * скептиков → снятие риска (сопровождение) → добивание возражений (FAQ) →
 * заявка.
 *
 * About стоит сразу после первого экрана, а не в конце: прежде чем читать
 * про проблемы и цену, человек хочет понять, кто с ним говорит — реальный
 * исполнитель или очередной шаблон. Цена стоит после портфолио, а не до
 * него: на вопрос «сколько это стоит» должно быть чем ответить — «вот что
 * вы получите за эти деньги», а не абстрактное число раньше, чем человек
 * увидел результат. Includes сразу за Pricing — это буквально расшифровка
 * «что входит в 6000 ₽», держать её далеко от цены значит заставлять
 * скроллить назад. Industries стоит сразу после болей, а не в хвосте:
 * список ниш — инструмент самоидентификации («кровля — это про меня»), он
 * должен работать в начале воронки, когда сомневающийся ещё не ушёл.
 * Works стоит прямо перед Industries: сначала человек видит, как выглядит
 * готовый сайт на разных экранах, и только потом сверяет список сфер —
 * так доказательство идёт раньше самоидентификации, а не наоборот.
 * Stack — блок для скептиков, которым важно «что под капотом»; в середине
 * воронки он тормозит тех, кому это не нужно, поэтому стоит ближе к концу,
 * рядом с FAQ.
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
        <Industries />
        <Pricing />
        <Includes />
        <HowItWorks />
        <Leads />
        <PwaSection />
        <Stack />
        <Support />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <StickyActions />
    </>
  )
}
