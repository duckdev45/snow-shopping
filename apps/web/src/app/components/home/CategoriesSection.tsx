'use client' // 標記為 Client Component

import Link from 'next/link'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import i18next from 'i18next'
import HttpBackend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next/initReactI18next'
import { getOptions } from '@/i18n/settings'

// 初始化 i18next for client side
i18next
  .use(initReactI18next)
  .use(HttpBackend)
  .init({
    ...getOptions(),
    lng: undefined, // 會讓 i18next 自動偵測語系
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  })

const categoryDetails = [
  {
    key: 'snowboard',
    imageUrl: '/images/snowboard.png',
    href: '/browse?category=snowboard'
  },
  {
    key: 'ski',
    imageUrl: '/images/ski.png',
    href: '/browse?category=ski'
  },
  {
    key: 'apparel',
    imageUrl: '/images/jacketW.png',
    href: '/browse?category=apparel'
  },
  {
    key: 'goggles',
    imageUrl: '/images/goggles.png',
    href: '/browse?category=goggles'
  },
  {
    key: 'helmet',
    imageUrl: '/images/helmet.png',
    href: '/browse?category=helmet'
  },
  {
    key: 'gloves',
    imageUrl: '/images/gloves.png',
    href: '/browse?category=accessories'
  },
  {
    key: 'boots',
    imageUrl: '/images/boots.png',
    href: '/browse?category=boots'
  },
  {
    key: 'lift-ticket',
    imageUrl: '/images/ticket.png',
    href: '/browse?category=ticker'
  },
  {
    key: 'other',
    imageUrl: '/images/other.png',
    href: '/browse?category=other'
  }
]

export function CategoriesSection() {
  const { t, i18n } = useTranslation()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // 在 i18n 初始化完成前，先顯示 Loading，避免畫面閃爍
  if (!isClient || !i18n.isInitialized) {
    return (
      <section className='bg-white py-16'>
        <div className='container mx-auto px-4 lg:px-6'>
          <h2 className='mb-10 text-center text-3xl font-bold text-gray-600'>探索熱門分類</h2>
          <div className="h-40 text-center">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section className='bg-white py-16'>
      <div className='container mx-auto px-4 lg:px-6'>
        <h2 className='mb-10 text-center text-3xl font-bold text-gray-600'>
          {t('CategoriesSection.title', '探索熱門分類')}
        </h2>
        <div className='grid grid-cols-3 gap-4 md:grid-cols-5 md:gap-6 lg:grid-cols-9'>
          {categoryDetails.map((category) => {
            // 從 i18n 取得翻譯後的分類名稱
            const translatedName = t(`CategoriesSection.categories.${category.key}`)

            return (
              <Link
                key={category.key}
                href={category.href}
                className='group block rounded-xl border border-gray-200 p-4 text-center transition-all duration-300 hover:border-blue-500 hover:shadow-lg'>
                <div
                  className='mx-auto mb-4 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 transition-colors group-hover:bg-blue-100'>
                  <Image
                    src={category.imageUrl}
                    alt={`${translatedName} 分類圖示`}
                    width={100}
                    height={100}
                    className='object-contain transition-transform duration-300 group-hover:scale-110' // 加個帥氣的放大效果
                  />
                </div>
                <h3 className='font-semibold text-gray-800'>{translatedName}</h3>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}