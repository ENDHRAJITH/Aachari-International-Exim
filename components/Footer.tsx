"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* =========================================================
   CONSTANTS
========================================================= */

const LEGAL_EFFECTIVE_DATE = "01 / August / 2026";

type LegalModalType = "privacy" | "terms" | null;

/* =========================================================
   TERMS & CONDITIONS DATA
========================================================= */

type Clause = {
  no: string;
  label?: string;
  text: string;
  subItems?: string[];
  after?: string;
};

type TermsSection = {
  title: string;
  paragraphs?: string[];
  definitions?: { term: string; text: string }[];
  clauses?: Clause[];
};

const TERMS_SECTIONS: TermsSection[] = [
  {
    title: "About Us",
    paragraphs: [
      "Aachari International Exim Pvt. Ltd. is an Indian export company with over a decade of domestic market experience, connecting global buyers with quality-assured products sourced from trusted Indian manufacturers and producers.",
      "Our product range covers organic agro products, agricultural produce, fresh fruits and vegetables, food powders, bakery products, ready-to-eat foods, handicrafts, and knitted and woven garments. Sample orders, custom packaging, and private labelling are available on most products.",
    ],
  },
  {
    title: "Definitions",
    definitions: [
      {
        term: "Company/Seller/we/us/our",
        text: "Aachari International Exim Pvt. Ltd., its successors and permitted assigns.",
      },
      {
        term: "Buyer/Customer/you",
        text: "the party purchasing Products from the Company, in India or overseas.",
      },
      {
        term: "Products",
        text: "all goods offered by the Company, including agro produce, food items, handicrafts and garments.",
      },
      {
        term: "Contract",
        text: "the specific purchase order, proforma invoice, or order confirmation for a shipment, read together with these Terms.",
      },
      {
        term: "Incoterms",
        text: "ICC International Commercial Terms; Incoterms 2020 applies unless a different edition is expressly stated in the Contract.",
      },
      {
        term: "LC",
        text: "an irrevocable documentary Letter of Credit governed by UCP 600 (ICC Publication 600, current revision).",
      },
      {
        term: "CHA",
        text: "the Customs House Agent engaged for clearance of the consignment.",
      },
      {
        term: "Business Day",
        text: "a day (other than Saturday, Sunday, or a gazetted holiday) on which banks are open for business in Chennai, India.",
      },
      {
        term: "Force Majeure Event",
        text: "as defined in Clause 19.1.",
      },
      {
        term: "Writing/written",
        text: "includes email, unless a Contract or LC requires a physically signed document.",
      },
    ],
  },
  {
    title: "Applicability and Acceptance",
    clauses: [
      {
        no: "3.1",
        label: "Scope",
        text: "These Terms apply to every export/import quotation, purchase order and Contract of the Company, unless varied in writing by an authorised signatory of the Company.",
      },
      {
        no: "3.2",
        label: "Precedence",
        text: "If a signed Contract or LC conflicts with these Terms, the Contract/LC prevails only on the point of conflict; these Terms govern every other matter.",
      },
      {
        no: "3.3",
        label: "Acceptance",
        text: "Any one of the following constitutes binding acceptance of these Terms: placing a purchase order, signing/confirming a proforma invoice, instructing an LC to be opened, or remitting an advance payment.",
      },
      {
        no: "3.4",
        label: "Buyer's warranty",
        text: "The Buyer confirms it is a validly constituted entity, legally authorised to import and trade internationally, and that entering the Contract does not violate any law binding on the Buyer.",
      },
      {
        no: "3.5",
        label: "No waiver by delay",
        text: "A delay or omission by the Company in enforcing any Term does not waive that Term or any future right to enforce it.",
      },
    ],
  },
  {
    title: "Products, Samples, MOQ and Cancellation",
    clauses: [
      {
        no: "4.1",
        label: "Product variance",
        text: "Images/descriptions are indicative. Natural produce and handcrafted items may vary in colour, size, weight or finish within trade-customary limits; such variance is not a defect.",
      },
      {
        no: "4.2",
        label: "Samples",
        text: "Pre-shipment samples are chargeable unless waived in writing. A sample once approved by the Buyer in writing is the binding quality benchmark for that order; verbal approval is not sufficient.",
      },
      {
        no: "4.3",
        label: "MOQ",
        text: "Each Product carries a minimum order quantity (MOQ) stated in the quotation. Orders below MOQ may be declined or repriced at the Company's discretion.",
      },
      {
        no: "4.4",
        label: "Private label",
        text: "For private-label/custom-packaging orders, the Buyer must supply final artwork and label content in writing within the timeline stated in the quotation. Production does not begin until artwork is approved in writing by the Buyer. Delay in artwork approval extends the shipment schedule by an equal number of days. The Buyer is solely responsible for the legality of all brand names, claims and artwork used, and indemnifies the Company under Clause 18.",
      },
      {
        no: "4.5",
        label: "Cancellation by Buyer",
        text: "An order may be cancelled by the Buyer only with the Company's written consent. Where production, procurement, or private-label packaging has already commenced, any advance paid is forfeited to the extent of costs already incurred, and the balance (if any) is refunded within 30 days.",
      },
      {
        no: "4.6",
        label: "Cancellation by Company",
        text: "The Company may cancel an unshipped order, without liability beyond refund of any advance received (less costs already incurred), if the Buyer fails to open a conforming LC, fails to pay an agreed advance, or fails to approve artwork/specifications within the stipulated timeline.",
      },
    ],
  },
  {
    title: "Trade Terms and Incoterms",
    clauses: [
      {
        no: "5.1",
        text: "All delivery terms (FOB, CFR, CIF, EXW, DAP, etc.) are interpreted per Incoterms 2020, unless the Contract states a different edition.",
      },
      {
        no: "5.2",
        text: "The quoted price excludes every cost, duty, or charge arising after risk passes to the Buyer under the agreed Incoterm, including insurance, import duty, port charges, and unloading charges, unless the Contract expressly includes them.",
      },
      {
        no: "5.3",
        text: "Import clearance, import licences, and all destination-country duties/taxes are the Buyer's sole responsibility, except where the agreed Incoterm is DDP.",
      },
    ],
  },
  {
    title: "Pricing and Currency",
    clauses: [
      {
        no: "6.1",
        text: "Prices are quoted in USD unless another currency is stated in the quotation, and exclude bank charges, currency-conversion charges, and correspondent-bank fees unless expressly included.",
      },
      {
        no: "6.2",
        text: "A quoted price is valid only for the period stated in the quotation. An order not confirmed within that period may be repriced to reflect prevailing market/mandi rates, especially for agro-commodities.",
      },
      {
        no: "6.3",
        text: "Each party bears its own currency-fluctuation risk between the Contract date and the payment date, except where the fluctuation loss is caused by the other party's unjustified delay in payment or documentation.",
      },
    ],
  },
  {
    title: "Payment Terms",
    clauses: [
      {
        no: "7.1",
        label: "Accepted modes",
        text: "Payment is made by one of the following, as specified in the Contract: (a) 100% advance by TT/SWIFT MT103; (b) part-advance plus balance by TT before/against shipping documents; (c) Irrevocable LC, sight or usance (30/60/90 days); or (d) Transferable LC, where specifically agreed.",
      },
      {
        no: "7.2",
        label: "LC compliance",
        text: "An LC must be issued by a bank acceptable to the Company, strictly per the agreed Contract terms, and opened at least 15 Business Days before the scheduled shipment date. The Company may reject an LC containing ambiguous or restrictive clauses capable of manufacturing a discrepancy; resulting delay is not attributable to the Company. LC advising, confirmation and amendment charges outside India are for the Buyer's account unless the Contract states otherwise.",
      },
      {
        no: "7.3",
        label: "Late payment",
        text: "On any payment overdue by more than 5 Business Days, the Company may: suspend all pending and future shipments to the Buyer; charge interest at 1.5% per month (or the maximum rate permitted by applicable law, if lower) on the overdue amount from the due date to the date of realisation; and, after 30 days' continued default, treat it as material breach under Clause 22.",
      },
      {
        no: "7.4",
        label: "No set-off",
        text: "The Buyer may not withhold, deduct, or set off any amount against sums due to the Company without the Company's prior written consent.",
      },
      {
        no: "7.5",
        label: "FEMA compliance",
        text: "Export proceeds are realised and repatriated within the period prescribed under FEMA, 1999 and applicable RBI directions in force on the shipment date.",
      },
    ],
  },
  {
    title: "Quality, Inspection and Certification",
    clauses: [
      {
        no: "8.1",
        text: "Products conform to the specification, approved sample, or Technical Data Chart referenced in the Contract — not to general website/marketing descriptions.",
      },
      {
        no: "8.2",
        text: "Certificates (Certificate of Origin, Phytosanitary, Fumigation/ISPM-15, FSSAI, Organic, or others) are furnished only where specifically agreed in the Contract or legally mandated for export; charges for certificates not legally mandated are billed to the Buyer unless included in the price.",
      },
      {
        no: "8.3",
        text: "Pre-shipment inspection is carried out by the Company or a mutually agreed agency. Trade-customary remarks in the inspection/packing report (e.g., natural colour variation, minor packaging wear from export handling) are not treated as defects.",
      },
      {
        no: "8.4",
        text: "The Buyer may appoint its own inspection agency at its own cost, with at least 3 Business Days' prior written notice, provided this does not delay the agreed shipment schedule.",
      },
    ],
  },
  {
    title: "Packaging, Labelling and Marking",
    clauses: [
      {
        no: "9.1",
        text: "Standard export-grade packaging is used unless custom packaging is requested and paid for under Clause 4.4.",
      },
      {
        no: "9.2",
        text: "The Buyer must provide, in writing and at least 15 Business Days before the scheduled shipment, all destination-country labelling requirements (language, allergen declarations, net-weight standards, barcodes, or country-specific marking). The Company is not liable for customs delay, rejection, or penalty resulting from information not provided within this timeline.",
      },
      {
        no: "9.3",
        text: "Country-of-origin marking ('Made in India' or equivalent) is applied as legally required for export; any additional origin-marking requirement of the destination country must be notified by the Buyer under Clause 9.2.",
      },
      {
        no: "9.4",
        text: "Wood packaging material (pallets, crates, dunnage) complies with ISPM-15 fumigation and marking standards where required by the destination country.",
      },
    ],
  },
  {
    title: "Shipment, Delivery and Carrier Liability",
    clauses: [
      {
        no: "10.1",
        text: "Shipment timelines quoted are estimates running from the later of order confirmation, LC receipt (where LC is the payment mode), or artwork approval (where private-label), and are subject to carrier space availability, port congestion, and Force Majeure Events.",
      },
      {
        no: "10.2",
        text: "Partial shipment and transhipment are permitted unless expressly prohibited in the Contract or LC.",
      },
      {
        no: "10.3",
        text: "The Company is not liable for delay caused by the Buyer's delay in instructions/LC/artwork/documentation, or by carriers, ports, or customs authorities. Where delay is solely attributable to the Company, the Buyer's sole remedy is a reasonable extension of the shipment schedule, unless the Contract specifies liquidated damages.",
      },
      {
        no: "10.4",
        text: "Shipping documents (commercial invoice, packing list, bill of lading/airway bill, and agreed certificates) are furnished per the Contract/LC terms. Document-transmission charges are borne by the party specified in the Contract, or by the Buyer if unspecified.",
      },
      {
        no: "10.5",
        text: "Once goods are handed to a shipping line, airline, or freight forwarder, that carrier's own terms and bill of lading/airway bill govern its liability for loss, damage, or delay in transit; the Company is not liable for the acts, omissions, or delay of any carrier or customs authority.",
      },
    ],
  },
  {
    title: "Risk, Title and Insurance",
    clauses: [
      {
        no: "11.1",
        text: "Risk in the Products passes from the Company to the Buyer at the point specified by the agreed Incoterm (e.g., on loading onto the vessel/aircraft at the port/airport of shipment for FOB/CFR/CIF).",
      },
      {
        no: "11.2",
        text: "Title remains with the Company, notwithstanding passage of risk, until the Company has received payment in full for the relevant shipment.",
      },
      {
        no: "11.3",
        text: "Under CIF/CIP, the Company insures the shipment under Institute Cargo Clauses (A) or equivalent, for 110% of invoice value, unless the Contract states otherwise. Under FOB/CFR/EXW/FCA, the Buyer is solely responsible for insurance from the point risk passes.",
      },
    ],
  },
  {
    title: "Regulatory Compliance and Export Controls",
    clauses: [
      {
        no: "12.1",
        text: "The Company holds and maintains a valid compliance and arranges any Indian export licence required for the specific consignment.",
      },
      {
        no: "12.2",
        text: "The Buyer is solely responsible for import licences, permits, and destination-country regulatory compliance, including food-safety and labelling law.",
      },
      {
        no: "12.3",
        label: "Tariff classification",
        text: "The Company provides the HS code applicable in India for information only; the Buyer is solely responsible for verifying and declaring the correct tariff classification and duty in the destination country.",
      },
      {
        no: "12.4",
        label: "Sanctions screening",
        text: "The Buyer warrants it is not, and is not owned/controlled by, a person on any sanctions or denied-party list maintained by the UN, EU, US (OFAC), UK, or India, and will not resell or divert Products to a sanctioned country/party. The Company may decline or suspend any transaction where it reasonably suspects such risk.",
      },
      {
        no: "12.5",
        label: "Anti-bribery",
        text: "Each party complies with applicable anti-corruption law, including the Prevention of Corruption Act, 1988, and will not offer, give, or accept any improper payment in connection with the Contract.",
      },
      {
        no: "12.6",
        label: "KYC/AML",
        text: "The Company may require KYC documentation (certificate of incorporation, import licence, bank reference) from a new or high-value Buyer before confirming a Contract.",
      },
    ],
  },
  {
    title: "Quality Complaints, Claims and Rejection",
    clauses: [
      {
        no: "13.1",
        text: "A quality complaint must be raised in writing within 30 days of the vessel/aircraft's arrival at the discharge port/airport, supported by the bill of entry, lot/batch/heat number, photographs, and a report from a mutually recognised independent inspection agency.",
      },
      {
        no: "13.2",
        text: "The Company may, within 30 days of receiving a valid complaint, inspect the goods at the Buyer's location or request samples (shipped at the Buyer's cost). The Buyer must preserve the goods under complaint, unused and unsold, for at least 30 days from the date of complaint.",
      },
      {
        no: "13.3",
        text: "A claim is assessed against the batch-specific certificate of analysis; a mismatch between the batch complained of and the batch supplied invalidates the claim. A valid claim is settled commercially — by credit note, price adjustment, or replacement in a future shipment, at the Company's reasonable discretion — and the Company's decision on settlement is final, without prejudice to the Buyer's statutory rights.",
      },
      {
        no: "13.4",
        text: "The Company is not liable for damage, contamination, or deterioration arising after risk passes to the Buyer, including from improper storage, handling, or customs delay, nor for variance within the tolerance under Clause 4.1/4.5.",
      },
      {
        no: "13.5",
        label: "No unilateral rejection",
        text: "The Buyer may not reject, return, or refuse to take delivery of a shipment unilaterally. Any dispute as to conformity is resolved exclusively through the claims process in this Clause 13.",
      },
    ],
  },
  {
    title: "Intellectual Property",
    clauses: [
      {
        no: "14.1",
        text: "All Company trademarks, trade names, and content remain the Company's exclusive property; no licence to use them is granted except as expressly agreed in writing.",
      },
      {
        no: "14.2",
        text: "The Buyer warrants it owns or is licensed to use any artwork/trademark it supplies for private labelling, and indemnifies the Company against any third-party IP claim arising from such artwork under Clause 18.",
      },
    ],
  },
  {
    title: "Confidentiality",
    clauses: [
      {
        no: "15.1",
        text: "Each party keeps the other's pricing, supplier, customer, and business information confidential and does not disclose it to a third party without prior written consent, except where disclosure is required by law or a competent authority.",
      },
    ],
  },
  {
    title: "Data Protection and Privacy",
    clauses: [
      {
        no: "16.1",
        text: "Personal data is processed in accordance with the Company's Privacy Policy and applicable law (India's DPDP Act 2023, and GDPR where the Buyer is in the EU), including cross-border transfer to banks, carriers, and inspection agencies as reasonably necessary to perform the Contract.",
      },
    ],
  },
  {
    title: "Disclaimer of Warranties; Limitation of Liability",
    clauses: [
      {
        no: "17.1",
        text: "Website and marketing content is indicative only; the binding quality standard is the Contract specification/approved sample under Clause 8.1.",
      },
      {
        no: "17.2",
        text: "The Company is not liable for indirect, incidental, or consequential loss (including lost profit or business opportunity), to the extent permitted by law.",
      },
      {
        no: "17.3",
        text: "The Company's total liability arising from a single Contract is capped at the invoice value of the shipment giving rise to the claim.",
      },
      {
        no: "17.4",
        text: "This cap does not apply to liability that cannot lawfully be excluded, including fraud or death/personal injury caused by negligence.",
      },
    ],
  },
  {
    title: "Indemnification",
    clauses: [
      {
        no: "18.1",
        text: "The Buyer shall indemnify, defend, and hold harmless the Company, its directors, officers, employees, agents, affiliates, and suppliers from and against any claims, losses, liabilities, damages, costs, expenses, and reasonable legal fees arising from or relating to:",
        subItems: [
          "(a) the Buyer's breach of these Terms or any purchase contract;",
          "(b) the Buyer's violation of any applicable law or destination-country requirement;",
          "(c) any specifications, artwork, trademarks, packaging, labelling, or product claims supplied or approved by the Buyer;",
          "(d) the Buyer's importation, resale, distribution, or use of the Products contrary to the agreed specifications or applicable law; or",
          "(e) any third-party claim resulting from the Buyer's acts or omissions.",
        ],
        after:
          "This indemnity shall survive the completion, termination, or expiry of the parties' agreement.",
      },
    ],
  },
  {
    title: "Force Majeure",
    clauses: [
      {
        no: "19.1",
        text: "Neither party is liable for failure or delay (other than payment already due) caused by an event beyond its reasonable control, including war, blockade, strikes, riots, government embargo, epidemic, port closure, or natural calamity ('Force Majeure Event').",
      },
      {
        no: "19.2",
        text: "The affected party must notify the other in writing within 15 days of the event's occurrence, with supporting certification from a Chamber of Commerce or government authority where reasonably obtainable, and must notify the other party upon cessation.",
      },
      {
        no: "19.3",
        text: "If the event continues beyond 90 days, either party may cancel the affected order(s) by written notice, without liability to the other party except for amounts already due for goods delivered before the event.",
      },
    ],
  },
  {
    title: "Assignment",
    clauses: [
      {
        no: "20.1",
        text: "Neither the Buyer nor the Company may assign or transfer any rights or obligations under these Terms without the prior written consent of the other party, except that the Company may assign its right to receive payment to any bank or financial institution without the Buyer's consent.",
      },
    ],
  },
  {
    title: "Website Use",
    clauses: [
      {
        no: "21.1",
        text: "Users of the Company's website must be legally capable of contracting and authorised to act for the business they represent.",
      },
      {
        no: "21.2",
        text: "Website descriptions may contain errors and are subject to correction without notice.",
      },
      {
        no: "21.3",
        text: "Unlawful use, transmission of malicious code, unauthorised scraping, or misrepresentation of identity on the website is prohibited.",
      },
      {
        no: "21.4",
        text: "The Company is not responsible for third-party services linked from its website (logistics, payment gateways, inspection agencies).",
      },
    ],
  },
  {
    title: "Termination",
    clauses: [
      {
        no: "22.1",
        text: "Either party may terminate a Contract by written notice if the other commits a material breach — including non-payment, failure to open a conforming LC, or repeated quality non-compliance — not cured within 15 days of written notice. Obligations accrued before termination, including payment for goods already shipped, survive termination.",
      },
    ],
  },
  {
    title: "Notices",
    clauses: [
      {
        no: "23.1",
        text: "Formal notices are given in writing by email (to the address in the Contract) or courier to the registered address stated in the Contract. An emailed notice is deemed received on the next Business Day after transmission, unless a delivery-failure notification is received.",
      },
    ],
  },
  {
    title: "Severability",
    clauses: [
      {
        no: "24.1",
        text: "If a provision of these Terms is held invalid or unenforceable, it is severed without affecting the remaining Terms, and the parties negotiate in good faith to replace it with a valid provision of similar commercial intent.",
      },
    ],
  },
  {
    title: "Entire Agreement and Amendment",
    clauses: [
      {
        no: "25.1",
        text: "These Terms, together with the applicable Contract, constitute the entire agreement for that transaction and supersede all prior discussions on the same subject. No amendment is valid unless made in writing and confirmed by an authorised representative of each party.",
      },
    ],
  },
  {
    title: "Governing Law and Jurisdiction",
    clauses: [
      {
        no: "26.1",
        text: "These Terms and every Contract are governed by the laws of India, regardless of the Buyer's country of incorporation or residence. Subject to Clause 27, the courts at Chennai, Tamil Nadu, India have exclusive jurisdiction over matters not referred to arbitration.",
      },
    ],
  },
  {
    title: "Dispute Resolution and Arbitration",
    clauses: [
      {
        no: "27.1",
        text: "The parties first attempt to resolve a dispute through good-faith negotiation between authorised representatives, for up to 30 days.",
      },
      {
        no: "27.2",
        text: "A dispute not resolved within 30 days is referred to and finally resolved by arbitration under the Arbitration and Conciliation Act, 1996 (or, for international commercial disputes, the Rules of the Indian Council of Arbitration), by a sole arbitrator, seated at Chennai, India, in the English language. The award is final and binding on both parties.",
      },
      {
        no: "27.3",
        text: "Either party may seek urgent interim relief from a competent court at Chennai, India, without this being treated as a waiver of the arbitration agreement.",
      },
    ],
  },
  {
    title: "Independent Contracting Status",
    clauses: [
      {
        no: "28.1",
        text: "The Company contracts solely on its own behalf, as an independent legal entity; nothing in these Terms creates a partnership, agency, joint venture, or employment relationship between the Company and the Buyer.",
      },
    ],
  },
  {
    title: "Language",
    clauses: [
      {
        no: "29.1",
        text: "These Terms are issued in English, which prevails over any translated version provided for convenience.",
      },
    ],
  },
  {
    title: "Changes to These Terms",
    clauses: [
      {
        no: "30.1",
        text: "The Company may update these Terms by posting the revised version on its website. The version in force on the date a Contract is confirmed governs that Contract; later changes apply only to Contracts confirmed afterward.",
      },
    ],
  },
];

