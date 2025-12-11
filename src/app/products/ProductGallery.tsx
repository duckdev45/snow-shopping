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
    status?: string
}

export function ProductGallery({images, status}: ProductGalleryProps) {
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
        <div className='flex w-full flex-col gap-4'>
            {/* 主圖區域 (包含遮罩) */}
            <div className='relative w-full overflow-hidden rounded-2xl border border-gray-100 '>

                {/* 狀態遮罩組合包：緞帶 + 輕微變暗 */}
                {status !== 'active' && (
                    <>
                        {/* 全圖遮罩：變暗 */}
                        <div className="absolute inset-0 z-10 bg-black/20"/>

                        {/* 左上角緞帶 */}
                        <div className="absolute top-0 left-0 z-20 h-24 w-24 overflow-hidden rounded-tl-2xl">
                            <div
                                className="absolute top-3 -left-10 w-40 -rotate-45 bg-red-600 py-1.5 text-center shadow-sm">
                            <span
                                className="text-[10px] font-extrabold tracking-[0.15em] text-white uppercase drop-shadow-sm">
                                {status === 'sold' ? 'SOLD OUT' : '已下架'}
                            </span>
                            </div>
                        </div>
                    </>
                )}

                <Carousel setApi={setApi} className='w-full'>
                    <CarouselContent>
                        {displayImages.map((src, index) => (
                            <CarouselItem key={index}>
                                {/* 這裡設定圖片比例：
                                   手機版維持 3:4 (比較好滑)
                                   電腦版改成 1:1 (aspect-square) 或是維持 3:4 也可以，這裡設為 1:1 比較大器
                                */}
                                <div className='relative aspect-[3/4] w-full bg-gray-100 lg:aspect-square'>
                                    <Image
                                        src={src}
                                        alt={`Product image ${index + 1}`}
                                        fill
                                        className='object-contain'
                                        priority={index === 0}
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/* 導航箭頭 */}
                    {displayImages.length > 1 && (
                        <>
                            <CarouselPrevious
                                className='left-4 z-12 h-10 w-10 border-none bg-white/80 backdrop-blur-sm hover:bg-white'/>
                            <CarouselNext
                                className='right-4 z-12 h-10 w-10 border-none bg-white/80 backdrop-blur-sm hover:bg-white'/>
                        </>
                    )}
                </Carousel>
            </div>

            {/* 下方縮圖列 */}
            {displayImages.length > 1 && (
                <div className='w-full'>
                    {/* 手機版：圓點指示器 */}
                    <div className="flex justify-center gap-2 py-2 lg:hidden">
                        {displayImages.map((_, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "h-1.5 rounded-full transition-all duration-300",
                                    current === index ? "bg-black w-4" : "bg-gray-300 w-1.5"
                                )}
                            />
                        ))}
                    </div>

                    {/* 電腦版：縮圖列表 */}
                    <div className="hidden flex-wrap gap-3 lg:flex">
                        {displayImages.map((src, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={cn(
                                    'relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border transition-all',
                                    current === index
                                        ? 'border-gray-500 ring-2 ring-black/10'
                                        : 'border-transparent opacity-60 hover:opacity-100'
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
