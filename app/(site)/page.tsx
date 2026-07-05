import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Certificates from "@/components/certificates/Certificates";
import FeaturedProducts from "@/components/products/FeaturedProducts";
import CertificatesSection from "@/components/certificates/CertificatesSection";
import HomeAbout from "@/components/About/HomeAbout";
import InternationalStandards from "@/components/certificates/InternationalStandards";
import TradeNetworkLoader from "@/components/TradeNetworkLoader";
 
import FAQ from "@/components/FAQ/FAQ";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <HomeAbout />
        <FeaturedProducts />
        <TradeNetworkLoader />
        <FAQ />
        <InternationalStandards />
        <Contact />
        
      </main>
    </>
  );
}