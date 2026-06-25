"use client";

import Image from "next/image";

export default function HeroRight() {
  return (
    <div
      className="
        relative
        z-10
        grid
        h-[600px]
        place-items-center
      "
    >
      <div
        className="
          relative
          h-full
          w-full
          max-w-[480px]
        "
      >
        {/* Rotating Badge */}

     <div
  className="
    absolute
    -left-3
    top-20
    z-20
    h-[130px]
    w-[130px]
    animate-[spin_20s_linear_infinite]
  "
>
 
</div>

        {/* Card 1 */}

        <div
          className="
            absolute
            right-0
            top-0
            h-[60%]
            w-[65%]
            overflow-hidden
            rounded-[18px]
            shadow-[0_30px_70px_rgba(42,31,23,0.18)]
            animate-[floatA_6s_ease-in-out_infinite]
          "
        >
          <Image
            src="/a1.jpg"
            alt="Premium Spices"
            fill
            className="object-cover"
          />

          <div
            className="
              absolute
              bottom-4
              left-4
              rounded-full
              bg-cream/90
              px-4
              py-2
              text-[11px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-ink
              backdrop-blur-md
            "
          >
            Premium Spices
          </div>
        </div>

        {/* Card 2 */}

        <div
          className="
            absolute
            bottom-0
            left-0
            h-[50%]
            w-[55%]
            overflow-hidden
            rounded-[18px]
            shadow-[0_30px_70px_rgba(42,31,23,0.18)]
            animate-[floatA_7s_ease-in-out_infinite]
            [animation-delay:1s]
          "
        >
          <Image
            src="/a2.jpg"
            alt="Electronics"
            fill
            className="object-cover"
          />

          <div
            className="
              absolute
              bottom-4
              left-4
              rounded-full
              bg-cream/90
              px-4
              py-2
              text-[11px]
              font-medium 
              uppercase
              tracking-[0.18em]
              text-ink
              backdrop-blur-md
            "
          >
            Poweder 
          </div>
        </div>

        {/* Card 3 */}

        <div
          className="
            absolute
            left-[38%]
            top-[38%]
            z-10
            h-[36%]
            w-[38%]
            overflow-hidden
            rounded-[18px]
            shadow-[0_30px_70px_rgba(42,31,23,0.18)]
            animate-[floatA_5s_ease-in-out_infinite]
            [animation-delay:.5s]
          "
        >
          <Image
            src="/a3.avif"
            alt="Industrial Hardware"
            fill
            className="object-cover"
          />

          <div
            className="
              absolute
              bottom-3
              left-3
              rounded-full
              bg-cream/90
              px-3
              py-1.5
              text-[10px]
              font-medium
              uppercase
              tracking-[0.15em]
              text-ink
              backdrop-blur-md
            "
          >
            Masala
          </div>
        </div>
      </div>
    </div>
  );
}