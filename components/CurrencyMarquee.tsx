"use client";

import { useEffect, useState } from "react";

interface RateItem {
  code: string;
  flag: string;
  rate: number;
}

const CURRENCIES = [
  { code: "USD", flag: "🇺🇸", name: "US Dollar" },
  { code: "EUR", flag: "🇪🇺", name: "Euro" },
  { code: "GBP", flag: "🇬🇧", name: "British Pound" },
  { code: "AED", flag: "🇦🇪", name: "UAE Dirham" },
  { code: "SGD", flag: "🇸🇬", name: "Singapore Dollar" },
  { code: "AUD", flag: "🇦🇺", name: "Australian Dollar" },
  { code: "SAR", flag: "🇸🇦", name: "Saudi Riyal" },
  { code: "JPY", flag: "🇯🇵", name: "Japanese Yen" },
];

export default function CurrencyMarquee() {
  const [rates, setRates] = useState<RateItem[]>([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const codes = CURRENCIES.map((c) => c.code).join(",");
        const res = await fetch(
          `https://api.frankfurter.dev/v1/latest?base=INR&symbols=${codes}`
        );
        const data = await res.json();

        const list: RateItem[] = CURRENCIES.map((c) => ({
          code: c.code,
          flag: c.flag,
          rate: data.rates?.[c.code] ? 1 / data.rates[c.code] : 0,
        })).filter((r) => r.rate > 0);

        setRates(list);
      } catch (err) {
        console.error("Currency fetch failed", err);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  if (rates.length === 0) return null;

  const loopRates = [...rates, ...rates];

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        background: "linear-gradient(90deg, #a84f1d 0%, #c1622a 50%, #a84f1d 100%)",
        padding: "10px 0",
        position: "relative",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* LIVE Badge - fixed, doesn't scroll */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: "0 16px 0 20px",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 0 0 rgba(74,222,128,0.7)",
            animation: "livePulse 1.8s ease-out infinite",
          }}
        />
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#eafff0",
          }}
        >
          LIVE
        </span>
      </div>

      {/* Scrolling rates */}
      <div style={{ overflow: "hidden", flex: 1 }}>
        <div
          style={{
            display: "flex",
            width: "max-content",
            animation: "marqueeScroll 40s linear infinite",
          }}
        >
          {loopRates.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0 24px",
                whiteSpace: "nowrap",
                fontSize: "12.5px",
                fontWeight: 500,
                color: "#fdf8ec",
                letterSpacing: "0.02em",
              }}
            >
              <span>{item.flag}</span>
              <span style={{ opacity: 0.85 }}>1 {item.code}</span>
              <span style={{ opacity: 0.6 }}>=</span>
              <span style={{ fontWeight: 700, color: "#ffe4c7" }}>
                ₹{item.rate.toFixed(2)}
              </span>
              <span
                style={{
                  width: "3px",
                  height: "3px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.4)",
                  marginLeft: "18px",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes livePulse {
          0% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
          }
          70% {
            box-shadow: 0 0 0 7px rgba(74, 222, 128, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0);
          }
        }
      `}</style>
    </div>
  );
}