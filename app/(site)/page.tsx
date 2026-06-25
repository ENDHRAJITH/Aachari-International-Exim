import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer";
import Terms from "@/components/Terms/Terms";
import Certificates from "@/components/certificates/Certificates";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import CertificatesSection from "@/components/certificates/CertificatesSection";
import HomeAbout from "@/components/About/HomeAbout";

export default function Home() {
  return (
    <>
        

      <main>
        <Hero />  
        <HomeAbout />
        <FeaturedProducts />
        <CertificatesSection mode="home" />
        <Terms/>
        <Contact />
        
      </main>
    </>
  );
}