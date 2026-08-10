'use client'

import { useState } from 'react'
import { avitoMessage, site } from '@/lib/content'
import { reachGoal, getUtmSuffix } from '@/lib/analytics'

/**
 * Общая логика заявки на Авито — используется и в финальной форме,
 * и в мини-форме первого экрана. Без бэкенда: у сайта нет базы и почты,
 * поэтому готовое сообщение копируется в буфер и открывается переписка
 * на Авито, где остаются все заявки, отзывы и рейтинг в одном месте.
 */
export function useAvitoLeadForm(place: string) {
  const [industry, setIndustry] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [copied, setCopied] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // UTM попадает в текст сообщения — только так видно, из какого
    // объявления пришёл человек: Авито не передаёт рефереры в переписку
    const message = [
      avitoMessage + getUtmSuffix() + '.',
      industry ? `Сфера: ${industry}.` : '',
      name ? `Меня зовут ${name}.` : '',
      contact ? `Связь: ${contact}.` : '',
    ]
      .filter(Boolean)
      .join(' ')

    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
    } catch {
      // Буфер недоступен (старый Safari, отказ в разрешении) — не блокируем переход
      setCopied(false)
    }

    reachGoal('form_submit', { industry: industry || 'не выбрана', place })
    window.open(site.avitoUrl, '_blank', 'noopener,noreferrer')
  }

  return { industry, setIndustry, name, setName, contact, setContact, copied, handleSubmit }
}
