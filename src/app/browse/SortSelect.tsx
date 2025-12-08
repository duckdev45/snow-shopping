'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export function SortSelect() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`/browse?${params.toString()}`)
  }

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder='排序方式' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='newest'>最新上架</SelectItem>
        <SelectItem value='price_asc'>價格：低到高</SelectItem>
        <SelectItem value='price_desc'>價格：高到低</SelectItem>
      </SelectContent>
    </Select>
  )
}
