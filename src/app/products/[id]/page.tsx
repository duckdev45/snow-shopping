import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductGallery } from '@/app/products/ProductGallery'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { MessageCircle, Heart, Share2, ShieldCheck, MapPin } from 'lucide-react'

// 定義分類的中英文對照 (也可以抽成共用常數)
const CATEGORY_MAP: Record<string, string> = {
  snowboard: '單板',
  ski: '雙板',
  boots: '雪鞋',
  goggles: '雪鏡',
  helmet: '安全帽',
  apparel: '雪衣褲',
  'lift-ticket': '雪票',
  other: '其他'
}

const CONDITION_MAP: Record<string, string> = {
  brand_new: '全新',
  like_new: '九成新',
  used: '二手良品',
  for_parts: '零件'
}

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  // Next.js 15 的 params 是 Promise，需要 await (如果是 15 RC 版本後)
  const { id } = await params
  const supabase = await createClient()

  // 關聯查詢：抓商品 + 賣家資料 (profiles)
  const { data: product, error } = await supabase
    .from('products')
    .select(
      `
      *,
      seller:profiles (
        username,
        full_name,
        avatar_url,
        snow_experience
      )
    `
    )
    .eq('id', id)
    .single()

  if (error || !product) {
    notFound() // 導向 404 頁面
  }

  // 整理賣家資料
  const seller = product.seller as any // 暫時規避型別，之後建議補上完整 Type
  const categoryLabel = CATEGORY_MAP[product.category] || product.category
  const conditionLabel = CONDITION_MAP[product.condition] || product.condition

  return (
    <div className='container mx-auto min-h-screen px-4 pt-28 pb-16 lg:px-6'>
      {/* 麵包屑導航 */}
      <Breadcrumb className='mb-6'>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href='/'>首頁</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href='/browse'>二手裝備</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/browse?category=${product.category}`}>
              {categoryLabel}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className='line-clamp-1 max-w-[200px]'>
              {product.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className='grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16'>
        {/* 左側：圖片畫廊 */}
        <div>
          <ProductGallery images={product.images || []} />
        </div>

        {/* 右側：商品資訊 */}
        <div className='flex flex-col space-y-6'>
          {/* 標題與價格 */}
          <div className='space-y-2'>
            <div className='flex items-start justify-between gap-4'>
              <h1 className='text-3xl leading-tight font-bold text-gray-900'>
                {product.title}
              </h1>
              {/* 分享按鈕 (可以之後做功能) */}
              <Button variant='ghost' size='icon' className='rounded-full'>
                <Share2 className='h-5 w-5 text-gray-500' />
              </Button>
            </div>

            <div className='flex items-center gap-3'>
              <span className='text-3xl font-extrabold text-blue-600'>
                NT$ {product.price.toLocaleString()}
              </span>
              <Badge
                variant='secondary'
                className='px-3 py-1 text-sm font-medium'>
                {conditionLabel}
              </Badge>
            </div>
          </div>

          <Separator />

          {/* 賣家資訊卡片 */}
          <div className='flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-4'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-12 w-12 border-2 border-white shadow-sm'>
                <AvatarImage src={seller?.avatar_url} />
                <AvatarFallback>{seller?.full_name?.[0] || 'S'}</AvatarFallback>
              </Avatar>
              <div>
                <p className='font-semibold text-gray-900'>
                  {seller?.full_name || seller?.username || '神秘雪友'}
                </p>
                <div className='flex items-center gap-2 text-xs text-gray-500'>
                  <Badge
                    variant='outline'
                    className='h-5 border-blue-200 bg-blue-50 px-1.5 text-[10px] text-blue-700'>
                    {seller?.snow_experience || '初學者'}
                  </Badge>
                  <span>
                    • 上架 {Math.floor(Math.random() * 10) + 1} 件商品
                  </span>
                </div>
              </div>
            </div>
            <Button variant='outline' size='sm' className='hidden sm:flex'>
              查看賣場
            </Button>
          </div>

          {/* 商品描述 */}
          <div className='space-y-3'>
            <h3 className='font-semibold text-gray-900'>商品描述</h3>
            <div className='text-base leading-relaxed whitespace-pre-wrap text-gray-600'>
              {product.description || '賣家沒有留下描述，建議私訊詢問細節。'}
            </div>
          </div>

          {/* 安全提示 */}
          <div className='flex items-start gap-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-700'>
            <ShieldCheck className='mt-0.5 h-5 w-5 flex-shrink-0' />
            <p>
              雪拼平台建議盡量選擇「面交」或是透過平台建議的方式交易。
              若賣家要求使用其他通訊軟體私下聯繫，請提高警覺。
            </p>
          </div>

          {/* 底部行動區 (Sticky on Mobile) */}
          <div className='fixed bottom-0 left-0 z-20 w-full border-t bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:static lg:w-auto lg:border-none lg:bg-transparent lg:p-0 lg:shadow-none'>
            <div className='container mx-auto flex gap-3 lg:px-0'>
              {/* 收藏按鈕 */}
              <Button
                variant='outline'
                size='lg'
                className='flex-1 gap-2 border-gray-300 hover:border-red-200 hover:text-red-500 lg:flex-none'>
                <Heart className='h-5 w-5' />
                <span className='hidden sm:inline'>收藏</span>
              </Button>

              {/* 私訊按鈕 */}
              <Button
                size='lg'
                className='flex-[3] gap-2 bg-blue-600 text-lg font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700'>
                <MessageCircle className='h-5 w-5' />
                私訊賣家
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