/* =========================================================
   FOOTER COMPONENT
========================================================= */

export default function Footer() {
  const [typedText, setTypedText] = useState("");
  const [activeModal, setActiveModal] = useState<LegalModalType>(null);

  const fullText = "Where Quality Leads";

  /* Typing animation */
  useEffect(() => {
    let index = 0;
    let typingInterval: NodeJS.Timeout;
    let pauseTimeout: NodeJS.Timeout;

    const startTyping = () => {
      index = 0;
      setTypedText("");

      typingInterval = setInterval(() => {
        if (index < fullText.length) {
          setTypedText(fullText.slice(0, index + 1));
          index++;
        } else {
          clearInterval(typingInterval);

          pauseTimeout = setTimeout(() => {
            startTyping();
          }, 2000);
        }
      }, 90);
    };

    startTyping();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(pauseTimeout);
    };
  }, []);

  /* Prevent background scrolling when any popup is open */
  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeModal]);

  /* ESC key closes popup */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveModal(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      {/* =========================================================
          FOOTER
      ========================================================= */}

      <footer
        className="
          relative
          overflow-hidden
          bg-ink
          text-cream
          px-6
          lg:px-12
          pt-20
          pb-10
        "
      >
        {/* Background Glow */}
        <div
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 15% 25%, rgba(217,121,38,.15), transparent 35%)",
          }}
        />

        <div className="relative z-10 flex justify-center mb-14">
          <h4
            className="
              text-[1.4rem]
              lg:text-[1.8rem]
              font-medium
              tracking-[0.02em]
              text-cream
            "
          >
            {typedText}

            <span
              className="
                inline-block
                w-[2px]
                h-[1em]
                bg-saffron
                ml-1
                align-middle
                animate-[blink_0.8s_step-end_infinite]
              "
            />
          </h4>
        </div>

        <div className="relative z-10 max-w-[1800px] mx-auto px-4 lg:px-8">
          {/* =====================================================
              TOP SECTION
          ===================================================== */}

          <div
            className="
              grid
              gap-12
              border-b
              border-white/10
              pb-12
              lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]
            "
          >
            {/* ================= BRAND ================= */}

            <div>
              <h3 className="text-[1.6rem] font-medium leading-tight">
                Aachari International Exim Pvt Ltd
              </h3>

              <p className="mt-4 max-w-[340px] text-[0.92rem] leading-8 text-cream/60">
                A house of traders proudly carrying Indian quality and
                craftsmanship to the world since 2026.
              </p>

              {/* Social Icons */}
              <div className="mt-6 flex gap-3">
                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/aachari-exim/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-saffron
                    hover:bg-saffron
                    hover:text-white
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z" />
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/18uVs8XNP6/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-saffron
                    hover:bg-saffron
                    hover:text-white
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/aachari_exim?igsh=MWZmZXhjNDMzenIxaQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-saffron
                    hover:bg-saffron
                    hover:text-white
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M12 2c-2.72 0-3.06.01-4.13.06-1.07.05-1.8.22-2.44.47-.66.26-1.22.6-1.78 1.16a4.94 4.94 0 0 0-1.16 1.78c-.25.64-.42 1.37-.47 2.44C2.01 8.94 2 9.28 2 12s.01 3.06.06 4.13c.05 1.07.22 1.8.47 2.44.26.66.6.9 1.16 1.78.56.56 1.12.9 1.78 1.16.64.25 1.37.42 2.44.47C8.94 21.99 9.28 22 12 22s3.06-.01 4.13-.06c1.07-.05 1.8-.22 2.44-.47a4.94 4.94 0 0 0 1.78-1.16 4.94 4.94 0 0 0 1.16-1.78c.25-.64.42-1.37.47-2.44.05-1.07.06-1.41.06-4.13s-.01-3.06-.06-4.13c-.05-1.07-.22-1.8-.47-2.44a4.94 4.94 0 0 0-1.16-1.78 4.94 4.94 0 0 0-1.78-1.16c-.64-.25-1.37-.42-2.44-.47C15.06 2.01 14.72 2 12 2z" />
                  </svg>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/917305982029"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/20
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-saffron
                    hover:bg-saffron
                    hover:text-white
                  "
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                  >
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.87 9.87 0 0 0 12.04 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* ================= COMPANY ================= */}

            <div>
              <h5 className="mb-5 text-[0.74rem] uppercase tracking-[0.22em] text-gold-light">
                Company
              </h5>

              <ul className="space-y-3">
                <li>
                  <Link
                    href="/about"
                    className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/products"
                    className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                  >
                    Our Products
                  </Link>
                </li>

                <li>
                  <Link
                    href="/certificates"
                    className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                  >
                    Certificates
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* ================= FOUNDER ================= */}

            <div>
              <h5 className="mb-5 text-[0.74rem] uppercase tracking-[0.22em] text-gold-light">
                Founder
              </h5>

              <ul className="space-y-4">
                <li>
                  <p className="text-[0.9rem] text-cream/70 leading-6 font-medium">
                    Hariharan P
                  </p>
                  <p className="text-[0.78rem] text-cream/50">
                    Managing Director
                  </p>
                </li>
              </ul>
            </div>

            {/* ================= LEGAL ================= */}

            <div>
              <h5 className="mb-5 text-[0.74rem] uppercase tracking-[0.22em] text-gold-light">
                Legal
              </h5>

              <ul className="space-y-3">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("privacy")}
                    className="text-left text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>

                <li>
                  <button
                    type="button"
                    onClick={() => setActiveModal("terms")}
                    className="text-left text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                  >
                    Terms &amp; Conditions
                  </button>
                </li>

                <li>
                  <Link
                    href="/catalogue"
                    className="block text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                  >
                    Catalogue
                  </Link>
                </li>
              </ul>
            </div>

            {/* ================= CONTACT ================= */}

            <div>
              <h5 className="mb-5 text-[0.74rem] uppercase tracking-[0.22em] text-gold-light">
                Get In Touch
              </h5>

              <div className="space-y-5">
                {/* Address */}
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-cream/45">
                    Address
                  </p>

                  <p className="mt-1 text-[0.88rem] leading-7 text-cream/70">
                    No. 15, 5th Street, A.N. Kandigai,
                    <br />
                    Palanipet Post, Arakkonam,
                    <br />
                    Ranipet Dist. - 631 002,
                    <br />
                    Tamil Nadu, India.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-cream/45">
                    Phone
                  </p>

                  <a
                    href="tel:+917305982029"
                    className="mt-1 block text-[0.9rem] text-cream/70 hover:text-saffron transition-colors"
                  >
                    +91 73059 82029
                  </a>
                </div>

                {/* Email */}
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-cream/45">
                    Email
                  </p>

                  <a
                    href="mailto:aachariexim@gmail.com"
                    className="mt-1 block break-all text-[0.88rem] text-cream/70 hover:text-saffron transition-colors"
                  >
                    aachariexim@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              BOTTOM
          ===================================================== */}

          <div
            className="
              flex
              flex-col
              gap-4
              pt-8
              text-[0.82rem]
              text-cream/50
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              © {new Date().getFullYear()} Aachari International Exim Pvt Ltd
              · All Rights Reserved
            </div>

            <div>CIN: U46909TN2026PTC193669</div>
          </div>
        </div>
      </footer>

      {/* =========================================================
          PRIVACY POLICY POPUP
      ========================================================= */}

      {activeModal === "privacy" && (
        <LegalModal title="Privacy Policy" onClose={closeModal}>
          <EffectiveDate />

          <LegalSection title="Privacy Policy">
            <p>
              Aachari International Exim Pvt. Ltd. (&quot;Company&quot;,
              &quot;we&quot;, &quot;us&quot;) values the trust you place in us
              when you reach out via the Website, email, WhatsApp, telephone,
              trade fairs, or other direct engagement. This Policy explains
              what personal data we collect, how we use it, and your rights. By
              contacting us or sharing information with us, you agree to this
              Policy. If you disagree, we kindly request that you refrain from
              sharing information with us.
            </p>
          </LegalSection>

          <LegalSection number="1" title="Scope">
            <p>
              This Policy covers personal data collected through the Website,
              email, WhatsApp, telephone, trade fairs, referrals, and other
              direct engagement. It excludes formal commercial contracts,
              shipping, or banking documentation, governed separately by the
              relevant agreement, law, or our Terms and Conditions. For B2B
              communications, employee contact details processed solely for
              executing export contracts remain subject to applicable
              commercial terms.
            </p>
          </LegalSection>

          <LegalSection number="2" title="Information We Collect">
            <BulletList
              items={[
                "Contact details you share with us (name, company, designation, email, phone, country) via any channel, including enquiries, RFQs, and trade correspondence.",
                "Correspondence and attachments you send us.",
                "Technical/usage data collected automatically on the Website (IP address, browser, device, pages visited, cookies — see Section 7).",
              ]}
            />

            <p className="mt-5">
              We collect only what you share or what is generated through
              standard Website usage, and are not responsible for its accuracy.
              WhatsApp and other third-party platforms are governed by their own
              privacy policies, over which we have no control.
            </p>
          </LegalSection>

          <LegalSection number="3" title="Purpose of Collection">
            <p>We use your information only to:</p>

            <BulletList
              items={[
                "Respond to enquiries and process trade-related requests.",
                "Communicate on products, quotations, and export documentation.",
                "Meet legal, regulatory, and export-control obligations.",
                "Maintain Website security and functionality.",
                "Detect and prevent fraud or unauthorized access.",
              ]}
            />

            <p className="mt-5">
              We will not use your data for any other purpose without your
              consent, where required by law.
            </p>
          </LegalSection>

          <LegalSection number="4" title="Disclosure of Information">
            <p>
              We do not sell or rent personal data. We share it, strictly on a
              need-to-know basis, with:
            </p>

            <BulletList
              items={[
                "Service providers for hosting, analytics, or communication (bound by confidentiality).",
                "CHAs, freight forwarders, banks, and certification/regulatory bodies involved in your transaction.",
                "Authorities, where legally required.",
                "A successor entity in case of merger, acquisition, or sale of business.",
              ]}
            />

            <p className="mt-5">
              We are not responsible for third parties&apos; privacy practices
              once data is lawfully shared for your transaction.
            </p>
          </LegalSection>

          <LegalSection number="5" title="Cross-Border Data Transfer">
            <p>
              Your information may be processed or stored outside your home
              country, including India. We take reasonable steps to safeguard
              such transfers under applicable law. For B2B communications,
              employee contact details processed solely for executing export
              contracts remain subject to applicable commercial terms. By
              submitting information, you consent to this.
            </p>
          </LegalSection>

          <LegalSection number="6" title="Data Retention">
            <p>
              We retain data only as long as necessary for its purpose, or as
              required by legal/regulatory retention rules — whichever is longer
              — after which it is securely deleted or anonymised.
            </p>
          </LegalSection>

          <LegalSection number="7" title="Cookies">
            <p>
              The Website may use cookies for core functionality, preferences,
              and aggregate analytics. Where required by law, non-essential
              cookies will only be deployed upon your explicit consent via our
              website banner. You may disable them via browser settings, though
              some features may be affected. Continued use with cookies enabled
              means you consent to this.
            </p>
          </LegalSection>

          <LegalSection number="8" title="Data Security">
            <p>
              We apply reasonable safeguards, but no online transmission or
              storage is fully secure. We do not warrant absolute security and
              disclaim liability for breaches from circumstances beyond our
              reasonable control, including cyberattacks or third-party
              failures.
            </p>
          </LegalSection>

          <LegalSection number="9" title="Your Rights">
            <p>
              Subject to law, you may access, correct, update, delete, or
              withdraw consent for your data by contacting us (Section 12). We
              will verify your identity and respond within 30 calendar days (or
              as legally prescribed under the DPDP Act).
            </p>
          </LegalSection>

          <LegalSection number="10" title="Third-Party Links">
            <p>
              The Website may link to third-party sites. We are not responsible
              for their content or privacy practices.
            </p>
          </LegalSection>

          <LegalSection number="11" title="Limitation of Liability">
            <p>
              To the extent permitted by law, our liability under this Policy is
              limited to proven gross negligence or wilful misconduct, and
              excludes indirect, incidental, or consequential damages, except
              where exclusion is not permitted under applicable data protection
              law.
            </p>
          </LegalSection>

          <LegalSection number="12" title="Contact">
            <p>
              If you have questions, wish to exercise your data rights, or need
              to lodge a grievance regarding the processing of your personal
              data, please contact us:
            </p>

            <ContactCard />

            <p className="mt-5">
              We will address queries and grievances within legally prescribed
              timelines.
            </p>
          </LegalSection>

          <LegalSection number="13" title="Governing Law and Dispute Resolution">
            <p>
              This Policy is governed by Indian law. Disputes will first be
              addressed amicably; failing that, resolved by arbitration under
              the Arbitration and Conciliation Act, 1996, seated at [Chennai,
              Tamil Nadu], in English. Courts at [Chennai, Tamil Nadu] have
              exclusive jurisdiction over non-arbitrable matters.
            </p>
          </LegalSection>

          <LegalSection number="14" title="Changes to This Policy">
            <p>
              We may revise this Policy periodically; updates will be posted
              here with a new Effective Date. Continued use after changes means
              you accept the revised Policy.
            </p>
          </LegalSection>

          {/* Disclaimer */}
          <div className="mt-10 rounded-2xl border border-[#E4D4C0] bg-[#FFF8ED] p-5 sm:p-6">
            <p className="text-[0.82rem] leading-7 text-[#766A5D]">
              This document is a general-purpose template and does not
              constitute legal advice. Given the export-specific, cross-border,
              and arbitration provisions herein, it is strongly recommended that
              this Policy be reviewed by qualified legal counsel prior to
              publication, and updated as the Company&apos;s data practices
              evolve.
            </p>
          </div>
        </LegalModal>
      )}

      {/* =========================================================
          TERMS & CONDITIONS POPUP
      ========================================================= */}

      {activeModal === "terms" && (
        <LegalModal title="Terms & Conditions" onClose={closeModal}>
          {/* Document header */}
          <div className="mb-10 rounded-2xl border border-[#E5D8C7] bg-white p-6 sm:p-8">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[#B87932]">
              Aachari International Exim Pvt. Ltd.
            </p>

            <p className="mt-2 text-[0.88rem] italic leading-7 text-[#766A5D]">
              Export of Organic Agro Products, Food Products, Handicrafts &amp;
              Garments
            </p>

            <h3 className="mt-5 font-[var(--font-display)] text-2xl font-medium leading-tight text-[#211A15] sm:text-3xl">
              General Terms and Conditions of Sale
            </h3>

            <p className="mt-1 text-[0.9rem] text-[#766A5D]">
              (Export / Import Trade)
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <MetaItem label="Document Ref" value="AIEPL/EXP/T&C/02" />
              <MetaItem label="Version" value="2.0" />
              <MetaItem label="Governing Law" value="Laws of India" />
              <MetaItem label="Seat of Arbitration" value="Chennai, India" />
            </div>
          </div>

          <EffectiveDate />

          {/* Sections 1 – 30 */}
          {TERMS_SECTIONS.map((section, i) => (
            <LegalSection
              key={section.title}
              number={String(i + 1)}
              title={section.title}
            >
              {section.paragraphs?.map((para, idx) => (
                <p key={idx} className="mb-4 last:mb-0">
                  {para}
                </p>
              ))}

              {section.definitions && (
                <DefinitionList items={section.definitions} />
              )}

              {section.clauses?.map((clause) => (
                <ClauseBlock key={clause.no} clause={clause} />
              ))}
            </LegalSection>
          ))}

          {/* Section 31 – Contact */}
          <LegalSection
            number={String(TERMS_SECTIONS.length + 1)}
            title="Contact Information"
          >
            <p>
              <span className="mr-2 font-semibold text-[#B66F29]">
                {TERMS_SECTIONS.length + 1}.1
              </span>
              Questions on these Terms may be sent to the contact details below,
              or addressed to our registered office.
            </p>

            <ContactCard />
          </LegalSection>
        </LegalModal>
      )}
    </>
  );
}

