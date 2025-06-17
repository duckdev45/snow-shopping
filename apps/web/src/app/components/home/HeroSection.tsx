export function HeroSection() {
  return (
    <section className='hero-bg relative flex min-h-screen w-full items-center justify-center text-white'>
      <div className='absolute inset-0 bg-black/50'></div>
      <div className='container relative z-10 mx-auto px-4 py-24 text-center md:py-32 lg:px-6 lg:py-40'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl'>
          斷捨離你的雪季回憶
        </h1>
        <p className='mx-auto mb-8 max-w-2xl text-lg text-gray-200 md:text-xl'>
          在「雪拼」找到裝備的下一段旅程，或為你的下一趟冒險尋寶。
        </p>
        <div className='mx-auto max-w-xl'>
          <div className='relative'>
            <input
              type='search'
              placeholder='search...'
              className='w-full rounded-full border-none bg-white/90 py-4 pl-5 pr-32 text-lg text-gray-800 placeholder-gray-500 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300'
            />
            <button className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-blue-400 px-6 py-2.5 text-base font-semibold text-white shadow-lg transition-colors hover:bg-green-600'>
              搜尋
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
