"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Products", href: "#products" },
  { label: "Certificates", href: "#certificates" },
  { label: "Payment Terms", href: "#terms" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-cream/90 backdrop-blur-xl py-4"
          : "bg-transparent py-6"
      }`}
    >
      <nav
        className="
          mx-auto
          flex
          max-w-[1400px]
          items-center
          justify-between
          px-10
        "
      >
        {/* Logo */}

        <Link
          href="/"
          className="cursor-hover flex items-center gap-3"
        >
          <div className="relative h-[56px] w-[56px]">
            <div
              className="
                absolute
                -inset-1
                rounded-full
                border
                border-dashed
                border-saffron
                opacity-40
                animate-[slow-spin_14s_linear_infinite]
              "
            />

            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src="/logo.png"
                alt="Aachari International"
                fill
                priority
                className="object-cover scale-[1.7]"
              />
            </div>
          </div>

          <div>
            <h2
              className="
                text-[18px]
                font-semibold
                leading-none
                text-ink
              "
            >
              Aachari International
            </h2>

            <p
              className="
                mt-1
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-ink-soft
              "
            >
              EXIM PVT LTD
            </p>
          </div>
        </Link>

        {/* Navigation */}

        <ul
          className="
            hidden
            lg:flex
            items-center
            rounded-full
            border
            border-black/5
            bg-white/20
            px-2
            py-2
            backdrop-blur-md
          "
        >
          {navLinks.map((item, index) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`
                  cursor-hover
                  px-6
                  py-2
                  rounded-full
                  text-[14px]
                  transition-all
                  ${
                    index === 0
                      ? "bg-ink text-cream"
                      : "text-ink-soft hover:text-ink"
                  }
                `}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}

        <button
          className="
            cursor-hover
            hidden
            lg:flex
            items-center
            gap-2
            rounded-full
            bg-ink
            px-8
            py-4
            text-[12px]
            uppercase
            tracking-[0.08em]
            text-cream
          "
        >
          📖 REQUEST QUOTE
        </button>

        <button
          className="
            lg:hidden
            text-3xl
          "
        >
          ☰
        </button>
      </nav>
    </header>
  );
}