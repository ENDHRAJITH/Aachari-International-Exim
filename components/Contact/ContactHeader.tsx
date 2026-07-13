export default function ContactHeader() {
  return (
    <div className="mb-16 mt-20">
      {/* Eyebrow */}

      <div
        className="
          mb-5
          flex
          items-center
          gap-3
          text-[12px]
          font-semibold
          uppercase
          tracking-[0.32em]
          text-saffron-deep
        "
      >
        <span className="h-px w-8 bg-saffron" />
        Get in Touch
      </div>

      {/* Title */}

      <h2
        className="
          font-[var(--font-display)]
          text-[clamp(2.8rem,4vw,4.5rem)]
          leading-[1]
          tracking-[-0.02em]
          text-ink
        "
      >
        Begin your{" "}
        <span className="font-light italic text-saffron">
          conversation
        </span>{" "}
        with us.
      </h2>
    </div>
  );
}