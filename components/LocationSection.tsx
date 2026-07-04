"use client";

export default function LocationSection() {
  const LAT = 13.077536;
  const LNG = 79.675588;

  return (
    <section className="relative bg-ink px-6 pb-20 pt-10 lg:px-12">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h5 className="mb-2 text-[0.74rem] uppercase tracking-[0.22em] text-gold-light">
              Find Us
            </h5>
            <h3 className="text-[1.6rem] font-medium text-cream">
              Our Location
            </h3>
          </div>

          {/* Live status badge */}
          <div className="flex items-center gap-2 rounded-full border border-white/15 px-4 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-[0.8rem] text-cream/70">Live Location</span>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative h-[420px] w-full overflow-hidden rounded-2xl border border-white/10">
          <iframe
            title="Aachari International Exim Location"
            src={`https://www.google.com/maps?q=${LAT},${LNG}&z=16&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, filter: "grayscale(20%) contrast(1.1)" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />

          {/* Gradient overlay so it blends with dark theme */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,11,15,0.15) 0%, rgba(11,11,15,0.05) 50%, rgba(11,11,15,0.35) 100%)",
            }}
          />

          {/* Bottom-left address card floating on map */}
          <div className="absolute bottom-5 left-5 max-w-[300px] rounded-xl border border-white/15 bg-ink/80 p-4 backdrop-blur-md">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-gold-light">
              Registered Address
            </p>
            <p className="mt-1 text-[0.85rem] leading-6 text-cream/80">
              No. 15, 5th Street, A N Kandigai, Palanipet, Arakkonam,
              Vellore District, Tamil Nadu – 631002.
            </p>
            
             </div> <a href={`https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-[0.8rem] text-saffron hover:underline"
            >
              Get Directions →
            </a>
          </div>
        </div>
       
    </section>
  );
}