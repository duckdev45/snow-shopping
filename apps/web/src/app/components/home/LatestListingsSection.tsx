import Link from 'next/link'
import { ProductCard } from '../../ui/ProductCard'

// 範例資料，未來會從後端 API 取得
const sampleProducts = [
  {
    id: '1',
    name: 'Burton Custom 2023 公分板',
    category: '單板 Snowboard',
    price: 8500,
    imageUrl: '/'
  },
  {
    id: '2',
    name: '[全新] Oakley Flight Deck M 雪鏡',
    category: '雪鏡 Goggle',
    price: 4200,
    imageUrl: '/'
  },
  {
    id: '3',
    name: '二手 Burton Ion 雪鞋 9.5號',
    category: '雪鞋 Boots',
    price: 6000,
    imageUrl: '/'
  },
  {
    id: '4',
    name: 'Volcom 雪衣外套 L號 女款',
    category: '雪衣雪褲 Apparel',
    price: 3800,
    imageUrl: '/'
  }
]

export function LatestListingsSection() {
  return (
    <section className='py-16'>
      <div className='container mx-auto px-4 lg:px-6'>
        <h2 className='mb-10 text-center text-3xl font-bold'>最新上架</h2>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-4'>
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        <div className='mt-12 text-center'>
          <Link
            href='/browse'
            className='rounded-full bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-lg transition-colors hover:bg-blue-700'>
            瀏覽所有裝備
          </Link>
        </div>
      </div>
    </section>
  )
}
