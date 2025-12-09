import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {Badge} from '@/components/ui/badge'
import {MapPin} from 'lucide-react'
import {cn} from '@/lib/utils'
import {FavoriteButton} from "@/components/product/favorite-button";

interface ProductCardProps {
    id: string
    title: string
    price: number
    imageUrl: string
    category: string
    condition: string
    brand?: string
    sellerName?: string
    sellerAvatar?: string
    location?: string
    className?: string
    isFavorited?: boolean
    isLoggedIn?: boolean
}

const CONDITION_MAP: Record<string, { label: string; color: string; textColor: string }> = {
    brand_new: {label: '全新', color: 'bg-emerald-500', textColor: 'text-white'},
    like_new: {label: '九成新', color: 'bg-blue-500', textColor: 'text-white'},
    used: {label: '良品', color: 'bg-amber-500', textColor: 'text-white'},
    for_parts: {label: '戰損', color: 'bg-gray-500', textColor: 'text-white'}
}

export function ProductCard({
                                id,
                                title,
                                price,
                                imageUrl,
                                condition,
                                brand,
                                location,
                                isFavorited = false,
                                isLoggedIn = false,
                                className
                            }: ProductCardProps) {
    const conditionInfo = CONDITION_MAP[condition] || {
        label: '二手',
        color: 'bg-gray-100',
        textColor: 'text-gray-600'
    }

    return (
        <div
            className={cn(
                'group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
                className
            )}>
            <div className='relative'>
                {/* 1. 圖片區域 */}
                <Link
                    href={`/products/${id}`}
                    className='relative block aspect-square w-full overflow-hidden bg-gray-50'>
                    <Image
                        src={imageUrl || '/placeholder.png'}
                        alt={title}
                        fill
                        className='object-cover transition-transform duration-700 ease-out group-hover:scale-105'
                        sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
                        /* ✨ 修改 sizes: 告訴瀏覽器手機版這張圖只佔 50vw (一半寬度)，優化效能 */
                    />

                    {/* 左上角：狀態標籤 (縮小字體與內距) */}
                    <div className='absolute top-2 left-2 z-10'>
                        <Badge
                            variant='secondary'
                            className={cn(
                                'border-0 px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-sm',
                                conditionInfo.color,
                                conditionInfo.textColor
                            )}>
                            {conditionInfo.label}
                        </Badge>
                    </div>
                </Link>
                {/* 右上角：收藏按鈕 (稍微縮小) - 移到 Link 外層 */}
                <div className='absolute top-2 right-2 z-20'>
                    <FavoriteButton
                        productId={id}
                        initialIsFavorited={isFavorited}
                        isLoggedIn={isLoggedIn}
                        className='h-7 w-7 sm:h-8 sm:w-8' // 手機版稍微小一點
                    />
                </div>
            </div>

            {/* 2. 內容區域：縮減內距 p-2.5 */}
            <div className='flex flex-1 flex-col p-2.5 sm:p-4'>

                {/* Row 1: 品牌 (左) + 地點 (右) */}
                <div className='mb-1.5 flex items-center justify-between'>
                    <div
                        className='text-[10px] sm:text-[12px] font-bold tracking-widest text-gray-400 uppercase truncate max-w-[60%]'>
                        {brand ? brand.replace(/_/g, ' ') : ''}
                    </div>

                    {location && (
                        <div
                            className='flex flex-shrink-0 items-center gap-0.5 text-[10px] sm:text-[12px] text-gray-400'>
                            <MapPin className='h-3 w-3'/>
                            <span>{location}</span>
                        </div>
                    )}
                </div>

                {/* Row 2: 標題 (調整字級) */}
                <Link href={`/products/${id}`} className="block mb-1">
                    <h3 className='line-clamp-2 text-sm font-medium leading-snug text-gray-900 group-hover:text-black min-h-[2.5em]'>
                        {title}
                    </h3>
                </Link>

                <div className='flex-1'/>

                {/* Row 3: 價格 (調整字級) */}
                <div className='flex items-end justify-end border-t border-gray-50 pt-2 sm:pt-3'>
                    <p className='font-mono text-sm sm:text-base font-bold text-gray-900'>
                        NT$ {price.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    )
}