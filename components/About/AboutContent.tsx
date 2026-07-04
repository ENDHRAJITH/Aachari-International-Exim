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
    <div className="w-full">
      {/* Eyebrow */}
      <div
        className="
          mb-4 sm:mb-5
          flex
          items-center
          gap-3
          text-[10px] sm:text-[12px]
          font-semibold
          uppercase
          tracking-[0.25em] sm:tracking-[0.32em]
          text-saffron-deep
        "
      >
        <span
          className="
            h-px
            w-6 sm:w-8
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
          text-[2rem]
          sm:text-[2.6rem]
          lg:text-[3.6rem]
          leading-tight
          lg:leading-[1.05]
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
          mt-6 sm:mt-8
          max-w-[620px]
          text-[15px] sm:text-[17px]
          leading-7 sm:leading-8
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
          mt-4 sm:mt-6
          max-w-[620px]
          text-[15px] sm:text-[17px]
          leading-7 sm:leading-8
          text-ink-soft
        "
      >
        Through strong supplier networks, transparent
        sourcing and efficient logistics, we ensure
        seamless international trade experiences for
        businesses worldwide.
      </p>

      {/* Features */}
      {/* <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="
              group
              rounded-xl sm:rounded-2xl
              border
              border-black/5
              bg-white/40
              p-5 sm:p-6
              backdrop-blur-sm
              transition-all
              duration-500
              hover:-translate-y-1 sm:hover:-translate-y-2
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
            <div className="flex items-start gap-3 sm:gap-4">
              <div
                className="
                  mt-1
                  flex
                  h-8 w-8
                  sm:h-10 sm:w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-saffron/10
                  text-sm sm:text-base
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
                    text-base sm:text-lg
                    font-medium
                    text-ink
                  "
                >
                  {feature.title}
                </h3>

                <p
                  className="
                    mt-2
                    text-sm sm:text-[15px]
                    leading-6 sm:leading-7
                    text-ink-soft
                  "
                >
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </div>
  );
}