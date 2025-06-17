import './globals.css'
import type { Metadata } from 'next'
import { SiteHeader } from '@/app/components/layout/SiteHeader'
import { SiteFooter } from '@/app/components/layout/SiteFooter'
import React from 'react'

export const metadata: Metadata = {
  title: '雪拼 SnowShop',
  description: '斷捨離你的雪季回憶，為裝備找到下一段旅程。'
}

export default async function LocaleLayout({
                                             children,
                                             params: { locale }
                                           }: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <html lang={locale}>
    <body>
    <SiteHeader />
    <main>{children}</main>
    <SiteFooter />
    </body>
    </html>
  )
}