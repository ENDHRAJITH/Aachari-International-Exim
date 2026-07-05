"use client";
import { useEffect, useState, useRef } from "react";

export default function ScrollPlane() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        setProgress(Math.min(100, Math.max(0, pct)));
        rafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      className="hidden lg:flex"
      style={{
        position: "fixed",
        right: "8px",
        top: "80px",
        bottom: "40px",
        width: "24px",
        zIndex: 9999,
        pointerEvents: "none",
        justifyContent: "center",
      }}
    >
      {/* Dotted flight path */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "2px",
          borderLeft: "2px dashed rgba(193,98,42,0.3)",
        }}
      />

      {/* Filled progress line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          width: "2px",
          height: `${progress}%`,
          borderLeft: "2px dashed #c1622a",
          transition: "height 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />

      {/* Top live dot */}
      <div
        style={{
          position: "absolute",
          top: "-4px",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#c1622a",
          boxShadow: "0 0 0 0 rgba(193,98,42,0.7)",
          animation: "trackPulse 1.8s ease-out infinite",
        }}
      />

      {/* Bottom live dot */}
      <div
        style={{
          position: "absolute",
          bottom: "-4px",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: "#c1622a",
          boxShadow: "0 0 0 0 rgba(193,98,42,0.7)",
          animation: "trackPulse 1.8s ease-out infinite",
          animationDelay: "0.9s",
        }}
      />

      {/* Airplane icon */}
      <div
        style={{
          position: "absolute",
          top: `${progress}%`,
          transform: "translateY(-50%)",
          transition: "top 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          filter: "drop-shadow(0 2px 6px rgba(193,98,42,0.4))",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="#c1622a"
          style={{ transform: "rotate(-180deg)" }}
        >
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2.5 2v1.5l3.5-1 3.5 1V21l-2.5-2v-5.5z" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes trackPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(193, 98, 42, 0.7);
          }
          70% {
            box-shadow: 0 0 0 8px rgba(193, 98, 42, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(193, 98, 42, 0);
          }
        }
      `}</style>
    </div>
  );
}