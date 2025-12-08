'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
import { Filter, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface FilterSidebarProps {
  className?: string
}

// 預設分類選項
const CATEGORIES = [
  { id: 'snowboard', label: '單板 Snowboard' },
  { id: 'ski', label: '雙板 Ski' },
  { id: 'apparel', label: '雪衣褲 Apparel' },
  { id: 'goggles', label: '雪鏡 Goggles' },
  { id: 'helmet', label: '安全帽 Helmet' },
  { id: 'gloves', label: '手套 Gloves' },
  { id: 'boots', label: '雪鞋 Boots' },
  { id: 'lift-ticket', label: '雪票 Lift Ticket' },
  { id: 'other', label: '其他 Other' }
]

// 預設板況選項
const CONDITIONS = [
  { id: 'brand_new', label: '全新' },
  { id: 'like_new', label: '九成新' },
  { id: 'used', label: '二手良品' },
  { id: 'for_parts', label: '戰損' }
]

export function FilterSidebar({ className }: FilterSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 從 URL 讀取狀態
  const currentCategories = searchParams.getAll('category')
  const currentConditions = searchParams.getAll('condition')
  const minPrice = Number(searchParams.get('minPrice')) || 0
  const maxPrice = Number(searchParams.get('maxPrice')) || 50000

  // 價格滑桿的本地狀態 (避免一直觸發 URL 更新)
  const [priceRange, setPriceRange] = React.useState([minPrice, maxPrice])

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

    router.push(`/browse?${params.toString()}`, { scroll: false })
  }

  // 處理價格變更 (放開滑鼠才更新 URL)
  const handlePriceCommit = (value: number[]) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('minPrice', value[0].toString())
    params.set('maxPrice', value[1].toString())
    router.push(`/browse?${params.toString()}`, { scroll: false })
  }

  // 清除所有篩選
  const clearFilters = () => {
    router.push('/browse')
    setPriceRange([0, 50000])
  }

  const FilterContent = () => (
    <div className='space-y-6'>
      {/* 標題與清除按鈕 */}
      <div className='flex items-center justify-between'>
        <h3 className='font-semibold text-gray-900'>篩選裝備</h3>
        {(currentCategories.length > 0 ||
          currentConditions.length > 0 ||
          minPrice > 0) && (
          <Button
            variant='ghost'
            size='sm'
            onClick={clearFilters}
            className='h-auto px-2 text-red-500 hover:text-red-600'>
            清除全部
          </Button>
        )}
      </div>

      <Accordion
        type='multiple'
        defaultValue={['category', 'price', 'condition']}
        className='w-full'>
        {/* 1. 分類篩選 */}
        <AccordionItem value='category'>
          <AccordionTrigger>裝備分類</AccordionTrigger>
          <AccordionContent>
            <div className='space-y-3 pt-2'>
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

        {/* 2. 價格範圍 */}
        <AccordionItem value='price'>
          <AccordionTrigger>預算範圍</AccordionTrigger>
          <AccordionContent>
            <div className='px-2 pt-4 pb-2'>
              <Slider
                defaultValue={[0, 50000]}
                value={priceRange}
                max={100000}
                step={1000}
                minStepsBetweenThumbs={1}
                onValueChange={setPriceRange}
                onValueCommit={handlePriceCommit}
                className='mb-6'
              />
              <div className='flex items-center justify-between text-sm'>
                <div className='rounded-md border px-3 py-1'>
                  NT$ {priceRange[0].toLocaleString()}
                </div>
                <span className='text-gray-400'>-</span>
                <div className='rounded-md border px-3 py-1'>
                  NT$ {priceRange[1].toLocaleString()}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* 3. 商品狀況 */}
        <AccordionItem value='condition'>
          <AccordionTrigger>商品狀況</AccordionTrigger>
          <AccordionContent>
            <div className='space-y-3 pt-2'>
              {CONDITIONS.map((cond) => (
                <div key={cond.id} className='flex items-center space-x-2'>
                  <Checkbox
                    id={cond.id}
                    checked={currentConditions.includes(cond.id)}
                    onCheckedChange={() =>
                      updateParams('condition', cond.id, true)
                    }
                  />
                  <Label
                    htmlFor={cond.id}
                    className='cursor-pointer text-sm leading-none font-medium'>
                    {cond.label}
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
      <div className='lg:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='sm' className='h-10 gap-2'>
              <Filter className='h-4 w-4' />
              篩選
              {currentCategories.length + currentConditions.length > 0 && (
                <Badge
                  variant='secondary'
                  className='ml-1 h-5 rounded-full px-1.5 text-xs'>
                  {currentCategories.length + currentConditions.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='w-[300px] sm:w-[400px]'>
            <SheetHeader>
              <SheetTitle className='text-left'>篩選條件</SheetTitle>
            </SheetHeader>
            <div className='mt-8'>
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sticky Sidebar */}
      <div className='sticky top-24 hidden h-[calc(100vh-8rem)] w-64 overflow-y-auto pr-6 lg:block'>
        <FilterContent />
      </div>
    </>
  )
}
