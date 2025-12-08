import {createClient} from '@/lib/supabase/server'
import {ProductCard} from '@/components/ui/product-card'
import {FilterSidebar} from '@/app/browse/FilterSidebar'
import {SortSelect} from '@/app/browse/SortSelect'
import {Ghost} from 'lucide-react'

// 定義 Props 型別，Next.js 會自動傳入 searchParams
interface BrowsePageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function BrowsePage({searchParams}: BrowsePageProps) {
    // 先 await 把參數拿出來
    const params = await searchParams
    const supabase = await createClient()

    // 1. 解析 URL 參數
    const category = params.category
    const condition = params.condition
    const minPrice = Number(params.minPrice) || 0
    const maxPrice = Number(params.maxPrice) || 100000
    const sort = typeof params.sort === 'string' ? params.sort : 'newest'
    const searchQuery = typeof params.q === 'string' ? params.q : ''

    // 2. 建構 Supabase 查詢
    let query = supabase
        .from('products')
        .select('*')
        .eq('status', 'active') // 只顯示上架中的
        .gte('price', minPrice)
        .lte('price', maxPrice)

    // 處理多選分類 (category)
    if (category) {
        const categories = Array.isArray(category) ? category : [category]
        query = query.in('category', categories)
    }

    // 處理多選狀況 (condition)
    if (condition) {
        const conditions = Array.isArray(condition) ? condition : [condition]
        query = query.in('condition', conditions)
    }

    // 處理關鍵字搜尋
    if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`)
    }

    // 處理排序
    switch (sort) {
        case 'price_asc':
            query = query.order('price', {ascending: true})
            break
        case 'price_desc':
            query = query.order('price', {ascending: false})
            break
        case 'newest':
        default:
            query = query.order('created_at', {ascending: false})
            break
    }

    // 3. 執行查詢
    const {data: products, error} = await query

    if (error) {
        console.error('Error fetching products:', error)
        return <div>載入失敗，請稍後再試</div>
    }

    return (
        <div className='container mx-auto min-h-screen px-4 pt-28 pb-8 lg:px-6'>
            {/* 標題區塊 */}
            <div className='mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center'>
                <div>
                    <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
                        {searchQuery ? `"${searchQuery}" 的搜尋結果` : '探索裝備'}
                    </h1>
                    <p className='mt-1 text-sm text-gray-500'>
                        共找到 {products?.length || 0} 件好貨
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    {/* 手機版篩選按鈕會出現在這裡 */}
                    <div className='lg:hidden'>
                        <FilterSidebar/>
                    </div>
                    <SortSelect/>
                </div>
            </div>

            <div className='flex flex-col gap-8 lg:flex-row'>
                {/* 左側：桌面版篩選器 */}
                <aside className='hidden w-64 flex-shrink-0 lg:block'>
                    <FilterSidebar/>
                </aside>

                {/* 右側：商品列表 */}
                <main className='flex-1'>
                    {products && products.length > 0 ? (
                        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    title={product.title}
                                    category={product.category}
                                    price={product.price}
                                    condition={product.condition}
                                    imageUrl={product.images?.[0] || '/placeholder.png'}
                                    brand={product.brand}
                                />
                            ))}
                        </div>
                    ) : (
                        // 空狀態 (Empty State)
                        <div className='flex flex-col items-center justify-center py-20 text-center'>
                            <div className='mb-4 rounded-full bg-gray-100 p-6'>
                                <Ghost className='h-10 w-10 text-gray-400'/>
                            </div>
                            <h3 className='text-lg font-semibold text-gray-900'>
                                找不到相關裝備
                            </h3>
                            <p className='mt-2 max-w-sm text-gray-500'>
                                試試看放寬篩選條件，或是換個關鍵字搜尋吧！
                            </p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
