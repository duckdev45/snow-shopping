import { CategoriesSection } from '../components/home/CategoriesSection'
import { HeroSection } from '../components/home/HeroSection'
import { LatestListingsSection } from '../components/home/LatestListingsSection'
import { useTranslation } from '@/i18n/server'

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <LatestListingsSection />
      <CallToActionSection locale={locale} />
    </>
  )
}

async function CallToActionSection({ locale }: { locale: string }) {
  const { t } = await useTranslation(locale)
  return (
    <section className='bg-blue-700'>
      <div className='container mx-auto px-4 py-16 text-center lg:px-6'>
        <h2 className='mb-4 text-3xl font-bold text-white'>
          {t('CallToActionSection.title')}
        </h2>
        <p className='mx-auto mb-8 max-w-xl text-lg text-blue-200'>
          {t('CallToActionSection.description')}
        </p>
        <button className='rounded-full bg-white px-10 py-4 text-lg font-bold text-blue-700 shadow-2xl transition-colors hover:bg-blue-50'>
          {t('CallToActionSection.button')}
        </button>
      </div>
    </section>
  )
}
