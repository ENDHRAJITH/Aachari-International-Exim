import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ScrollPlane from "@/components/ScrollPlane";

export default function SiteLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
        
      <Footer />
      <WhatsAppButton />
      <ScrollPlane />
    </>
  )
}