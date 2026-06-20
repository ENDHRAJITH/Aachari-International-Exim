export default function TermsHeader() {
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
          text-saffron-deep
        "
      >
        <span className="h-px w-8 bg-saffron" />
        Payment & Trade Terms
      </div>

      <h2
        className="
          max-w-[760px]
          font-[var(--font-display)]
          text-[clamp(2.8rem,4vw,4.8rem)]
          leading-[0.98]
          tracking-[-0.03em]
          text-ink
        "
      >
        Flexible terms,{" "}
        <span className="font-light italic text-saffron">
          transparent
        </span>{" "}
        dealings.
      </h2>

      <p
        className="
          mt-8
          max-w-[700px]
          text-[17px]
          leading-8
          text-ink-soft
        "
      >
        We offer multiple payment structures designed for
        first-time buyers and long-standing partners alike
        — all governed by ICC's Incoterms 2020.
      </p>
    </div>
  );
}