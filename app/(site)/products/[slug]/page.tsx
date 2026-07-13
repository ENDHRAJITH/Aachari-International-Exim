'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Package, Tag, FileText, ArrowRight, Share2, CheckCircle2, Phone, ChevronDown, ChevronUp } from 'lucide-react'

interface ProductImage {
  id: string
  image_url: string
  is_primary: boolean
  alt_text: string | null
}

interface ProductSpec {
  id: string
  spec_key: string
  spec_value: string
  sort_order: number
}

interface Product {
  id: string
  name: string
  slug: string
  hsn_code: string | null
  description: string | null
  short_description: string | null
  category: { name: string; slug: string } | null
  images: ProductImage[]
  specs: ProductSpec[]
}

interface EnquiryForm {
  name: string
  email: string
  phone: string
  country: string
  city: string
  message: string
}

/* ------------------------------------------------------------------ */
/*  Country code data (ISO alpha-2 + dial code) — used by the flag     */
/*  dropdown below. Same full list used across the site's contact form. */
/* ------------------------------------------------------------------ */
interface CountryCode {
  code: string
  name: string
  dial: string
}

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
]

/* ------------------------------------------------------------------ */
/*  Flag dropdown for country dial code — styled to match this page's  */
/*  inline-style theme (cream/orange), rather than the Tailwind        */
/*  version used in ContactForm.                                       */
/* ------------------------------------------------------------------ */
function CountryCodeSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (dial: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected =
    COUNTRY_CODES.find((c) => c.dial === value) ??
    COUNTRY_CODES.find((c) => c.code === 'in')!

  const filtered = COUNTRY_CODES.filter((c) => {
    const q = query.trim().toLowerCase()
    if (!q) return true
    return (
      c.name.toLowerCase().includes(q) ||
      c.dial.includes(q) ||
      c.code.includes(q)
    )
  })

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current?.focus(), 10)
      return () => clearTimeout(t)
    }
  }, [open])

  function handleSelect(c: CountryCode) {
    onChange(c.dial)
    setOpen(false)
    setQuery('')
  }

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '112px', flexShrink: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          width: '100%', padding: '11px 10px',
          borderRadius: '9px', border: '1.5px solid #E8E0D8',
          backgroundColor: '#FAFAF8', fontSize: '14px', color: '#1A1A1A',
          cursor: 'pointer', fontFamily: 'inherit'
        }}
      >
        <img
          src={`https://flagcdn.com/24x18/${selected.code}.png`}
          alt=""
          width={20}
          height={15}
          style={{ borderRadius: '2px', flexShrink: 0, pointerEvents: 'none' }}
        />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {selected.dial}
        </span>
        <svg
          width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5"
          style={{
            marginLeft: 'auto', flexShrink: 0, color: '#6B6B6B',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s'
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          style={{
            position: 'absolute', left: 0, top: 'calc(100% + 6px)',
            zIndex: 30, width: '260px', overflow: 'hidden',
            borderRadius: '10px', border: '1px solid #E8E0D8',
            backgroundColor: '#ffffff',
            boxShadow: '0 16px 40px rgba(42,31,23,0.16)'
          }}
        >
          <div style={{ borderBottom: '1px solid #F0EBE3', padding: '8px' }}>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country or code..."
              style={{
                width: '100%', padding: '8px 12px', borderRadius: '6px',
                border: '1px solid #E8E0D8', backgroundColor: '#FAFAF8',
                fontSize: '13px', color: '#1A1A1A', outline: 'none', fontFamily: 'inherit'
              }}
            />
          </div>

          <ul role="listbox" style={{ maxHeight: '240px', overflowY: 'auto', padding: '4px 0', margin: 0, listStyle: 'none' }}>
            {filtered.length === 0 && (
              <li style={{ padding: '12px 16px', fontSize: '13px', color: '#6B6B6B' }}>
                No matches found
              </li>
            )}

            {filtered.map((c) => {
              const isSelected = c.dial === selected.dial && c.code === selected.code
              return (
                <li key={c.code} role="option" aria-selected={isSelected}>
                  <button
                    type="button"
                    onClick={() => handleSelect(c)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                      padding: '9px 16px', textAlign: 'left', fontSize: '13px',
                      color: '#1A1A1A', border: 'none', cursor: 'pointer',
                      backgroundColor: isSelected ? '#C1622A18' : 'transparent',
                      fontFamily: 'inherit'
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = '#C1622A0D' }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent' }}
                  >
                    <img
                      src={`https://flagcdn.com/24x18/${c.code}.png`}
                      alt=""
                      width={20}
                      height={15}
                      style={{ borderRadius: '2px', flexShrink: 0 }}
                    />
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.name}
                    </span>
                    <span style={{ flexShrink: 0, color: '#6B6B6B' }}>{c.dial}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function ProductDetailPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState<string>('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [showAllSpecs, setShowAllSpecs] = useState(false)
  const [dialCode, setDialCode] = useState('+91') // default India

  const [form, setForm] = useState<EnquiryForm>({
    name: '', email: '', phone: '', country: '', city: '', message: ''
  })

  useEffect(() => {
    params.then(({ slug }) => fetchProduct(slug))
  }, [])

  const fetchProduct = async (slug: string) => {
    try {
      const res = await fetch(`/api/products/${slug}`)
      const data = await res.json()
      if (!data.success || !data.data) { router.push('/products'); return }
      setProduct(data.data)
      const primary = data.data.images?.find((img: ProductImage) => img.is_primary)
      setActiveImage(primary?.image_url || data.data.images?.[0]?.image_url || '')

      // Related products fetch
      if (data.data.category?.slug) {
        const relRes = await fetch(`/api/products?category=${data.data.category.slug}`)
        const relData = await relRes.json()
        if (relData.success) {
          setRelatedProducts(relData.data.filter((p: any) => p.slug !== slug).slice(0, 3))
        }
      }
    } catch {
      router.push('/products')
    } finally {
      setLoading(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // allow digits/spaces/hyphens only (no letters)
    const cleaned = e.target.value.replace(/[^\d\s-]/g, '')
    setForm({ ...form, phone: cleaned })
  }

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setError('Name, email and message are required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const fullPhone = form.phone ? `${dialCode} ${form.phone.trim()}` : null

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product?.id, ...form, phone: fullPhone })
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
        setForm({ name: '', email: '', phone: '', country: '', city: '', message: '' })
        setDialCode('+91')
      } else {
        setError(data.error || 'Failed to submit')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: '9px',
    border: '1.5px solid #E8E0D8',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#FAFAF8',
    color: '#1A1A1A',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s'
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: '#1A1A1A',
    display: 'block',
    marginBottom: '6px'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#F8F7F4', padding: '120px 24px 40px', marginTop:'0px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            <div style={{ aspectRatio: '1', backgroundColor: '#EDE8E0', borderRadius: '20px', animation: 'pulse 1.5s infinite' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '20px' }}>
              {[60, 40, 90, 70, 50].map((w, i) => (
                <div key={i} style={{ height: i === 0 ? '36px' : '14px', backgroundColor: '#EDE8E0', borderRadius: '6px', width: `${w}%`, animation: 'pulse 1.5s infinite' }} />
              ))}
            </div>
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </div>
    )
  }

  if (!product) return null

  const sortedSpecs = [...(product.specs || [])].sort((a, b) => a.sort_order - b.sort_order)
  const sortedImages = [...(product.images || [])].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
  const visibleSpecs = showAllSpecs ? sortedSpecs : sortedSpecs.slice(0, 3)

  const trustBadges = [
    '✅ APEDA Certified',
    '✅ Quality Checked',
    '✅ Bulk Orders',
    '✅ Export Ready'
  ]

  return (
    <div style={{ backgroundColor: '#F8F7F4', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '110px 24px 60px' }}>

        {/* Breadcrumb */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          marginBottom: '32px', fontSize: '12px', color: '#9B9B9B', flexWrap: 'wrap',
          marginTop:'70px'
        }}>
          <Link href="/" style={{ color: '#9B9B9B', textDecoration: 'none' }}>Home</Link>
          <ChevronRight size={12} />
          <Link href="/products" style={{ color: '#9B9B9B', textDecoration: 'none' }}>Products</Link>
          {product.category && (
            <>
              <ChevronRight size={12} />
              <Link href={`/products?category=${product.category.slug}`} style={{ color: '#9B9B9B', textDecoration: 'none' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={12} />
          <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{product.name}</span>
        </div>

        {/* Main Grid */}
        <div className="product-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '48px' }}>

          {/* Left — Images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{
              width: '100%', aspectRatio: '1',
              backgroundColor: '#F0EAE0', borderRadius: '20px',
              overflow: 'hidden', position: 'relative',
              border: '1px solid #E8E0D8'
            }}>
              {activeImage ? (
                <Image src={activeImage} alt={product.name} fill priority style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={64} color="#D8CFC4" />
                </div>
              )}
            </div>

            {sortedImages.length > 1 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '8px' }}>
                {sortedImages.map((img) => (
                  <div
                    key={img.id}
                    onClick={() => setActiveImage(img.image_url)}
                    style={{
                      aspectRatio: '1', borderRadius: '10px',
                      overflow: 'hidden', position: 'relative', cursor: 'pointer',
                      border: activeImage === img.image_url ? '2px solid #C1622A' : '2px solid transparent',
                      outline: activeImage === img.image_url ? 'none' : '1px solid #E8E0D8',
                      transition: 'all 0.15s', backgroundColor: '#F0EAE0'
                    }}
                  >
                    <Image src={img.image_url} alt={img.alt_text || product.name} fill style={{ objectFit: 'cover' }} sizes="100px" />
                  </div>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '8px', marginTop: '4px'
            }}>
              {trustBadges.map((badge) => (
                <div key={badge} style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #E8E0D8',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '12px',
                  color: '#1A1A1A',
                  fontWeight: 500
                }}>
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right — Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingTop: '8px' }}>

            {/* Category + Share */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {product.category && (
                <Link
                  href={`/products?category=${product.category.slug}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    backgroundColor: '#C1622A18', color: '#C1622A',
                    padding: '5px 12px', borderRadius: '999px',
                    fontSize: '11px', fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.5px', textDecoration: 'none'
                  }}
                >
                  <Tag size={11} />
                  {product.category.name}
                </Link>
              )}
              <button
                onClick={handleShare}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: '8px',
                  border: '1px solid #E8E0D8', backgroundColor: '#ffffff',
                  fontSize: '12px', color: copied ? '#16A34A' : '#6B6B6B',
                  cursor: 'pointer', fontWeight: 500
                }}
              >
                {copied ? <CheckCircle2 size={13} /> : <Share2 size={13} />}
                {copied ? 'Copied!' : 'Share'}
              </button>
            </div>

            {/* Name */}
            <h1 style={{ fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 700, color: '#1A1A1A', margin: 0, lineHeight: 1.2 }}>
              {product.name}
            </h1>

            {/* HSN */}
            {product.hsn_code && (
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                backgroundColor: '#1A1A1A', color: '#ffffff',
                padding: '8px 16px', borderRadius: '8px',
                fontSize: '13px', fontWeight: 600, width: 'fit-content'
              }}>
                <FileText size={14} />
                HSN Code: {product.hsn_code}
              </div>
            )}

            <div style={{ height: '1px', backgroundColor: '#E8E0D8' }} />

            {product.short_description && (
              <p style={{ fontSize: '15px', color: '#6B6B6B', lineHeight: 1.8, margin: 0, fontStyle: 'italic' }}>
                {product.short_description}
              </p>
            )}

            {product.description && (
              <p style={{ fontSize: '14px', color: '#3D3D3D', lineHeight: 1.8, margin: 0 }}>
                {product.description}
              </p>
            )}

            {/* Specs — expands in place to show all, fully responsive */}
            {sortedSpecs.length > 0 && (
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #E8E0D8', overflow: 'hidden' }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #F0EBE3', backgroundColor: '#FAFAF8' }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1A1A1A' }}>
                    Specifications
                  </p>
                </div>

                {visibleSpecs.map((spec, idx) => (
                  <div
                    key={spec.id}
                    className="spec-row"
                    style={{
                      display: 'grid', gridTemplateColumns: '140px 1fr',
                      gap: '4px 16px',
                      padding: '11px 16px',
                      borderBottom: idx < visibleSpecs.length - 1 ? '1px solid #F0EBE3' : 'none',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#FAFAF8'
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#6B6B6B', fontWeight: 500 }}>{spec.spec_key}</span>
                    <span style={{ fontSize: '13px', color: '#1A1A1A', fontWeight: 600, wordBreak: 'break-word' }}>{spec.spec_value}</span>
                  </div>
                ))}

                {sortedSpecs.length > 3 && (
                  <button
                    onClick={() => setShowAllSpecs(!showAllSpecs)}
                    style={{
                      width: '100%', padding: '10px 16px', textAlign: 'center',
                      fontSize: '12px', color: '#C1622A', fontWeight: 600,
                      cursor: 'pointer', border: 'none', backgroundColor: '#FAFAF8',
                      borderTop: '1px solid #F0EBE3',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px'
                    }}
                  >
                    {showAllSpecs ? (
                      <>Show less <ChevronUp size={13} /></>
                    ) : (
                      <>View all {sortedSpecs.length} specifications <ChevronDown size={13} /></>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
              <button
                onClick={() => document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' })}
                style={{
                  flex: 1, minWidth: '160px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  backgroundColor: '#C1622A', color: '#ffffff',
                  padding: '14px 24px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer'
                }}
              >
                Enquire Now <ArrowRight size={16} />
              </button>

              <a
                href={`https://wa.me/917305982029?text=${encodeURIComponent(`Hi, I'm interested in ${product.name}. Please share more details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1, minWidth: '140px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  backgroundColor: '#25D366', color: '#ffffff',
                  padding: '14px 24px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, textDecoration: 'none'
                }}
              >
                <Phone size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Enquiry Form */}
        <div id="enquiry-form" style={{
          backgroundColor: '#ffffff', borderRadius: '16px',
          border: '1px solid #E8E0D8', padding: '32px',
          marginBottom: '48px', scrollMarginTop: '100px'
        }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 6px' }}>
            Send Enquiry
          </h2>
          <p style={{ color: '#6B6B6B', fontSize: '14px', margin: '0 0 24px' }}>
            Enquiring about: <strong style={{ color: '#C1622A' }}>{product.name}</strong>
          </p>

          {submitted ? (
            <div style={{
              backgroundColor: '#F0FDF4', border: '1px solid #86EFAC',
              borderRadius: '12px', padding: '24px', textAlign: 'center'
            }}>
              <CheckCircle2 size={40} color="#16A34A" style={{ margin: '0 auto 12px', display: 'block' }} />
              <p style={{ fontWeight: 700, color: '#16A34A', fontSize: '16px', margin: '0 0 6px' }}>
                Enquiry Submitted!
              </p>
              <p style={{ color: '#6B6B6B', fontSize: '13px', margin: 0 }}>
                Our team will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {error && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '12px 16px', color: '#DC2626', fontSize: '13px' }}>
                  {error}
                </div>
              )}

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Name *</label>
                  <input style={inputStyle} placeholder="Your full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                    onBlur={(e) => e.target.style.borderColor = '#E8E0D8'} />
                </div>
                <div>
                  <label style={labelStyle}>Email *</label>
                  <input type="email" style={inputStyle} placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                    onBlur={(e) => e.target.style.borderColor = '#E8E0D8'} />
                </div>
              </div>

              <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <CountryCodeSelect value={dialCode} onChange={setDialCode} />
                    <input
                      style={inputStyle}
                      type="tel"
                      inputMode="numeric"
                      placeholder="98765 43210"
                      value={form.phone}
                      onChange={handlePhoneChange}
                      onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                      onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
                    />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>Country</label>
                  <input style={inputStyle} placeholder="e.g. United Arab Emirates" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                    onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                    onBlur={(e) => e.target.style.borderColor = '#E8E0D8'} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>City</label>
                <input style={inputStyle} placeholder="Your city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                  onBlur={(e) => e.target.style.borderColor = '#E8E0D8'} />
              </div>

              <div>
                <label style={labelStyle}>Message *</label>
                <textarea
                  style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                  placeholder={`I'm interested in ${product.name}. Please share pricing and MOQ details...`}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  onFocus={(e) => e.target.style.borderColor = '#C1622A'}
                  onBlur={(e) => e.target.style.borderColor = '#E8E0D8'}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '14px', borderRadius: '12px', border: 'none',
                  backgroundColor: submitting ? '#A8521F80' : '#C1622A',
                  color: '#ffffff', fontSize: '15px', fontWeight: 600,
                  cursor: submitting ? 'not-allowed' : 'pointer', width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                {submitting ? 'Submitting...' : <>Submit Enquiry <ArrowRight size={16} /></>}
              </button>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 20px' }}>
              Related Products
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
              gap: '20px'
            }}>
              {relatedProducts.map((rp) => {
                const rpImage = rp.images?.find((img: any) => img.is_primary)?.image_url || rp.images?.[0]?.image_url
                return (
                  <Link key={rp.id} href={`/products/${rp.slug}`} style={{ textDecoration: 'none' }}>
                    <div style={{
                      backgroundColor: '#ffffff', borderRadius: '14px',
                      border: '1px solid #E8E0D8', overflow: 'hidden',
                      transition: 'all 0.2s', cursor: 'pointer'
                    }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.borderColor = '#C1622A'
                        e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.08)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.borderColor = '#E8E0D8'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ width: '100%', aspectRatio: '4/3', backgroundColor: '#F5EDE0', position: 'relative' }}>
                        {rpImage ? (
                          <Image src={rpImage} alt={rp.name} fill style={{ objectFit: 'cover' }} sizes="33vw" />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={40} color="#D8CFC4" />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '16px' }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#1A1A1A', margin: '0 0 4px' }}>{rp.name}</p>
                        <p style={{ fontSize: '12px', color: '#C1622A', fontWeight: 600, margin: 0 }}>View Details →</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 28px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .spec-row { grid-template-columns: 1fr !important; gap: 2px !important; }
        }
      `}</style>
    </div>
  )
}