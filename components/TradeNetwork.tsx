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
  country: string;
};

type Origin = {
  name: string;
  coords: [number, number];
};

const ROUTES: Route[] = [
  { id: "r1", from: [80.27, 13.08], to: [79.86, 6.93], duration: 9, destination: "Colombo", country: "Sri Lanka" },
  { id: "r2", from: [80.27, 13.08], to: [103.82, 1.35], duration: 15, destination: "Singapore", country: "Singapore" },
  { id: "r3", from: [72.95, 18.95], to: [55.06, 25.02], duration: 13, destination: "Jebel Ali", country: "UAE" },
  { id: "r4", from: [80.27, 13.08], to: [121.47, 31.23], duration: 19, destination: "Shanghai", country: "China" },
  { id: "r5", from: [72.95, 18.95], to: [4.48, 51.92], duration: 24, destination: "Rotterdam", country: "Netherlands" },
  { id: "r6", from: [78.13, 8.76], to: [9.99, 53.55], duration: 17, destination: "Hamburg", country: "Germany" },
  { id: "r7", from: [88.36, 22.57], to: [-118.24, 34.05], duration: 21, destination: "Los Angeles", country: "USA" },
  { id: "r8", from: [72.95, 18.95], to: [46.68, 24.71], duration: 12, destination: "Riyadh", country: "Saudi Arabia" },
  { id: "r9", from: [80.27, 13.08], to: [151.21, -33.87], duration: 22, destination: "Sydney", country: "Australia" },
  { id: "r10", from: [72.95, 18.95], to: [-0.13, 51.51], duration: 20, destination: "London", country: "UK" },
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

function bearingDeg(from: [number, number], to: [number, number]) {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  // screen y is inverted vs lat, atan2 gives angle from x-axis
  const angle = Math.atan2(dx, dy) * (180 / Math.PI);
  return angle;
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
        if (Math.abs(p - current) > 0.004) shouldUpdate = true;
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
    <div className="relative w-full max-w-5xl mx-auto px-4 py-10" id="map">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-gray-900">Global Trade Network</h2>
        <p className="text-gray-600 mt-2">Live Shipping Routes Across 10 Countries</p>
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
              stroke="#c1622a"
              strokeWidth={1.1}
              strokeOpacity={0.4}
              strokeDasharray="6 5"
              style={{ animation: `flow 4.5s linear infinite`, animationDelay: `-${r.duration * 0.1}s` }}
            />
          ))}

          {/* Airplane + Trail per route */}
          {ROUTES.map((r) => {
            const t = progress[r.id] ?? 0;
            const x = lerp(r.from[0], r.to[0], t);
            const y = lerp(r.from[1], r.to[1], t);
            const angle = bearingDeg(r.from, r.to);

            return (
              <g key={`trail-${r.id}`}>
                {/* Particle Trail */}
                {Array.from({ length: 6 }).map((_, i) => {
                  const trailT = Math.max(0, t - i * 0.06);
                  const tx = lerp(r.from[0], r.to[0], trailT);
                  const ty = lerp(r.from[1], r.to[1], trailT);
                  return (
                    <Marker key={i} coordinates={[tx, ty]}>
                      <circle
                        r={1.6 - i * 0.2}
                        fill="#c1622a"
                        opacity={0.6 - i * 0.09}
                      />
                    </Marker>
                  );
                })}

                {/* Airplane Icon - rotated to travel direction */}
                <Marker
                  coordinates={[x, y]}
                  onMouseEnter={(e) => {
                    setHoveredRoute(r);
                    setTooltipPos({ x: e.clientX + 15, y: e.clientY - 15 });
                  }}
                  onMouseLeave={() => setHoveredRoute(null)}
                >
                  <g transform={`rotate(${angle})`} style={{ cursor: "pointer" }}>
                    <path
                      d="M0,-6 L2,-1 L6,1 L6,2.5 L2,1.5 L1.2,4.5 L3,6 L3,7.2 L0,6 L-3,7.2 L-3,6 L-1.2,4.5 L-2,1.5 L-6,2.5 L-6,1 L-2,-1 Z"
                      fill="#c1622a"
                      stroke="#fff"
                      strokeWidth={0.4}
                    />
                  </g>
                </Marker>
              </g>
            );
          })}

          {/* Origin Ports - blinking live waves */}
          {ORIGINS.map((port) => (
            <Marker key={port.name} coordinates={port.coords}>
              <circle r={9} fill="none" stroke="#ea580c" strokeWidth={1} opacity={0.6} className="live-wave" />
              <circle r={9} fill="none" stroke="#ea580c" strokeWidth={1} opacity={0.6} className="live-wave live-wave-delay" />
              <circle r={5.5} fill="#ea580c" stroke="#fff" strokeWidth={2.5} />
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
            <div className="text-gray-500 text-xs">{hoveredRoute.country}</div>
            <div className="text-gray-600 mt-1">
              Transit: <span className="font-medium">{hoveredRoute.duration} days</span>
            </div>
            <div className="text-xs text-emerald-600 mt-2">● Live Shipment</div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes flow {
          to { stroke-dashoffset: -35; }
        }
        @keyframes liveWave {
          0% {
            transform: scale(0.6);
            opacity: 0.7;
          }
          100% {
            transform: scale(2.4);
            opacity: 0;
          }
        }
        .live-wave {
          transform-origin: center;
          transform-box: fill-box;
          animation: liveWave 2.2s ease-out infinite;
        }
        .live-wave-delay {
          animation-delay: 1.1s;
        }
      `}</style>
    </div>
  );
}