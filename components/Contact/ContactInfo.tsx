export default function ContactInfo() {
  return (
    <div>
     

      <p
        className="
          max-w-[520px]
          leading-8
          text-ink-soft
        "
      >
        Connect with Aachari International Exim Pvt Ltd for export,
        import, sourcing, and international trade inquiries. Our team
        is available to assist customers and business partners.
      </p>

      <ul className="mt-8">
        {/* Address */}
        <li
          className="
            flex
            items-start
            gap-[18px]
            border-b
            border-black/[0.08]
            py-[18px]
          "
        >
          <div
            className="
              grid
              h-[44px]
              w-[44px]
              shrink-0
              place-items-center
              rounded-[12px]
              bg-ink
              text-cream
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>

          <div>
            <div
              className="
                mb-1
                text-[0.72rem]
                uppercase
                tracking-[0.18em]
                text-ink-soft
              "
            >
              Head Office
            </div>

            <div
              className="
                font-[var(--font-display)]
                text-[1.1rem]
                font-medium
                text-ink
              "
            >
              No. 15, 5th Street,
              <br />
              A N Kandigai, Palanipet,
              <br />
              Arakkonam, Vellore District,
              <br />
              Tamil Nadu - 631002
            </div>
          </div>
        </li>

        {/* Phone */}
        <li
          className="
            flex
            items-start
            gap-[18px]
            border-b
            border-black/[0.08]
            py-[18px]
          "
        >
          <div
            className="
              grid
              h-[44px]
              w-[44px]
              shrink-0
              place-items-center
              rounded-[12px]
              bg-ink
              text-cream
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </div>

          <div>
            <div
              className="
                mb-1
                text-[0.72rem]
                uppercase
                tracking-[0.18em]
                text-ink-soft
              "
            >
              Phone
            </div>

            <div
              className="
                font-[var(--font-display)]
                text-[1.1rem]
                font-medium
                text-ink
              "
            >
              +91 7305982029
            </div>
          </div>
        </li>

        {/* Email */}
        <li
          className="
            flex
            items-start
            gap-[18px]
            border-b
            border-black/[0.08]
            py-[18px]
          "
        >
          <div
            className="
              grid
              h-[44px]
              w-[44px]
              shrink-0
              place-items-center
              rounded-[12px]
              bg-ink
              text-cream
            "
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 4h16c1.1 0 0 0 .9 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>

          <div>
            <div
              className="
                mb-1
                text-[0.72rem]
                uppercase
                tracking-[0.18em]
                text-ink-soft
              "
            >
              Email
            </div>

            <div
              className="
                font-[var(--font-display)]
                text-[1.1rem]
                font-medium
                text-ink
                break-all
              "
            >
              aachariinternationaleximpvtltd@gmail.com
            </div>
          </div>
        </li>
{/* Working Hours */}
<li
  className="
    flex
    items-start
    gap-[18px]
    border-b
    border-black/[0.08]
    py-[18px]
  "
>
  <div
    className="
      grid
      h-[44px]
      w-[44px]
      shrink-0
      place-items-center
      rounded-[12px]
      bg-ink
      text-cream
    "
  >
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  </div>

  <div>
    <div
      className="
        mb-1
        text-[0.72rem]
        uppercase
        tracking-[0.18em]
        text-ink-soft
      "
    >
      Working Hours
    </div>

    <div
      className="
        font-[var(--font-display)]
        text-[1.1rem]
        font-medium
        text-ink
      "
    >
      Mon - Sat : 09.00 am - 06.00 pm
    </div>
  </div>
</li>
        {/* CIN */}
        <li
          className="
            flex
            items-start
            gap-[18px]
            py-[18px]
          "
        >
          <div>
            <div
              className="
                mb-1
                text-[0.72rem]
                uppercase
                tracking-[0.18em]
                text-ink-soft
              "
            >
              CIN Number
            </div>

            <div
              className="
                font-[var(--font-display)]
                text-[1.05rem]
                font-medium
                text-ink
              "
            >
              U46909TN2026PTC193669
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}