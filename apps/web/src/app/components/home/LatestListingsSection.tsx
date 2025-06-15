import Link from "next/link";
import {ProductCard} from "../../ui/ProductCard";

// 範例資料，未來會從後端 API 取得
const sampleProducts = [
    {
        id: '1',
        name: 'Burton Custom 2023 公分板',
        category: '單板 Snowboard',
        price: 8500,
        imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Burton+Custom'
    },
    {
        id: '2',
        name: '[全新] Oakley Flight Deck M 雪鏡',
        category: '雪鏡 Goggle',
        price: 4200,
        imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Oakley+Goggles'
    },
    {
        id: '3',
        name: '二手 Burton Ion 雪鞋 9.5號',
        category: '雪鞋 Boots',
        price: 6000,
        imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Burton+Ion'
    },
    {
        id: '4',
        name: 'Volcom 雪衣外套 L號 女款',
        category: '雪衣雪褲 Apparel',
        price: 3800,
        imageUrl: 'https://placehold.co/400x300/e2e8f0/334155?text=Volcom+Jacket'
    },
];

export function LatestListingsSection() {
    return (
        <section className="py-16">
            <div className="container mx-auto px-4 lg:px-6">
                <h2 className="text-3xl font-bold text-center mb-10">最新上架</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {sampleProducts.map((product) => (
                        <ProductCard key={product.id} {...product} />
                    ))}
                </div>
                <div className="text-center mt-12">
                    <Link href="/browse"
                          className="px-8 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors shadow-lg">
                        瀏覽所有裝備
                    </Link>
                </div>
            </div>
        </section>
    );
}
