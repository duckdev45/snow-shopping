'use client'

import { useState, useTransition, useEffect, Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { productSchema, type ProductFormData } from '@/lib/schemas/product'
import { createProductAction, updateProductAction } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Loader2, X, UploadCloud } from 'lucide-react'

// ... CATEGORIES 和 CONDITIONS 常數保持不變
const CATEGORIES = [
  { id: 'snowboard', label: '單板' },
  { id: 'ski', label: '雙板' },
  { id: 'apparel', label: '雪衣褲' },
  { id: 'goggles', label: '雪鏡' },
  { id: 'helmet', label: '安全帽' },
  { id: 'gloves', label: '手套' },
  { id: 'boots', label: '雪鞋' },
  { id: 'lift-ticket', label: '雪票' },
  { id: 'other', label: '其他' }
]

const CONDITIONS = [
  { id: 'brand_new', label: '全新' },
  { id: 'like_new', label: '九成新' },
  { id: 'used', label: '二手良品' },
  { id: 'for_parts', label: '戰損' }
]

// 抽出表單邏輯組件
function ProductForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit') // 取得編輯 ID

  const [isPending, startTransition] = useTransition()
  const [uploading, setUploading] = useState(false)
  const [fetching, setFetching] = useState(false)

  // 🔥 改良版 State：只存「新選的」檔案，並記錄它的預覽 URL 以便對應
  const [newFiles, setNewFiles] = useState<{ file: File; url: string }[]>([])

  const supabase = createClient()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      images: []
    }
  })

  // 監聽圖片欄位 (這裡面會混合「舊的 https://」和「新的 blob:」)
  const currentImages = watch('images')

  // 1. 如果是編輯模式，載入舊資料
  useEffect(() => {
    if (!editId) return

    const fetchProduct = async () => {
      setFetching(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', editId)
        .single()

      if (data) {
        // 回填資料
        reset({
          title: data.title,
          description: data.description || '',
          price: data.price,
          category: data.category as any,
          condition: data.condition as any,
          images: data.images || [] // 舊圖片 URL
        })
      }
      setFetching(false)
    }

    fetchProduct()
  }, [editId, supabase, reset])

  // 2. 選圖片 (純本地預覽)
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const selectedFiles = Array.from(e.target.files)

    // 防呆：檢查總數量 (舊圖 + 新圖)
    if (currentImages.length + selectedFiles.length > 5) {
      alert('最多只能上傳 5 張照片')
      e.target.value = ''
      return
    }

    const newEntries = selectedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file)
    }))

    // 更新新檔案 State
    setNewFiles((prev) => [...prev, ...newEntries])

    // 更新表單顯示 (保留舊圖，加上新圖)
    const newUrls = newEntries.map((entry) => entry.url)
    setValue('images', [...currentImages, ...newUrls], { shouldValidate: true })

    e.target.value = ''
  }

  // 3. 移除圖片
  const removeImage = (indexToRemove: number) => {
    const urlToRemove = currentImages[indexToRemove]

    // A. 從表單顯示中移除
    const updatedImages = currentImages.filter(
      (_, index) => index !== indexToRemove
    )
    setValue('images', updatedImages, { shouldValidate: true })

    // B. 如果是「新選的圖片」(blob開頭)，也要從 newFiles 移除，避免之後還被上傳
    if (urlToRemove.startsWith('blob:')) {
      setNewFiles((prev) => prev.filter((entry) => entry.url !== urlToRemove))
      URL.revokeObjectURL(urlToRemove) // 釋放記憶體
    }
  }

  // 4. 送出表單 (上傳新圖 -> 合併 -> 寫入 DB)
  const onSubmit = async (data: ProductFormData) => {
    setUploading(true)

    try {
      // A. 先上傳所有「新選的」檔案
      const uploadedMap = new Map<string, string>() // blobUrl -> supabaseUrl

      for (const entry of newFiles) {
        const file = entry.file
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl }
        } = supabase.storage.from('product-images').getPublicUrl(filePath)

        uploadedMap.set(entry.url, publicUrl)
      }

      // B. 組合最終圖片陣列
      // 遍歷 data.images，如果是舊圖(http)保留，如果是新圖(blob)則換成剛上傳好的網址
      const finalImages = data.images.map((url) => {
        if (url.startsWith('blob:')) {
          return uploadedMap.get(url) || url // 理論上一定拿得到，拿不到就回傳原值(會報錯但至少不崩潰)
        }
        return url
      })

      const finalData = {
        ...data,
        images: finalImages
      }

      // C. 呼叫 Server Action (新增 or 更新)
      startTransition(async () => {
        let result
        if (editId) {
          result = await updateProductAction(editId, finalData)
        } else {
          result = await createProductAction(finalData)
        }

        if (result.success) {
          router.push(`/products/${result.id}`)
          router.refresh() // 強制刷新
        } else {
          alert(`操作失敗 QQ: ${result.error}`)
        }
      })
    } catch (error) {
      console.error('Upload failed:', error)
      alert('圖片上傳失敗，請檢查網路或圖片大小')
    } finally {
      setUploading(false)
    }
  }

  if (fetching) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <div className='text-center'>
          <Loader2 className='mx-auto h-8 w-8 animate-spin text-blue-500' />
          <p className='mt-2 text-gray-500'>正在讀取裝備資料...</p>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-bold'>
          {editId ? '編輯裝備' : '刊登裝備'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {/* 圖片上傳區 */}
          <div className='space-y-2'>
            <Label>商品照片 (最多 5 張)</Label>
            <div className='grid grid-cols-3 gap-4 sm:grid-cols-4'>
              {currentImages.map((url, index) => (
                <div
                  key={index}
                  className='group relative aspect-square overflow-hidden rounded-lg border bg-gray-50'>
                  <Image
                    src={url}
                    alt='Preview'
                    fill
                    className='object-cover'
                  />
                  <button
                    type='button'
                    onClick={() => removeImage(index)}
                    className='absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-500'>
                    <X className='h-3 w-3' />
                  </button>
                </div>
              ))}

              {/* 上傳按鈕 */}
              {currentImages.length < 5 && (
                <label className='flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 transition-colors hover:border-blue-500 hover:bg-blue-50'>
                  <UploadCloud className='h-6 w-6 text-gray-400' />
                  <span className='mt-2 text-xs text-gray-500'>
                    {5 - currentImages.length > 0
                      ? `還可選 ${5 - currentImages.length} 張`
                      : '已滿'}
                  </span>
                  <input
                    type='file'
                    multiple
                    accept='image/*'
                    className='hidden'
                    onChange={handleImageSelect}
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
            {errors.images && (
              <p className='text-sm text-red-500'>{errors.images.message}</p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='title'>商品標題</Label>
            <Input
              id='title'
              placeholder='例如：2024 Burton Custom 全新板'
              {...register('title')}
            />
            {errors.title && (
              <p className='text-sm text-red-500'>{errors.title.message}</p>
            )}
          </div>

          <div className='grid grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <Label>分類</Label>
              <Select
                onValueChange={(val) => setValue('category', val as any)}
                defaultValue={watch('category')} // 確保編輯時有預設值
                value={watch('category')}>
                <SelectTrigger>
                  <SelectValue placeholder='選擇分類' />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className='text-sm text-red-500'>
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label>裝備狀況</Label>
              <Select
                onValueChange={(val) => setValue('condition', val as any)}
                defaultValue={watch('condition')}
                value={watch('condition')}>
                <SelectTrigger>
                  <SelectValue placeholder='選擇狀況' />
                </SelectTrigger>
                <SelectContent>
                  {CONDITIONS.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.condition && (
                <p className='text-sm text-red-500'>
                  {errors.condition.message}
                </p>
              )}
            </div>
            <div className='space-y-2'>
              <Label htmlFor='price'>價格 (NT$)</Label>
              <Input
                id='price'
                type='number'
                placeholder='8500'
                {...register('price')}
              />
              {errors.price && (
                <p className='text-sm text-red-500'>{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='description'>商品描述</Label>
            <Textarea
              id='description'
              placeholder='描述一下使用狀況、購買來源、面交地點...'
              className='h-32'
              {...register('description')}
            />
            {errors.description && (
              <p className='text-sm text-red-500'>
                {errors.description.message}
              </p>
            )}
          </div>

          <Button
            type='submit'
            className='h-12 w-full bg-blue-600 text-lg hover:bg-blue-700'
            disabled={isPending || uploading}>
            {uploading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                圖片上傳中...
              </>
            ) : isPending ? (
              '處理中...'
            ) : editId ? (
              '儲存變更'
            ) : (
              '確認刊登'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// 最外層必須用 Suspense 包裹，因為用到了 useSearchParams
export default function SellPage() {
  return (
    <div className='container mx-auto max-w-2xl px-4 py-10 pt-28'>
      <Suspense fallback={<div className='py-20 text-center'>載入中...</div>}>
        <>
          <ProductForm />
        </>
      </Suspense>
    </div>
  )
}
