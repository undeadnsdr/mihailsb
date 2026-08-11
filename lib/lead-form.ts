'use client'

import { useState } from 'react'
import { finalCta, site } from '@/lib/content'
import { reachGoal, getUtmSuffix } from '@/lib/analytics'

/**
 * Логика финальной формы заявки. Как и у обратного звонка, бэкенда нет:
 * сообщение уходит через deep-link Телеграма с параметром text.
 *
 * Отличие от формы звонка — поле «что нужно сделать»: на замер выезжают
 * по конкретной задаче, и строка «дом 8×10, нужна кровля» экономит
 * созвон-уточнение, который иначе идёт до выезда.
 *
 * Направление работ можно предзадать (defaultService) — тогда форма,
 * открытая из блока конкретной услуги, приходит уже заполненной.
 */
export function useTelegramLeadForm(place: string, defaultService = '') {
  const [service, setService] = useState(defaultService)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const message = [
      finalCta.messageIntro + getUtmSuffix() + '.',
      service ? `Направление: ${service}.` : '',
      name ? `Меня зовут ${name}.` : '',
      phone ? `Телефон: ${phone}.` : '',
      comment ? `Задача: ${comment}` : '',
    ]
      .filter(Boolean)
      .join(' ')

    reachGoal('form_submit', { service: service || 'не выбрано', place })
    window.open(`${site.telegramUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return {
    service,
    setService,
    name,
    setName,
    phone,
    setPhone,
    comment,
    setComment,
    sent,
    handleSubmit,
  }
}
