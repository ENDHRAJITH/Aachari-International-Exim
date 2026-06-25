"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutImage() {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Image Card */}
      <div
        className="
          group
          relative
          overflow-hidden
          rounded-xl md:rounded-2xl
          aspect-[4/5]
          w-full
          shadow-[0_20px_50px_rgba(42,31,23,0.12)]
          md:shadow-[0_30px_70px_rgba(42,31,23,0.15)]
        "
      >
        <Image
          src="/about.png"
          alt="Aachari International"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="
            object-cover
            transition-transform
            duration-700
            group-hover:scale-105
          "
        />

        {/* Light Sweep */}
        <div
          className="
            absolute inset-0
            opacity-0
            transition-opacity duration-700
            group-hover:opacity-100
            bg-gradient-to-tr
            from-transparent
            via-white/10
            to-transparent
          "
        />

        {/* Overlay */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-t
            from-black/40
            via-transparent
            to-transparent
          "
        />

        {/* Badge */}
        <div
          className="
            absolute bottom-4 md:bottom-6
            left-4 md:left-6
            rounded-full
            bg-cream/90
            px-4 md:px-5
            py-2
            backdrop-blur-md
            text-[10px] md:text-[11px]
            font-medium
            uppercase
            tracking-[0.15em] md:tracking-[0.2em]
            text-ink
          "
        >
          Since 2026
        </div>
      </div>

      {/* CTA Button */}
       
    </div>
  );
}