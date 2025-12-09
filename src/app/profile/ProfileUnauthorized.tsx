'use client'

import { LoginModal } from '@/components/auth/login-modal'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'
import Link from 'next/link'

export default function ProfileUnauthorized() {
    return (
        <div className='container mx-auto flex min-h-[calc(100vh-15rem)] items-center justify-center px-4 py-10'>
            <div className='text-center'>
                <Lock className='mx-auto h-16 w-16 text-gray-400' />
                <h2 className='mt-4 text-2xl font-bold text-gray-800'>
                    請先登入
                </h2>
                <p className='mt-2 text-gray-500'>
                    登入後才能查看您的個人檔案、賣場和收藏。
                </p>
                <div className='mt-6 flex justify-center gap-4'>
                    <LoginModal>
                        <Button>立即登入</Button>
                    </LoginModal>
                    <Button variant='outline' asChild>
                        <Link href='/'>回到首頁</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}

