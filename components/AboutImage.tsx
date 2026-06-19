"use client";

import Image from "next/image";

export default function AboutImage() {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-md
        aspect-[4/5]
        shadow-[0_30px_70px_rgba(42,31,23,0.15)]
      "
    >
      <Image
        src="/about.png"
        alt="Aachari International"
        fill
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
          absolute
          inset-0
          opacity-0
          transition-opacity
          duration-700
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
          absolute
          inset-0
          bg-gradient-to-t
          from-black/40
          via-transparent
          to-transparent
        "
      />

      {/* Badge */}

      <div
        className="
          absolute
          bottom-6
          left-6
          rounded-full
          bg-cream/90
          px-5
          py-2
          backdrop-blur-md
          text-[11px]
          uppercase
          tracking-[0.2em]
          text-ink
        "
      >
        Since 2007
      </div>
    </div>
  );
}