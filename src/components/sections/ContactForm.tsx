'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export function ContactForm() {
  const t = useTranslations('contact.form')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = {
      type: (form.elements.namedItem('type') as HTMLSelectElement).value,
      firstName: (form.elements.namedItem('firstName') as HTMLInputElement).value,
      lastName: (form.elements.namedItem('lastName') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      company: (form.elements.namedItem('company') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        setStatus('error')
        setErrorMsg(json.error ?? t('error_generic'))
        return
      }

      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMsg(t('error_generic'))
    }
  }

  if (status === 'success') {
    return (
      <div
        className="rounded-2xl p-10 text-center"
        style={{ background: '#0d0d14', border: '1px solid rgba(48,209,88,0.2)' }}
      >
        <div
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: 'rgba(48,209,88,0.1)' }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="#30D158" strokeWidth={2} className="h-6 w-6">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-content-primary">{t('success_title')}</h3>
        <p className="mt-2 text-sm text-content-secondary">{t('success_body')}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl p-8"
      style={{ background: '#0d0d14', border: '1px solid rgba(255,255,255,0.06)' }}
      noValidate
    >
      {/* Type */}
      <div>
        <label htmlFor="type" className="label">{t('type_label')}</label>
        <select
          id="type"
          name="type"
          defaultValue="info"
          className="input"
          style={{ cursor: 'pointer' }}
        >
          <option value="quote">{t('type_quote')}</option>
          <option value="info">{t('type_info')}</option>
          <option value="partnership">{t('type_partnership')}</option>
          <option value="support">{t('type_support')}</option>
        </select>
      </div>

      {/* Prénom + Nom */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="label">{t('firstName')} *</label>
          <input id="firstName" name="firstName" type="text" required className="input" placeholder="Jean" />
        </div>
        <div>
          <label htmlFor="lastName" className="label">{t('lastName')} *</label>
          <input id="lastName" name="lastName" type="text" required className="input" placeholder="Dupont" />
        </div>
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="label">{t('email')} *</label>
        <input id="email" name="email" type="email" required className="input" placeholder="jean.dupont@entreprise.com" />
      </div>

      {/* Entreprise */}
      <div>
        <label htmlFor="company" className="label">{t('company')}</label>
        <input id="company" name="company" type="text" className="input" placeholder="Stellantis, Bosch..." />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="label">{t('message')} *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="input resize-none"
          placeholder={t('message_placeholder')}
        />
      </div>

      {/* Erreur */}
      {status === 'error' && (
        <p className="rounded-lg px-4 py-3 text-sm text-error" style={{ background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.2)' }}>
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
