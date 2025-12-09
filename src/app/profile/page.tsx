import {redirect} from 'next/navigation'
import Link from 'next/link'
import {createClient} from '@/lib/supabase/server'
import {ProductCard} from '@/components/product/product-card' //
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Button} from '@/components/ui/button'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Badge} from '@/components/ui/badge'
import {Package, Heart} from 'lucide-react'
import {EditProfileDialog} from './EditProfileDialog'
import {ProductItemActions} from './ProductItemActions'

export default async function ProfilePage() {
    const supabase = await createClient()

    // 1. 檢查登入
    const {
        data: {user}
    } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // 2. 抓取 Profile 資料
    const {data: profile} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // 3. 抓取「我的商品」
    const {data: myListings} = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', {ascending: false})

    // 4抓取「我的收藏」 (透過 join 查詢 products)
    const {data: myFavorites} = await supabase
        .from('favorites')
        .select(`
            product_id,
            products (*) 
        `)
        .eq('user_id', user.id)
        .order('created_at', {ascending: false})

    // 整理一下資料結構，因為上面抓出來會是 { product_id: ..., products: { ... } }
    // 我們需要把 products 拿出來變成一個陣列，並過濾掉可能已被刪除的商品
    const favoriteProducts = myFavorites?.map(f => f.products).filter(p => p !== null) || []
    const favoritedProductIds = new Set(myFavorites?.map(f => f.product_id) || [])

    return (
        <div className='container mx-auto min-h-screen px-4 pt-28 pb-10 lg:px-6'>
            {/* --- Header 區塊：個人名片 --- */}
            <div className='mb-10 flex flex-col items-center gap-6 md:flex-row md:items-start md:gap-10'>
                <div className='group relative'>
                    <Avatar className='h-32 w-32 border-4 border-white shadow-xl'>
                        <AvatarImage src={profile?.avatar_url}/>
                        <AvatarFallback className='text-4xl'>
                            {profile?.full_name?.[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>

                <div className='flex-1 space-y-2 text-center md:text-left'>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        {profile?.full_name || '未命名雪友'}
                    </h1>
                    <p className='text-gray-500'>
                        @{profile?.username || user.email?.split('@')[0]}
                    </p>

                    <div className='flex flex-wrap items-center justify-center gap-2 md:justify-start'>
                        <Badge
                            variant='secondary'
                            className='bg-blue-100 text-blue-700 hover:bg-blue-100'>
                            {profile?.snow_experience || '雪場菜鳥'}
                        </Badge>
                        <span className='text-sm text-gray-400'>
              加入於 {new Date(user.created_at).getFullYear()} 年
            </span>
                    </div>
                </div>

                <div className='flex gap-3'>
                    {/* 編輯資料按鈕 (Client Component) */}
                    <EditProfileDialog profile={profile}/>
                </div>
            </div>

            {/* --- Content 區塊：分頁 --- */}
            <Tabs defaultValue='listings' className='w-full'>
                <TabsList className='grid w-full max-w-md grid-cols-2'>
                    <TabsTrigger value='listings'>
                        <Package className='mr-2 h-4 w-4'/>
                        我的賣場 ({myListings?.length || 0})
                    </TabsTrigger>
                    <TabsTrigger value='favorites'>
                        <Heart className='mr-2 h-4 w-4'/>
                        收藏清單
                    </TabsTrigger>
                </TabsList>

                {/* Tab 1: 我的商品 */}
                <TabsContent value='listings' className='mt-6'>
                    {myListings && myListings.length > 0 ? (
                        <div className='grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
                            {myListings.map((product) => (
                                <div key={product.id} className='group relative'>
                                    <ProductCard
                                        id={product.id}
                                        title={product.title}
                                        category={product.category}
                                        price={product.price}
                                        condition={product.condition}
                                        imageUrl={product.images?.[0]}
                                        brand={product.brand}
                                        location={product.location}
                                        isFavorited={favoritedProductIds.has(product.id)}
                                        isLoggedIn={true}
                                    />

                                    {/* 判斷一下狀態，如果已經下架了，可以給個不同的樣式，或者直接蓋上遮罩 */}
                                    {product.status === 'sold' && (
                                        <div
                                            className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-gray-900/50 backdrop-blur-[1px]">
          <span
              className="rotate-[-12deg] rounded border-4 border-red-500 px-4 py-2 text-xl font-black text-red-500 opacity-80 shadow-2xl">
            已下架
          </span>
                                        </div>
                                    )}

                                    {/* 使用我們抽離出來的互動元件 */}
                                    <ProductItemActions productId={product.id}/>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className='flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-12 text-center'>
                            <p className='mb-4 text-gray-500'>
                                你的賣場空空如也，快去清庫存！
                            </p>
                            <Button asChild>
                                <Link href='/sell'>立即刊登</Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>

                {/* Tab 2: 收藏清單 */}
                <TabsContent value='favorites' className='mt-6'>
                    {favoriteProducts.length > 0 ? (
                        <div className='grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5'>
                            {favoriteProducts.map((product: any) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    title={product.title}
                                    category={product.category}
                                    price={product.price}
                                    condition={product.condition}
                                    imageUrl={product.images?.[0]}
                                    brand={product.brand}
                                    location={product.location}
                                    isFavorited={true}
                                    isLoggedIn={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className='flex flex-col items-center justify-center py-12 text-center text-gray-500'>
                            <Heart className='mb-4 h-12 w-12 text-gray-300'/>
                            <p>你還沒有收藏任何裝備喔！</p>
                            <Button variant="link" asChild className="mt-2">
                                <Link href="/browse">去逛逛</Link>
                            </Button>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}
