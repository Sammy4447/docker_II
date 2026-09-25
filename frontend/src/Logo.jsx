export function LogoMark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill="#b5412b" />
      <circle cx="32" cy="32" r="27" fill="none" stroke="#f6f1e7" strokeWidth="1.2" strokeDasharray="2 3" />
      <path
        d="M26 16c-2-2.5 2-4 0-6.5M32 15c-2-2.5 2-4 0-6.5M38 16c-2-2.5 2-4 0-6.5"
        fill="none"
        stroke="#f6f1e7"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M14 45c0-13 9-22 18-24 9 2 18 11 18 24q0 4-4 4H18q-4 0-4-4z"
        fill="#f7efe1"
        stroke="#2b211a"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M32 21v10M27.5 23l2 8.5M36.5 23l-2 8.5M22.5 28l4.5 6M41.5 28l-4.5 6"
        stroke="#2b211a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="32" cy="20" r="2" fill="#2b211a" />
    </svg>
  )
}

export default function Logo({ size = 40, className = '' }) {
  return (
    <a href="#top" className={`brand ${className}`} aria-label="Sammy's Momo House, back to top">
      <LogoMark size={size} />
      <span className="brand-text">
        <span className="brand-name">Sammy&rsquo;s</span>
        <span className="brand-sub">Momo House</span>
      </span>
    </a>
  )
}
