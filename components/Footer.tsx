"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [typedText, setTypedText] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);

  const fullText = "Where Quality Leads";

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

  /* Prevent background scrolling when popup is open */
  useEffect(() => {
    if (showPrivacy) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showPrivacy]);

  /* ESC key closes popup */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowPrivacy(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

        <div className="relative z-10 max-w-[1320px] mx-auto">

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
                    className="
                      text-[0.9rem]
                      text-cream/70
                      hover:text-saffron
                      transition-colors
                    "
                  >
                    About Us
                  </Link>
                </li>

                <li>
                  <Link
                    href="/products"
                    className="
                      text-[0.9rem]
                      text-cream/70
                      hover:text-saffron
                      transition-colors
                    "
                  >
                    Our Products
                  </Link>
                </li>

                <li>
                  <Link
                    href="/certificates"
                    className="
                      text-[0.9rem]
                      text-cream/70
                      hover:text-saffron
                      transition-colors
                    "
                  >
                    Certificates
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="
                      text-[0.9rem]
                      text-cream/70
                      hover:text-saffron
                      transition-colors
                    "
                  >
                    Contact
                  </Link>
                </li>

              </ul>
            </div>


            {/* ================= DIRECTORS ================= */}

            <div>
              <h5 className="mb-5 text-[0.74rem] uppercase tracking-[0.22em] text-gold-light">
                Directors
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
                    onClick={() => setShowPrivacy(true)}
                    className="
                      text-left
                      text-[0.9rem]
                      text-cream/70
                      hover:text-saffron
                      transition-colors
                    "
                  >
                    Privacy Policy
                  </button>
                </li>

                <li>
                  <Link
                    href="/catalogue"
                    className="
                      block
                      text-[0.9rem]
                      text-cream/70
                      hover:text-saffron
                      transition-colors
                    "
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
                    className="
                      mt-1
                      block
                      text-[0.9rem]
                      text-cream/70
                      hover:text-saffron
                      transition-colors
                    "
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
                    className="
                      mt-1
                      block
                      break-all
                      text-[0.88rem]
                      text-cream/70
                      hover:text-saffron
                      transition-colors
                    "
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
              © {new Date().getFullYear()} Aachari International Exim
              Pvt Ltd · All Rights Reserved
            </div>

            <div>
              CIN: U46909TN2026PTC193669
            </div>

          </div>

        </div>
      </footer>


      {/* =========================================================
          PRIVACY POLICY POPUP
      ========================================================= */}

      {showPrivacy && (
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
          onClick={() => setShowPrivacy(false)}
        >

          {/* ================= MODAL ================= */}

          <div
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

            {/* ================= MODAL HEADER ================= */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-[#E6D9C9]
                bg-[#FBF8F3]/95
                px-6
                py-5
                backdrop-blur-xl
                sm:px-8
              "
            >

              <div>
                <p
                  className="
                    text-[0.65rem]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-[#B87932]
                  "
                >
                  Aachari International Exim Pvt. Ltd.
                </p>

                <h2
                  className="
                    mt-1
                    font-[var(--font-display)]
                    text-2xl
                    font-medium
                    tracking-[-0.02em]
                    text-[#211A15]
                    sm:text-3xl
                  "
                >
                  Privacy Policy
                </h2>
              </div>


              {/* Close Button */}

              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
                aria-label="Close Privacy Policy"
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
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

            </div>


            {/* ================= SCROLLABLE CONTENT ================= */}

            <div
              className="
                flex-1
                overflow-y-auto
                px-6
                py-8
                sm:px-10
                sm:py-10
                lg:px-14
              "
            >

              {/* Effective Date */}

              <div
                className="
                  mb-8
                  inline-flex
                  rounded-full
                  border
                  border-[#E3D4C2]
                  bg-white
                  px-4
                  py-2
                  text-[0.75rem]
                  text-[#766A5D]
                "
              >
                <span className="mr-2 font-semibold text-[#4B4036]">
                  Effective Date:
                </span>

                01 / August / 2026
              </div>


              {/* Intro */}

              <PrivacySection
                title="Privacy Policy"
              >
                <p>
                  Aachari International Exim Pvt. Ltd. ("Company", "we", "us")
                  values the trust you place in us when you reach out via the
                  Website, email, WhatsApp, telephone, trade fairs, or other
                  direct engagement. This Policy explains what personal data we
                  collect, how we use it, and your rights. By contacting us or
                  sharing information with us, you agree to this Policy. If you
                  disagree, we kindly request that you refrain from sharing
                  information with us.
                </p>
              </PrivacySection>


              <PrivacySection
                number="1"
                title="Scope"
              >
                <p>
                  This Policy covers personal data collected through the
                  Website, email, WhatsApp, telephone, trade fairs, referrals,
                  and other direct engagement. It excludes formal commercial
                  contracts, shipping, or banking documentation, governed
                  separately by the relevant agreement, law, or our Terms and
                  Conditions. For B2B communications, employee contact details
                  processed solely for executing export contracts remain subject
                  to applicable commercial terms.
                </p>
              </PrivacySection>


              <PrivacySection
                number="2"
                title="Information We Collect"
              >
                <BulletList
                  items={[
                    "Contact details you share with us (name, company, designation, email, phone, country) via any channel, including enquiries, RFQs, and trade correspondence.",
                    "Correspondence and attachments you send us.",
                    "Technical/usage data collected automatically on the Website (IP address, browser, device, pages visited, cookies — see Section 7).",
                  ]}
                />

                <p className="mt-5">
                  We collect only what you share or what is generated through
                  standard Website usage, and are not responsible for its
                  accuracy. WhatsApp and other third-party platforms are governed
                  by their own privacy policies, over which we have no control.
                </p>
              </PrivacySection>


              <PrivacySection
                number="3"
                title="Purpose of Collection"
              >
                <p>
                  We use your information only to:
                </p>

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
              </PrivacySection>


              <PrivacySection
                number="4"
                title="Disclosure of Information"
              >
                <p>
                  We do not sell or rent personal data. We share it, strictly on
                  a need-to-know basis, with:
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
                  We are not responsible for third parties' privacy practices
                  once data is lawfully shared for your transaction.
                </p>
              </PrivacySection>


              <PrivacySection
                number="5"
                title="Cross-Border Data Transfer"
              >
                <p>
                  Your information may be processed or stored outside your home
                  country, including India. We take reasonable steps to safeguard
                  such transfers under applicable law For B2B communications,
                  employee contact details processed solely for executing export
                  contracts remain subject to applicable commercial terms. By
                  submitting information, you consent to this.
                </p>
              </PrivacySection>


              <PrivacySection
                number="6"
                title="Data Retention"
              >
                <p>
                  We retain data only as long as necessary for its purpose, or as
                  required by legal/regulatory retention rules — whichever is
                  longer — after which it is securely deleted or anonymised.
                </p>
              </PrivacySection>


              <PrivacySection
                number="7"
                title="Cookies"
              >
                <p>
                  The Website may use cookies for core functionality,
                  preferences, and aggregate analytics. Where required by law,
                  non-essential cookies will only be deployed upon your explicit
                  consent via our website banner. You may disable them via
                  browser settings, though some features may be affected.
                  Continued use with cookies enabled means you consent to this.
                </p>
              </PrivacySection>


              <PrivacySection
                number="8"
                title="Data Security"
              >
                <p>
                  We apply reasonable safeguards, but no online transmission or
                  storage is fully secure. We do not warrant absolute security
                  and disclaim liability for breaches from circumstances beyond
                  our reasonable control, including cyberattacks or third-party
                  failures.
                </p>
              </PrivacySection>


              <PrivacySection
                number="9"
                title="Your Rights"
              >
                <p>
                  Subject to law, you may access, correct, update, delete, or
                  withdraw consent for your data by contacting us (Section 12).
                  We will verify your identity and respond within 30 calendar
                  days (or as legally prescribed under the DPDP Act).
                </p>
              </PrivacySection>


              <PrivacySection
                number="10"
                title="Third-Party Links"
              >
                <p>
                  The Website may link to third-party sites. We are not
                  responsible for their content or privacy practices.
                </p>
              </PrivacySection>


              <PrivacySection
                number="11"
                title="Limitation of Liability"
              >
                <p>
                  To the extent permitted by law, our liability under this Policy
                  is limited to proven gross negligence or wilful misconduct,
                  and excludes indirect, incidental, or consequential damages,
                  except where exclusion is not permitted under applicable data
                  protection law.
                </p>
              </PrivacySection>


              <PrivacySection
                number="12"
                title="Contact"
              >
                <p>
                  If you have questions, wish to exercise your data rights, or
                  need to lodge a grievance regarding the processing of your
                  personal data, please contact us:
                </p>

                <div
                  className="
                    mt-6
                    rounded-2xl
                    border
                    border-[#E5D8C7]
                    bg-white
                    p-5
                  "
                >
                  <p className="text-[0.72rem] uppercase tracking-[0.15em] text-[#9A8978]">
                    Email
                  </p>

                  <a
                    href="mailto:queries.aachari@gmail.com"
                    className="
                      mt-1
                      block
                      text-[#D97926]
                      hover:underline
                    "
                  >
                    queries.aachari@gmail.com
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

                <p className="mt-5">
                  We will address queries and grievances within legally
                  prescribed timelines.
                </p>
              </PrivacySection>


              <PrivacySection
                number="13"
                title="Governing Law and Dispute Resolution"
              >
                <p>
                  This Policy is governed by Indian law. Disputes will first be
                  addressed amicably; failing that, resolved by arbitration
                  under the Arbitration and Conciliation Act, 1996, seated at
                  [Chennai, Tamil Nadu], in English. Courts at [Chennai, Tamil
                  Nadu] have exclusive jurisdiction over non-arbitrable matters.
                </p>
              </PrivacySection>


              <PrivacySection
                number="14"
                title="Changes to This Policy"
              >
                <p>
                  We may revise this Policy periodically; updates will be posted
                  here with a new Effective Date. Continued use after changes
                  means you accept the revised Policy.
                </p>
              </PrivacySection>


              {/* Disclaimer */}

              <div
                className="
                  mt-10
                  rounded-2xl
                  border
                  border-[#E4D4C0]
                  bg-[#FFF8ED]
                  p-5
                  sm:p-6
                "
              >
                <p className="text-[0.82rem] leading-7 text-[#766A5D]">
                  This document is a general-purpose template and does not
                  constitute legal advice. Given the export-specific,
                  cross-border, and arbitration provisions herein, it is
                  strongly recommended that this Policy be reviewed by qualified
                  legal counsel prior to publication, and updated as the
                  Company's data practices evolve.
                </p>
              </div>

            </div>

            {/* ================= MODAL FOOTER ================= */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-t
                border-[#E6D9C9]
                bg-[#FBF8F3]
                px-6
                py-4
                sm:px-8
              "
            >
              <span className="text-[0.7rem] text-[#9A8978]">
                Privacy Policy
              </span>

              <button
                type="button"
                onClick={() => setShowPrivacy(false)}
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
      )}
    </>
  );
}


/* =========================================================
   PRIVACY SECTION
========================================================= */

function PrivacySection({
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

        <h3
          className="
            font-[var(--font-display)]
            text-xl
            font-medium
            leading-tight
            text-[#211A15]
            sm:text-2xl
          "
        >
          {title}
        </h3>

      </div>

      <div
        className="
          text-[0.94rem]
          leading-8
          text-[#62574C]
        "
      >
        {children}
      </div>

    </section>
  );
}


/* =========================================================
   BULLET LIST
========================================================= */

function BulletList({
  items,
}: {
  items: string[];
}) {
  return (
    <ul className="mt-4 space-y-3">

      {items.map((item, index) => (
        <li
          key={index}
          className="
            flex
            gap-3
            text-[0.94rem]
            leading-8
            text-[#62574C]
          "
        >
          <span
            className="
              mt-[13px]
              h-1.5
              w-1.5
              shrink-0
              rounded-full
              bg-[#D97926]
            "
          />

          <span>
            {item}
          </span>

        </li>
      ))}

    </ul>
  );
}