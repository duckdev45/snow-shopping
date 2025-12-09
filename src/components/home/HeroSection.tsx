'use client'

import { Button } from '@/components/ui/button'

export function HeroSection() {
  const handleScrollToCategories = () => {
    const categoriesSection = document.getElementById('categories-section')
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className='relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat text-white'
      style={{ backgroundImage: "url('/hero-bg.png')" }}>
      <div className='absolute inset-0 bg-black/50'></div>
      <div className='relative z-10 container mx-auto px-4 py-24 text-center md:py-32 lg:px-6 lg:py-40'>
        <h1 className='mb-4 text-4xl font-bold tracking-wider md:text-5xl lg:text-6xl'>
          斷捨離你的雪季回憶
        </h1>
        <p className='mx-auto mb-8 max-w-2xl text-base text-gray-200 md:text-xl'>
          在「雪拼」找到裝備的下一段旅程，或為你的下一趟冒險尋寶
        </p>
        <div className='mx-auto max-w-xl'>
          <Button
            onClick={handleScrollToCategories}
            className='rounded-full bg-white/30 px-6 py-2.5 font-semibold text-white shadow-lg transition-colors'>
            開始探索雪拼
          </Button>
        </div>
      </div>
    </section>
  )
}
