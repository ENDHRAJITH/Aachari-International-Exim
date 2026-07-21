'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function SiteLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isCataloguePage = pathname === '/catalogue' || pathname.startsWith('/catalogue/');

  return (
    <>
      {!isCataloguePage && <Navbar />}
      
      <main>{children}</main>
      
      {!isCataloguePage && <Footer />}
      <WhatsAppButton />
    </>
  )
}