'use client'

import React, { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { MessageCircle, Loader2 } from 'lucide-react'
import { startConversationAction } from '@/app/actions/chat'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { LoginModal } from '@/components/auth/login-modal'

interface StartChatButtonProps {
  sellerId: string
  productId?: string
  className?: string
  children?: React.ReactNode // 讓外面可以自訂文字 (例如 "私訊" 或 "私訊賣家")
}

export function StartChatButton({
  sellerId,
  productId,
  className,
  children
}: StartChatButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const router = useRouter()

  const handleStartChat = () => {
    startTransition(async () => {
      const result = await startConversationAction(sellerId, productId)

      if (result?.error) {
        if (result.error.includes('請先登入')) {
          toast.error('請先登入才能私訊喔！')
          setIsLoginModalOpen(true)
        } else {
          toast.error(result.error)
        }
      }
      // 成功的話會由 Server Action 自動 redirect，這裡不用做事
    })
  }

  return (
    <>
      <Button
        onClick={handleStartChat}
        disabled={isPending}
        className={cn(
          'bg-gray-900 text-white transition-all hover:bg-black',
          className
        )}>
        {isPending ? (
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
        ) : (
          <MessageCircle className='mr-2 h-4 w-4' />
        )}
        {children || '私訊賣家'}
      </Button>
      <LoginModal open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen} />
    </>
  )
}
