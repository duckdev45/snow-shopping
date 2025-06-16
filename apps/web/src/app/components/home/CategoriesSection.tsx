import Link from 'next/link';

const categories = [
    {name: '單板 (Snowboard)', emoji: '🏂', href: '/browse?category=snowboard'},
    {name: '雙板 (Ski)', emoji: '⛷️', href: '/browse?category=ski'},
    {name: '雪衣雪褲', emoji: '🦺', href: '/browse?category=apparel'},
    {name: '雪鏡', emoji: '🥽', href: '/browse?category=goggles'},
    {name: '手套配件', emoji: '🧤', href: '/browse?category=accessories'},
    {name: '雪鞋', emoji: '🥾', href: '/browse?category=boots'},
];

export function CategoriesSection() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 lg:px-6">
                <h2 className="text-3xl font-bold text-center mb-10">探索熱門分類</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {categories.map((category) => (
                        <Link key={category.name} href={category.href}
                              className="block group text-center p-4 rounded-xl border border-gray-200 hover:shadow-lg hover:border-blue-500 transition-all">
                            <div
                                className="flex items-center justify-center h-24 w-24 bg-blue-100 rounded-full mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                <span className="text-4xl">{category.emoji}</span>
                            </div>
                            <h3 className="font-semibold text-gray-800">{category.name}</h3>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
