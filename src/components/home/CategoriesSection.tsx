'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

const categoryDetails = [
  {
    key: 'snowboard',
    name: '單板',
    imageUrl: '/images/snowboard.png',
    href: '/browse?category=snowboard'
  },
  {
    key: 'ski',
    name: '雙板',
    imageUrl: '/images/ski.png',
    href: '/browse?category=ski'
  },
  {
    key: 'apparel',
    name: '雪衣褲',
    imageUrl: '/images/jacketW.png',
    href: '/browse?category=apparel'
  },
  {
    key: 'goggles',
    name: '雪鏡',
    imageUrl: '/images/goggles.png',
    href: '/browse?category=goggles'
  },
  {
    key: 'helmet',
    name: '安全帽',
    imageUrl: '/images/helmet.png',
    href: '/browse?category=helmet'
  },
  {
    key: 'gloves',
    name: '手套',
    imageUrl: '/images/gloves.png',
    href: '/browse?category=accessories'
  },
  {
    key: 'boots',
    name: '雪鞋',
    imageUrl: '/images/boots.png',
    href: '/browse?category=boots'
  },
  {
    key: 'lift-ticket',
    name: '纜車票',
    imageUrl: '/images/ticket.png',
    href: '/browse?category=ticker'
  },
  {
    key: 'other',
    name: '其他',
    imageUrl: '/images/other.png',
    href: '/browse?category=other'
  }
]

export function CategoriesSection() {
  return (
    <section className='bg-white py-16'>
      <div className='container mx-auto px-4 lg:px-6'>
        <h2 className='mb-10 text-center text-3xl font-bold text-gray-600'>
          探索熱門分類
        </h2>
        <div className='grid grid-cols-3 gap-4 md:flex md:flex-wrap md:justify-center md:gap-2'>
          {categoryDetails.map((category) => {
            const translatedName = category.name

            return (
              <Card
                key={category.key}
                className='group block rounded-xl border border-gray-200 p-2 text-center transition-all duration-300 hover:border-cyan-500 hover:shadow-lg md:w-32'>
                <Link href={category.href}>
                  <CardContent className='p-0'>
                    <div className='mx-auto mb-2 flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-slate-100 transition-colors group-hover:bg-blue-100'>
                      <Image
                        src={category.imageUrl}
                        alt={`${translatedName} 分類圖示`}
                        width={100}
                        height={100}
                        className='h-full w-full object-contain transition-transform duration-300 group-hover:scale-110'
                      />
                    </div>
                    <h3 className='text-sm font-semibold text-gray-800'>
                      {translatedName}
                    </h3>
                  </CardContent>
                </Link>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
