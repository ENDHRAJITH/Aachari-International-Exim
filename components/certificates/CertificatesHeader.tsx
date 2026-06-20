export default function CertificatesHeader() {
  return (
    <div className="mb-16">
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
          text-gold-light
        "
      >
        <span className="h-px w-8 bg-gold" />
        Accreditations
      </div>

      <h2
        className="
          max-w-[850px]
          font-[var(--font-display)]
          text-[clamp(2.8rem,4vw,4.8rem)]
          leading-[0.98]
          tracking-[-0.03em]
          text-cream
        "
      >
        Built on{" "}
        <span className="font-light italic text-gold-light">
          compliance
        </span>
        . Honoured by certification.
      </h2>

      <p
        className="
          mt-8
          max-w-[720px]
          text-[17px]
          leading-8
          text-cream/70
        "
      >
        Every license, audit and accreditation we hold
        is one more reason buyers across the globe sign
        with confidence.
      </p>
    </div>
  );
}