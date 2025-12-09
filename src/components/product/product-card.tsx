import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {Badge} from '@/components/ui/badge'
import { MapPin} from 'lucide-react'
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
                // h-full 是關鍵：強制卡片高度跟隨父層 (Grid/Flex) 的高度
                'group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:border-gray-200 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)]',
                className
            )}>

            {/* 1. 圖片區域 */}
            <Link
                href={`/products/${id}`}
                className='relative block aspect-square w-full overflow-hidden bg-gray-50'>
                <Image
                    src={imageUrl || '/placeholder.png'}
                    alt={title}
                    fill
                    className='object-cover transition-transform duration-700 ease-out group-hover:scale-105'
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* 左上角：狀態標籤 */}
                <div className='absolute top-3 left-3 z-10'>
                    <Badge
                        variant="secondary"
                        className={cn(
                            'border-0 px-2.5 py-0.5 text-xs font-semibold backdrop-blur-md',
                            conditionInfo.color,
                            conditionInfo.textColor
                        )}>
                        {conditionInfo.label}
                    </Badge>
                </div>

                {/* 右上角：收藏按鈕 */}
                <div className='absolute top-3 right-3 z-10'>
                    <FavoriteButton
                        productId={id}
                        initialIsFavorited={isFavorited}
                        isLoggedIn={isLoggedIn}
                        className="h-8 w-8"
                    />
                </div>
            </Link>

            {/* 2. 內容區域：使用 flex-col 讓內部元素垂直排列 */}
            <div className='flex flex-1 flex-col p-3 sm:p-4'>

                {/* Row 1: 品牌 (左) + 地點 (右) */}
                <div className='mb-2 flex items-center justify-between'>
                    {/* 品牌：如果沒有品牌就顯示 placeholder 防止高度塌陷 (可選) */}
                    <div className='text-[12px] font-bold tracking-widest text-gray-400 uppercase truncate max-w-[60%]'>
                        {brand ? brand.replace(/_/g, ' ') : ''}
                    </div>

                    {/* 地點：移到這裡 */}
                    {location && (
                        <div className='flex flex-shrink-0 items-center gap-1 text-[12px]  text-gray-400'>
                            <MapPin className='h-3 w-3'/>
                            <span>{location}</span>
                        </div>
                    )}
                </div>

                {/* Row 2: 標題 */}
                <Link href={`/products/${id}`} className="block mb-1">
                    <h3 className='line-clamp-2 text-sm font-medium leading-relaxed text-gray-900 group-hover:text-black min-h-[2.5em]'>
                        {/* min-h-[2.5em] 是一個小技巧：強制預留兩行字的高度，這樣只有一行標題的卡片也不會變矮 */}
                        {title}
                    </h3>
                </Link>

                {/* 中間撐開空間 (Flex Spacer) */}
                {/* 這行很重要，它會佔據所有剩餘空間，把下方的價格推到底部 */}
                <div className='flex-1'/>

                {/* Row 3: 價格 (置右) */}
                <div className='flex items-end justify-end border-t border-gray-50 pt-3'>
                    <p className='font-mono text-base font-bold text-gray-900'>
                        NT$ {price.toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    )
}