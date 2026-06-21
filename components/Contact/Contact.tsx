import ContactHeader from "./ContactHeader";
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function Contact() {
  return (
    <section
      id="contact"
      className="
        relative
        bg-cream-soft
        px-6
        py-28
        lg:px-12
      "
    >
      {/* Optional subtle background glow like original */}

      <div
        className="
          pointer-events-none
          absolute
          right-0
          top-0
          h-[400px]
          w-[400px]
          rounded-full
          bg-saffron/5
          blur-[120px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          h-[300px]
          w-[300px]
          rounded-full
          bg-emerald/5
          blur-[100px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1320px]
        "
      >
        <ContactHeader />

        <div
          className="
            grid
            gap-[60px]
            lg:grid-cols-[1fr_1.1fr]
          "
        >
          <ContactInfo />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}