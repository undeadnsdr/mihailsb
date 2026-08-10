'use client'

import { useState } from 'react'
import { avitoMessage, site } from '@/lib/content'
import { reachGoal, getUtmSuffix } from '@/lib/analytics'

/**
 * Логика финальной формы заявки — без бэкенда: у сайта нет базы и почты,
 * поэтому сообщение уходит через deep-link Телеграма с параметром text —
 * в отличие от Авито, который не умеет предзаполнять переписку, у
 * Телеграма текст появляется в поле ввода готовым, остаётся только нажать
 * «Отправить» уже в самом мессенджере.
 */
export function useTelegramLeadForm(place: string) {
  const [industry, setIndustry] = useState('')
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // UTM попадает в текст сообщения — только так видно, из какого
    // объявления пришёл человек: Телеграм не передаёт рефереры в переписку
    const message = [
      avitoMessage + getUtmSuffix() + '.',
      industry ? `Сфера: ${industry}.` : '',
      name ? `Меня зовут ${name}.` : '',
      contact ? `Связь: ${contact}.` : '',
    ]
      .filter(Boolean)
      .join(' ')

    reachGoal('form_submit', { industry: industry || 'не выбрана', place })
    window.open(`${site.telegramUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return { industry, setIndustry, name, setName, contact, setContact, sent, handleSubmit }
}
