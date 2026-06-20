"use client";

export default function HeroBackground() {
  return (
    <>
      {/* Saffron Blob */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-32
          h-[480px]
          w-[480px]
          rounded-full
          blur-[80px]
          opacity-50
          animate-[blobFloat_10s_ease-in-out_infinite]
        "
        style={{
          background:
            "rgba(217,121,38,0.25)",
        }}
      />

      {/* Emerald Blob */}

      <div
        className="
          pointer-events-none
          absolute
          -left-16
          -bottom-24
          h-[380px]
          w-[380px]
          rounded-full
          blur-[80px]
          opacity-50
          animate-[blobFloat_12s_ease-in-out_infinite]
        "
        style={{
          background:
            "rgba(31,79,63,0.18)",
          animationDelay: "1s",
        }}
      />

      {/* Orb */}

      <div
        className="
          absolute
          left-[75%]
          top-[40%]
          h-[280px]
          w-[280px]
          rounded-full
          bg-saffron/10
          blur-[90px]
          pointer-events-none
        "
      />
    </>
  );
}