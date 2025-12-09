'use client'

import React from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { TermsOfServiceDialog } from '@/components/layout/TermsOfServiceDialog'

interface LoginModalProps {
  children?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function LoginModal({ children, open, onOpenChange }: LoginModalProps) {
  const handleGoogleLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }

  // 處理 OAuth 登入 (Facebook)
  const handleFacebookLogin = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${location.origin}/auth/callback`
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader className='text-center'>
          <DialogTitle className='text-2xl font-bold tracking-tight'>
            歡迎回到雪拼
          </DialogTitle>
          <DialogDescription className='text-center text-base'>
            社群帳號登入
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col space-y-2 py-2'>
          {/* Google Login Button */}
          <Button
            variant='outline'
            className='relative h-12 w-full text-base'
            onClick={handleGoogleLogin}>
            <div className='absolute top-1/2 left-4 -translate-y-1/2'>
              {/* Google SVG Icon */}
              <svg className='h-5 w-5' viewBox='0 0 24 24'>
                <path
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                  fill='#4285F4'
                />
                <path
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                  fill='#34A853'
                />
                <path
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                  fill='#FBBC05'
                />
                <path
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                  fill='#EA4335'
                />
              </svg>
            </div>
            使用 Google 登入
          </Button>

          {/* Facebook Login Button */}
          <Button
            variant='outline'
            className='relative h-12 w-full text-base'
            onClick={handleFacebookLogin}>
            <div className='absolute top-1/2 left-4 -translate-y-1/2'>
              <svg className='h-5 w-5' viewBox='0 0 24 24'>
                <path
                  d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z'
                  fill='#1877F2'
                />
              </svg>
            </div>
            使用 Facebook 登入
          </Button>
        </div>

        <div className='text-center text-xs text-gray-500'>
          登入即代表同意本站的
          <TermsOfServiceDialog>
            <button className='ml-1 underline hover:text-gray-900'>
              服務條款
            </button>
          </TermsOfServiceDialog>
        </div>
      </DialogContent>
    </Dialog>
  )
}
