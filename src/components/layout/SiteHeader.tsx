'use client'

import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { useScrollEffects } from '@/hooks/useScrollEffects'
import React, { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/client'
import { Ghost, LogOut, User as UserIcon, ShoppingBag } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export function SiteHeader() {
  const logoSrc = '/snowShopping.png'
  const { isScrollingUp, isAtTop } = useScrollEffects()
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // 判斷是否為首頁 (或是其他有 Hero 圖片的頁面)
  const isHome = pathname === '/'

  // 檢查使用者登入狀態
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    // 監聽登入狀態改變
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // 登出功能
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  // 取得顯示名稱的第一個字 (用於沒有圖片時)
  const getAvatarFallback = () => {
    const name = user?.user_metadata?.full_name || user?.email || 'S'
    return name.charAt(0).toUpperCase()
  }

  return (
    <header
      className={clsx(
        'fixed top-0 z-50 w-full transition-all duration-300 ease-in-out',
        {
          // 情況 A: 在首頁，且在頂部 -> 透明背景
          'bg-transparent text-white': isHome && isAtTop,

          // 情況 B: 在首頁但滾動中，或是「根本不在首頁」 -> 深色背景 (避免文字在白底消失)
          'bg-slate-900/90 text-white shadow-md backdrop-blur-md':
            !isHome || !isAtTop,

          // 情況 C: 控制顯示/隱藏 (往下滾時藏起來)
          'translate-y-0': isScrollingUp || isAtTop,
          '-translate-y-full': !isScrollingUp && !isAtTop
        }
      )}>
      <nav className='container mx-auto px-4 lg:px-6'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <Image
              src={logoSrc}
              alt='雪拼Logo'
              width={80}
              height={40}
              className='h-24 w-auto'
            />
          </Link>

          <div className='hidden items-center space-x-6 lg:flex'>
            <Link
              href='/browse'
              className='transition-colors hover:text-blue-600'>
              二手裝備
            </Link>
            <Link
              href='/browse?category=lift-ticket'
              className='font-medium transition-colors hover:text-blue-400'>
              {' '}
              雪票交易
            </Link>
          </div>

          <div className='flex items-center space-x-4'>
            {user ? (
              // ------------------------------------------------
              // 狀態 A: 已登入 -> 顯示大頭貼 Dropdown
              // ------------------------------------------------
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='rounded-full ring-2 ring-white/50 transition-all hover:ring-white focus:outline-none'>
                    <Avatar className='h-9 w-9'>
                      <AvatarImage src={user.user_metadata.avatar_url} />
                      <AvatarFallback className='bg-blue-600 font-bold text-white'>
                        {getAvatarFallback()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align='end' className='mt-2 w-56'>
                  <DropdownMenuLabel>
                    <div className='flex flex-col space-y-1'>
                      <p className='truncate text-sm leading-none font-medium'>
                        {user.user_metadata.full_name || '雪友'}
                      </p>
                      <p className='text-muted-foreground truncate text-xs leading-none'>
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => router.push('/profile')}
                    className='cursor-pointer'>
                    <UserIcon className='mr-2 h-4 w-4' />
                    <span>個人檔案</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => router.push('/sell')}
                    className='cursor-pointer'>
                    <ShoppingBag className='mr-2 h-4 w-4' />
                    <span>刊登商品</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className='cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600'
                    onClick={handleLogout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>登出</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // ------------------------------------------------
              // 狀態 B: 未登入 -> 顯示登入按鈕
              // ------------------------------------------------
              <Link href='/login'>
                <button className='flex items-center rounded-full bg-cyan-700 px-6 py-2 text-sm font-medium text-white shadow-md transition-all hover:bg-cyan-600 hover:shadow-lg active:scale-95'>
                  <Ghost className='mr-2 h-4 w-4' />
                  登入
                </button>
              </Link>
            )}

            {/* Mobile Menu Icon (手機版選單) */}
            <button className='rounded-md p-2 text-white hover:bg-white/20 lg:hidden'>
              <MenuIcon className='h-6 w-6' />
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}>
      <line x1='4' x2='20' y1='12' y2='12' />
      <line x1='4' x2='20' y1='6' y2='6' />
      <line x1='4' x2='20' y1='18' y2='18' />
    </svg>
  )
}
