'use client'

import { useState } from 'react'
import { callbackModal, site } from '@/lib/content'
import { reachGoal, getUtmSuffix } from '@/lib/analytics'

const OTHER_OPTION = callbackModal.serviceOptions[callbackModal.serviceOptions.length - 1]

/**
 * Логика формы обратного звонка — общая для модалки, которую вызывают
 * и из верхней полоски, и с первого экрана.
 *
 * Бэкенда у сайта нет, поэтому заявка уходит через deep-link Телеграма
 * с параметром text: сообщение появляется в поле ввода уже готовым,
 * отправить его — одно нажатие. Пустых заявок «позвоните мне» без
 * контакта при этом не бывает: телефон и имя уходят в том же тексте.
 */
export function useCallbackForm(place: string) {
  const [name, setName] = useState('')
  const [service, setService] = useState('')
  const [serviceOther, setServiceOther] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  const isOther = service === OTHER_OPTION

  function reset() {
    setName('')
    setService('')
    setServiceOther('')
    setPhone('')
    setSent(false)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const serviceText = isOther ? serviceOther.trim() || OTHER_OPTION : service

    // UTM подставляется в текст сообщения: Телеграм не передаёт реферер
    // в переписку, и без этого не узнать, из какого объявления пришёл человек
    const message = [
      callbackModal.messageIntro + getUtmSuffix() + '.',
      name ? `Меня зовут ${name}.` : '',
      serviceText ? `Направление: ${serviceText}.` : '',
      phone ? `Телефон: ${phone}.` : '',
    ]
      .filter(Boolean)
      .join(' ')

    reachGoal('form_submit', { service: serviceText || 'не выбрано', place })
    window.open(`${site.telegramUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')

    setSent(true)
  }

  return {
    name,
    setName,
    service,
    setService,
    serviceOther,
    setServiceOther,
    phone,
    setPhone,
    isOther,
    sent,
    handleSubmit,
    reset,
  }
}
