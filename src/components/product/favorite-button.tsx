'use client'

import {useState, useTransition} from 'react'
import {Heart} from 'lucide-react'
import {Button} from '@/components/ui/button'
import {cn} from '@/lib/utils'
import {toggleFavoriteAction} from '@/app/actions/favorite'
import {useRouter} from 'next/navigation'
import {toast} from 'sonner'
import {LoginModal} from '@/components/auth/login-modal'

interface FavoriteButtonProps {
    productId: string
    initialIsFavorited: boolean
    className?: string
    isLoggedIn?: boolean // 傳入是否登入，用來判斷跳轉
}

export function FavoriteButton({
                                   productId,
                                   initialIsFavorited,
                                   className,
                                   isLoggedIn = false
                               }: FavoriteButtonProps) {
    const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleToggle = async (e: React.MouseEvent) => {
        e.preventDefault() // 防止點到卡片連結
        e.stopPropagation()

        if (!isLoggedIn) {
            toast.error('請先登入才能收藏喔！')
            setIsLoginModalOpen(true)
            return
        }

        // Optimistic Update: 先變色給使用者看
        const newState = !isFavorited
        setIsFavorited(newState)

        startTransition(async () => {
            const result = await toggleFavoriteAction(productId)
            if (!result.success) {
                // 如果失敗，再切換回來
                setIsFavorited(!newState)
                toast.error('操作失敗，請稍後再試')
            } else {
                toast.success(newState ? '已加入收藏' : '已取消收藏')
            }
            router.refresh() // 確保資料同步
        })
    }

    return (
        <>
            <Button
                size='icon'
                variant='ghost'
                onClick={handleToggle}
                disabled={isPending}
                className={cn(
                    'rounded-full bg-white/70 backdrop-blur-sm transition-all hover:scale-110 active:scale-95',
                    isFavorited ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500 hover:bg-white',
                    className
                )}
            >
                <Heart className={cn('h-5 w-5', isFavorited && 'fill-current')}/>
            </Button>
            <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}/>
        </>
    )
}