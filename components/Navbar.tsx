"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { X, Menu } from "lucide-react";
import CurrencyMarquee from "./CurrencyMarquee";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Certificates", href: "/certificates" },
  { label: "Payment Terms", href: "/payment-terms" },
  { label: "FAQ", href: "/faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
 <header
  className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
    scrolled
      ? "bg-cream/40 backdrop-blur-xl border-b border-white/20"
      : "bg-transparent"
  }`}
>
        {/* Marquee - always pinned to the very top */}
        <CurrencyMarquee />

        {/* Nav - own padding, independent of marquee */}
        <nav
          className={`mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-10 transition-all duration-500 ${
            scrolled ? "py-4" : "py-6"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="cursor-hover flex items-center gap-3">
            <div className="relative h-[56px] w-[56px] lg:h-[90px] lg:w-[90px]">
              <div className="absolute -inset-1 rounded-full border border-dashed border-saffron opacity-80 animate-[slow-spin_14s_linear_infinite]" />
              <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src="/123.jpeg"
                alt="Aachari International"
                fill
                priority
                className="object-cover scale-[1]"
              />
            </div>
            </div>
            <div>
              <h2 className="text-[18px] lg:text-[22px] font-semibold leading-none text-ink">
                Aachari International
              </h2>
              <p className="mt-1 text-[12px] lg:text-[14px] uppercase tracking-[0.3em] text-ink-soft">
                EXIM PVT LTD
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex items-center rounded-full border border-black/5 bg-white/20 px-2 py-2 backdrop-blur-md">
            {navLinks.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={`cursor-hover px-6 py-2 rounded-full text-[14px] transition-all ${
                    isActive(item.href)
                      ? "bg-ink text-cream"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Link
            href="/contact"
            className="cursor-hover hidden lg:flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-[12px] uppercase tracking-[0.08em] text-cream"
          >
            Contact
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-ink text-cream"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
        </nav>
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm lg:hidden"
          style={{ animation: "fadeIn 0.2s ease" }}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[80%] max-w-[320px] bg-cream lg:hidden flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-black/[0.06]">
          <div>
            <p className="text-[13px] font-semibold text-ink">Menu</p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">
              Navigation
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-9 h-9 rounded-full bg-ink/10 flex items-center justify-center text-ink"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col px-4 py-6 gap-1 flex-1">
          {navLinks.map((item, idx) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{ animationDelay: `${idx * 40}ms` }}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-medium transition-all ${
                isActive(item.href)
                  ? "bg-ink text-cream"
                  : "text-ink hover:bg-ink/5"
              }`}
            >
              {item.label}
              {isActive(item.href) && (
                <span className="text-[10px] bg-saffron text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Active
                </span>
              )}
            </Link>
          ))}
        </div>

        <div className="px-4 pb-8">
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-ink text-cream py-4 text-[13px] uppercase tracking-[0.08em] font-medium"
          >
            Contact
          </Link>
          <p className="text-center text-[11px] text-ink-soft mt-4">
            Aachari International Exim Pvt Ltd
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}