import BrandMark from './BrandMark'

export default function RouteLoader({ active }) {
  return (
    <div
      className={`route-loader fixed inset-0 z-[100] grid place-items-center bg-[#FBF3E4] ${active ? 'visible opacity-100' : 'invisible pointer-events-none opacity-0'}`}
      role={active ? 'status' : undefined}
      aria-live="polite"
      aria-hidden={!active}
      aria-label={active ? 'Loading the next page' : undefined}
    >
      <div className="flex flex-col items-center">
        <div className="relative grid h-40 w-40 place-items-center">
          <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <circle cx="80" cy="80" r="75" fill="none" stroke="#CDBE9F" strokeWidth="1" />
            <g>
              <path d="M80 5 A75 75 0 0 1 155 80" fill="none" stroke="#B98216" strokeWidth="4" strokeLinecap="round" />
              <circle cx="80" cy="5" r="7" fill="#B98216" stroke="#FBF3E4" strokeWidth="3" />
              <animateTransform attributeName="transform" type="rotate" from="0 80 80" to="360 80 80" dur="0.85s" repeatCount="indefinite" />
            </g>
            <circle cx="80" cy="80" r="59" fill="none" stroke="#1C1711" strokeOpacity=".3" strokeWidth="1" strokeDasharray="4 6" />
            <g>
              <circle cx="80" cy="139" r="4.5" fill="#1C1711" />
              <animateTransform attributeName="transform" type="rotate" from="360 80 80" to="0 80 80" dur="1.35s" repeatCount="indefinite" />
            </g>
          </svg>
          <div className="relative grid h-20 w-20 place-items-center rounded-full border border-[#D8C9AC] bg-white shadow-[0_10px_35px_rgba(28,23,17,.14)]">
            <BrandMark compact />
          </div>
        </div>
        <p className="mt-5 text-[10px] font-black uppercase tracking-[.3em] text-[#6F4F13]">Curating your next look</p>
      </div>
    </div>
  )
}
