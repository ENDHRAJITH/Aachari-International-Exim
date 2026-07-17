"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

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

  // Measure the active link's position/width so the pill can glide to it —
  // purely visual, doesn't touch any layout width/height.
  const measurePill = () => {
    const activeIdx = navLinks.findIndex((item) => isActive(item.href));
    const el = itemRefs.current[activeIdx];
    const list = listRef.current;
    if (!el || !list) return;
    const listRect = list.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPill({ left: elRect.left - listRect.left, width: elRect.width, ready: true });
  };

  useEffect(() => {
    measurePill();
    window.addEventListener("resize", measurePill);
    return () => window.removeEventListener("resize", measurePill);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, scrolled]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-cream/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
            : "bg-transparent"
        }`}
      >
        {/* Marquee - always pinned to the very top */}
        <CurrencyMarquee />

        {/* Nav - 3-column grid, edge-to-edge padding so logo/CTA sit close to the borders */}
        <nav
          className={`mx-auto grid w-full max-w-[1600px] grid-cols-[auto_1fr_auto] items-center px-3 lg:px-6 transition-all duration-500 ${
            scrolled ? "py-3" : "py-5"
          }`}
        >
          {/* Logo — flush to the left edge */}
          <Link href="/" className="cursor-hover flex items-center gap-4 justify-self-start">
            <div
              className={`relative transition-all duration-500 ease-out ${
                scrolled
                  ? "h-[50px] w-[50px] lg:h-[68px] lg:w-[68px]"
                  : "h-[62px] w-[62px] lg:h-[92px] lg:w-[92px]"
              }`}
            >
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
              <h2
                className={`font-semibold leading-none text-ink transition-all duration-500 ${
                  scrolled ? "text-[17px] lg:text-[19px]" : "text-[18px] lg:text-[22px]"
                }`}
              >
                Aachari International
              </h2>
              <p className="mt-1 text-[11px] lg:text-[12px] uppercase tracking-[0.25em] text-ink-soft">
                EXIM PVT LTD
              </p>
            </div>
          </Link>

          {/* Desktop Nav — dead center of the row */}
          <ul
            ref={listRef}
            className="relative hidden lg:flex items-center justify-self-center rounded-full border border-black/5 bg-white px-3 py-3 backdrop-blur-md"
          >
            {/* Sliding active pill */}
            <span
              aria-hidden
              className="absolute top-1.5 bottom-1.5 rounded-full bg-ink transition-[left,width] duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]"
              style={{
                left: pill.left,
                width: pill.width,
                opacity: pill.ready ? 1 : 0,
              }}
            />
            {navLinks.map((item, idx) => (
              <li key={item.label} className="relative z-10">
                <Link
                  ref={(el) => {
                    itemRefs.current[idx] = el;
                  }}
                  href={item.href}
                  className={`cursor-hover block px-6 py-2 rounded-full text-[14px] transition-colors duration-300 whitespace-nowrap ${
                    isActive(item.href)
                      ? "text-cream"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTA — flush to the right edge */}
          <Link
            href="/contact"
            className="cursor-hover hidden lg:flex items-center gap-2 justify-self-end rounded-full bg-ink px-8 py-4 text-[12px] uppercase tracking-[0.08em] text-cream"
          >
            Contact
          </Link>

          {/* Mobile Hamburger — flush right on mobile */}
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden flex items-center justify-center justify-self-end w-9 h-9 rounded-full bg-ink text-cream"
            aria-label="Open menu"
          >
            <Menu size={18} />
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