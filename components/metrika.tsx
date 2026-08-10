'use client'

import Script from 'next/script'
import { useEffect, useRef } from 'react'
import { YM_ID, captureUtm, reachGoal } from '@/lib/analytics'

/**
 * Яндекс.Метрика + автоцели.
 *
 * Скрипт грузится через next/script со стратегией afterInteractive —
 * он не участвует в LCP и не задерживает первый экран.
 * Без NEXT_PUBLIC_YM_ID не грузится вовсе: на страницу не должен попадать
 * счётчик с чужим id, а разработка не должна портить статистику.
 */
export function Metrika() {
  const fired = useRef({ scroll75: false, pricing: false })

  useEffect(() => {
    captureUtm()
  }, [])

  // Автоцель «дочитал до 75%»
  useEffect(() => {
    const onScroll = () => {
      if (fired.current.scroll75) return
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      if (scrollable > 0 && window.scrollY / scrollable >= 0.75) {
        fired.current.scroll75 = true
        reachGoal('scroll_75')
        window.removeEventListener('scroll', onScroll)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Автоцель «доскроллил до цен» — самый показательный сигнал интереса
  useEffect(() => {
    const target = document.getElementById('pricing')
    if (!target) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired.current.pricing) {
            fired.current.pricing = true
            reachGoal('view_pricing')
            observer.disconnect()
          }
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  if (!YM_ID) return null

  return (
    <>
      <Script id="ym-init" strategy="afterInteractive">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
m[i].l=1*new Date();
for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
ym(${JSON.stringify(YM_ID)}, "init", {clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});`}
      </Script>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YM_ID}`}
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  )
}
