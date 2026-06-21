"use client";

export default function ContactForm() {
  return (
    <form
      className="
        rounded-[12px]
        border
        border-black/[0.08]
        bg-cream
        p-10
        shadow-[0_20px_60px_rgba(42,31,23,0.08)]
      "
    >
      <h3
        className="
          mb-6
          font-[var(--font-display)]
          text-[1.6rem]
          font-medium
          text-ink
        "
      >
        Send us an enquiry
      </h3>

      {/* Row 1 */}

      <div
        className="
          mb-4
          grid
          gap-4
          md:grid-cols-2
        "
      >
        <div>
          <label
            className="
              mb-2
              block
              text-[0.72rem]
              font-medium
              uppercase
              tracking-[0.16em]
              text-ink-soft
            "
          >
            Full Name
          </label>

          <input
            type="text"
            required
            placeholder="Your name"
            className="
              w-full
              rounded-[8px]
              border
              border-black/[0.12]
              bg-cream-soft
              px-4
              py-[14px]
              text-[0.95rem]
              text-ink
              transition-all
              duration-200
              focus:border-saffron
              focus:bg-cream
              focus:outline-none
            "
          />
        </div>

        <div>
          <label
            className="
              mb-2
              block
              text-[0.72rem]
              font-medium
              uppercase
              tracking-[0.16em]
              text-ink-soft
            "
          >
            Company
          </label>

          <input
            type="text"
            placeholder="Company / Organisation"
            className="
              w-full
              rounded-[8px]
              border
              border-black/[0.12]
              bg-cream-soft
              px-4
              py-[14px]
              text-[0.95rem]
              text-ink
              transition-all
              duration-200
              focus:border-saffron
              focus:bg-cream
              focus:outline-none
            "
          />
        </div>
      </div>

      {/* Row 2 */}

      <div
        className="
          mb-4
          grid
          gap-4
          md:grid-cols-2
        "
      >
        <div>
          <label
            className="
              mb-2
              block
              text-[0.72rem]
              font-medium
              uppercase
              tracking-[0.16em]
              text-ink-soft
            "
          >
            Email
          </label>

          <input
            type="email"
            required
            placeholder="you@company.com"
            className="
              w-full
              rounded-[8px]
              border
              border-black/[0.12]
              bg-cream-soft
              px-4
              py-[14px]
              text-[0.95rem]
              text-ink
              transition-all
              duration-200
              focus:border-saffron
              focus:bg-cream
              focus:outline-none
            "
          />
        </div>

        <div>
          <label
            className="
              mb-2
              block
              text-[0.72rem]
              font-medium
              uppercase
              tracking-[0.16em]
              text-ink-soft
            "
          >
            Country
          </label>

          <input
            type="text"
            placeholder="Country of import"
            className="
              w-full
              rounded-[8px]
              border
              border-black/[0.12]
              bg-cream-soft
              px-4
              py-[14px]
              text-[0.95rem]
              text-ink
              transition-all
              duration-200
              focus:border-saffron
              focus:bg-cream
              focus:outline-none
            "
          />
        </div>
      </div>

      {/* Product Category */}

      <div className="mb-4">
        <label
          className="
            mb-2
            block
            text-[0.72rem]
            font-medium
            uppercase
            tracking-[0.16em]
            text-ink-soft
          "
        >
          Product Category
        </label>

        <select
          className="
            w-full
            rounded-[8px]
            border
            border-black/[0.12]
            bg-cream-soft
            px-4
            py-[14px]
            text-[0.95rem]
            text-ink
            transition-all
            duration-200
            focus:border-saffron
            focus:bg-cream
            focus:outline-none
          "
        >
          <option>Indian Spices</option>
          <option>Hardware & Tools</option>
          <option>Electrical Components</option>
          <option>Electronics</option>
          <option>Multiple Categories</option>
        </select>
      </div>

      {/* Message */}

      <div className="mb-4">
        <label
          className="
            mb-2
            block
            text-[0.72rem]
            font-medium
            uppercase
            tracking-[0.16em]
            text-ink-soft
          "
        >
          Your Message
        </label>

        <textarea
          required
          placeholder="Tell us about your enquiry, volumes, target prices..."
          className="
            min-h-[120px]
            w-full
            resize-y
            rounded-[8px]
            border
            border-black/[0.12]
            bg-cream-soft
            px-4
            py-[14px]
            text-[0.95rem]
            text-ink
            transition-all
            duration-200
            focus:border-saffron
            focus:bg-cream
            focus:outline-none
          "
        />
      </div>

      {/* Submit */}

      <button
        type="submit"
        className="
          flex
          w-full
          items-center
          justify-center
          gap-[10px]
          rounded-[8px]
          bg-ink
          px-4
          py-4
          text-[0.86rem]
          font-medium
          uppercase
          tracking-[0.1em]
          text-cream
          transition-all
          duration-300
          hover:-translate-y-[2px]
          hover:bg-saffron
        "
      >
        Send Enquiry

        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </button>
    </form>
  );
}