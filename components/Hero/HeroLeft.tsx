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
          { id: "1", number: "40+", label: "Export Markets" },
          { id: "2", number: "500+", label: "Product SKUs" },
          { id: "3", number: "18yrs", label: "Industry Legacy" },
        ];

  return (
    <div className="relative z-10 max-w-4xl " style={{zIndex:"100"}}>

      {/* Badge */}
     

      {/* Main Heading */}
      <h1
      className="max-w-[950px] text-[clamp(2.5rem,4.5vw,4rem)] font-black leading-[0.95] tracking-[-0.04em] "  style={{
          color: '#000000',
          
          // textShadow: `
          //   0 0 40px rgba(255,255,255,1),
          //   0 2px 4px rgba(255,255,255,0.9),
          //   2px 2px 0px rgba(255,255,255,0.5)
          // `
        }}
      >
        Where{" "}
        <span
          className="italic"
          style={{
            color: '#C1622A',
             
          }}
        >
          Quality
        </span>{" "}
        <span className="relative inline-block">
          <span className="relative z-10">
            Leads
          </span>
          
        </span>
      </h1>

      {/* Description */}
      {/* <p
        className="mt-8 max-w-[580px] text-[17px] text-bold leading-[1.8]"
        style={{
          color: '#000000',
          fontWeight: 900,
          
        }}
      >
        Aachari International Exim is a trusted partner for premium
        exports and imports, connecting Indian craftsmanship with
        world-class hardware, electronics, and spices to buyers
        across more than forty countries.
      </p> */}

       <p className="mt-8 max-w-[720px] text-[19px] leading-8"
  style={{
    color: '#000000',
    fontWeight: 700,
  }}
>
  Aachari International Exim is a trusted partner for premium
        exports and imports, connecting Indian craftsmanship with
        world-class hardware, electronics, and spices to buyers
        across more than forty countries.</p>

      {/* Buttons */}
      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/products"
          className="group flex items-center gap-2 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:-translate-y-1"
          style={{
            backgroundColor: '#C1622A',
            boxShadow: '0 12px 32px rgba(193,98,42,0.45), 0 4px 12px rgba(193,98,42,0.3)'
          }}
        >
          Explore Our Range
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </Link>

        <Link
          href="/contact"
          className="flex items-center gap-2 rounded-full px-8 py-4 text-[13px] font-bold uppercase tracking-[0.1em] transition-all duration-300 hover:-translate-y-1"
          style={{
            border: '2.5px solid #1A1A1A',
            color: '#1A1A1A',
            backgroundColor: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
          }}
        >
          Get Quote →
        </Link>
      </div>

      {/* Stats */}
      {/* <div
        className="mt-14 grid grid-cols-3 gap-4"
        style={{ maxWidth: '480px' }}
      >
        {displayStats.map((stat) => (
          <div
            key={stat.id}
            style={{
              backgroundColor: 'rgba(255,255,255,0.88)',
              backdropFilter: 'blur(16px)',
              borderRadius: '16px',
              padding: '18px 16px',
              border: '1.5px solid rgba(193,98,42,0.2)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(193,98,42,0.08)'
            }}
          >
            <div style={{
              fontSize: 'clamp(1.8rem, 2.5vw, 2.2rem)',
              fontWeight: 800,
              color: '#C1622A',
              lineHeight: 1,
              fontStyle: 'italic'
            }}>
              {stat.number}
            </div>
            <div style={{
              marginTop: '8px',
              fontSize: '10px',
              fontWeight: 700,
              color: '#3D2314',
              textTransform: 'uppercase',
              letterSpacing: '0.18em'
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div> */}

    </div>
  );
}