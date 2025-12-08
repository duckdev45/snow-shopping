'use client'

import {useState, useTransition} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {Loader2, Trash2, Edit} from 'lucide-react'
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
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import {deactivateProductAction} from '@/app/sell/actions'

interface ProductItemActionsProps {
    productId: string
}

export function ProductItemActions({productId}: ProductItemActionsProps) {
    const [open, setOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const handleDeactivate = async () => {
        startTransition(async () => {
            const result = await deactivateProductAction(productId)

            if (result.success) {
                setOpen(false)
                toast.success('商品已下架', {
                    description: '該商品已從公開賣場移除'
                })
                router.refresh() // 確保 UI 狀態同步
            } else {
                toast.error('下架失敗', {
                    description: result.error
                })
            }
        })
    }

    return (
        <div
            className='absolute inset-0 flex items-center justify-center gap-2 rounded-xl bg-black/60 opacity-0 transition-opacity group-hover:opacity-100'>
            {/* 編輯按鈕 */}
            <Button variant='secondary' size='sm' asChild>
                <Link href={`/sell?edit=${productId}`}>
                    <Edit className="mr-1 h-3 w-3"/>
                    編輯
                </Link>
            </Button>

            {/* 下架按鈕 + 確認視窗 */}
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant='destructive' size='sm'>
                        <Trash2 className="mr-1 h-3 w-3"/>
                        下架
                    </Button>
                </AlertDialogTrigger>
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
                                e.preventDefault() // 阻止預設關閉，等待 action 完成
                                handleDeactivate()
                            }}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                    處理中
                                </>
                            ) : (
                                '確認下架'
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}