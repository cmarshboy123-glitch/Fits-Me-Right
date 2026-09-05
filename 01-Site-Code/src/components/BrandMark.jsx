export default function BrandMark({ compact = false, inverse = false }) {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 58 58" className="h-12 w-12 shrink-0" role="img" aria-label="Dress with measuring ruler">
        <circle cx="29" cy="29" r="28" fill={inverse ? '#ffffff' : '#1C1711'} />
        <path d="M22 13l7 5 7-5 4 11-5 5 9 17H14l9-17-5-5 4-11z" fill="#fff" />
        <g transform="rotate(-35 29 29)">
          <rect x="25" y="5" width="9" height="48" rx="3" fill="#E0B33A" stroke="#1C1711" strokeWidth="1.5" />
          {[12,18,24,30,36,42,48].map((y, i) => <path key={y} d={`M26 ${y}h${i % 2 ? 4 : 6}`} stroke="#1C1711" strokeWidth="1.2" />)}
        </g>
      </svg>
      {!compact && <span className={`leading-none ${inverse ? 'text-white' : 'text-neutral-950'}`}><span className="block text-[15px] font-black tracking-[-.03em]">FITS ME RIGHT</span><span className="mt-1 block text-[9px] font-bold uppercase tracking-[.18em] text-amber-600">Your fashion concierge</span></span>}
    </div>
  )
}
