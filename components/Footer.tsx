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
                { label: "in", href: "#" },
                { label: "𝕏", href: "#" },
                { label: "◎", href: "#" },
                { label: "◉", href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    text-sm
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-saffron
                    hover:bg-saffron
                    hover:text-white
                  "
                >
                  {item.label}
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

              <li>
                <Link
                  href="/logistics"
                  className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  Logistics
                </Link>
              </li>

              <li>
                <Link
                  href="/quality-policy"
                  className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  Quality Policy
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

                <a
                  href="tel:+917305982029"
                  className="mt-1 block text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                >
                  +91 73059 82029
                </a>
              </div>

              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-cream/45">
                  Email
                </p>

                <a
                  href="mailto:aachariinternationaleximpvtltd@gmail.com"
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

          <div className="flex items-center gap-4">
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
          </div>

          <div>CIN: U46909TN2026PTC193669</div>
        </div>
      </div>
    </footer>
  );
}