type CertificateCardProps = {
  seal: string;
  title: string;
  description: string;
};

export default function CertificateCard({
  seal,
  title,
  description,
}: CertificateCardProps) {
  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-[14px]
        border
        border-white/[0.10]
        bg-gradient-to-b
        from-white/[0.06]
        to-white/[0.02]
        px-7
        py-10
        text-center
        shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]
        transition-all
        duration-500
        ease-out
        hover:-translate-y-2
        hover:border-saffron/40
        hover:shadow-[0_20px_40px_-12px_rgba(217,121,38,0.25)]
      "
    >
      {/* Corner accents — certificate framing device */}
      <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-saffron/0 transition-colors duration-500 group-hover:border-saffron/60" />
      <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-saffron/0 transition-colors duration-500 group-hover:border-saffron/60" />
      <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-saffron/0 transition-colors duration-500 group-hover:border-saffron/60" />
      <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-saffron/0 transition-colors duration-500 group-hover:border-saffron/60" />

      {/* Ambient glow */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          scale-0
          bg-[radial-gradient(circle,rgba(217,121,38,0.18)_0%,transparent_55%)]
          transition-transform
          duration-700
          ease-out
          group-hover:scale-100
        "
      />

      {/* Shimmer sweep */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/[0.06]
          to-transparent
          transition-transform
          duration-1000
          ease-out
          group-hover:translate-x-full
        "
      />

      {/* Seal */}
      <div className="relative z-10 mx-auto mb-5 grid h-[84px] w-[84px] place-items-center">
        {/* Outer ring */}
        <div
          className="
            absolute
            inset-0
            rounded-full
            border
            border-gold/30
            transition-all
            duration-500
            group-hover:scale-110
            group-hover:border-gold/60
          "
        />
        {/* Inner seal */}
        <div
          className="
            relative
            grid
            h-[68px]
            w-[68px]
            place-items-center
            rounded-full
            bg-gradient-to-br
            from-gold
            to-gold-light
            font-[var(--font-display)]
            text-[1rem]
            font-bold
            text-ink
            shadow-[0_4px_16px_rgba(0,0,0,0.35)]
            transition-transform
            duration-500
            group-hover:scale-105
          "
        >
          {seal}
        </div>
      </div>

      <h4
        className="
          relative
          z-10
          mb-2.5
          font-[var(--font-display)]
          text-[1.15rem]
          font-medium
          tracking-tight
          text-cream
        "
      >
        {title}
      </h4>

      <div className="relative z-10 mx-auto mb-3 h-px w-8 bg-saffron/40 transition-all duration-500 group-hover:w-12" />

      <p className="relative z-10 text-[0.82rem] leading-relaxed text-cream/60">
        {description}
      </p>
    </div>
  );
}