"use client";

import Link from "next/link";
import AboutImage from "./AboutImage";
import AboutContent from "./AboutContent";

export default function HomeAbout() {
  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        bg-cream-soft
        px-6
        py-24
        lg:px-12
      "
    >
      {/* Background Blobs */}
      <div
        className="
          absolute
          right-0
          top-20
          h-[320px]
          w-[320px]
          rounded-full
          bg-saffron/10
          blur-[80px]
          animate-[blobFloat_10s_ease-in-out_infinite]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-10
          left-0
          h-[280px]
          w-[280px]
          rounded-full
          bg-emerald/10
          blur-[80px]
          animate-[blobFloat_12s_ease-in-out_infinite]
          pointer-events-none
        "
      />

      <div className="relative z-10 mx-auto max-w-[1320px]">
        {/* Main Content */}
        <div
          className="
            grid
            items-center
            gap-20
            lg:grid-cols-[0.9fr_1.1fr]
          "
        >
          <AboutImage />
          <AboutContent />
        </div>

        {/* CTA */}
        <div className="mt-14 flex justify-center lg:justify-start">
          <Link
            href="/about"
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-[#C1622A]
              px-8
              py-4
              text-sm
              font-semibold
              tracking-wide
              text-white
              shadow-[0_12px_30px_rgba(193,98,42,0.25)]
              transition-all
              duration-300
              hover:-translate-y-1
              hover:bg-[#A84F1D]
              hover:shadow-[0_18px_40px_rgba(193,98,42,0.35)]
            "
          >
            Read More
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}