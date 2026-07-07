"use client";

import { useEffect, useState } from "react";
import "flag-icons/css/flag-icons.min.css";

interface RateItem {
  code: string;
  flagClass: string;
  rate: number;
}

const CURRENCIES = [
  { code: "USD", flagClass: "fi-us", name: "US Dollar" },
  { code: "EUR", flagClass: "fi-eu", name: "Euro" },
  { code: "GBP", flagClass: "fi-gb", name: "British Pound" },
  { code: "AED", flagClass: "fi-ae", name: "UAE Dirham" },
  { code: "SGD", flagClass: "fi-sg", name: "Singapore Dollar" },
  { code: "AUD", flagClass: "fi-au", name: "Australian Dollar" },
  { code: "SAR", flagClass: "fi-sa", name: "Saudi Riyal" },
  { code: "JPY", flagClass: "fi-jp", name: "Japanese Yen" },
];

export default function CurrencyMarquee() {
  const [rates, setRates] = useState<RateItem[]>([]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/INR`);
        const data = await res.json();

        if (data.result !== "success") {
          throw new Error("Rate API returned an error");
        }

        const list: RateItem[] = CURRENCIES.map((c) => ({
          code: c.code,
          flagClass: c.flagClass,
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
          UPDATED DAILY
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
              <span
                className={`fi ${item.flagClass}`}
                style={{
                  borderRadius: "2px",
                  width: "18px",
                  height: "13px",
                  boxShadow: "0 0 0 1px rgba(255,255,255,0.15)",
                }}
              />
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