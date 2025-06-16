export function HeroSection() {
    return (
        <section className="hero-bg min-h-screen w-full relative flex justify-center items-center text-white">
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="container mx-auto px-4 lg:px-6 py-24 md:py-32 lg:py-40 relative z-10 text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">斷捨離你的雪季回憶</h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto">在「雪拼」找到裝備的下一段旅程，或為你的下一趟冒險尋寶。</p>
                <div className="max-w-xl mx-auto">
                    <div className="relative">
                        <input type="search" placeholder="search..."
                               className="w-full pl-5 pr-32 py-4 border-none rounded-full bg-white/90 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all text-lg"/>
                        <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 text-base font-semibold text-white bg-blue-400 hover:bg-green-600 rounded-full transition-colors shadow-lg">搜尋
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
