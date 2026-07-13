"use client";

import { useState, useEffect, useRef } from "react";

interface Product {
  id: string;
  name: string;
}

interface CountryCode {
  code: string; // ISO 3166-1 alpha-2, lowercase — used for flagcdn image
  name: string;
  dial: string;
}

// Full world list — 240+ countries & territories, sorted alphabetically by name.
const COUNTRY_CODES: CountryCode[] = [
  { code: "af", name: "Afghanistan", dial: "+93" },
  { code: "al", name: "Albania", dial: "+355" },
  { code: "dz", name: "Algeria", dial: "+213" },
  { code: "as", name: "American Samoa", dial: "+1684" },
  { code: "ad", name: "Andorra", dial: "+376" },
  { code: "ao", name: "Angola", dial: "+244" },
  { code: "ai", name: "Anguilla", dial: "+1264" },
  { code: "ag", name: "Antigua and Barbuda", dial: "+1268" },
  { code: "ar", name: "Argentina", dial: "+54" },
  { code: "am", name: "Armenia", dial: "+374" },
  { code: "aw", name: "Aruba", dial: "+297" },
  { code: "au", name: "Australia", dial: "+61" },
  { code: "at", name: "Austria", dial: "+43" },
  { code: "az", name: "Azerbaijan", dial: "+994" },
  { code: "bs", name: "Bahamas", dial: "+1242" },
  { code: "bh", name: "Bahrain", dial: "+973" },
  { code: "bd", name: "Bangladesh", dial: "+880" },
  { code: "bb", name: "Barbados", dial: "+1246" },
  { code: "by", name: "Belarus", dial: "+375" },
  { code: "be", name: "Belgium", dial: "+32" },
  { code: "bz", name: "Belize", dial: "+501" },
  { code: "bj", name: "Benin", dial: "+229" },
  { code: "bm", name: "Bermuda", dial: "+1441" },
  { code: "bt", name: "Bhutan", dial: "+975" },
  { code: "bo", name: "Bolivia", dial: "+591" },
  { code: "ba", name: "Bosnia and Herzegovina", dial: "+387" },
  { code: "bw", name: "Botswana", dial: "+267" },
  { code: "br", name: "Brazil", dial: "+55" },
  { code: "io", name: "British Indian Ocean Territory", dial: "+246" },
  { code: "vg", name: "British Virgin Islands", dial: "+1284" },
  { code: "bn", name: "Brunei", dial: "+673" },
  { code: "bg", name: "Bulgaria", dial: "+359" },
  { code: "bf", name: "Burkina Faso", dial: "+226" },
  { code: "bi", name: "Burundi", dial: "+257" },
  { code: "kh", name: "Cambodia", dial: "+855" },
  { code: "cm", name: "Cameroon", dial: "+237" },
  { code: "ca", name: "Canada", dial: "+1" },
  { code: "cv", name: "Cape Verde", dial: "+238" },
  { code: "ky", name: "Cayman Islands", dial: "+1345" },
  { code: "cf", name: "Central African Republic", dial: "+236" },
  { code: "td", name: "Chad", dial: "+235" },
  { code: "cl", name: "Chile", dial: "+56" },
  { code: "cn", name: "China", dial: "+86" },
  { code: "co", name: "Colombia", dial: "+57" },
  { code: "km", name: "Comoros", dial: "+269" },
  { code: "cg", name: "Congo", dial: "+242" },
  { code: "cd", name: "Congo (DRC)", dial: "+243" },
  { code: "ck", name: "Cook Islands", dial: "+682" },
  { code: "cr", name: "Costa Rica", dial: "+506" },
  { code: "hr", name: "Croatia", dial: "+385" },
  { code: "cu", name: "Cuba", dial: "+53" },
  { code: "cw", name: "Curacao", dial: "+599" },
  { code: "cy", name: "Cyprus", dial: "+357" },
  { code: "cz", name: "Czech Republic", dial: "+420" },
  { code: "dk", name: "Denmark", dial: "+45" },
  { code: "dj", name: "Djibouti", dial: "+253" },
  { code: "dm", name: "Dominica", dial: "+1767" },
  { code: "do", name: "Dominican Republic", dial: "+1809" },
  { code: "ec", name: "Ecuador", dial: "+593" },
  { code: "eg", name: "Egypt", dial: "+20" },
  { code: "sv", name: "El Salvador", dial: "+503" },
  { code: "gq", name: "Equatorial Guinea", dial: "+240" },
  { code: "er", name: "Eritrea", dial: "+291" },
  { code: "ee", name: "Estonia", dial: "+372" },
  { code: "sz", name: "Eswatini", dial: "+268" },
  { code: "et", name: "Ethiopia", dial: "+251" },
  { code: "fk", name: "Falkland Islands", dial: "+500" },
  { code: "fo", name: "Faroe Islands", dial: "+298" },
  { code: "fj", name: "Fiji", dial: "+679" },
  { code: "fi", name: "Finland", dial: "+358" },
  { code: "fr", name: "France", dial: "+33" },
  { code: "gf", name: "French Guiana", dial: "+594" },
  { code: "pf", name: "French Polynesia", dial: "+689" },
  { code: "ga", name: "Gabon", dial: "+241" },
  { code: "gm", name: "Gambia", dial: "+220" },
  { code: "ge", name: "Georgia", dial: "+995" },
  { code: "de", name: "Germany", dial: "+49" },
  { code: "gh", name: "Ghana", dial: "+233" },
  { code: "gi", name: "Gibraltar", dial: "+350" },
  { code: "gr", name: "Greece", dial: "+30" },
  { code: "gl", name: "Greenland", dial: "+299" },
  { code: "gd", name: "Grenada", dial: "+1473" },
  { code: "gp", name: "Guadeloupe", dial: "+590" },
  { code: "gu", name: "Guam", dial: "+1671" },
  { code: "gt", name: "Guatemala", dial: "+502" },
  { code: "gn", name: "Guinea", dial: "+224" },
  { code: "gw", name: "Guinea-Bissau", dial: "+245" },
  { code: "gy", name: "Guyana", dial: "+592" },
  { code: "ht", name: "Haiti", dial: "+509" },
  { code: "hn", name: "Honduras", dial: "+504" },
  { code: "hk", name: "Hong Kong", dial: "+852" },
  { code: "hu", name: "Hungary", dial: "+36" },
  { code: "is", name: "Iceland", dial: "+354" },
  { code: "in", name: "India", dial: "+91" },
  { code: "id", name: "Indonesia", dial: "+62" },
  { code: "ir", name: "Iran", dial: "+98" },
  { code: "iq", name: "Iraq", dial: "+964" },
  { code: "ie", name: "Ireland", dial: "+353" },
  { code: "il", name: "Israel", dial: "+972" },
  { code: "it", name: "Italy", dial: "+39" },
  { code: "jm", name: "Jamaica", dial: "+1876" },
  { code: "jp", name: "Japan", dial: "+81" },
  { code: "jo", name: "Jordan", dial: "+962" },
  { code: "kz", name: "Kazakhstan", dial: "+7" },
  { code: "ke", name: "Kenya", dial: "+254" },
  { code: "ki", name: "Kiribati", dial: "+686" },
  { code: "kw", name: "Kuwait", dial: "+965" },
  { code: "kg", name: "Kyrgyzstan", dial: "+996" },
  { code: "la", name: "Laos", dial: "+856" },
  { code: "lv", name: "Latvia", dial: "+371" },
  { code: "lb", name: "Lebanon", dial: "+961" },
  { code: "ls", name: "Lesotho", dial: "+266" },
  { code: "lr", name: "Liberia", dial: "+231" },
  { code: "ly", name: "Libya", dial: "+218" },
  { code: "li", name: "Liechtenstein", dial: "+423" },
  { code: "lt", name: "Lithuania", dial: "+370" },
  { code: "lu", name: "Luxembourg", dial: "+352" },
  { code: "mo", name: "Macau", dial: "+853" },
  { code: "mg", name: "Madagascar", dial: "+261" },
  { code: "mw", name: "Malawi", dial: "+265" },
  { code: "my", name: "Malaysia", dial: "+60" },
  { code: "mv", name: "Maldives", dial: "+960" },
  { code: "ml", name: "Mali", dial: "+223" },
  { code: "mt", name: "Malta", dial: "+356" },
  { code: "mh", name: "Marshall Islands", dial: "+692" },
  { code: "mq", name: "Martinique", dial: "+596" },
  { code: "mr", name: "Mauritania", dial: "+222" },
  { code: "mu", name: "Mauritius", dial: "+230" },
  { code: "yt", name: "Mayotte", dial: "+262" },
  { code: "mx", name: "Mexico", dial: "+52" },
  { code: "fm", name: "Micronesia", dial: "+691" },
  { code: "md", name: "Moldova", dial: "+373" },
  { code: "mc", name: "Monaco", dial: "+377" },
  { code: "mn", name: "Mongolia", dial: "+976" },
  { code: "me", name: "Montenegro", dial: "+382" },
  { code: "ms", name: "Montserrat", dial: "+1664" },
  { code: "ma", name: "Morocco", dial: "+212" },
  { code: "mz", name: "Mozambique", dial: "+258" },
  { code: "mm", name: "Myanmar", dial: "+95" },
  { code: "na", name: "Namibia", dial: "+264" },
  { code: "nr", name: "Nauru", dial: "+674" },
  { code: "np", name: "Nepal", dial: "+977" },
  { code: "nl", name: "Netherlands", dial: "+31" },
  { code: "nc", name: "New Caledonia", dial: "+687" },
  { code: "nz", name: "New Zealand", dial: "+64" },
  { code: "ni", name: "Nicaragua", dial: "+505" },
  { code: "ne", name: "Niger", dial: "+227" },
  { code: "ng", name: "Nigeria", dial: "+234" },
  { code: "nu", name: "Niue", dial: "+683" },
  { code: "kp", name: "North Korea", dial: "+850" },
  { code: "mk", name: "North Macedonia", dial: "+389" },
  { code: "mp", name: "Northern Mariana Islands", dial: "+1670" },
  { code: "no", name: "Norway", dial: "+47" },
  { code: "om", name: "Oman", dial: "+968" },
  { code: "pk", name: "Pakistan", dial: "+92" },
  { code: "pw", name: "Palau", dial: "+680" },
  { code: "ps", name: "Palestine", dial: "+970" },
  { code: "pa", name: "Panama", dial: "+507" },
  { code: "pg", name: "Papua New Guinea", dial: "+675" },
  { code: "py", name: "Paraguay", dial: "+595" },
  { code: "pe", name: "Peru", dial: "+51" },
  { code: "ph", name: "Philippines", dial: "+63" },
  { code: "pl", name: "Poland", dial: "+48" },
  { code: "pt", name: "Portugal", dial: "+351" },
  { code: "pr", name: "Puerto Rico", dial: "+1787" },
  { code: "qa", name: "Qatar", dial: "+974" },
  { code: "re", name: "Reunion", dial: "+262" },
  { code: "ro", name: "Romania", dial: "+40" },
  { code: "ru", name: "Russia", dial: "+7" },
  { code: "rw", name: "Rwanda", dial: "+250" },
  { code: "ws", name: "Samoa", dial: "+685" },
  { code: "sm", name: "San Marino", dial: "+378" },
  { code: "st", name: "Sao Tome and Principe", dial: "+239" },
  { code: "sa", name: "Saudi Arabia", dial: "+966" },
  { code: "sn", name: "Senegal", dial: "+221" },
  { code: "rs", name: "Serbia", dial: "+381" },
  { code: "sc", name: "Seychelles", dial: "+248" },
  { code: "sl", name: "Sierra Leone", dial: "+232" },
  { code: "sg", name: "Singapore", dial: "+65" },
  { code: "sk", name: "Slovakia", dial: "+421" },
  { code: "si", name: "Slovenia", dial: "+386" },
  { code: "sb", name: "Solomon Islands", dial: "+677" },
  { code: "so", name: "Somalia", dial: "+252" },
  { code: "za", name: "South Africa", dial: "+27" },
  { code: "kr", name: "South Korea", dial: "+82" },
  { code: "ss", name: "South Sudan", dial: "+211" },
  { code: "es", name: "Spain", dial: "+34" },
  { code: "lk", name: "Sri Lanka", dial: "+94" },
  { code: "sd", name: "Sudan", dial: "+249" },
  { code: "sr", name: "Suriname", dial: "+597" },
  { code: "se", name: "Sweden", dial: "+46" },
  { code: "ch", name: "Switzerland", dial: "+41" },
  { code: "sy", name: "Syria", dial: "+963" },
  { code: "tw", name: "Taiwan", dial: "+886" },
  { code: "tj", name: "Tajikistan", dial: "+992" },
  { code: "tz", name: "Tanzania", dial: "+255" },
  { code: "th", name: "Thailand", dial: "+66" },
  { code: "tl", name: "Timor-Leste", dial: "+670" },
  { code: "tg", name: "Togo", dial: "+228" },
  { code: "to", name: "Tonga", dial: "+676" },
  { code: "tt", name: "Trinidad and Tobago", dial: "+1868" },
  { code: "tn", name: "Tunisia", dial: "+216" },
  { code: "tr", name: "Turkey", dial: "+90" },
  { code: "tm", name: "Turkmenistan", dial: "+993" },
  { code: "tc", name: "Turks and Caicos Islands", dial: "+1649" },
  { code: "tv", name: "Tuvalu", dial: "+688" },
  { code: "ug", name: "Uganda", dial: "+256" },
  { code: "ua", name: "Ukraine", dial: "+380" },
  { code: "ae", name: "United Arab Emirates", dial: "+971" },
  { code: "gb", name: "United Kingdom", dial: "+44" },
  { code: "us", name: "United States", dial: "+1" },
  { code: "uy", name: "Uruguay", dial: "+598" },
  { code: "uz", name: "Uzbekistan", dial: "+998" },
  { code: "vu", name: "Vanuatu", dial: "+678" },
  { code: "va", name: "Vatican City", dial: "+379" },
  { code: "ve", name: "Venezuela", dial: "+58" },
  { code: "vn", name: "Vietnam", dial: "+84" },
  { code: "vi", name: "U.S. Virgin Islands", dial: "+1340" },
  { code: "ye", name: "Yemen", dial: "+967" },
  { code: "zm", name: "Zambia", dial: "+260" },
  { code: "zw", name: "Zimbabwe", dial: "+263" },
];

