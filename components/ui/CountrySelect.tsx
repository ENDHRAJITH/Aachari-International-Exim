'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'

export interface CountryItem {
  code: string
  name: string
  dial: string
}

export const COUNTRIES: CountryItem[] = [
  { code: "ae", name: "United Arab Emirates", dial: "+971" },
  { code: "us", name: "United States", dial: "+1" },
  { code: "sa", name: "Saudi Arabia", dial: "+966" },
  { code: "gb", name: "United Kingdom", dial: "+44" },
  { code: "sg", name: "Singapore", dial: "+65" },
  { code: "nl", name: "Netherlands", dial: "+31" },
  { code: "in", name: "India", dial: "+91" },
  { code: "au", name: "Australia", dial: "+61" },
  { code: "ca", name: "Canada", dial: "+1" },
  { code: "de", name: "Germany", dial: "+49" },
  { code: "fr", name: "France", dial: "+33" },
  { code: "my", name: "Malaysia", dial: "+60" },
  { code: "kw", name: "Kuwait", dial: "+965" },
  { code: "qa", name: "Qatar", dial: "+974" },
  { code: "om", name: "Oman", dial: "+968" },
  { code: "bh", name: "Bahrain", dial: "+973" },
  { code: "za", name: "South Africa", dial: "+27" },
  { code: "nz", name: "New Zealand", dial: "+64" },
  { code: "af", name: "Afghanistan", dial: "+93" },
  { code: "al", name: "Albania", dial: "+355" },
  { code: "dz", name: "Algeria", dial: "+213" },
  { code: "ar", name: "Argentina", dial: "+54" },
  { code: "at", name: "Austria", dial: "+43" },
  { code: "bd", name: "Bangladesh", dial: "+880" },
  { code: "be", name: "Belgium", dial: "+32" },
  { code: "br", name: "Brazil", dial: "+55" },
  { code: "bn", name: "Brunei", dial: "+673" },
  { code: "bg", name: "Bulgaria", dial: "+359" },
  { code: "kh", name: "Cambodia", dial: "+855" },
  { code: "cl", name: "Chile", dial: "+56" },
  { code: "cn", name: "China", dial: "+86" },
  { code: "co", name: "Colombia", dial: "+57" },
  { code: "hr", name: "Croatia", dial: "+385" },
  { code: "cz", name: "Czech Republic", dial: "+420" },
  { code: "dk", name: "Denmark", dial: "+45" },
  { code: "eg", name: "Egypt", dial: "+20" },
  { code: "ee", name: "Estonia", dial: "+372" },
  { code: "et", name: "Ethiopia", dial: "+251" },
  { code: "fi", name: "Finland", dial: "+358" },
  { code: "gr", name: "Greece", dial: "+30" },
  { code: "hk", name: "Hong Kong", dial: "+852" },
  { code: "hu", name: "Hungary", dial: "+36" },
  { code: "id", name: "Indonesia", dial: "+62" },
  { code: "ir", name: "Iran", dial: "+98" },
  { code: "iq", name: "Iraq", dial: "+964" },
  { code: "ie", name: "Ireland", dial: "+353" },
  { code: "il", name: "Israel", dial: "+972" },
  { code: "it", name: "Italy", dial: "+39" },
  { code: "jp", name: "Japan", dial: "+81" },
  { code: "jo", name: "Jordan", dial: "+962" },
  { code: "ke", name: "Kenya", dial: "+254" },
  { code: "kr", name: "South Korea", dial: "+82" },
  { code: "lb", name: "Lebanon", dial: "+961" },
  { code: "lu", name: "Luxembourg", dial: "+352" },
  { code: "mv", name: "Maldives", dial: "+960" },
  { code: "mx", name: "Mexico", dial: "+52" },
  { code: "ma", name: "Morocco", dial: "+212" },
  { code: "np", name: "Nepal", dial: "+977" },
  { code: "no", name: "Norway", dial: "+47" },
  { code: "pk", name: "Pakistan", dial: "+92" },
  { code: "ph", name: "Philippines", dial: "+63" },
  { code: "pl", name: "Poland", dial: "+48" },
  { code: "pt", name: "Portugal", dial: "+351" },
  { code: "ro", name: "Romania", dial: "+40" },
  { code: "ru", name: "Russia", dial: "+7" },
  { code: "es", name: "Spain", dial: "+34" },
  { code: "lk", name: "Sri Lanka", dial: "+94" },
  { code: "se", name: "Sweden", dial: "+46" },
  { code: "ch", name: "Switzerland", dial: "+41" },
  { code: "tw", name: "Taiwan", dial: "+886" },
  { code: "th", name: "Thailand", dial: "+66" },
  { code: "tr", name: "Turkey", dial: "+90" },
  { code: "ua", name: "Ukraine", dial: "+380" },
  { code: "vn", name: "Vietnam", dial: "+84" }
]

interface CountrySelectProps {
  value: string
  onChange: (countryName: string) => void
  placeholder?: string
  style?: React.CSSProperties
  className?: string
}

export default function CountrySelect({
  value,
  onChange,
  placeholder = "Select Country of Import",
  style,
  className = ""
}: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  const selectedCountry = COUNTRIES.find((c) => c.name.toLowerCase() === value.toLowerCase())

  const filtered = COUNTRIES.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`} style={{ width: '100%', ...style }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 rounded-[8px] border border-black/[0.12] bg-cream-soft px-4 py-[14px] text-[0.95rem] text-ink transition-all duration-200 focus:border-saffron focus:bg-cream focus:outline-none"
        style={{
          border: '1.5px solid #E8E0D8',
          backgroundColor: '#FAFAF7',
          color: selectedCountry ? '#1A1A1A' : '#78716c'
        }}
      >
        <span className="flex items-center gap-2 truncate">
          {selectedCountry ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://flagcdn.com/w40/${selectedCountry.code}.png`}
                alt={selectedCountry.name}
                className="h-3.5 w-5 rounded-[2px] object-cover flex-shrink-0"
              />
              <span className="truncate font-medium">{selectedCountry.name}</span>
            </>
          ) : (
            <span>{value || placeholder}</span>
          )}
        </span>
        <ChevronDown size={16} className={`transition-transform duration-200 text-stone-500 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute left-0 top-full z-50 mt-1.5 w-full rounded-xl border border-stone-200 bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2"
          style={{
            maxHeight: '260px',
            backgroundColor: '#ffffff',
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
            zIndex: 999
          }}
        >
          <div className="relative mb-2 px-1">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              autoFocus
              className="w-full rounded-lg border border-stone-200 bg-stone-50 py-1.5 pl-8 pr-3 text-xs text-stone-800 focus:border-saffron focus:bg-white focus:outline-none"
            />
          </div>

          <div className="max-h-[190px] overflow-y-auto space-y-0.5 custom-scrollbar">
            {filtered.length > 0 ? (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onChange(c.name)
                    setOpen(false)
                    setSearch("")
                  }}
                  className={`w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-stone-100 ${
                    value.toLowerCase() === c.name.toLowerCase() ? 'bg-amber-50 text-saffron font-semibold' : 'text-stone-700'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`https://flagcdn.com/w40/${c.code}.png`}
                      alt={c.name}
                      className="h-3 w-4.5 rounded-[2px] object-cover flex-shrink-0"
                    />
                    <span className="truncate">{c.name}</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">{c.dial}</span>
                </button>
              ))
            ) : (
              <div className="py-4 text-center text-xs text-stone-400">No country found</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
