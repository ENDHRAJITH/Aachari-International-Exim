"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Stat {
  id: string;
  label: string;
  number: string;
  sort_order: number;
}

export default function HeroLeft() {
  const [stats, setStats] = useState<Stat[]>([]);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setStats(data.data);
      })
      .catch(() => {});
  }, []);

  const displayStats =
    stats.length > 0
      ? stats
      : [
          {
            id: "1",
            number: "40+",
            label: "Export Markets",
          },
          {
            id: "2",
            number: "500+",
            label: "Product SKUs",
          },
          {
            id: "3",
            number: "18yrs",
            label: "Industry Legacy",
          },
        ];

  return (
    <div className="relative z-10 max-w-4xl">
      {/* Premium Eyebrow */}
      {/* <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-saffron/20 bg-white px-5 py-3 shadow-sm backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-saffron animate-pulse" />
        <span className="text-[11px] uppercase tracking-[0.25em] text-ink-soft">
          Crafted in India · Delivered Worldwide
        </span>
      </div> */}

      {/* Main Heading */}
      <h1 className="max-w-[950px] text-[clamp(3.5rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.04em] text-ink">
        Where{" "}
        <span className="italic font-light text-saffron">
          heritage
        </span>{" "}
        meets{" "}
        <span className="relative inline-block">
          <span className="relative z-10 font-medium">
            global trade.
          </span>
          <span className="absolute bottom-[0.12em] left-0 right-0 h-[0.22em] bg-saffron/15 -z-0 rounded-full" />
        </span>
      </h1>

      {/* Description */}
      <p className="mt-8 max-w-[620px] font-[var(--font-body)] text-[17px] leading-8 text-ink-soft">
        Aachari International Exim is a trusted partner for premium
        exports and imports, connecting Indian craftsmanship with
        world-class hardware, electronics, and spices to buyers
        across more than forty countries.
      </p>

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/products"
          className="group flex items-center gap-2 rounded-full bg-saffron px-8 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-white shadow-[0_12px_30px_rgba(217,121,38,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(217,121,38,0.35)]"
        >
          Explore Our Range
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>

        <Link
          href="/catalogue"
          className="flex items-center gap-2 rounded-full border border-ink px-8 py-4 text-[13px] font-medium uppercase tracking-[0.1em] text-ink transition-all duration-300 hover:bg-ink hover:text-white"
        >
          View E-Catalogue
        </Link>
      </div>

      {/* Stats Cards */}
      {/* <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {displayStats.map((stat) => (
          <div
            key={stat.id}
            className="group rounded-3xl border border-black/5 bg-white p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
          >
            <div className="font-[var(--font-display)] text-[3rem] leading-none">
              <span className="italic font-light text-saffron">
                {stat.number}
              </span>
            </div>

            <div className="mt-3 text-[11px] uppercase tracking-[0.25em] text-ink-soft">
              {stat.label}
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}