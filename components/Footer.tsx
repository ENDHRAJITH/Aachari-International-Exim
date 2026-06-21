"use client";

import Link from "next/link";

const rates = [
  { pair: "USD / INR", value: "83.54", trend: "up" },
  { pair: "EUR / INR", value: "89.97", trend: "up" },
  { pair: "AED / INR", value: "22.63", trend: "down" },
  { pair: "GBP / INR", value: "105.58", trend: "down" },
];

export default function Footer() {
  return (
    <footer
      className="
        relative
        overflow-hidden
        bg-ink
        text-cream
        px-12
        pt-20
        pb-10
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          inset-0
          opacity-40
          pointer-events-none
        "
        style={{
          background:
            "radial-gradient(circle at 15% 25%, rgba(217,121,38,.15), transparent 35%)",
        }}
      />

      <div className="relative z-10">
        {/* Top */}

        <div
          className="
            grid
            gap-[60px]
            border-b
            border-white/10
            pb-[50px]
            lg:grid-cols-[1.4fr_1fr_1fr_1fr]
          "
        >
          {/* Brand */}

          <div>
            <h3
              className="
                text-[1.6rem]
                font-medium
                leading-tight
              "
            >
              Aachari International Exim
            </h3>

            <p
              className="
                mt-[14px]
                max-w-[340px]
                text-[0.92rem]
                leading-8
                text-cream/60
              "
            >
              A house of traders proudly carrying Indian
              quality and craftsmanship to the world,
              since 2007.
            </p>

            {/* Social */}

            <div className="mt-6 flex gap-3">
              {["in", "𝕏", "◎", "◉"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="
                    flex
                    h-[38px]
                    w-[38px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    text-sm
                    transition-all
                    duration-300
                    hover:-translate-y-[3px]
                    hover:border-saffron
                    hover:bg-saffron
                  "
                >
                  {item}
                </a>
              ))}
            </div>

            {/* FX Card */}

            <div
              className="
                mt-[18px]
                flex
                flex-wrap
                items-start
                gap-[18px]
                rounded-[10px]
                border
                border-white/10
                bg-white/[0.04]
                px-4
                py-[14px]
              "
            >
              <span
                className="
                  text-[0.66rem]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-cream/50
                "
              >
                FX Rates
              </span>

              {rates.map((rate) => (
                <div
                  key={rate.pair}
                  className="
                    flex
                    flex-col
                    gap-[2px]
                  "
                >
                  <span
                    className="
                      text-[0.66rem]
                      tracking-[0.1em]
                      text-cream/50
                    "
                  >
                    {rate.pair}
                  </span>

                  <span
                    className={`
                      flex items-center gap-1
                      text-[0.95rem]
                      font-medium
                      ${
                        rate.trend === "up"
                          ? "text-[#6ed391]"
                          : "text-[#ff8c5a]"
                      }
                    `}
                  >
                    {rate.value}
                    {rate.trend === "up" ? "▲" : "▼"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Company */}

          <div>
            <h5
              className="
                mb-[18px]
                text-[0.74rem]
                uppercase
                tracking-[0.22em]
                text-gold-light
              "
            >
              Company
            </h5>

            <ul className="space-y-[10px]">
              <li>
                <Link
                  href="#about"
                  className="
                    text-[0.9rem]
                    text-cream/70
                    transition-colors
                    hover:text-saffron
                  "
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="#products"
                  className="
                    text-[0.9rem]
                    text-cream/70
                    transition-colors
                    hover:text-saffron
                  "
                >
                  Our Products
                </Link>
              </li>

              <li>
                <Link
                  href="#certificates"
                  className="
                    text-[0.9rem]
                    text-cream/70
                    transition-colors
                    hover:text-saffron
                  "
                >
                  Certificates
                </Link>
              </li>

              <li>
                <Link
                  href="#contact"
                  className="
                    text-[0.9rem]
                    text-cream/70
                    transition-colors
                    hover:text-saffron
                  "
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Trade */}

          <div>
            <h5
              className="
                mb-[18px]
                text-[0.74rem]
                uppercase
                tracking-[0.22em]
                text-gold-light
              "
            >
              Trade
            </h5>

            <ul className="space-y-[10px]">
              <li>
                <a
                  href="#terms"
                  className="
                    text-[0.9rem]
                    text-cream/70
                    transition-colors
                    hover:text-saffron
                  "
                >
                  Payment Terms
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="
                    text-[0.9rem]
                    text-cream/70
                    transition-colors
                    hover:text-saffron
                  "
                >
                  E-Catalogue
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="
                    text-[0.9rem]
                    text-cream/70
                    transition-colors
                    hover:text-saffron
                  "
                >
                  Logistics
                </a>
              </li>

              <li>
                <a
                  href="#"
                  className="
                    text-[0.9rem]
                    text-cream/70
                    transition-colors
                    hover:text-saffron
                  "
                >
                  Quality Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}

          <div>
            <h5
              className="
                mb-[18px]
                text-[0.74rem]
                uppercase
                tracking-[0.22em]
                text-gold-light
              "
            >
              Newsletter
            </h5>

            <p
              className="
                mb-[14px]
                text-[0.88rem]
                leading-7
                text-cream/60
              "
            >
              Quarterly trade updates, harvest reports &
              new SKU launches.
            </p>

            <input
              type="email"
              placeholder="your@email.com"
              className="
                w-full
                rounded-md
                border
                border-white/[0.18]
                bg-white/[0.05]
                px-3
                py-3
                text-cream
                outline-none
                placeholder:text-cream/35
              "
            />
          </div>
        </div>

        {/* Bottom */}

        <div
          className="
            flex
            items-center
            justify-between
            pt-[30px]
            text-[0.82rem]
            text-cream/50
          "
        >
          <div>
            © 2026 Aachari International Exim Pvt Ltd ·
            All Rights Reserved
          </div>

          <div>
            Crafted with care in Chennai · GST
            33AAACA0000A1Z5
          </div>
        </div>
      </div>
    </footer>
  );
}