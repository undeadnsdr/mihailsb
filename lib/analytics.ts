/**
 * Цели Яндекс.Метрики и UTM.
 *
 * Цели навешиваются через data-goal, а не через классы: классы поменяются
 * при редизайне, data-атрибуты — нет.
 *
 * ID счётчика подставить в NEXT_PUBLIC_YM_ID. Пока переменной нет —
 * скрипт Метрики просто не грузится, ошибок не возникает.
 */

export const YM_ID = process.env.NEXT_PUBLIC_YM_ID

export type Goal =
  | 'click_avito'
  | 'click_phone'
  | 'click_callback'
  | 'form_submit'
  | 'scroll_75'
  | 'view_pricing'
  | 'pwa_install'

declare global {
  interface Window {
    ym?: (id: string | number, action: string, ...args: unknown[]) => void
  }
}

export function reachGoal(goal: Goal, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || !YM_ID || typeof window.ym !== 'function') return
  window.ym(YM_ID, 'reachGoal', goal, params)
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
const STORAGE_KEY = 'utm'

/** Запоминает метки один раз за сессию — иначе не узнать, из какого канала пришёл лид */
export function captureUtm() {
  if (typeof window === 'undefined') return
  try {
    const params = new URLSearchParams(window.location.search)
    const found: Record<string, string> = {}
    for (const key of UTM_KEYS) {
      const value = params.get(key)
      if (value) found[key] = value
    }
    if (Object.keys(found).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(found))
    }
  } catch {
    // приватный режим — молча пропускаем
  }
}

export function getUtmSuffix(): string {
  if (typeof window === 'undefined') return ''
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return ''
    const parsed = JSON.parse(raw) as Record<string, string>
    const source = parsed.utm_source ?? parsed.utm_campaign
    return source ? ` (${source})` : ''
  } catch {
    return ''
  }
}
