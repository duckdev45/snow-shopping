import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import {Badge} from '@/components/ui/badge'
import {Button} from '@/components/ui/button'
import {Heart} from 'lucide-react'
import {cn} from '@/lib/utils'
import {MapPin} from 'lucide-react'

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
}

const CONDITION_MAP: Record<string, { label: string; color: string }> = {
    brand_new: {label: '全新', color: 'bg-green-500'},
    like_new: {label: '九成新', color: 'bg-blue-500'},
    used: {label: '二手良品', color: 'bg-yellow-500'},
    for_parts: {label: '零件機', color: 'bg-gray-500'}
}

export function ProductCard({
                                id,
                                title,
                                price,
                                imageUrl,
                                category,
                                condition,
                                brand,
                                location
                            }: ProductCardProps) {
    const conditionInfo = CONDITION_MAP[condition] || {
        label: '二手',
        color: 'bg-gray-500'
    }

    return (
        <div
            className='group relative flex flex-col h-full overflow-hidden rounded-xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg'>
            {/* 1. 圖片區域 */}
            <Link
                href={`/products/${id}`}
                className='relative block aspect-[4/3] w-full overflow-hidden bg-gray-100'>
                <div className='h-full w-full'>
                    <Image
                        src={imageUrl || '/placeholder.png'}
                        alt={title}
                        fill
                        className='object-cover transition-transform duration-500 group-hover:scale-110'
                    />

                    {/* 狀態標籤 */}
                    <div className='absolute top-2 left-2 z-10'>
                        <Badge
                            className={cn(
                                'hover:bg-opacity-100 text-white shadow-md',
                                conditionInfo.color
                            )}>
                            {conditionInfo.label}
                        </Badge>
                    </div>

                    {/* 收藏按鈕 */}
                    <div className='absolute top-2 right-2 z-10 opacity-0 transition-opacity group-hover:opacity-100'>
                        <Button
                            size='icon'
                            variant='secondary'
                            className='h-8 w-8 rounded-full bg-white/80 shadow-sm backdrop-blur-sm hover:bg-white hover:text-red-500'>
                            <Heart className='h-4 w-4'/>
                        </Button>
                    </div>
                </div>
            </Link>

            {/* 4. 內容區域 */}
            <div className='flex flex-1 flex-col p-4'>
                <div className='flex-1'>
                    {/*<p className='mb-1 text-xs font-medium tracking-wider text-gray-500 uppercase'>*/}
                    {/*    {category}*/}
                    {/*</p>*/}

                    {/* 地點顯示 (靠右對齊) */}
                    {location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3"/>
                            <span>{location}</span>
                        </div>
                    )}

                    {/* 標題連結 */}
                    <Link href={`/products/${id}`}>
                        <h3 className='line-clamp-2 text-base font-semibold text-gray-900 transition-colors group-hover:text-blue-600'>
                            {title}
                        </h3>
                    </Link>
                </div>

                <div className='mt-4 flex items-end justify-between'>
                    <div className='flex flex-col gap-0.5'> {/* 用 flex-col 包起來 */}
                        {/* 顯示品牌，如果沒有填就顯示 '--' 或隱藏 */}
                        {brand && (
                            <span className='text-xs font-semibold text-gray-500 uppercase tracking-wide'>
                 {brand.replace(/_/g, ' ')} {/* 簡單把底線換空白 */}
               </span>
                        )}
                        <p className='font-mono text-lg font-bold text-blue-700'>
                            NT$ {price.toLocaleString()}
                        </p>
                    </div>

                    <span className='text-xs text-gray-400 mb-1'>查看詳情</span>
                </div>
            </div>
        </div>
    )
}
