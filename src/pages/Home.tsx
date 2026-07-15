import Hero from '../components/sections/Hero'
import Categories from '../components/sections/Categories'
import FeaturedProducts from '../components/sections/FeaturedProducts'
import MissionSection from '../components/sections/MissionSection'
import TrustStrip from '../components/sections/TrustStrip'

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Categories />
      <FeaturedProducts />
      <MissionSection />
    </>
  )
}
