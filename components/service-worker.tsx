'use client'

import { useEffect } from 'react'

/**
 * Регистрация service worker.
 *
 * Только в production: в dev-режиме кэш SW перехватывает HMR и правки
 * перестают появляться в браузере. Регистрируется после load, чтобы не
 * соревноваться за поток с отрисовкой первого экрана.
 */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return
    if (!('serviceWorker' in navigator)) return

    const register = () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Отказ в регистрации (приватный режим, http) не должен ломать страницу
      })
    }

    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register, { once: true })

    return () => window.removeEventListener('load', register)
  }, [])

  return null
}
