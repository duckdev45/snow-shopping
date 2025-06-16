'use client'

import Link from "next/link";
import Image from "next/image";
import clsx from 'clsx';
import {useScrollEffects} from '@/app/hooks/useScrollEffects';
import React from "react";

export function SiteHeader() {
    const logoSrc = "/snowShopping.png";
    const {isScrollingUp, isAtTop} = useScrollEffects();

    return (
        <header
            className={clsx(
                'fixed top-0 z-50 w-full transition-all duration-300 ease-in-out',

                // 條件一：控制「背景 & 文字顏色」
                {
                    // 狀態1：在頂部時 (跟之前一樣)
                    'bg-transparent text-white': isAtTop,

                    // 狀態2：離開頂部，且正在「往上滑」
                    'bg-black/50 text-white backdrop-blur-sm': !isAtTop && isScrollingUp,

                    // 狀態3：離開頂部，且正在「往下滑」
                    'bg-background/95 text-primary-foreground backdrop-blur-sm': !isAtTop && !isScrollingUp,
                },

                // 條件二：控制「顯示 & 隱藏」(只有在離開頂部後才作用)
                {
                    'translate-y-0': isScrollingUp || isAtTop,  // 往上滑 或 在頂部時，顯示
                    '-translate-y-full': !isScrollingUp && !isAtTop, // 往下滑 且 離開頂部時，才隱藏
                }
            )}
        >
            <nav className="container mx-auto px-4 lg:px-6">
                <div className="flex justify-between items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src={logoSrc} alt="雪拼Logo" width={80} height={40} className="h-24 w-auto"/>
                    </Link>

                    <div className="hidden lg:flex items-center space-x-6">
                        <Link href="/browse"
                              className="text-white hover:text-blue-600 transition-colors">二手裝備</Link>
                        <Link href="/about" className="text-white hover:text-blue-600 transition-colors">雪票交易</Link>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Link href="/login"
                              className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-full transition-colors">登入</Link>
                        <Link href="/register"
                              className="px-4 py-2 text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 rounded-full transition-colors">註冊</Link>
                        <button
                            className="hidden md:flex items-center ml-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-md">
                            <PlusIcon className="mr-2 h-4 w-4"/>
                            免費刊登
                        </button>
                        <button className="lg:hidden p-2 rounded-md hover:bg-gray-100">
                            <MenuIcon className="h-6 w-6"/>
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
        </svg>
    )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="4" x2="20" y1="12" y2="12"/>
            <line x1="4" x2="20" y1="6" y2="6"/>
            <line x1="4" x2="20" y1="18" y2="18"/>
        </svg>
    )
}
