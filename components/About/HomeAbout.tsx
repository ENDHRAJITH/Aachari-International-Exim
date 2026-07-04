"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import AboutContent from "./AboutContent";

interface Stat {
  id: string;
  label: string;
  number: string;
  sort_order: number;
}

export default function HomeAbout() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) {
          const sorted = [...data.data].sort(
            (a: Stat, b: Stat) => a.sort_order - b.sort_order
          );
          setStats(sorted);
        }
      })
      .catch(() => {});
  }, []);

  // First 2 stats only — CTA section-ku
  const ctaStats = stats.length > 0
    ? stats.slice(0, 2)
    : [
        { id: "1", number: "40+",   label: "Export Markets",  sort_order: 1 },
        { id: "2", number: "18yrs", label: "Industry Legacy", sort_order: 2 },
      ];

  return (
    <section
      id="about"
      className="
        relative overflow-hidden
        bg-cream-soft
        px-6 py-24 lg:px-12
      "
    >
      {/* Background Blobs */}
      <div className="absolute right-0 top-20 h-[320px] w-[320px] rounded-full bg-saffron/10 blur-[80px] animate-[blobFloat_10s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute bottom-10 left-0 h-[280px] w-[280px] rounded-full bg-emerald/10 blur-[80px] animate-[blobFloat_12s_ease-in-out_infinite] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-[1320px]">
        {/* Main Content */}
        <div className="grid items-center gap-20 lg:grid-cols-[0.9fr_1.1fr]">
          {/* <AboutImage /> */}
          <AboutContent />
        </div>

        {/* CTA */}
        <div className="mt-14 flex items-center gap-4 flex-wrap">

          <Link
            href="/about"
            className="
              group inline-flex items-center gap-3
              rounded-full bg-[#C1622A]
              px-7 py-3.5
              text-sm font-medium tracking-wide text-white
              transition-all duration-300
              hover:-translate-y-0.5 hover:bg-[#A84F1D]
            "
          >
            Discover our story
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>

          {/* {ctaStats.map((stat, idx) => (
            <div key={stat.id} className="flex items-center gap-4">
              <div className="h-9 w-px bg-ink/10" />
              <div className="flex flex-col gap-0.5">
                <span className="text-xl font-medium text-ink leading-none">
                  {stat.number}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-ink/40">
                  {stat.label}
                </span>
              </div>
            </div>
          ))} */}

        </div>
      </div>
    </section>
  );
}