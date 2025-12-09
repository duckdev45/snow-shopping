'use client'

import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { useScrollEffects } from '@/hooks/useScrollEffects'
import React, { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LoginModal } from '@/components/auth/login-modal'
import {
  Ghost,
  LogOut,
  User as UserIcon,
  ShoppingBag,
  Menu,
  Snowflake,
  Ticket,
  Info,
  MessageCircle
} from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export function SiteHeader() {
  const logoSrc = '/snowShopping.png'
  const { isScrollingUp, isAtTop } = useScrollEffects()
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const isHome = pathname === '/'

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const getAvatarFallback = () => {
    const name = user?.user_metadata?.full_name || user?.email || 'S'
    return name.charAt(0).toUpperCase()
  }

  // bo-ba-me and content
  const AboutDialog = ({ isMobile = false }: { isMobile?: boolean }) => (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={clsx(
            'flex items-center transition-colors hover:text-blue-500',
            isMobile
              ? 'w-full text-lg font-medium text-gray-900'
              : 'text-lg font-medium lg:text-base'
          )}>
          {isMobile ? <Info className='mr-3 h-5 w-5' /> : null}
          關於雪拼
        </button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[400px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-xl'>
            關於雪拼 SnowShopping
          </DialogTitle>
          <DialogDescription className='pt-1 text-base'>
            Hello, 我是網站開發者 Duck 🐤
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-2'>
          <p className='text-sm leading-relaxed text-gray-600'>
            開發這個網站就像滑雪一樣，雖然快樂但也有點開銷
            <br />
            （Server 費、網域費、還有一些隱形成本...💸）
          </p>
          <p className='text-sm leading-relaxed text-gray-600'>
            如果你/妳覺得網站還不錯用，或是順利交易了裝備 🎉
            <br />能<b>「請我喝杯珍奶」</b>！就更感謝惹
            <br />
          </p>
          <p className='text-sm font-medium text-gray-900'>
            有想許願的新功能也可以在抖內的時候偷偷跟我說喔
            <br />
            讓我們一起讓雪拼變得更好滑...（誤），是更好用！✨
          </p>
        </div>

        {/* bo-ba-me 按鈕 */}
        <div className='flex justify-center pt-2'>
          <a
            href='https://duckdev45.bobaboba.me'
            target='_blank'
            rel='noopener noreferrer'
            className='flex h-[48px] w-[180px] items-center justify-center rounded-xl bg-[#CCA78C] text-white shadow-lg transition-all duration-200 hover:scale-125 hover:bg-[#b8957a] active:scale-95'>
            <img
              src='https://s3.ap-southeast-1.amazonaws.com/media.anyonelab.com/images/boba/boba-embed-icon.png'
              alt='boba'
              className='mr-2 h-6 w-auto'
            />
            <span className='font-bold tracking-wide'>點我抖內珍奶</span>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )

  // --- 使用者選單 ---
  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='rounded-full ring-2 ring-white/50 transition-all hover:ring-white focus:outline-none'>
          <Avatar className='h-8 w-8 lg:h-9 lg:w-9'>
            <AvatarImage src={user?.user_metadata.avatar_url} />
            <AvatarFallback className='bg-blue-600 text-xs font-bold text-white lg:text-sm'>
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='mt-2 w-56'>
        <DropdownMenuLabel>
          <div className='flex flex-col space-y-1'>
            <p className='truncate text-sm leading-none font-medium'>
              {user?.user_metadata.full_name || '雪友'}
            </p>
            <p className='text-muted-foreground truncate text-xs leading-none'>
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push('/profile')}
          className='cursor-pointer'>
          <UserIcon className='mr-2 h-4 w-4' />
          個人檔案
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/chat')}
          className='cursor-pointer'>
          <MessageCircle className='mr-2 h-4 w-4' />
          我的訊息
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/sell')}
          className='cursor-pointer'>
          <ShoppingBag className='mr-2 h-4 w-4' />
          刊登商品
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600'
          onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' />
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // --- 登入按鈕 ---
  const AuthButton = () => (
    <LoginModal>
      <button className='flex items-center rounded-full bg-cyan-700 px-4 py-1.5 text-xs font-medium text-white shadow-md transition-all hover:bg-cyan-600 hover:shadow-lg active:scale-95 lg:px-6 lg:py-2 lg:text-sm'>
        <Ghost className='mr-2 h-3 w-3 lg:h-4 lg:w-4' />
        登入
      </button>
    </LoginModal>
  )

  return (
    <header
      className={clsx(
        'fixed top-0 z-50 w-full transition-all duration-300 ease-in-out',
        {
          'bg-transparent text-white': isHome && isAtTop,
          'bg-slate-900/90 text-white shadow-md backdrop-blur-md':
            !isHome || !isAtTop,
          'translate-y-0': isScrollingUp || isAtTop,
          '-translate-y-full': !isScrollingUp && !isAtTop
        }
      )}>
      <nav className='container mx-auto px-4 lg:px-6'>
        <div className='flex items-center justify-between'>
          {/* 1. Logo */}
          <Link href='/' className='flex items-center space-x-2'>
            <Image
              src={logoSrc}
              alt='雪拼Logo'
              width={80}
              height={40}
              className='h-20 w-auto object-contain lg:h-24'
            />
          </Link>

          {/* 2. Desktop Navigation */}
          <div className='hidden items-center space-x-6 lg:flex'>
            <Link
              href='/browse'
              className='text-lg font-medium transition-colors hover:text-blue-600 lg:text-base'>
              二手裝備
            </Link>
            <Link
              href='/browse?category=lift-ticket'
              className='text-lg font-medium transition-colors hover:text-blue-400 lg:text-base'>
              雪票交易
            </Link>
            {/* ✨ 這裡加入電腦版 About 按鈕 */}
            <AboutDialog />
          </div>

          {/* 3. Right Side Actions */}
          <div className='flex items-center gap-2 sm:gap-4'>
            {/* A. User Status */}
            {user ? <UserMenu /> : <AuthButton />}

            {/* B. Mobile Menu Trigger */}
            <div className='lg:hidden'>
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='text-white hover:bg-white/20 hover:text-white'>
                    <Menu className='h-6 w-6' />
                    <span className='sr-only'>開啟選單</span>
                  </Button>
                </SheetTrigger>

                <SheetContent side='right' className='w-[300px]'>
                  <SheetHeader>
                    <SheetTitle className='text-left text-xl font-bold'>
                      雪拼地圖
                    </SheetTitle>
                  </SheetHeader>

                  <div className='mt-8 flex flex-col gap-6 px-2'>
                    <SheetClose asChild>
                      <Link
                        href='/browse'
                        className='flex items-center text-lg font-medium hover:text-blue-600'>
                        <Snowflake className='mr-3 h-5 w-5' />
                        二手裝備
                      </Link>
                    </SheetClose>

                    <SheetClose asChild>
                      <Link
                        href='/browse?category=lift-ticket'
                        className='flex items-center text-lg font-medium hover:text-blue-600'>
                        <Ticket className='mr-3 h-5 w-5' />
                        雪票交易
                      </Link>
                    </SheetClose>

                    <div className='flex items-center'>
                      <AboutDialog isMobile />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
