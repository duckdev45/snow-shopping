import Link from 'next/link';

export function SiteFooter() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 lg:px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">雪拼 Snow Shopping</h3>
                        <p className="text-gray-400 text-sm">為你的下一趟冒險尋寶，<br />也為裝備的下一段旅程找到歸宿。</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">探索</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/browse" className="text-gray-400 hover:text-white">所有分類</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white">如何刊登</Link></li>
                            <li><Link href="#" className="text-gray-400 hover:text-white">交易安全</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">關於</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="text-gray-400 hover:text-white">關於我們</Link></li>
                            <li><Link href="/terms" className="text-gray-400 hover:text-white">服務條款</Link></li>
                            <li><Link href="/privacy" className="text-gray-400 hover:text-white">隱私權政策</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white mb-4">關注我們</h3>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-white"><InstagramIcon className="h-6 w-6"/></a>
                            <a href="#" className="text-gray-400 hover:text-white"><FacebookIcon className="h-6 w-6"/></a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} 雪拼 Snow Shopping. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
}
