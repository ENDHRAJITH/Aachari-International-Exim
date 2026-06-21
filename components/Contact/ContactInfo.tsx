export default function ContactInfo() {
  return (
    <div>
      <h3
        className="
          mb-5
          font-[var(--font-display)]
          text-[1.8rem]
          font-medium
          text-ink
        "
      >
        Visit, write, or call — we reply within 24 hours.
      </h3>

      <p
        className="
          max-w-[520px]
          leading-8
          text-ink-soft
        "
      >
        Our trade desk operates Monday through Saturday,
        IST 09:00 – 19:00. International calls can be
        scheduled via WhatsApp at any hour.
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
              3rd Floor, Spencer Plaza,
              <br />
              Anna Salai, Chennai 600002, IN
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
              Telephone
            </div>

            <div
              className="
                font-[var(--font-display)]
                text-[1.1rem]
                font-medium
                text-ink
              "
            >
              +91 44 4500 8800
              <br />
              +91 98400 12345
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
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
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
              "
            >
              trade@aachari-exim.com
              <br />
              quotes@aachari-exim.com
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}