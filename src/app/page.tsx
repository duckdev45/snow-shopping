import { CategoriesSection } from '@/components/home/CategoriesSection'
import { HeroSection } from '@/components/home/HeroSection'
import { LatestListingsSection } from '@/components/home/LatestListingsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <LatestListingsSection />
    </>
  )
}
