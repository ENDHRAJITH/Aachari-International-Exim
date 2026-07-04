"use client";

import { useEffect, useRef, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Route = {
  id: string;
  from: [number, number];
  to: [number, number];
  duration: number;
  destination: string;
};

type Origin = {
  name: string;
  coords: [number, number];
};

const ROUTES: Route[] = [
  { id: "r1", from: [80.27, 13.08], to: [79.86, 6.93], duration: 9, destination: "Colombo" },
  { id: "r2", from: [80.27, 13.08], to: [103.82, 1.35], duration: 15, destination: "Singapore" },
  { id: "r3", from: [72.95, 18.95], to: [55.06, 25.02], duration: 13, destination: "Jebel Ali" },
  { id: "r4", from: [80.27, 13.08], to: [121.47, 31.23], duration: 19, destination: "Shanghai" },
  { id: "r5", from: [72.95, 18.95], to: [4.48, 51.92], duration: 24, destination: "Rotterdam" },
  { id: "r6", from: [78.13, 8.76], to: [9.99, 53.55], duration: 17, destination: "Hamburg" },
  { id: "r7", from: [88.36, 22.57], to: [-118.24, 34.05], duration: 21, destination: "Los Angeles" },
];

const ORIGINS: Origin[] = [
  { name: "Chennai", coords: [80.27, 13.08] },
  { name: "Mumbai", coords: [72.95, 18.95] },
  { name: "Tuticorin", coords: [78.13, 8.76] },
  { name: "Kolkata", coords: [88.36, 22.57] },
];

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function TradeNetwork() {
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [hoveredRoute, setHoveredRoute] = useState<Route | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const progressRef = useRef<Record<string, number>>({});
  const rafRef = useRef<number | undefined>(undefined);
  const lastTsRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const initial = Object.fromEntries(ROUTES.map((r) => [r.id, Math.random()]));
    setProgress(initial);
    progressRef.current = initial;

    const tick = (ts: number) => {
      if (lastTsRef.current === undefined) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const next: Record<string, number> = {};
      let shouldUpdate = false;

      for (const r of ROUTES) {
        const current = progressRef.current[r.id] ?? 0;
        let p = current + dt / r.duration;
        if (p >= 1) p %= 1;
        next[r.id] = p;
        if (Math.abs(p - current) > 0.009) shouldUpdate = true;
      }

      progressRef.current = next;
      if (shouldUpdate) setProgress({ ...next });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Global Trade Network</h2>
        <p className="text-gray-600 mt-2">Live Shipping Routes with Particle Trails</p>
      </div>

      <div className="relative bg-[#f8f7f4] rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 158, center: [18, 8] }}
          width={920}
          height={480}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#e8e6df"
                  stroke="#d1cdc2"
                  strokeWidth={0.8}
                />
              ))
            }
          </Geographies>

          {/* Flowing Lines */}
          {ROUTES.map((r) => (
            <Line
              key={`line-${r.id}`}
              from={r.from}
              to={r.to}
              stroke="#64748b"
              strokeWidth={1.3}
              strokeOpacity={0.55}
              strokeDasharray="9 5"
              style={{ animation: `flow 4.5s linear infinite`, animationDelay: `-${r.duration * 0.1}s` }}
            />
          ))}

          {/* Particle Trail + Main Dot */}
          {ROUTES.map((r) => {
            const t = progress[r.id] ?? 0;
            const x = lerp(r.from[0], r.to[0], t);
            const y = lerp(r.from[1], r.to[1], t);

            return (
              <g key={`trail-${r.id}`}>
                {/* Particle Trail */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const trailT = Math.max(0, t - i * 0.08);
                  const tx = lerp(r.from[0], r.to[0], trailT);
                  const ty = lerp(r.from[1], r.to[1], trailT);
                  return (
                    <Marker key={i} coordinates={[tx, ty]}>
                      <circle
                        r={1.8 - i * 0.25}
                        fill="#fb923c"
                        opacity={0.7 - i * 0.1}
                      />
                    </Marker>
                  );
                })}

                {/* Main Pulsing Dot */}
                <Marker
                  coordinates={[x, y]}
                  onMouseEnter={(e) => {
                    setHoveredRoute(r);
                    setTooltipPos({ x: e.clientX + 15, y: e.clientY - 15 });
                  }}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  <circle r={8} fill="#f97316" opacity={0.25} className="animate-pulse" />
                  <circle r={4.5} fill="#f97316" stroke="#fff" strokeWidth={2.5} />
                </Marker>
              </g>
            );
          })}

          {/* Origin Ports */}
          {ORIGINS.map((port) => (
            <Marker key={port.name} coordinates={port.coords}>
              <circle r={5.5} fill="#ea580c" stroke="#fff" strokeWidth={3} />
              <text y={-20} textAnchor="middle" fill="#1f2937" fontSize="10.5" fontWeight="700">
                {port.name}
              </text>
            </Marker>
          ))}
        </ComposableMap>

        {/* Tooltip */}
        {hoveredRoute && (
          <div
            className="absolute pointer-events-none bg-white shadow-2xl rounded-2xl px-5 py-4 text-sm z-50 border border-gray-100"
            style={{ left: tooltipPos.x, top: tooltipPos.y, transform: "translate(-50%, -105%)" }}
          >
            <div className="font-semibold text-orange-600 text-lg">{hoveredRoute.destination}</div>
            <div className="text-gray-600 mt-1">
              Transit: <span className="font-medium">{hoveredRoute.duration} days</span>
            </div>
            <div className="text-xs text-emerald-600 mt-2">● Live Container</div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes flow {
          to { stroke-dashoffset: -35; }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </div>
  );
}