'use client'

import { useState } from 'react'
import { callbackModal, site } from '@/lib/content'
import { reachGoal, getUtmSuffix } from '@/lib/analytics'

const OTHER_OPTION = callbackModal.industryOptions[callbackModal.industryOptions.length - 1]

/**
 * Логика формы обратного звонка — общая для модалки, которая вызывается
 * и из верхней полоски, и из первого экрана.
 *
 * В отличие от Авито (там нельзя предзаполнить сообщение, только скопировать
 * текст в буфер и надеяться, что человек его вставит), Телеграм поддерживает
 * параметр text в ссылке на диалог — сообщение реально появляется в поле
 * ввода готовым, отправить его — одно нажатие.
 */
export function useCallbackForm(place: string) {
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [industryOther, setIndustryOther] = useState('')
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)

  const isOther = industry === OTHER_OPTION

  function reset() {
    setName('')
    setIndustry('')
    setIndustryOther('')
    setPhone('')
    setSent(false)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const industryText = isOther ? industryOther.trim() || OTHER_OPTION : industry

    const message = [
      callbackModal.messageIntro + getUtmSuffix() + '.',
      name ? `Меня зовут ${name}.` : '',
      industryText ? `Ниша: ${industryText}.` : '',
      phone ? `Телефон: ${phone}.` : '',
    ]
      .filter(Boolean)
      .join(' ')

    reachGoal('form_submit', { industry: industryText || 'не выбрана', place })
    window.open(`${site.telegramUrl}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')

    setSent(true)
  }

  return {
    name,
    setName,
    industry,
    setIndustry,
    industryOther,
    setIndustryOther,
    phone,
    setPhone,
    isOther,
    sent,
    handleSubmit,
    reset,
  }
}
