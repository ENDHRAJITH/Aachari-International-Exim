"use client";

import { useEffect, useRef, useState } from "react";
import { ComposableMap, Geographies, Geography, Marker, Line } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// டார்கெட் 5 நாடுகள் + இந்தியா
const CORE_NETWORK: Record<string, { name: string; tz: string; curr: string; code: string }> = {
  "840": { name: "United States", tz: "America/New_York", curr: "USD", code: "USD" },
  "036": { name: "Australia", tz: "Australia/Sydney", curr: "AUD", code: "AUD" },
  "764": { name: "Thailand", tz: "Asia/Bangkok", curr: "THB", code: "THB" },
  "826": { name: "United Kingdom", tz: "Europe/London", curr: "GBP", code: "GBP" },
  "710": { name: "South Africa", tz: "Africa/Johannesburg", curr: "ZAR", code: "ZAR" },
  "356": { name: "India", tz: "Asia/Kolkata", curr: "INR", code: "INR" }
};

type TravelArc = { id: string; from: [number, number]; to: [number, number]; speed: number; geoId: string };

const ROUTES: TravelArc[] = [
  { id: "a1", from: [78.96, 20.59], to: [-100.0, 40.0], speed: 14, geoId: "840" },
  { id: "a2", from: [78.96, 20.59], to: [133.77, -25.27], speed: 11, geoId: "036" },
  { id: "a3", from: [78.96, 20.59], to: [100.99, 15.87], speed: 7, geoId: "764" },
  { id: "a4", from: [78.96, 20.59], to: [-2.0, 54.0], speed: 15, geoId: "826" },
  { id: "a5", from: [78.96, 20.59], to: [25.04, -29.04], speed: 16, geoId: "710" }
];

