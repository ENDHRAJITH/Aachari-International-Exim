import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero/Hero";
import About from "@/components/About/About";
import Contact from "@/components/Contact/Contact";
import Footer from "@/components/Footer";
import Terms from "@/components/Terms/Terms";
import Certificates from "@/components/certificates/Certificates";

export default function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />  
        <About />
        <Certificates/>
        <Terms/>
        <Contact />
        <Footer />
      </main>
    </>
  );
}