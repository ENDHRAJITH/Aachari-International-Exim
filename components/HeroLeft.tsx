"use client";
import LiveDashboard from "./LiveDashboard";
import Link from "next/link";

export default function HeroLeft() {
  return (
    <div className="relative z-10">
      {/* Eyebrow */}

      <div
        className="
          mb-7
          inline-flex
          items-center
          gap-2.5
          rounded-full
          bg-emerald/8
          px-4
          py-2
          text-[12px]
          uppercase
          tracking-[0.30em]
          text-emerald
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-saffron animate-pulse" />
        Crafted in India · Delivered Worldwide
      </div>

      {/* Main Heading */}

     <h1
  className="
    max-w-[920px]
    text-ink
    font-normal
    leading-[0.98]
    tracking-[-0.03em]
    text-[clamp(3rem,5vw,4.7rem)]
  "
>
  Where{" "}
  <span className="italic font-light text-saffron">
    heritage
  </span>{" "}
  meets{" "}
  <span className="relative inline-block">
    <span className="relative z-10">
      global trade.
    </span>

    <span
      className="
        absolute
        left-0
        right-0
        bottom-[0.1em]
        h-[0.28em]
        bg-saffron/20
        -z-0
      "
    />
  </span>
</h1>

      {/* Description */}

      <p
        className="
          mt-12
          max-w-[560px]
          font-[var(--font-body)]
          text-[15px]
          leading-8
          text-ink-soft
        "
      >
        Aachari International Exim is a trusted partner for
        premium exports & imports — connecting Indian
        craftsmanship and world-class hardware,
        electronics and spices to buyers in over forty
        countries.
      </p>

      {/* Buttons */}

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="#products"
          className="
            flex
            items-center
            gap-2
            rounded-full
            bg-saffron
            px-8
            py-4
            text-[12px]
            font-medium
            uppercase
            tracking-[0.08em]
            text-white
            shadow-[0_10px_25px_rgba(217,121,38,0.35)]
            transition-all
            duration-300
            hover:-translate-y-1
          "
        >
          →
          Explore Our Range
        </Link>

        <Link
          href="#catalogue"
          className="
            flex
            items-center
            gap-2
            rounded-full
            border
            border-ink
            px-8
            py-4
            text-[12px]
            font-medium
            uppercase
            tracking-[0.08em]
            text-ink
            transition-all
            duration-300
            hover:bg-ink
            hover:text-cream
          "
        >
          ⓘ
          View E-Catalogue
        </Link>
      </div>

      {/* Stats */}

      <div
        className="
          mt-14
          flex
          gap-10
          border-t
          border-black/10
          pt-8
          flex-wrap
        "
      >
        <div>
          <div
            className="
              font-[var(--font-display)]
              text-[3rem]
              leading-none
              text-ink
            "
          >
            <span className="italic font-light text-saffron">
              40
            </span>
            +
          </div>

          <div
            className="
              mt-2
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-ink-soft
            "
          >
            Export Markets
          </div>
        </div>

        <div>
          <div
            className="
              font-[var(--font-display)]
              text-[3rem]
              leading-none
              text-ink
            "
          >
            500
            <span className="italic font-light text-saffron">
              +
            </span>
          </div>

          <div
            className="
              mt-2
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-ink-soft
            "
          >
            Product SKUs
          </div>
        </div>

        <div>
          <div
            className="
              font-[var(--font-display)]
              text-[3rem]
              leading-none
              text-ink
            "
          >
            18
            <span className="italic font-light text-saffron">
              yrs
            </span>
          </div>

          <div
            className="
              mt-2
              text-[10px]
              uppercase
              tracking-[0.25em]
              text-ink-soft
            "
          >
            Industry Legacy
          </div>
        </div>
      </div>
      <LiveDashboard /> 
    </div>
  );
}