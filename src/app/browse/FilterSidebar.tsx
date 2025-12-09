'use client'

import * as React from 'react'
import {useRouter, useSearchParams} from 'next/navigation'
import {Checkbox} from '@/components/ui/checkbox'
import {Label} from '@/components/ui/label'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import {Button} from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet'
import {Filter} from 'lucide-react'
import {Badge} from '@/components/ui/badge'

interface FilterSidebarProps {
    className?: string
}

// 預設分類選項
const CATEGORIES = [
    {id: 'snowboard', label: '單板'},
    {id: 'ski', label: '雙板'},
    {id: 'apparel', label: '雪衣褲'},
    {id: 'goggles', label: '雪鏡'},
    {id: 'helmet', label: '安全帽'},
    {id: 'gloves', label: '手套'},
    {id: 'boots', label: '雪鞋'},
    {id: 'lift-ticket', label: '纜車票'},
    {id: 'other', label: '其他/護具'}
]


export function FilterSidebar({className}: FilterSidebarProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    // 從 URL 讀取狀態
    const currentCategories = searchParams.getAll('category')

    // 更新 URL 的 helper function
    const updateParams = (key: string, value: string | null, isArray = false) => {
        const params = new URLSearchParams(searchParams.toString())

        if (isArray && value) {
            if (params.has(key, value)) {
                params.delete(key, value)
            } else {
                params.append(key, value)
            }
        } else {
            if (value) {
                params.set(key, value)
            } else {
                params.delete(key)
            }
        }

        // 重置頁碼到 1
        params.delete('page')

        router.push(`/browse?${params.toString()}`, {scroll: false})
    }

    // 清除所有篩選
    const clearFilters = () => {
        router.push('/browse')
    }

    const FilterContent = () => (
        <div className='space-y-2 px-6'>
            {/* 標題與清除按鈕 */}
            <div className='flex items-center justify-between'>
                <h3 className='font-semibold text-gray-900'>篩選裝備</h3>
                {currentCategories.length > 0 && (
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={clearFilters}
                        className='h-auto px-2 text-cyan-700 hover:text-red-600'>
                        清除全部
                    </Button>
                )}
            </div>

            <Accordion
                type='multiple'
                defaultValue={['category']}
                className='w-full'>
                {/* 分類篩選 */}
                <AccordionItem value='category'>
                    <AccordionTrigger>裝備分類</AccordionTrigger>
                    <AccordionContent>
                        <div className='space-y-3 pt-2 '>
                            {CATEGORIES.map((cat) => (
                                <div key={cat.id} className='flex items-center space-x-2'>
                                    <Checkbox
                                        id={cat.id}
                                        checked={currentCategories.includes(cat.id)}
                                        onCheckedChange={() =>
                                            updateParams('category', cat.id, true)
                                        }
                                    />
                                    <Label
                                        htmlFor={cat.id}
                                        className='cursor-pointer text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                                        {cat.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )

    return (
        <>
            {/* Mobile Filter Sheet */}
            <div className='lg:hidden '>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant='outline' size='sm' className='h-10 gap-2'>
                            <Filter className='h-4 w-4'/>
                            篩選
                            {currentCategories.length > 0 && (
                                <Badge
                                    variant='secondary'
                                    className='ml-1 h-5 rounded-full px-1.5 text-xs'>
                                    {currentCategories.length}
                                </Badge>
                            )}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
                        <SheetHeader>
                            <SheetTitle className='text-left'>篩選條件</SheetTitle>
                        </SheetHeader>
                        <div className='mt-10'>
                            <FilterContent/>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sticky Sidebar */}
            <div className='sticky top-24 hidden h-[calc(100vh-8rem)] w-64 overflow-y-auto pr-6 lg:block'>
                <FilterContent/>
            </div>
        </>
    )
}
