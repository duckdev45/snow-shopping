import {Suspense} from 'react'
import {notFound} from 'next/navigation'
import {createClient} from '@/lib/supabase/server'
import {Badge} from '@/components/ui/badge'
import {Separator} from '@/components/ui/separator'
import {StartChatButton} from '@/components/chat/start-chat-button'
import {
    ShieldCheck,
    Snowflake,
    MapPin,
} from 'lucide-react'
import {ProductGallery} from '@/app/products/ProductGallery'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {ProductDetailFavoriteButton} from '@/components/product/product-detail-favorite-button'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import {JAPAN_SKI_RESORTS} from "@/lib/constants";

// 定義狀況顯示資料 (簡單版)
const CONDITION_STYLES: Record<
    string,
    { label: string; color: string; bg: string }
> = {
    brand_new: {label: '全新', color: 'text-emerald-700', bg: 'bg-emerald-50'},
    like_new: {label: '九成新', color: 'text-blue-700', bg: 'bg-blue-50'},
    used: {label: '良品', color: 'text-amber-700', bg: 'bg-amber-50'},
    for_parts: {label: '戰損', color: 'text-gray-700', bg: 'bg-gray-100'}
}

const CATEGORY_MAP: Record<string, string> = {
    snowboard: '單板',
    ski: '雙板',
    apparel: '雪衣褲',
    goggles: '雪鏡',
    helmet: '安全帽',
    gloves: '手套',
    boots: '雪鞋',
    'lift-ticket': '纜車票',
    other: '其他'
}

const skiResortLabelMap = new Map(JAPAN_SKI_RESORTS.map(resort => [resort.id, resort.label]));

const getResortName = (resortId: string | null) => {
    if (!resortId) return null
    return skiResortLabelMap.get(resortId) || resortId.replace(/_/g, ' ');
}

interface ProductPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ProductPage({params}: ProductPageProps) {
    const {id} = await params
    const supabase = await createClient()

    const {
        data: {user}
    } = await supabase.auth.getUser()

    const [productResponse, favoriteResponse] = await Promise.all([
        supabase
            .from('products')
            .select(
                `
        *,
        seller:profiles!seller_id (
          id,
          username,
          full_name,
          avatar_url,
          snow_experience
        )
      `
            )
            .eq('id', id)
            .single(),
        user
            ? supabase
                .from('favorites')
                .select('product_id')
                .eq('user_id', user.id)
                .eq('product_id', id)
                .single()
            : Promise.resolve({data: null})
    ])

    const {data: product, error} = productResponse
    const isFavorited = !!favoriteResponse.data

    if (error || !product) {
        notFound()
    }

    const seller = product.seller as any
    const categoryLabel = CATEGORY_MAP[product.category] || product.category
    const resortName = getResortName(product.ski_resort)
    const isLiftTicket = product.category === 'lift-ticket'

    // 取得狀況樣式，預設為灰色
    const conditionStyle = CONDITION_STYLES[product.condition] || {
        label: '二手',
        color: 'text-gray-700',
        bg: 'bg-gray-100'
    }