/* =========================================================
   LEGAL MODAL (shared popup shell)
========================================================= */

function LegalModal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        flex
        items-center
        justify-center
        bg-black/60
        px-4
        py-6
        backdrop-blur-md
        animate-[fadeIn_0.25s_ease-out]
      "
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="
          relative
          flex
          h-[88vh]
          w-full
          max-w-[1000px]
          flex-col
          overflow-hidden
          rounded-[1.5rem]
          border
          border-white/10
          bg-[#FBF8F3]
          shadow-[0_30px_100px_rgba(0,0,0,0.45)]
          animate-[modalIn_0.3s_ease-out]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E6D9C9] bg-[#FBF8F3]/95 px-6 py-5 backdrop-blur-xl sm:px-8">
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#B87932]">
              Aachari International Exim Pvt. Ltd.
            </p>

            <h2 className="mt-1 font-[var(--font-display)] text-2xl font-medium tracking-[-0.02em] text-[#211A15] sm:text-3xl">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#DCCDBB]
              bg-white
              text-[#665A4F]
              transition-all
              duration-300
              hover:rotate-90
              hover:border-[#D97926]
              hover:bg-[#D97926]
              hover:text-white
            "
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
          {children}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-[#E6D9C9] bg-[#FBF8F3] px-6 py-4 sm:px-8">
          <span className="text-[0.7rem] text-[#9A8978]">{title}</span>

          <button
            type="button"
            onClick={onClose}
            className="
              rounded-full
              bg-[#D97926]
              px-5
              py-2.5
              text-[0.78rem]
              font-medium
              text-white
              transition-all
              hover:-translate-y-0.5
              hover:bg-[#B9621C]
            "
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SMALL SHARED PIECES
========================================================= */

function EffectiveDate() {
  return (
    <div className="mb-8 inline-flex rounded-full border border-[#E3D4C2] bg-white px-4 py-2 text-[0.75rem] text-[#766A5D]">
      <span className="mr-2 font-semibold text-[#4B4036]">Effective Date:</span>
      {LEGAL_EFFECTIVE_DATE}
    </div>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#EFE4D5] bg-[#FBF8F3] px-4 py-3">
      <p className="text-[0.65rem] uppercase tracking-[0.15em] text-[#9A8978]">
        {label}
      </p>
      <p className="mt-1 text-[0.92rem] font-medium text-[#211A15]">{value}</p>
    </div>
  );
}

function ContactCard() {
  return (
    <div className="mt-6 rounded-2xl border border-[#E5D8C7] bg-white p-5">
      <p className="text-[0.72rem] uppercase tracking-[0.15em] text-[#9A8978]">
        Email
      </p>

      <a
        href="mailto:queries.aachari@gmail.com"
        className="mt-1 block text-[#D97926] hover:underline"
      >
        queries.aachari@gmail.com
      </a>

      <p className="mt-5 text-[0.72rem] uppercase tracking-[0.15em] text-[#9A8978]">
        Phone
      </p>

      <a
        href="tel:+917305982029"
        className="mt-1 block text-[#D97926] hover:underline"
      >
        +91 73059 82029
      </a>

      <p className="mt-5 text-[0.72rem] uppercase tracking-[0.15em] text-[#9A8978]">
        Address
      </p>

      <p className="mt-1 leading-7">
        No. 15, 5th Street, A N Kandigai,
        <br />
        Palanipet, Arakkonam,
        <br />
        Ranipet District, Tamil Nadu - 631002,
        <br />
        India
      </p>
    </div>
  );
}

/* =========================================================
   TERMS RENDER HELPERS
========================================================= */

function ClauseBlock({ clause }: { clause: Clause }) {
  return (
    <div className="mb-5 last:mb-0">
      <p>
        <span className="mr-2 font-semibold text-[#B66F29]">{clause.no}</span>

        {clause.label && (
          <span className="font-semibold text-[#211A15]">
            {clause.label}:{" "}
          </span>
        )}

        {clause.text}
      </p>

      {clause.subItems && (
        <ul className="mt-3 space-y-2 pl-6 sm:pl-8">
          {clause.subItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}

      {clause.after && <p className="mt-3">{clause.after}</p>}
    </div>
  );
}

function DefinitionList({
  items,
}: {
  items: { term: string; text: string }[];
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.term} className="flex gap-3">
          <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#D97926]" />

          <span>
            <span className="font-semibold text-[#211A15]">{item.term}</span>
            {": "}
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* =========================================================
   LEGAL SECTION
========================================================= */

function LegalSection({
  number,
  title,
  children,
}: {
  number?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-[#E9DED0] py-8 last:border-b-0">
      <div className="mb-4 flex items-start gap-3">
        {number && (
          <span
            className="
              mt-1
              flex
              h-7
              min-w-7
              items-center
              justify-center
              rounded-full
              bg-[#F4E5D3]
              px-2
              text-[0.62rem]
              font-semibold
              text-[#B66F29]
            "
          >
            {number}
          </span>
        )}

        <h3 className="font-[var(--font-display)] text-xl font-medium leading-tight text-[#211A15] sm:text-2xl">
          {title}
        </h3>
      </div>

      <div className="text-[0.94rem] leading-8 text-[#62574C]">{children}</div>
    </section>
  );
}

/* =========================================================
   BULLET LIST
========================================================= */

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-3">
      {items.map((item, index) => (
        <li
          key={index}
          className="flex gap-3 text-[0.94rem] leading-8 text-[#62574C]"
        >
          <span className="mt-[13px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#D97926]" />

          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
