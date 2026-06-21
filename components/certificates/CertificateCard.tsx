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
        rounded-[10px]
        border
        border-white/[0.12]
        bg-white/[0.05]
        px-6
        py-8
        text-center
        transition-all
        duration-500
        hover:-translate-y-[6px]
        hover:border-saffron/50
      "
    >
      {/* Glow */}

      <div
        className="
          absolute
          inset-0
          scale-0
          bg-[radial-gradient(circle,rgba(217,121,38,0.2)_0%,transparent_50%)]
          transition-transform
          duration-700
          group-hover:scale-100
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          mb-[18px]
          grid
          h-[80px]
          w-[80px]
          place-items-center
          rounded-full
          bg-gradient-to-br
          from-gold
          to-gold-light
          font-[var(--font-display)]
          text-[1rem]
          font-bold
          text-ink
        "
      >
        {seal}
      </div>

      <h4
        className="
          relative
          z-10
          mb-2
          font-[var(--font-display)]
          text-[1.15rem]
          font-medium
          text-cream
        "
      >
        {title}
      </h4>

      <p
        className="
          relative
          z-10
          text-[0.82rem]
          text-cream/60
        "
      >
        {description}
      </p>
    </div>
  );
}