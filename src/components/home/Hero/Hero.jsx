import Navbar from "../../layout/Navbar/Navbar";
import { BsArrowUpRight } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";
import { Link } from "react-router-dom";



const Hero = () => {
  return (
    <div className="w-full max-h-[1380px] h-[600px] sm:h-[750px] lg:h-[970px] bg-img-custom bg-[url('../assets/images/bg.jpg')] bg-cover bg-center mx-auto flex flex-col relative overflow-hidden">
      {/* Navbar handled globally in App.jsx */}

      {/* Main Content Area - Relative for positioning */}
      <div className="flex-grow w-full max-w-[1920px] mx-auto relative h-full">

        {/* --- Social Icons --- */}
        {/* Mobile: Vertical on Right. Desktop: Horizontal Top Right */}
        <div className="absolute right-4 top-[20%] flex flex-col gap-4 z-20 lg:right-10 lg:flex-row">
          <div className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-white hover:bg-[#02D5E0] flex items-center justify-center rounded-full cursor-pointer transition-colors">
            <FaFacebookF className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] text-black" />
          </div>
          <div className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-white hover:bg-[#02D5E0] flex items-center justify-center rounded-full cursor-pointer transition-colors">
            <FaInstagram className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] text-black" />
          </div>
          <div className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] bg-white hover:bg-[#02D5E0] flex items-center justify-center rounded-full cursor-pointer transition-colors">
            <IoLogoWhatsapp className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px] text-black" />
          </div>
        </div>

        {/* --- Product Cards (Desktop Only) --- */}

        {/* Left Card - Watch (Mid Left) */}
        <div className="hidden lg:flex absolute top-[18%] left-20 w-[200px] h-[200px] xl:w-[230px] xl:h-[230px] rounded-[40px] shadow-hard-card bg-img-custom bg-[url('../assets/images/products/hero1.png')] bg-cover bg-center items-center justify-center z-10 animate-float">
          <Link to="/##"><BsArrowUpRight className="p-4 w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] rounded-full bg-white text-cta-cyan hover:bg-[#02D5E0] hover:shadow-[#09D8DF] shadow-4xl hover:text-white transition-colors" /></Link>
        </div>

        {/* Right Card - Phone (Bottom Right) */}
        <div className="hidden lg:flex absolute bottom-40 right-10 xl:right-20 w-[200px] h-[200px] xl:w-[230px] xl:h-[230px] rounded-[40px] shadow-hard-card bg-img-custom bg-[url('../assets/images/products/hero2.png')] bg-cover bg-center items-center justify-center z-10 animate-float-delayed rotate-[20deg]">
          <Link to="/##"><BsArrowUpRight className="p-4 w-[50px] h-[50px] xl:w-[60px] xl:h-[60px] rounded-full bg-white text-cta-cyan hover:bg-[#02D5E0] shadow-[#09D8DF] shadow-4xl hover:text-white transition-colors" /></Link>
        </div>


        {/* --- Text Content --- */}
        {/* Mobile: Bottom Center. Desktop: Bottom Left */}
        <div className="absolute bottom-25 w-full px-4 text-center lg:text-left lg:bottom-35 lg:left-20 lg:w-auto z-20">
          <h1 className="max-[375px]:text-[26px] text-[28px] font-bold sm:text-4xl md:text-6xl lg:text-6xl xl:text-[70px] leading-tight mb-4 text-white">
            Elevate Your<br className="hidden lg:block" /> Everyday
          </h1>
          <p className="text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-white font-[400] max-w-[600px] mx-auto lg:mx-0">
            Smart accessories for a connected life. Shop Mobile Cases, Earbuds, Cables & More.
          </p>
        </div>

        {/* --- CTA Button --- */}
        {/* Mobile: Bottom Center (below text). Desktop: Bottom Center */}
        <div className="absolute bottom-10 lg:bottom-15 left-1/2 transform -translate-x-1/2 z-20">
          <div className="btn-primary xl:px-2 w-[150px] lg:h-[60px] h-[50px] sm:w-[180px] sm:h-[50px] xl:w-[230px] xl:h-[70px] flex items-center justify-center gap-4 rounded-full text-[14px] sm:text-[18px] xl:text-[24px] text-black font-semibold cursor-pointer hover:scale-105 transition-transform">
            Shop Now
            {/* <Link to="/##"><BsArrowUpRight className="p-3 w-[35px] h-[35px] sm:w-[40px] sm:h-[40px] xl:p-4 xl:w-[50px] xl:h-[50px] rounded-full bg-white text-cta-cyan" /></Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;