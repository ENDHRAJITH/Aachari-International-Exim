"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";

const HQ: [number, number] = [13.0827, 80.2707];

const PORTS = [
  { name: "Nhava Sheva", coord: [18.95, 72.95] as [number, number] },
  { name: "Kochi", coord: [9.93, 76.27] as [number, number] },
  { name: "Tuticorin", coord: [8.79, 78.13] as [number, number] },
];

// 5 destination countries — flag (ISO2), timezone (IANA) for local day/night, currency code
const DESTINATIONS = [
  {
    name: "Rotterdam",
    country: "Netherlands",
    coord: [51.92, 4.48] as [number, number],
    iso2: "nl",
    tz: "Europe/Amsterdam",
    currency: "EUR",
  },
  {
    name: "Dubai",
    country: "United Arab Emirates",
    coord: [25.01, 55.06] as [number, number],
    iso2: "ae",
    tz: "Asia/Dubai",
    currency: "AED",
  },
  {
    name: "Singapore",
    country: "Singapore",
    coord: [1.27, 103.85] as [number, number],
    iso2: "sg",
    tz: "Asia/Singapore",
    currency: "SGD",
  },
  {
    name: "New York",
    country: "United States",
    coord: [40.71, -74.0] as [number, number],
    iso2: "us",
    tz: "America/New_York",
    currency: "USD",
  },
  {
    name: "Durban",
    country: "South Africa",
    coord: [-29.86, 31.02] as [number, number],
    iso2: "za",
    tz: "Africa/Johannesburg",
    currency: "ZAR",
  },
];

// Aachari International brand tokens
const COLORS = {
  saffron: "#C1622A",
  ink: "#1A1A1A",
  cream: "#F8F7F4",
  line: "#E4DFD4",
};

