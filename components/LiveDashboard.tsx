"use client";

import { useEffect, useState } from "react";

export default function LiveDashboard() {
  const [seconds, setSeconds] = useState(37);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="
        mt-10
        relative
        overflow-hidden
        rounded-[18px]
        border
        border-black/10
        bg-white/20
        p-6
        shadow-[0_12px_35px_rgba(42,31,23,0.08)]
        backdrop-blur-sm
      "
    >
      {/* Left Accent */}

      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-[3px]
          bg-gradient-to-b
          from-saffron
          via-terracotta
          to-emerald
        "
      />

      {/* Header */}

      <div
        className="
          flex
          items-center
          border-b
          border-dashed
          border-black/10
          pb-4
        "
      >
        <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />

        <span
          className="
            ml-3
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.30em]
            text-ink
          "
        >
          Live Trade Activity
        </span>

        <span
          className="
            ml-auto
            text-[14px]
            italic
            text-ink-soft
          "
        >
          live · {seconds}s
        </span>
      </div>

      {/* Metrics */}

      <div
        className="
          flex
          justify-between
          gap-4
          py-6
        "
      >
        {/* Shipments */}

        <div className="min-w-[95px]">
          <div
            className="
              font-[var(--font-display)]
              text-[2.4rem]
              leading-none
              text-ink
            "
          >
            80
          </div>

          <div
            className="
              mt-2
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-ink-soft
            "
          >
            Shipments Today
          </div>
        </div>

        {/* Tonnes */}

        <div
          className="
            min-w-[105px]
            border-l
            border-black/5
            pl-4
          "
        >
          <div
            className="
              whitespace-nowrap
              font-[var(--font-display)]
              text-[2.4rem]
              leading-none
              text-ink
            "
          >
            487
            <span className="ml-1 italic text-saffron">
              T
            </span>
          </div>

          <div
            className="
              mt-2
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-ink-soft
            "
          >
            Tonnes Moved
          </div>
        </div>

        {/* Value */}

        <div
          className="
            min-w-[135px]
            border-l
            border-black/5
            pl-4
          "
        >
          <div
            className="
              whitespace-nowrap
              font-[var(--font-display)]
              text-[2.4rem]
              leading-none
              text-ink
            "
          >
            ₹3,022
            <span className="ml-1 italic text-saffron">
              K
            </span>
          </div>

          <div
            className="
              mt-2
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-ink-soft
            "
          >
            Value Traded
          </div>
        </div>

        {/* Enquiries */}

        <div
          className="
            min-w-[120px]
            border-l
            border-black/5
            pl-4
          "
        >
          <div
            className="
              font-[var(--font-display)]
              text-[2.4rem]
              leading-none
              text-ink
            "
          >
            37
          </div>

          <div
            className="
              mt-2
              text-[8px]
              uppercase
              tracking-[0.18em]
              text-ink-soft
            "
          >
            Enquiries Received
          </div>
        </div>
      </div>

      {/* Footer */}

      <div
        className="
          flex
          items-center
          gap-3
          border-t
          border-black/10
          pt-4
        "
      >
        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.18em]
            text-ink-soft
          "
        >
          Currently Exporting:
        </span>

        <span
          className="
            text-[15px]
            italic
            text-saffron
          "
        >
          Cumin Seeds → Cairo
        </span>
      </div>
    </div>
  );
}