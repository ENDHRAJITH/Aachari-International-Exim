"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-ink
        text-cream
        px-6
        lg:px-12
        pt-20
        pb-10
      "
    >
      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% 25%, rgba(217,121,38,.15), transparent 35%)",
        }}
      />

      <div className="relative z-10 max-w-[1320px] mx-auto">
        {/* Top Section */}
        <div
          className="
            grid
            gap-12
            border-b
            border-white/10
            pb-12
            lg:grid-cols-[1.4fr_1fr_1fr_1fr]
          "
        >
          {/* Brand */}
          <div>
            <h3 className="text-[1.6rem] font-medium leading-tight">
              Aachari International Exim Pvt Ltd
            </h3>

            <p className="mt-4 max-w-[340px] text-[0.92rem] leading-8 text-cream/60">
              A house of traders proudly carrying Indian quality and
              craftsmanship to the world since 2026.
            </p>

            {/* Social Icons */}
            <div className="mt-6 flex gap-3">
              {[
                {
                  label: "LinkedIn",
                  href: "https://linkedin.com/company/your-page",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
                    </svg>
                  ),
                },
                {
                  label: "X",
                  href: "https://x.com/your_handle",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-6.9l-5.4-6.6L4.8 22H1.7l8.1-9.3L1 2h7l4.9 6.1L18.9 2zm-1.2 18.2h1.9L7.4 3.7H5.4l12.3 16.5z" />
                    </svg>
                  ),
                },
                {
                  label: "Instagram",
                  href: "https://instagram.com/your_handle",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12 2c-2.72 0-3.06.01-4.13.06-1.07.05-1.8.22-2.44.47-.66.26-1.22.6-1.78 1.16a4.94 4.94 0 0 0-1.16 1.78c-.25.64-.42 1.37-.47 2.44C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.13c.05 1.07.22 1.8.47 2.44.26.66.6 1.22 1.16 1.78.56.56 1.12.9 1.78 1.16.64.25 1.37.42 2.44.47C8.94 21.99 9.28 22 12 22s3.06-.01 4.13-.06c1.07-.05 1.8-.22 2.44-.47a4.94 4.94 0 0 0 1.78-1.16 4.94 4.94 0 0 0 1.16-1.78c.25-.64.42-1.37.47-2.44.05-1.07.06-1.41.06-4.13s-.01-3.06-.06-4.13c-.05-1.07-.22-1.8-.47-2.44a4.94 4.94 0 0 0-1.16-1.78 4.94 4.94 0 0 0-1.78-1.16c-.64-.25-1.37-.42-2.44-.47C15.06 2.01 14.72 2 12 2zm0 1.8c2.67 0 2.99.01 4.04.06.98.04 1.5.2 1.86.34.47.18.8.4 1.15.75.35.35.57.68.75 1.15.14.36.3.88.34 1.86.05 1.05.06 1.37.06 4.04s-.01 2.99-.06 4.04c-.04.98-.2 1.5-.34 1.86-.18.47-.4.8-.75 1.15-.35.35-.68.57-1.15.75-.36.14-.88.3-1.86.34-1.05.05-1.37.06-4.04.06s-2.99-.01-4.04-.06c-.98-.04-1.5-.2-1.86-.34a3.14 3.14 0 0 1-1.15-.75 3.14 3.14 0 0 1-.75-1.15c-.14-.36-.3-.88-.34-1.86C3.81 14.99 3.8 14.67 3.8 12s.01-2.99.06-4.04c.04-.98.2-1.5.34-1.86.18-.47.4-.8.75-1.15.35-.35.68-.57 1.15-.75.36-.14.88-.3 1.86-.34C9.01 3.81 9.33 3.8 12 3.8zm0 3.05a5.15 5.15 0 1 0 0 10.3 5.15 5.15 0 0 0 0-10.3zm0 8.5a3.35 3.35 0 1 1 0-6.7 3.35 3.35 0 0 1 0 6.7zm5.35-8.7a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z" />
                    </svg>
                  ),
                },
                {
                  label: "WhatsApp",
                  href: "https://wa.me/917305982029",
                  icon: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2zm0 18.13h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.55-3.7 8.21-8.24 8.21zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.4-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.24-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.36-.77-1.86-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.86-.87 2.09 0 1.23.9 2.42 1.02 2.59.12.17 1.76 2.7 4.28 3.78.6.26 1.06.42 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.15-1.19-.07-.11-.23-.17-.48-.29z" />
                    </svg>
                  ),
                },
              ].map((item) => (
                
               <a   key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-saffron
                    hover:bg-saffron
                    hover:text-white
                  "
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h5 className="mb-5 text-[0.74rem] uppercase tracking-[0.22em] text-gold-light">
              Company
            </h5>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/products"
                  className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  Our Products
                </Link>
              </li>

              <li>
                <Link
                  href="/certificates"
                  className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  Certificates
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Trade */}
          <div>
            <h5 className="mb-5 text-[0.74rem] uppercase tracking-[0.22em] text-gold-light">
              Trade
            </h5>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/payment-terms"
                  className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  Payment Terms
                </Link>
              </li>

              <li>
                <Link
                  href="/catalogue"
                  className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  E-Catalogue
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h5 className="mb-5 text-[0.74rem] uppercase tracking-[0.22em] text-gold-light">
              Get In Touch
            </h5>

            <div className="space-y-5">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-cream/45">
                  Address
                </p>

                <p className="mt-1 text-[0.88rem] leading-7 text-cream/70">
                  No. 15, 5th Street, A N Kandigai, Palanipet,
                  Arakkonam, Vellore District, Tamil Nadu – 631002.
                </p>
              </div>

              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-cream/45">
                  Phone
                </p>

                
                 <a href="tel:+917305982029"
                  className="mt-1 block text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  +91 73059 82029
                </a>
              </div>

              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-cream/45">
                  Email
                </p>

                
              <a    href="mailto:aachariinternationaleximpvtltd@gmail.com"
                  className="mt-1 block break-all text-[0.88rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  aachariinternationaleximpvtltd@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="
            flex
            flex-col
            gap-4
            pt-8
            text-[0.82rem]
            text-cream/50
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div>
            © {new Date().getFullYear()} Aachari International Exim
            Pvt Ltd · All Rights Reserved
          </div>

          {/* <div className="flex items-center gap-4">
            <Link
              href="/privacy-policy"
              className="hover:text-saffron transition-colors"
            >
              Privacy Policy
            </Link>

            <span className="text-cream/20">|</span>

            <Link
              href="/terms"
              className="hover:text-saffron transition-colors"
            >
              Terms of Service
            </Link>
          </div> */}

          <div>CIN: U46909TN2026PTC193669</div>
        </div>
      </div>
    </footer>
  );
}