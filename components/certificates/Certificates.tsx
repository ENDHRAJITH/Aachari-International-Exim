import CertificatesHeader from "./CertificatesHeader";
import CertificateCard from "./CertificateCard";
import InternationalStandards from "./InternationalStandards";

const certificates = [
  {
    seal: "ISO",
    title: "ISO 9001:2015",
    description: "Quality management systems certified",
  },
  {
    seal: "FSSAI",
    title: "FSSAI Licensed",
    description: "Food safety & standards authority",
  },
  {
    seal: "APEDA",
    title: "APEDA Member",
    description: "Agricultural export development authority",
  },
  {
    seal: "IEC",
    title: "Import-Export Code",
    description: "DGFT registered exporter",
  },
  {
    seal: "GMP",
    title: "Good Manufacturing",
    description: "Hygiene & manufacturing practice",
  },
  {
    seal: "HACCP",
    title: "HACCP Certified",
    description: "Hazard analysis critical control",
  },
  {
    seal: "CE",
    title: "CE Marking",
    description: "European conformity for electronics",
  },
  {
    seal: "RoHS",
    title: "RoHS Compliant",
    description: "Restricted hazardous substances",
  },
];

export default function Certificates() {
  return (
    <>
    <InternationalStandards />
     
    <section
      id="certificates"
      className="
        relative
        overflow-hidden
        bg-ink
        px-6
        py-24
        text-cream
        lg:px-12
      "
    >
      {/* Background Glow Effects */}

       

      <div
        className="
          pointer-events-none
          absolute
          inset-0
        "
      >
        <div
          className="
            absolute
            left-[20%]
            top-[30%]
            h-[500px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-saffron/15
            blur-[120px]
          "
        />

        <div
          className="
            absolute
            right-[10%]
            top-[70%]
            h-[500px]
            w-[500px]
            -translate-y-1/2
            rounded-full
            bg-emerald/25
            blur-[140px]
          "
        />
      </div>

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1320px]
        "
      >
        <CertificatesHeader />

        {/* Certificates Grid */}

        <div
          className="grid gap-5"
          style={{
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
          }}
        >
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.title}
              seal={certificate.seal}
              title={certificate.title}
              description={certificate.description}
            />
          ))}
        </div>
      </div>
    </section>
    </>
  );
}