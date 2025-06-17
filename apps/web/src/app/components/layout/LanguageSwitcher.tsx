'use client'

import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { languages } from '@/i18n/settings'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const router = useRouter()
  const pathname = usePathname()

  const handleSwitch = (newLocale: string) => {
    const currentLocale = pathname.split('/')[1]
    if (currentLocale === newLocale) return

    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className='flex items-center space-x-2'>
      {languages.map((lang) => (
        <button
          key={lang}
          onClick={() => handleSwitch(lang)}
          // 這裡的判斷也建議用 pathname 來做，會更即時
          disabled={pathname.split('/')[1] === lang}
          className={`rounded-md px-3 py-1 text-sm transition-colors ${
            pathname.split('/')[1] === lang
              ? 'cursor-default bg-blue-300 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}>
          {lang === 'zh' ? '繁' : 'EN'}
        </button>
      ))}
    </div>
  )
}
