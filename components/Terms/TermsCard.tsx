type TermsCardProps = {
  number: string;
  title: string;
  description: string;
  points: string[];
};

export default function TermsCard({
  number,
  title,
  description,
  points,
}: TermsCardProps) {
  return (
    <div
      className="
        group
        rounded-[10px]
        border
        border-black/[0.08]
        bg-cream-soft
        px-7
        py-8
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_20px_50px_rgba(42,31,23,0.08)]
      "
    >
      <div
        className="
          mb-[14px]
          font-[var(--font-display)]
          text-[3rem]
          font-light
          italic
          leading-none
          text-saffron
        "
      >
        {number}
      </div>

      <h4
        className="
          mb-[10px]
          font-[var(--font-display)]
          text-[1.25rem]
          font-medium
          text-ink
        "
      >
        {title}
      </h4>

      <p
        className="
          mb-[14px]
          text-[0.92rem]
          text-ink-soft
        "
      >
        {description}
      </p>

      <ul>
        {points.map((point) => (
          <li
            key={point}
            className="
              relative
              py-[6px]
              pl-[22px]
              text-[0.86rem]
              text-ink-soft
            "
          >
            <span
              className="
                absolute
                left-0
                text-saffron
              "
            >
              ✦
            </span>

            {point}
          </li>
        ))}
      </ul>
    </div>
  );
}