export default function TradeNetworkMap() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const ratesRef = useRef<Record<string, number>>({}); // 1 unit of currency -> INR

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    let destroyed = false;
    let animationFrame: number;
    let invalidateTimer: number | undefined;
    let resizeObserver: ResizeObserver | undefined;

    // Fetch live currency -> INR rates (open.er-api.com, USD base)
    const fetchRates = async () => {
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();

        if (!data || !data.rates) throw new Error("Invalid format");

        const usdToInr = data.rates["INR"] || 1;
        const rates: Record<string, number> = {};

        DESTINATIONS.forEach((d) => {
          if (d.currency === "USD") {
            rates.USD = usdToInr;
            return;
          }
          const usdToForeign = data.rates[d.currency];
          if (usdToForeign > 0) {
            rates[d.currency] = usdToInr / usdToForeign; // 1 unit of currency -> INR
          }
        });

        ratesRef.current = rates;
      } catch {
        ratesRef.current = {};
      }
    };

    const buildPopupHTML = (dest: (typeof DESTINATIONS)[number]) => {
      const now = new Date();
      const hourStr = new Intl.DateTimeFormat("en-GB", {
        timeZone: dest.tz,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(now);
      const hour24 = parseInt(hourStr.split(":")[0], 10);
      const isDay = hour24 >= 6 && hour24 < 18;
      const timeLabel = new Intl.DateTimeFormat("en-US", {
        timeZone: dest.tz,
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }).format(now);
      const dateLabel = new Intl.DateTimeFormat("en-US", {
        timeZone: dest.tz,
        weekday: "short",
        day: "numeric",
        month: "short",
      }).format(now);

      const rate = ratesRef.current[dest.currency];
      const currencyLine = rate ? `1 ${dest.currency} ≈ ₹${rate.toFixed(2)}` : `Loading rate…`;

      return `
        <div style="min-width:190px;font-family:system-ui,sans-serif;">
          <div style="display:flex;align-items:center;gap:8px;padding:2px 0 8px 0;border-bottom:1px solid ${COLORS.line};margin-bottom:8px;">
            <img src="https://flagcdn.com/w40/${dest.iso2}.png" width="26" style="border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.1);" />
            <div>
              <div style="font-weight:600;font-size:13px;color:${COLORS.ink};line-height:1.2;">${dest.name}</div>
              <div style="font-size:10.5px;color:#8A8577;letter-spacing:.02em;">${dest.country}</div>
            </div>
          </div>
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;color:${COLORS.ink};margin-bottom:5px;">
            <span>${isDay ? "☀️" : "🌙"}</span>
            <span style="font-weight:600;">${timeLabel}</span>
            <span style="color:#8A8577;">· ${dateLabel}</span>
          </div>
          <div style="font-size:11.5px;font-weight:600;color:${COLORS.saffron};background:rgba(193,98,42,.08);display:inline-block;padding:3px 8px;border-radius:20px;">
            ${currencyLine}
          </div>
        </div>
      `;
    };

    import("leaflet").then(async (L) => {
      if (destroyed || !mapContainerRef.current) return;

      await fetchRates();

      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        scrollWheelZoom: false,
        attributionControl: false,
        dragging: true,
      }).setView([20, 30], 2);
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 8,
        minZoom: 2,
      }).addTo(map);

      // Container is sized with %/vh, so Leaflet can grab a stale 0/near-0 size
      // at first paint. Force it to re-measure once layout has actually settled.
      requestAnimationFrame(() => map.invalidateSize());
      invalidateTimer = window.setTimeout(() => map.invalidateSize(), 300);

      resizeObserver = new ResizeObserver(() => map.invalidateSize());
      if (mapContainerRef.current) resizeObserver.observe(mapContainerRef.current);

      const mkStaticMarker = (coord: [number, number], color: string, name: string) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="position:relative;width:14px;height:14px;border-radius:50%;background:${color};"><div class="tnm-pulse" style="position:absolute;inset:0;border-radius:50%;background:${color};opacity:.4"></div></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });
        return L.marker(coord, { icon })
          .bindTooltip(name, { permanent: false, direction: "top", offset: [0, -8] })
          .addTo(map);
      };

      mkStaticMarker(HQ, COLORS.saffron, "Chennai HQ");
      PORTS.forEach((p) => mkStaticMarker(p.coord, COLORS.ink, p.name));

      // Destination markers — bigger + more animated pin, hover/click to reveal flag + local time + currency card
      const destMarkers: LeafletMarker[] = DESTINATIONS.map((dest) => {
        const icon = L.divIcon({
          className: "",
          html: `
            <div class="tnm-dest-marker" style="position:relative;width:24px;height:24px;">
              <div class="tnm-pulse-ring" style="position:absolute;inset:0;border-radius:50%;background:${COLORS.saffron};opacity:.35"></div>
              <div class="tnm-pulse-ring tnm-pulse-ring-delay" style="position:absolute;inset:0;border-radius:50%;background:${COLORS.saffron};opacity:.35"></div>
              <div class="tnm-dest-core" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:12px;height:12px;border-radius:50%;background:${COLORS.saffron};box-shadow:0 0 0 3px rgba(193,98,42,.3),0 0 10px rgba(193,98,42,.6);"></div>
            </div>
          `,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });
        const marker = L.marker(dest.coord, { icon }).addTo(map);
        marker.bindPopup(buildPopupHTML(dest), {
          closeButton: false,
          className: "tnm-popup",
          offset: [0, -10],
        });
        marker.on("mouseover", () => {
          marker.setPopupContent(buildPopupHTML(dest));
          marker.openPopup();
        });
        marker.on("mouseout", () => marker.closePopup());
        marker.on("click", () => {
          marker.setPopupContent(buildPopupHTML(dest));
          marker.openPopup();
        });
        return marker;
      });

      const drawRoute = (from: [number, number], to: [number, number]) => {
        const [lat1, lon1] = from;
        const [lat2, lon2] = to;
        const midLat = (lat1 + lat2) / 2 + 15 * (Math.abs(lon1 - lon2) > 120 ? -1 : 1);
        const midLon = (lon1 + lon2) / 2;
        const pts: [number, number][] = [];
        for (let t = 0; t <= 1; t += 0.02) {
          const x = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2;
          const y = (1 - t) * (1 - t) * lon1 + 2 * (1 - t) * t * midLon + t * t * lon2;
          pts.push([x, y]);
        }
        L.polyline(pts, { color: COLORS.saffron, weight: 1.1, opacity: 0.55, dashArray: "3 5" }).addTo(map);
        return pts;
      };

      const routePaths = DESTINATIONS.map((d) => drawRoute(HQ, d.coord));

      const movingIcon = L.divIcon({
        className: "",
        html: `<div style="width:9px;height:9px;border-radius:50%;background:${COLORS.ink};box-shadow:0 0 0 4px rgba(26,26,26,.25),0 0 14px rgba(26,26,26,.5)"></div>`,
        iconSize: [9, 9],
        iconAnchor: [4.5, 4.5],
      });

      const movers = routePaths.map((path) => ({
        marker: L.marker(path[0], { icon: movingIcon }).addTo(map),
        path,
        t: Math.random() * path.length,
        speed: 0.06 + Math.random() * 0.04,
      }));

      const animateShips = () => {
        movers.forEach((m) => {
          m.t += m.speed;
          if (m.t >= m.path.length - 1) m.t = 0;
          m.marker.setLatLng(m.path[Math.floor(m.t)]);
        });
        animationFrame = requestAnimationFrame(animateShips);
      };
      animateShips();

      void destMarkers; // keep reference for cleanup scope
    });

    return () => {
      destroyed = true;
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (invalidateTimer) window.clearTimeout(invalidateTimer);
      if (resizeObserver) resizeObserver.disconnect();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <section id="mapnetwork" className="relative z-0 w-full" style={{ background: COLORS.cream }}>
      {/* Heading */}
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-12 pt-16 pb-8 sm:pt-20 sm:pb-10 text-center">
        
        <h2
          className="text-[clamp(2.2rem,6vw,5rem)] leading-[0.98] uppercase"
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            background: `linear-gradient(135deg, ${COLORS.ink} 0%, ${COLORS.ink} 55%, ${COLORS.saffron} 100%)`,
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Global Trade Network
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base" style={{ color: "#5C5850" }}>
          From Chennai to the world — hover a destination for local time and live currency value.
        </p>
      </div>

      {/* Map — 80% width, 60% viewport height, centered */}
      <div className="w-full flex justify-center pb-16 sm:pb-20">
        <div
          ref={mapContainerRef}
          className="relative z-0 w-[80%] h-[60vh] min-h-[380px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(26,26,26,0.12)]"
          style={{ background: COLORS.cream, border: `1px solid ${COLORS.line}` }}
        />
      </div>

      <style jsx global>{`
        .tnm-pulse {
          animation: tnmPulse 1.8s ease-out infinite;
        }
        @keyframes tnmPulse {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(4); opacity: 0; }
        }
        .tnm-pulse-ring {
          animation: tnmPulseRing 2.2s ease-out infinite;
        }
        .tnm-pulse-ring-delay {
          animation-delay: 1.1s;
        }
        @keyframes tnmPulseRing {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(3.2); opacity: 0; }
        }
        .tnm-dest-core {
          animation: tnmCoreBounce 2.4s ease-in-out infinite;
        }
        @keyframes tnmCoreBounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.18); }
        }
        .tnm-dest-marker {
          transition: transform 0.2s ease;
          cursor: pointer;
        }
        .tnm-dest-marker:hover {
          transform: scale(1.35);
        }
        .leaflet-container {
          background: ${COLORS.cream};
          z-index: 0 !important;
        }
        .leaflet-pane,
        .leaflet-top,
        .leaflet-bottom {
          z-index: 0 !important;
        }
        .tnm-popup .leaflet-popup-content-wrapper {
          background: #ffffff;
          border-radius: 10px;
          box-shadow: 0 8px 28px rgba(26,26,26,.18);
          border: 1px solid ${COLORS.line};
        }
        .tnm-popup .leaflet-popup-content {
          margin: 10px 12px;
        }
        .tnm-popup .leaflet-popup-tip {
          background: #ffffff;
          border: 1px solid ${COLORS.line};
        }
      `}</style>
    </section>
  );
}