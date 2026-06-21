import TermsHeader from "./TermsHeader";
import TermsCard from "./TermsCard";

const terms = [
  {
    number: "01",
    title: "Letter of Credit",
    description:
      "Irrevocable LC at sight via tier-1 banks.",
    points: [
      "Confirmed / Unconfirmed",
      "SBLC accepted",
      "Discrepancy support",
    ],
  },
  {
    number: "02",
    title: "Telegraphic Transfer",
    description:
      "Wire transfer with milestone splits.",
    points: [
      "30% advance, 70% B/L",
      "USD, EUR, AED accepted",
      "SWIFT MT103 secured",
    ],
  },
  {
    number: "03",
    title: "Documents Against",
    description:
      "D/P and D/A available for trusted buyers.",
    points: [
      "30 / 60 / 90 day terms",
      "Credit insurance backed",
      "Bank-to-bank collection",
    ],
  },
  {
    number: "04",
    title: "Open Account",
    description:
      "Net terms for established partners.",
    points: [
      "Net-30 / Net-60",
      "Volume-based credit limits",
      "Annual contracts available",
    ],
  },
];

export default function Terms() {
  return (
    <section
      id="terms"
      className="
        bg-cream
        px-6
        py-24
        lg:px-12
      "
    >
      <div className="mx-auto max-w-[1320px]">
        <TermsHeader />

        <div
          className="
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-4
          "
        >
          {terms.map((term) => (
            <TermsCard
              key={term.number}
              number={term.number}
              title={term.title}
              description={term.description}
              points={term.points}
            />
          ))}
        </div>
      </div>
    </section>
  );
}