export default function PremiumNetworkMatrix() {
  const [dots, setDots] = useState<Record<string, number>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [liveCard, setLiveCard] = useState<{ name: string; time: string; nightMode: boolean; rateText: string } | null>(null);

  const animationRef = useRef<Record<string, number>>({});
  const frameId = useRef<number | undefined>(undefined);
  const timestampTracker = useRef<number | undefined>(undefined);

  // லைவ் ஃபாரெக்ஸ் டேட்டா
  useEffect(() => {
    fetch("https://open.er-api.com/v6/latest/USD")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates) {
          const inrBase = data.rates["INR"] || 1;
          const matrix: Record<string, number> = {};
          Object.keys(data.rates).forEach((k) => {
            matrix[k] = data.rates[k] > 0 ? inrBase / data.rates[k] : 0;
          });
          setExchangeRates(matrix);
        }
      }).catch(err => console.error("Forex engine down:", err));
  }, []);

  // ஸ்மூத் பார்ட்டிகிள் லூப் எஃபெக்ட் (RAF)
  useEffect(() => {
    const startState = Object.fromEntries(ROUTES.map((r) => [r.id, Math.random()]));
    setDots(startState);
    animationRef.current = startState;

    const renderLoop = (ts: number) => {
      if (timestampTracker.current === undefined) timestampTracker.current = ts;
      const delta = (ts - timestampTracker.current) / 1000;
      timestampTracker.current = ts;

      const nextState: Record<string, number> = {};
      let thresholdPassed = false;

      for (const r of ROUTES) {
        const prev = animationRef.current[r.id] ?? 0;
        let p = prev + delta / r.speed;
        if (p >= 1) p %= 1;
        nextState[r.id] = p;
        if (Math.abs(p - prev) > 0.005) thresholdPassed = true;
      }

      animationRef.current = nextState;
      if (thresholdPassed) setDots({ ...nextState });
      frameId.current = requestAnimationFrame(renderLoop);
    };

    frameId.current = requestAnimationFrame(renderLoop);
    return () => { if (frameId.current) cancelAnimationFrame(frameId.current); };
  }, []);

  const handleFocus = (geoId: string, e: React.MouseEvent) => {
    const target = CORE_NETWORK[geoId];
    if (!target) return;

    setHoveredId(geoId);
    setMousePos({ x: e.clientX, y: e.clientY });

    const clockOptions: Intl.DateTimeFormatOptions = { timeZone: target.tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true };
    const localTime = new Intl.DateTimeFormat("en-US", clockOptions).format(new Date());

    const hourCheck = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: target.tz, hour: "numeric", hour12: false }).format(new Date()), 10);
    const nightMode = hourCheck >= 18 || hourCheck < 6;

    let rateText = "Valuation pending";
    if (target.curr === "INR") rateText = "Base Hub Node (₹1.00)";
    else if (exchangeRates[target.code]) rateText = `1 ${target.curr} = ₹${exchangeRates[target.code].toFixed(2)} INR`;

    setLiveCard({ name: target.name, time: localTime, nightMode, rateText });
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-8 select-none" style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">Enterprise Infrastructure Matrix</h2>
        <p className="text-slate-400 text-sm mt-1">Cross-Border Pipeline Valuations & Dynamic Telemetry</p>
      </div>

      <div className="relative bg-[#090d16] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        <ComposableMap projection="geoEqualEarth" projectionConfig={{ scale: 165, center: [20, 15] }} width={900} height={460} style={{ width: "100%", height: "auto" }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const currentId = geo.id || geo.properties?.ISO_N3;
                const node = CORE_NETWORK[currentId];
                const active = hoveredId === currentId;

                let fill = "#131924"; // டீஃபால்ட் பேக்கிரவுண்ட்
                if (node) fill = node.name === "India" ? "#38bdf8" : "#9a3412"; // இந்தியா ப்ளூ, மத்த 5 நாடுகள் டார்க் ஆரஞ்சு
                if (active && node && node.name !== "India") fill = "#ea580c"; // ஹோவர் பண்ணா பிரைட் ஆரஞ்சு

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(e) => handleFocus(currentId, e)}
                    onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
                    onMouseLeave={() => { setHoveredId(null); setLiveCard(null); }}
                    style={{
                      default: { fill, stroke: "#1e293b", strokeWidth: 0.5, outline: "none", transition: "fill 0.2s" },
                      hover: { fill: node && node.name !== "India" ? "#ea580c" : fill, stroke: "#475569", strokeWidth: 0.6, outline: "none", cursor: node ? "pointer" : "default" }
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* ஓடிக்கிட்டே இருக்குற பார்ட்டிக்கிள் க்ளோயிங் லைன்ஸ் */}
          {ROUTES.map((r) => (
            <Line
              key={`path-${r.id}`}
              from={r.from}
              to={r.to}
              stroke="#ea580c"
              strokeWidth={1.2}
              strokeOpacity={0.3}
              strokeDasharray="5 4"
              style={{ animation: "matrixFlow 5s linear infinite" }}
            />
          ))}

          {/* சிம்பிள் அனிமேஷன் சர்க்கிள் வித் வேவ் */}
          {ROUTES.map((r) => {
            const p = dots[r.id] ?? 0;
            // Linear approximation for standard projection tracking
            const cx = r.from[0] + (r.to[0] - r.from[0]) * p;
            const cy = r.from[1] + (r.to[1] - r.from[1]) * p;

            return (
              <g key={`node-dot-${r.id}`}>
                <Marker coordinates={[cx, cy]}>
                  <circle r={8} fill="none" stroke="#ffedd5" strokeWidth={1} className="ping-wave" />
                  <circle r={3.5} fill="#f97316" stroke="#ffffff" strokeWidth={1} />
                </Marker>
              </g>
            );
          })}

          <Marker coordinates={[78.96, 20.59]}>
            <circle r={4.5} fill="#38bdf8" stroke="#fff" strokeWidth={1.5} />
          </Marker>
        </ComposableMap>

        {/* நீங்க கேட்ட பிக் பிரீமியம் லைவ் டூல்டிப் கார்டு */}
        {hoveredId && liveCard && (
          <div
            style={{
              position: "fixed",
              left: mousePos.x + 22,
              top: mousePos.y - 15,
              transform: "translateY(-50%)",
              pointerEvents: "none",
              background: "linear-gradient(145deg, #111827 0%, #030712 100%)",
              border: "1px solid rgba(234, 88, 12, 0.45)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255,255,255,0.05)",
              borderRadius: "14px",
              padding: "18px",
              zIndex: 99999,
              color: "#f8fafc",
              minWidth: "270px",
              backdropFilter: "blur(10px)",
              animation: "cardFadeIn 0.15s ease-out"
            }}
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
              <span className="text-base font-bold text-orange-500 tracking-wide">{liveCard.name}</span>
              <span
                className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full"
                style={{
                  background: liveCard.nightMode ? "rgba(99, 102, 241, 0.15)" : "rgba(234, 179, 8, 0.15)",
                  color: liveCard.nightMode ? "#a5b4fc" : "#fde047",
                  border: liveCard.nightMode ? "1px solid rgba(99, 102, 241, 0.25)" : "1px solid rgba(234, 179, 8, 0.25)"
                }}
              >
                {liveCard.nightMode ? "🌙 NIGHT" : "☀️ DAY"}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Zone Metric Time</div>
                <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">{liveCard.time}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Converted Forex Index</div>
                <div className="text-xs font-semibold text-sky-400 mt-1 bg-sky-950/40 px-2.5 py-1.5 rounded-lg border border-sky-900/40 inline-block">
                  {liveCard.rateText}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes matrixFlow {
          to { stroke-dashoffset: -30; }
        }
        @keyframes wavePulse {
          0% { transform: scale(0.5); opacity: 0.9; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        :global(.ping-wave) {
          transform-origin: center;
          transform-box: fill-box;
          animation: wavePulse 1.6s cubic-bezier(0.1, 0.8, 0.3, 1) infinite;
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(-48%) scale(0.97); }
          to { opacity: 1; transform: translateY(-50%) scale(1); }
        }
      `}</style>
    </div>
  );
}