    return (
        <div className='min-h-screen bg-white pt-20 pb-24 lg:pt-28 lg:pb-10'>
            <div className='container mx-auto px-4 lg:px-6'>
                {/* 麵包屑 (桌面顯示) */}
                <div className='mb-6 hidden lg:block'>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/browse'>裝備瀏覽</BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator/>
                            <BreadcrumbItem>
                                <BreadcrumbPage>{product.title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className='grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12'>
                    {/* 左側：圖片區 */}
                    <div className='col-span-1 lg:col-span-5 '>
                        <Suspense
                            fallback={
                                <div
                                    className='aspect-[3/4] w-full animate-pulse rounded-2xl bg-gray-100 lg:aspect-square'/>
                            }>
                            <ProductGallery
                                images={product.images || []}
                                status={product.status}
                            />
                        </Suspense>
                    </div>

                    {/*
                       📝 右側：資訊區
                    */}
                    <div className='col-span-1 lg:col-span-7'>
                        <div className='space-y-6 lg:sticky lg:top-28'>
                            {/* 1. 標題與價格 */}
                            <div>
                                <div className='mb-3 flex items-center gap-2'>
                                    {product.brand && (
                                        <Badge
                                            variant='secondary'
                                            className='rounded-md bg-gray-100 text-gray-600'>
                                            {product.brand.replace(/_/g, ' ')}
                                        </Badge>
                                    )}
                                    <Badge
                                        variant='outline'
                                        className='border-gray-300 text-gray-500'>
                                        {categoryLabel}
                                    </Badge>
                                </div>

                                <h1 className='mb-3 text-2xl leading-snug font-bold text-gray-900 lg:text-3xl lg:leading-tight'>
                                    {product.title}
                                </h1>

                                <div className='flex items-center justify-end'>
                  <span className='text-3xl font-extrabold text-gray-900'>
                    NT$ {product.price.toLocaleString()}
                  </span>
                                </div>
                            </div>

                            <Separator/>

                            {/* 2. 商品狀況 */}
                            {!isLiftTicket && product.condition && (
                                <div className='flex items-center justify-between py-2'>
                  <span className='text-sm font-medium text-gray-500'>
                    商品狀況
                  </span>
                                    <Badge
                                        className={`${conditionStyle.bg} ${conditionStyle.color} border-0 px-3 py-1 text-sm font-medium hover:${conditionStyle.bg}`}>
                                        {conditionStyle.label}
                                    </Badge>
                                </div>
                            )}

                            {/* 3. 規格卡片 (地點/雪場) */}
                            <div className='grid grid-cols-2 gap-3'>
                                <div
                                    className='flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3'>
                                    <div
                                        className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm'>
                                        <MapPin className='h-4 w-4'/>
                                    </div>
                                    <div>
                                        <p className='text-[10px] text-gray-400'>交易地點</p>
                                        <p className='text-sm font-bold text-gray-900'>
                                            {product.location}
                                        </p>
                                    </div>
                                </div>
                                {isLiftTicket && resortName && (
                                    <div
                                        className='flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-3'>
                                        <div
                                            className='flex h-8 w-8 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm'>
                                            <Snowflake className='h-4 w-4'/>
                                        </div>
                                        <div>
                                            <p className='text-[10px] text-gray-400'>適用雪場</p>
                                            <p className='text-sm font-bold text-gray-900'>
                                                {resortName}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* 4. 賣家資訊 */}
                            {seller && (
                                <div
                                    className='flex items-center justify-between rounded-xl border border-gray-100 p-3 shadow-sm'>
                                    <div className='flex items-center gap-3'>
                                        <Avatar className='h-10 w-10 border border-gray-100'>
                                            <AvatarImage src={seller.avatar_url || undefined}/>
                                            <AvatarFallback className='bg-gray-100 text-gray-500'>
                                                {seller.full_name?.[0] || seller.username?.[0] || 'S'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className='text-sm font-bold text-gray-900'>
                                                {seller.full_name || seller.username || '未命名賣家'}
                                            </p>
                                            <p className='text-xs text-gray-500'>
                                                {seller.snow_experience || '雪友'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 5. 商品描述 */}
                            <div className='py-2'>
                                <h3 className='mb-2 text-base font-bold text-gray-900'>
                                    商品描述
                                </h3>
                                <div className='prose prose-sm prose-gray max-w-none rounded-xl bg-gray-50 p-4'>
                                    <p className='text-sm leading-6 whitespace-pre-wrap text-gray-600'>
                                        {product.description ||
                                            '賣家很懶，沒有留下描述。建議私訊詢問！'}
                                    </p>
                                </div>
                            </div>

                            {/* 安全提示 */}
                            <div
                                className='flex gap-3 rounded-xl bg-blue-50/50 p-3 text-xs leading-relaxed text-blue-800/80'>
                                <ShieldCheck className='mt-0.5 h-4 w-4 shrink-0 text-blue-400'/>
                                <p>
                                    建議選擇面交或平台建議方式交易。若遇到要求導出平台私下匯款，請提高警覺。
                                </p>
                            </div>

                            {/* 桌面版操作按鈕 (隱藏在手機版) */}
                            <div className='hidden gap-4 pt-4 lg:flex'>
                                {/* 收藏按鈕 */}
                                <ProductDetailFavoriteButton
                                    productId={product.id}
                                    initialIsFavorited={isFavorited}
                                    isLoggedIn={!!user}
                                />
                                {/*+ 私訊賣家按鈕 */}
                                <StartChatButton
                                    sellerId={product.seller_id}
                                    productId={product.id}
                                    className='h-12 flex-1 rounded-xl text-base shadow-lg shadow-gray-200 hover:shadow-xl'>
                                    私訊賣家
                                </StartChatButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/*
                    📱 手機版底部 Sticky Bar
                    - 維持原案，但稍微縮小高度，讓畫面更多給內容
                */}
                <div
                    className='safe-area-bottom fixed right-0 bottom-0 left-0 z-20 border-t border-gray-100 bg-white/90 p-3 pb-6 backdrop-blur-md lg:hidden'>
                    <div className='flex items-center gap-3'>
                        <div className='shrink-0'>
                            <ProductDetailFavoriteButton
                                productId={product.id}
                                initialIsFavorited={isFavorited}
                                isLoggedIn={!!user}
                            />
                        </div>

                        <StartChatButton
                            sellerId={product.seller_id}
                            productId={product.id}
                            className='h-12 flex-1 rounded-full font-bold shadow-md active:scale-[0.98]'
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