/* ------------------------------------------------------------------ */
/*  Custom flag dropdown for country dial code                         */
/* ------------------------------------------------------------------ */
function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (dial: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected =
    COUNTRY_CODES.find((c) => c.dial === value) ??
    COUNTRY_CODES.find((c) => c.code === "in")!;

  const filtered = COUNTRY_CODES.filter((c) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.includes(q)
    );
  });

  // close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // focus search box when opened
  useEffect(() => {
    if (open) {
      // small delay so it opens smoothly before focusing
      const t = setTimeout(() => searchRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [open]);

  function handleSelect(c: CountryCode) {
    onChange(c.dial);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={wrapperRef} className="relative w-[130px] shrink-0">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center gap-2 rounded-[8px] border border-black/[0.12] bg-cream-soft px-3 py-[14px] text-[0.85rem] text-ink transition-all duration-200 hover:border-saffron/60 focus:border-saffron focus:outline-none"
      >
        <img
          src={`https://flagcdn.com/24x18/${selected.code}.png`}
          alt=""
          width={20}
          height={15}
          className="pointer-events-none shrink-0 rounded-[2px]"
        />
        <span className="truncate">{selected.dial}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={`ml-auto shrink-0 text-ink-soft transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="
            absolute left-0 top-[calc(100%+6px)]
            z-30 w-[280px]
            overflow-hidden
            rounded-[10px] border border-black/[0.1]
            bg-cream
            shadow-[0_16px_40px_rgba(42,31,23,0.16)]
          "
        >
          <div className="border-b border-black/[0.08] p-2">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code..."
              className="w-full rounded-[6px] border border-black/[0.1] bg-cream-soft px-3 py-2 text-[0.85rem] text-ink focus:border-saffron focus:outline-none"
            />
          </div>

          <ul
            role="listbox"
            className="max-h-[260px] overflow-y-auto py-1"
          >
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-[0.85rem] text-ink-soft">
                No matches found
              </li>
            )}

            {filtered.map((c) => {
              const isSelected = c.dial === selected.dial && c.code === selected.code;
              return (
                <li key={c.code} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(c)}
                    className={`flex w-full items-center gap-3 px-4 py-[10px] text-left text-[0.85rem] transition-colors duration-150 hover:bg-saffron/10 ${
                      isSelected ? "bg-saffron/15 text-ink" : "text-ink"
                    }`}
                  >
                    <img
                      src={`https://flagcdn.com/24x18/${c.code}.png`}
                      alt=""
                      width={20}
                      height={15}
                      className="shrink-0 rounded-[2px]"
                    />
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="shrink-0 text-ink-soft">{c.dial}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function ContactForm() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dialCode, setDialCode] = useState("+91"); // default India
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

    // Phone field: allow digits/spaces/hyphens only (no letters)
    if (name === "phone") {
      const cleaned = value.replace(/[^\d\s-]/g, "");
      setFormData((prev) => ({ ...prev, phone: cleaned }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const fullPhone = formData.phone
        ? `${dialCode} ${formData.phone.trim()}`
        : null;

      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: formData.product_id || null,
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
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
      setDialCode("+91");
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

      {/* Phone — custom flag dropdown + number */}
      <div className="mb-4">
        <label className="mb-2 block text-[0.72rem] font-medium uppercase tracking-[0.16em] text-ink-soft">
          Phone
        </label>
        <div className="flex gap-2">
          <CountryCodeSelect value={dialCode} onChange={setDialCode} />

          <input
            type="tel"
            name="phone"
            inputMode="numeric"
            value={formData.phone}
            onChange={handleChange}
            placeholder="98765 43210"
            className="w-full rounded-[8px] border border-black/[0.12] bg-cream-soft px-4 py-[14px] text-[0.95rem] text-ink transition-all duration-200 focus:border-saffron focus:bg-cream focus:outline-none"
          />
        </div>
      </div>

      {/* Product */}
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