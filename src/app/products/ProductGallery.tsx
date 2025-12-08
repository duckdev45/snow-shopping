'use client'

import * as React from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProductGalleryProps {
  images: string[]
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) {
      return
    }

    // 監聽目前輪播到哪一張
    api.on('select', () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // 如果沒有圖片，給張預設圖
  const displayImages = images.length > 0 ? images : ['/placeholder.png']

  return (
    <div className='flex flex-col gap-4'>
      {/* 主大圖 */}
      <Carousel setApi={setApi} className='w-full'>
        <CarouselContent>
          {displayImages.map((src, index) => (
            <CarouselItem key={index}>
              <div className='relative aspect-square w-full overflow-hidden rounded-xl border bg-gray-100'>
                <Image
                  src={src}
                  alt={`Product image ${index + 1}`}
                  fill
                  className='object-cover'
                  priority={index === 0} // 第一張優先載入
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* 只有多張圖時才顯示箭頭 */}
        {displayImages.length > 1 && (
          <>
            <CarouselPrevious className='left-4' />
            <CarouselNext className='right-4' />
          </>
        )}
      </Carousel>

      {/* 下方縮圖列 */}
      {displayImages.length > 1 && (
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {displayImages.map((src, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={cn(
                'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all',
                current === index
                  ? 'border-blue-600 ring-2 ring-blue-100'
                  : 'border-transparent opacity-70 hover:opacity-100'
              )}>
              <Image
                src={src}
                alt={`Thumbnail ${index + 1}`}
                fill
                className='object-cover'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
