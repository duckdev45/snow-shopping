'use client'

import {useState, useTransition} from 'react'
import {Heart} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {toggleFavoriteAction} from '@/app/actions/favorite'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'

interface ProductDetailFavoriteButtonProps {
    productId: string
    initialIsFavorited: boolean
    isLoggedIn: boolean
}

export function ProductDetailFavoriteButton({
                                                productId,
                                                initialIsFavorited,
                                                isLoggedIn
                                            }: ProductDetailFavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleToggle = async () => {
        if (!isLoggedIn) {
            toast.error('請先登入才能收藏喔！')
            router.push('/login')
            return
        }

        // 樂觀更新 (Optimistic Update)
        const newState = !isFavorited
        setIsFavorited(newState)

        startTransition(async () => {
            // 呼叫 Server Action，並指定成功後更新當前路徑的快取
            const result = await toggleFavoriteAction(productId, `/products/${productId}`)

            if (!result.success) {
                setIsFavorited(!newState) // 失敗就切回來
                toast.error('操作失敗，請稍後再試')
            } else {
                toast.success(newState ? '已加入收藏 ❤️' : '已移除收藏 💔')
            }
            router.refresh()
        })
    }

    return (
        <Button
            variant='outline'
            size='lg'
            onClick={handleToggle}
            disabled={isPending}
            className={cn(
                'flex-1 gap-2 transition-all duration-300 lg:flex-none',
                isFavorited
                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600'
                    : 'border-gray-300 hover:border-red-200 hover:text-red-500'
            )}
        >
            <Heart className={cn('h-5 w-5', isFavorited && 'fill-current')}/>
            <span className='hidden sm:inline'>
        {isFavorited ? '已收藏' : '收藏'}
      </span>
        </Button>
    )
}