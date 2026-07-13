"use client";

import { useEffect, useState } from "react";
import "flag-icons/css/flag-icons.min.css";

interface RateItem {
  code: string;
  flagClass: string;
  rate: number;
}

const FEATURED_CURRENCIES = [
  { code: "USD", flagClass: "fi-us" },
  { code: "EUR", flagClass: "fi-eu" },
  { code: "GBP", flagClass: "fi-gb" },
  { code: "AED", flagClass: "fi-ae" },
  { code: "SGD", flagClass: "fi-sg" },
  { code: "AUD", flagClass: "fi-au" },
  { code: "SAR", flagClass: "fi-sa" },
  { code: "JPY", flagClass: "fi-jp" },
];

export default function CurrencyMarquee() {
  const [rates, setRates] = useState<RateItem[]>([]);
  const [allRates, setAllRates] = useState<RateItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();

        if (!data || !data.rates) throw new Error("Invalid format");

        const usdToInr = data.rates["INR"] || 1;

        const marqueeList: RateItem[] = FEATURED_CURRENCIES.map((c) => {
          if (c.code === "USD") return { code: c.code, flagClass: c.flagClass, rate: usdToInr };
          const usdToForeign = data.rates[c.code] || 0;
          const foreignToInr = usdToForeign > 0 ? usdToInr / usdToForeign : 0;
          return { code: c.code, flagClass: c.flagClass, rate: foreignToInr };
        }).filter((r) => r.rate > 0);

        setRates(marqueeList);

        const masterList: RateItem[] = Object.keys(data.rates).map((code) => {
          const flagCode = code.slice(0, 2).toLowerCase();
          const usdToForeign = data.rates[code] || 0;
          const foreignToInr = code === "USD" ? usdToInr : usdToForeign > 0 ? usdToInr / usdToForeign : 0;
          return {
            code,
            flagClass: `fi-${flagCode}`,
            rate: foreignToInr,
          };
        }).filter((r) => r.rate > 0 && r.code !== "INR")
          .sort((a, b) => a.code.localeCompare(b.code));

        setAllRates(masterList);
      } catch (err) {
        console.error("Fetch failure:", err);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  if (rates.length === 0) return null;

  const loopRates = [...rates, ...rates];

  const filteredRates = allRates.filter((item) =>
    item.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        background: "linear-gradient(90deg, #111827 0%, #1f2937 100%)",
        padding: "12px 0",
        position: "relative",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "0 16px 0 20px",
          flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.1)",
          background: "#111827",
          zIndex: 2,
        }}
      >
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", animation: "livePulse 2s infinite" }} />
        <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.05em", color: "#9ca3af" }}>LIVE INR</span>
      </div>

      <div style={{ overflow: "hidden", flex: 1, position: "relative" }}>
        <div style={{ display: "flex", width: "max-content", animation: "marqueeScroll 35s linear infinite" }}>
          {loopRates.map((item, idx) => (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 28px", color: "#e5e7eb", fontSize: "13px" }}>
              <span className={`fi ${item.flagClass}`} style={{ borderRadius: "2px", width: "16px", height: "12px" }} />
              <span style={{ color: "#9ca3af" }}>1 {item.code}</span>
              <span style={{ fontWeight: 600, color: "#f3f4f6" }}>₹{item.rate.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          padding: "6px 16px",
          margin: "0 16px 0 12px",
          background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
          color: "#ffffff",
          border: "none",
          borderRadius: "6px",
          fontSize: "11px",
          fontWeight: 700,
          cursor: "pointer",
          letterSpacing: "0.03em",
          boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
          zIndex: 5,
          flexShrink: 0,
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      >
        VIEW ALL
      </button>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(3, 7, 18, 0.45)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "850px",
              height: "85vh",
              background: "rgba(17, 24, 39, 0.95)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: "24px 32px 16px 32px", borderBottom: "1px solid rgba(255, 255, 255, 0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#ffffff" }}>Global Exchange Matrix</h2>
                <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>Real-time valuation rates converted directly to Indian Rupee (INR)</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{ background: "rgba(255,255,255,0.05)", border: "none", color: "#9ca3af", width: "32px", height: "32px", borderRadius: "50%", cursor: "pointer", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "16px 32px" }}>
              <input
                type="text"
                placeholder="Search by country code (e.g. CAD, JPY, KWD)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: "100%", padding: "12px 16px", background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "8px", color: "#ffffff", fontSize: "14px", outline: "none" }}
              />
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 32px 32px 32px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))", gap: "14px" }}>
                {filteredRates.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "16px",
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.04)",
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      transition: "all 0.2s"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                      e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.04)";
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span className={`fi ${item.flagClass}`} style={{ borderRadius: "2px", width: "20px", height: "14px", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }} />
                      <span style={{ fontSize: "14px", fontWeight: 700, color: "#ffffff" }}>1 {item.code}</span>
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "#60a5fa" }}>
                      {item.rate < 1 ? `₹${item.rate.toFixed(4)}` : `₹${item.rate.toFixed(2)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes livePulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
}