export default function AboutContent() {
  const features = [
    {
      title: "Verified Quality",
      description:
        "Every consignment lab-tested and triple-inspected before sealing.",
    },
    {
      title: "Global Logistics",
      description:
        "Direct ports of call in 40+ nations with bonded warehouse network.",
    },
    {
      title: "Custom Sourcing",
      description:
        "OEM, white-label and bespoke procurement at industrial volumes.",
    },
    {
      title: "Trade Finance",
      description:
        "Flexible LC, TT and open-account terms across major banks.",
    },
  ];

  return (
    <div>
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
        <span
          className="
            h-px
            w-8
            bg-saffron
            animate-pulse
          "
        />
        About Us
      </div>

      {/* Title */}

      <h2
        className="
          max-w-[800px]
          text-[clamp(2.2rem,4vw,3.6rem)]
          leading-[1.05]
          tracking-[-0.02em]
          text-ink
        "
      >
        Exporting India's finest products with{" "}
        <span className="italic font-light text-saffron-deep">
          integrity
        </span>{" "}
        and precision.
      </h2>

      {/* Description */}

      <p
        className="
          mt-8
          max-w-[620px]
          text-[17px]
          leading-8
          text-ink-soft
        "
      >
        Aachari International Exim bridges trusted Indian
        manufacturers with buyers across global markets.
        From premium spices sourced from renowned growing
        regions to industrial hardware and electronics,
        every shipment reflects quality, compliance and
        reliability.
      </p>

      <p
        className="
          mt-6
          max-w-[620px]
          text-[17px]
          leading-8
          text-ink-soft
        "
      >
        Through strong supplier networks, transparent
        sourcing and efficient logistics, we ensure
        seamless international trade experiences for
        businesses worldwide.
      </p>

      {/* Features */}

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="
              group
              rounded-2xl
              border
              border-black/5
              bg-white/40
              p-6
              backdrop-blur-sm
              transition-all
              duration-500
              hover:-translate-y-2
              hover:border-saffron/20
              hover:shadow-[0_20px_40px_rgba(42,31,23,0.08)]
            "
            style={{
              animation: `cardFloat ${
                5 + index
              }s ease-in-out infinite`,
              animationDelay: `${index * 0.3}s`,
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  mt-1
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-saffron/10
                  text-saffron
                  transition-all
                  duration-300
                  group-hover:bg-saffron
                  group-hover:text-white
                "
              >
                ✓
              </div>

              <div>
                <h3
                  className="
                    text-lg
                    font-medium
                    text-ink
                  "
                >
                  {feature.title}
                </h3>

                <p
                  className="
                    mt-2
                    text-[15px]
                    leading-7
                    text-ink-soft
                  "
                >
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}