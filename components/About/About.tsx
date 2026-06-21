import AboutImage from "./AboutImage";
import AboutContent from "./AboutContent";

export default function About() {
  return (
    <section
      id="about"
      className="
        relative
        overflow-hidden
        bg-cream-soft
        px-6
        py-24
        lg:px-12
      "
    >
      {/* Background Blobs */}

      <div
        className="
          absolute
          right-0
          top-20
          h-[320px]
          w-[320px]
          rounded-full
          bg-saffron/10
          blur-[80px]
          animate-[blobFloat_10s_ease-in-out_infinite]
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-10
          left-0
          h-[280px]
          w-[280px]
          rounded-full
          bg-emerald/10
          blur-[80px]
          animate-[blobFloat_12s_ease-in-out_infinite]
          pointer-events-none
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1320px]
          grid
          items-center
          gap-20
          lg:grid-cols-[0.9fr_1.1fr]
        "
      >
        <AboutImage />
        <AboutContent />
      </div>
    </section>
  );
}