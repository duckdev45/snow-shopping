import Link from 'next/link'
import { ProductCard } from '@/components/ui/product-card'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

// 這裡改成 async function
export async function LatestListingsSection() {
  const supabase = await createClient()

  // 直接從 DB 撈最新 4 筆 active 的商品
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) {
    console.error('Error fetching products:', error)
    // 這裡可以做個錯誤處理 UI，或是回傳 null
    return null
  }

  return (
    <section className='py-16'>
      <div className='container mx-auto px-4 lg:px-6'>
        <h2 className='mb-10 text-center text-3xl font-bold'>最新上架</h2>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4'>
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.title}
              category={product.category}
              price={product.price}
              condition={product.condition}
              imageUrl={product.images?.[0] || '/placeholder.png'}
            />
          ))}
        </div>

        {/* 如果沒有商品顯示一點提示 */}
        {products?.length === 0 && (
          <div className='text-center text-gray-500'>
            目前沒有上架商品，快來當第一個賣家！
          </div>
        )}

        <div className='mt-12 text-center'>
          <Button
            asChild
            className='rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700'>
            <Link href='/browse'>瀏覽所有裝備</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
