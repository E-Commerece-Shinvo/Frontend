import Hero from '../../components/home/Hero/Hero'
import Features from '../../components/home/Features/Features'
import Bestsellers from '../../components/home/Bestsellers/Bestsellers'
import ShopBanner from '../../components/home/ShopBanner/ShopBanner'
import PowerYourLife from '../../components/home/PowerYourLife/PowerYourLife'
import NewArrivals from '../../components/home/NewArrivals/NewArrivals'
import Testimonials from '../../components/home/Testimonials/Testimonials'
import Trust from '../../components/home/Trust/Trust'
import ContactInfo from '../../components/home/ContactInfo/ContactInfo'
import Footer from '../../components/layout/Footer/Footer'
import Brands from '../../components/home/Brands/Brands'
import Categories from '../../components/home/Categories/Categories'
import shop1 from '../../assets/shop1.gif'
import shop2 from '../../assets/shop2.gif'

function Home() {
  return (
    <div className='w-[100vw]'>
      <Hero />
      {/* <Features /> */}
      <Categories />
      <Bestsellers />
      <ShopBanner imgageShop={shop1} title="Shop Pixel Cases" />
      <ShopBanner imgageShop={shop2} title="Shop Mobile Holder" />
      <PowerYourLife />
      <Brands />
      <NewArrivals />
      <Testimonials />
      <Trust />
      <ContactInfo />

      <Footer />
    </div>
  )
}

export default Home
