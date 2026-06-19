"use client";

export default function HeroParticles() {
  const particles = Array.from(
    { length: 36 },
    (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 4 + Math.random() * 8,
      duration: 14 + Math.random() * 16,
      delay: Math.random() * -20,
      dx: Math.random() * 100 - 50,
      color: [
        "#d97926",
        "#b9591a",
        "#c44a2e",
        "#b8893a",
        "#1f4f3f",
      ][Math.floor(Math.random() * 5)],
    })
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animation: `particleFloat ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            ["--dx" as any]: `${p.dx}px`,
          }}
        />
      ))}
    </div>
  );
}