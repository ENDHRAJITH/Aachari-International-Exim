"use client";

import { useState, useEffect } from "react";

interface Product {
  id: string;
  name: string;
}

export default function ContactForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    product_id: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Fetch products for dropdown
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setProducts(data.data);
      })
      .catch(() => {
        // silently fail — dropdown just stays empty
      });
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: formData.product_id || null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          country: formData.country,
          city: formData.company || null,
          message: formData.message,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        country: "",
        product_id: "",
        message: "",
      });
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err.message || "Failed to send enquiry. Try again.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        rounded-[12px]
        border
        border-black/[0.08]
        bg-cream
        p-10
        shadow-[0_20px_60px_rgba(42,31,23,0.08)]
      "
    >
      <h3 className="mb-6 font-[var(--font-display)] text-[1.6rem] font-medium text-ink">
        Send us an enquiry
      </h3>

      {/* Row 1 */}
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className="w-full rounded-[8px] border border-black/[0.12] bg-cream-soft px-4 py-[14px] text-[0.95rem] text-ink transition-all duration-200 focus:border-saffron focus:bg-cream focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
            Company
          </label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company / Organisation"
            className="w-full rounded-[8px] border border-black/[0.12] bg-cream-soft px-4 py-[14px] text-[0.95rem] text-ink transition-all duration-200 focus:border-saffron focus:bg-cream focus:outline-none"
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            className="w-full rounded-[8px] border border-black/[0.12] bg-cream-soft px-4 py-[14px] text-[0.95rem] text-ink transition-all duration-200 focus:border-saffron focus:bg-cream focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
            Country
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Country of import"
            className="w-full rounded-[8px] border border-black/[0.12] bg-cream-soft px-4 py-[14px] text-[0.95rem] text-ink transition-all duration-200 focus:border-saffron focus:bg-cream focus:outline-none"
          />
        </div>
      </div>

      {/* Phone */}
      <div className="mb-4">
        <label className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+91 ..."
          className="w-full rounded-[8px] border border-black/[0.12] bg-cream-soft px-4 py-[14px] text-[0.95rem] text-ink transition-all duration-200 focus:border-saffron focus:bg-cream focus:outline-none"
        />
      </div>

      {/* Product — replaces Category */}
      <div className="mb-4">
        <label className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
          Product
        </label>
        <select
          name="product_id"
          value={formData.product_id}
          onChange={handleChange}
          className="w-full rounded-[8px] border border-black/[0.12] bg-cream-soft px-4 py-[14px] text-[0.95rem] text-ink transition-all duration-200 focus:border-saffron focus:bg-cream focus:outline-none"
        >
          <option value="">General Enquiry</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div className="mb-4">
        <label className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
          Your Message
        </label>
        <textarea
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your enquiry, volumes, target prices..."
          className="min-h-[120px] w-full resize-y rounded-[8px] border border-black/[0.12] bg-cream-soft px-4 py-[14px] text-[0.95rem] text-ink transition-all duration-200 focus:border-saffron focus:bg-cream focus:outline-none"
        />
      </div>

      {status === "success" && (
        <p className="mb-4 rounded-[8px] bg-green-50 px-4 py-3 text-[0.85rem] text-green-700">
          ✓ Enquiry sent successfully! We'll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="mb-4 rounded-[8px] bg-red-50 px-4 py-3 text-[0.85rem] text-red-700">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex w-full items-center justify-center gap-[10px] rounded-[8px] bg-ink px-4 py-4 text-[0.86rem] font-medium uppercase tracking-[0.1em] text-cream transition-all duration-300 hover:-translate-y-[2px] hover:bg-saffron disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "loading" ? "Sending..." : "Send Enquiry"}

        {status !== "loading" && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        )}
      </button>
    </form>
  );
}