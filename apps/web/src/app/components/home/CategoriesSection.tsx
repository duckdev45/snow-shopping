import Link from 'next/link';
import Image from "next/image";

const categories = [
    {name: '單板 (Snowboard)', imageUrl: '/images/snowboard.png', href: '/browse?category=snowboard'},
    {name: '雙板 (Ski)', imageUrl: '/images/ski.png', href: '/browse?category=ski'},
    {name: '雪衣雪褲', imageUrl: '/images/jacketW.png', href: '/browse?category=apparel'},
    {name: '雪鏡', imageUrl: '/images/goggles.png', href: '/browse?category=goggles'},
    {name: '安全帽', imageUrl: '/images/helmet.png', href: '/browse?category=helmet'},
    {name: '手套', imageUrl: '/images/gloves.png', href: '/browse?category=accessories'},
    {name: '雪鞋', imageUrl: '/images/boots.png', href: '/browse?category=boots'},
    {name: '雪票', imageUrl: '/images/ticket.png', href: '/browse?category=ticker'},
    {name: '其他', imageUrl: '/images/other.png', href: '/browse?category=other'},
];

export function CategoriesSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 lg:px-6">
                <h2 className="text-3xl font-bold text-center text-gray-600 mb-10">categories</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <Link key={category.name} href={category.href}
                              className="block group text-center p-4 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-all">
                            <div
                                className="flex items-center justify-center h-24 w-24 bg-blue-100 rounded-full overflow-hidden mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                <Image
                                    src={category.imageUrl}
                                    alt={`${category.name} 分類圖示`}
                                    width={100} // 提供寬高讓 Next.js 優化
                                    height={100}
                                    className="object-contain" // 確保圖片比例正確
                                />
                            </div>
                            <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
