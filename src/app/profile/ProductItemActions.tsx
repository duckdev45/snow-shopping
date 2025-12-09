'use client'

import {useState, useTransition} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {Loader2, Trash2, Edit, MoreHorizontal} from 'lucide-react'
import {toast} from 'sonner'

import {Button} from '@/components/ui/button'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {deactivateProductAction} from '@/app/sell/actions'

interface ProductItemActionsProps {
    productId: string
}

export function ProductItemActions({productId}: ProductItemActionsProps) {
    const [openAlert, setOpenAlert] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDeactivate = async () => {
        startTransition(async () => {
            const result = await deactivateProductAction(productId)

            if (result.success) {
                setOpenAlert(false)
                toast.success('商品已下架', {
                    description: '該商品已從公開賣場移除'
                })
                router.refresh()
            } else {
                toast.error('下架失敗', {
                    description: result.error
                })
            }
        })
    }

    return (
        <>
            {/* 1. 電腦版 (lg:flex)：懸浮遮罩 + 按鈕
           - 只有在 lg 以上螢幕顯示
      */}
            <div
                className='hidden lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center lg:gap-2 lg:rounded-xl lg:bg-black/60 lg:opacity-0 lg:transition-opacity lg:group-hover:opacity-100'>
                <Button variant='secondary' size='sm' asChild>
                    <Link href={`/sell?edit=${productId}`}>
                        <Edit className='mr-1 h-3 w-3'/>
                        編輯
                    </Link>
                </Button>
                <Button
                    variant='destructive'
                    size='sm'
                    onClick={() => setOpenAlert(true)}
                >
                    <Trash2 className='mr-1 h-3 w-3'/>
                    下架
                </Button>
            </div>

            {/* 2. 手機版 (lg:hidden)：三點選單按鈕
           - 放在卡片右上角
           - 為了不被 Link 蓋住，需要加 z-index 和 relative
      */}
            <div className='absolute top-2 right-2 z-10 lg:hidden'>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur-sm"
                        >
                            <MoreHorizontal className="h-5 w-5"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/sell?edit=${productId}`} className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4"/>
                                編輯商品
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 cursor-pointer"
                            onClick={() => setOpenAlert(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4"/>
                            下架商品
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* 共用的確認對話框 (Alert Dialog) */}
            <AlertDialog open={openAlert} onOpenChange={setOpenAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>確定要下架此商品嗎？</AlertDialogTitle>
                        <AlertDialogDescription>
                            下架後商品將不會顯示在「瀏覽頁面」，但你仍可在這裡看到它。<br/>
                            如果商品已售出，建議直接更新狀態。
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isPending}>再想想</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDeactivate()
                            }}
                            className='bg-red-600 hover:bg-red-700'
                            disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                                    處理中
                                </>
                            ) : (
                                '確認下架'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}