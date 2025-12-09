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
import {cn} from '@/lib/utils'

interface ProductGalleryProps {
    images: string[]
}

export function ProductGallery({images}: ProductGalleryProps) {
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
            <Carousel setApi={setApi} className='w-full h-full'>
                <CarouselContent>
                    {displayImages.map((src, index) => (
                        <CarouselItem key={index}>
                            <div className='relative aspect-[3/4] w-full overflow-hidden rounded-xl border bg-gray-100'>
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
                        <CarouselPrevious
                            className='left-4 h-10 w-10 border-none bg-white/80 backdrop-blur-sm hover:bg-white'/>
                        <CarouselNext
                            className='right-4 h-10 w-10 border-none bg-white/80 backdrop-blur-sm hover:bg-white'/>
                    </>
                )}
            </Carousel>

            {/* 下方縮圖列 (如果需要在長圖模式下隱藏，可以加 hidden lg:flex) */}
            {/* 目前建議手機版長圖模式下，縮圖列可能會蓋到圖片或佔空間，
          如果覺得擠，可以在這裡加上 className='hidden lg:flex ...' 只在電腦版顯示縮圖 */}
            {displayImages.length > 1 && (
                <div
                    className='absolute bottom-4 left-0 right-0 flex justify-center gap-2 lg:static lg:justify-start lg:pb-2'>
                    {/* 手機版改用小圓點 (Dots) 指示器，比較不佔空間 */}
                    <div className="flex gap-2 lg:hidden">
                        {displayImages.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "h-2 w-2 rounded-full transition-all shadow-sm",
                                    current === index ? "bg-white w-4" : "bg-white/50"
                                )}
                            />
                        ))}
                    </div>

                    {/* 電腦版維持縮圖 */}
                    <div className="hidden gap-2 overflow-x-auto lg:flex">
                        {displayImages.map((src, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={cn(
                                    'relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-all',
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
                </div>
            )}
        </div>
    )
}
