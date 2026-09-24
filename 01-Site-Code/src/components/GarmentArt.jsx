import { shade, bodyColor } from '../utils/artColor'
import { productColorFamily } from '../utils/searchIntent'

// Stand-in artwork for the same reason ShoeArt exists: a flat-lay illustration
// of the right kind of garment/accessory, tinted to the product's own color,
// instead of the generic department placeholder image.

const jewelryType = (name = '') => {
  if (/earring/i.test(name)) return 'earring'
  if (/bracelet|cuff|bangle/i.test(name)) return 'bracelet'
  if (/ring/i.test(name)) return 'ring'
  return 'necklace'
}
const accessoryType = (name = '') => {
  if (/belt/i.test(name)) return 'belt'
  if (/scarf/i.test(name)) return 'scarf'
  if (/sunglasses/i.test(name)) return 'sunglasses'
  if (/beanie|hat|cap/i.test(name)) return 'hat'
  if (/wallet|card holder/i.test(name)) return 'wallet'
  if (/glove/i.test(name)) return 'gloves'
  return 'bag'
}
const swimType = (name = '', gender) => (/trunk|board short|swim short/i.test(name) || gender === 'Men' ? 'trunk' : 'swimsuit')
const intimateType = (name = '') => (/robe|lounge|sleep|pajama|pyjama/i.test(name) ? 'robe' : 'intimates')

export function garmentTypeOf(category, name = '', gender) {
  switch (category) {
    case 'Tops': return 'top'
    case 'Knitwear': return 'sweater'
    case 'Outerwear': return 'jacket'
    case 'Suits': return 'blazer'
    case 'Dresses': return 'dress'
    case 'Skirts': return 'skirt'
    case 'Pants': return 'pants'
    case 'Jeans': return 'jeans'
    case 'Shorts': return 'shorts'
    case 'Activewear': return 'legging'
    case 'Swimwear': return swimType(name, gender)
    case 'Intimates': return intimateType(name)
    case 'Jewelry': return jewelryType(name)
    case 'Accessories': return accessoryType(name)
    default: return 'top'
  }
}

const shapes = {
  top: (c) => (
    <>
      <path d="M120 55C120 40 135 30 150 30C165 30 180 40 180 55L215 70L232 105L205 122L205 275L95 275L95 122L68 105L85 70Z" fill={c.body} />
      <path d="M95 122L68 105L85 70L95 85Z" fill={c.dark} opacity=".25" />
      <path d="M128 45C132 56 168 56 172 45" stroke={c.dark} strokeWidth="3" fill="none" />
    </>
  ),
  sweater: (c) => (
    <>
      <path d="M115 50C115 32 132 22 150 22C168 22 185 32 185 50L222 68L238 108L208 128L208 270L92 270L92 128L62 108L78 68Z" fill={c.body} />
      <path d="M92 128L62 108L78 68L92 84Z" fill={c.dark} opacity=".22" />
      <rect x="92" y="256" width="116" height="14" fill={c.trim} opacity=".55" />
      <rect x="196" y="118" width="14" height="20" fill={c.trim} opacity=".5" />
      <rect x="76" y="98" width="14" height="20" fill={c.trim} opacity=".5" />
      <path d="M132 40C138 48 162 48 168 40" stroke={c.trim} strokeWidth="6" fill="none" opacity=".65" />
    </>
  ),
  jacket: (c) => (
    <>
      <path d="M118 45L150 62L182 45L225 68L242 108L212 126L212 270L182 270L182 90L118 90L118 270L88 270L88 126L58 108L75 68Z" fill={c.body} />
      <path d="M150 62L128 100L144 108L150 90Z" fill={c.trim} opacity=".45" />
      <path d="M150 62L172 100L156 108L150 90Z" fill={c.trim} opacity=".25" />
      <line x1="150" y1="90" x2="150" y2="270" stroke={c.trim} strokeWidth="2" opacity=".65" />
      <circle cx="150" cy="140" r="4.5" fill={c.trim} />
      <circle cx="150" cy="170" r="4.5" fill={c.trim} />
      <circle cx="150" cy="200" r="4.5" fill={c.trim} />
    </>
  ),
  blazer: (c) => (
    <>
      <path d="M120 48L150 62L180 48L218 70L232 105L206 120L206 262L94 262L94 120L68 105L82 70Z" fill={c.body} />
      <path d="M150 62L128 100L142 108L150 92Z" fill={c.trim} opacity=".45" />
      <path d="M150 62L172 100L158 108L150 92Z" fill={c.trim} opacity=".25" />
      <line x1="150" y1="92" x2="150" y2="262" stroke={c.trim} strokeWidth="1.5" opacity=".55" />
      <circle cx="150" cy="176" r="5" fill={c.trim} />
      <rect x="108" y="150" width="14" height="4" fill={c.trim} opacity=".55" />
      <rect x="178" y="150" width="14" height="4" fill={c.trim} opacity=".55" />
    </>
  ),
  dress: (c) => (
    <>
      <path d="M120 45C120 32 134 24 150 24C166 24 180 32 180 45L196 60L188 96L176 86L188 300L112 300L124 86L112 96L104 60Z" fill={c.body} />
      <path d="M104 60L112 96L124 86L112 62Z" fill={c.dark} opacity=".2" />
      <path d="M126 150C138 157 162 157 174 150" stroke={c.dark} strokeWidth="2" fill="none" opacity=".5" />
    </>
  ),
  skirt: (c) => (
    <>
      <rect x="118" y="58" width="64" height="18" rx="5" fill={c.dark} />
      <path d="M118 76L182 76L212 258L88 258Z" fill={c.body} />
      <path d="M182 76L212 258L196 258L172 76Z" fill={c.dark} opacity=".2" />
    </>
  ),
  pants: (c) => (
    <>
      <rect x="108" y="55" width="84" height="16" rx="5" fill={c.dark} />
      <path d="M112 71L188 71L192 280L158 280L150 150L142 280L108 280Z" fill={c.body} />
      <path d="M150 150L158 280L150 280L145 150Z" fill={c.dark} opacity=".2" />
    </>
  ),
  jeans: (c) => (
    <>
      <rect x="108" y="55" width="84" height="16" rx="5" fill={c.dark} />
      <path d="M112 71L188 71L192 280L158 280L150 150L142 280L108 280Z" fill={c.body} />
      <path d="M150 150L158 280L150 280L145 150Z" fill={c.dark} opacity=".2" />
      <path d="M116 90L110 276" stroke={c.trim} strokeWidth="1.6" opacity=".7" fill="none" />
      <path d="M184 90L190 276" stroke={c.trim} strokeWidth="1.6" opacity=".7" fill="none" />
      <rect x="168" y="78" width="15" height="11" rx="2" fill="none" stroke={c.trim} strokeWidth="1.6" opacity=".75" />
      <rect x="118" y="52" width="10" height="6" fill={c.trim} opacity=".8" />
      <rect x="172" y="52" width="10" height="6" fill={c.trim} opacity=".8" />
    </>
  ),
  shorts: (c) => (
    <>
      <rect x="108" y="55" width="84" height="16" rx="5" fill={c.dark} />
      <path d="M112 71L188 71L184 172L154 172L150 122L146 172L116 172Z" fill={c.body} />
      <path d="M150 122L154 172L150 172L147 122Z" fill={c.dark} opacity=".2" />
    </>
  ),
  legging: (c) => (
    <>
      <rect x="118" y="50" width="64" height="14" rx="7" fill={c.dark} />
      <path d="M120 64L180 64L172 290L156 290L150 170L144 290L128 290Z" fill={c.body} />
      <path d="M120 64L128 290" stroke={c.light} strokeWidth="4" opacity=".8" fill="none" />
      <path d="M180 64L172 290" stroke={c.light} strokeWidth="4" opacity=".8" fill="none" />
    </>
  ),
  swimsuit: (c) => (
    <>
      <path d="M120 60C120 48 134 42 150 42C166 42 180 48 180 60L192 78L182 100L172 90L172 178C172 194 162 205 150 205C138 205 128 194 128 178L128 90L118 100L108 78Z" fill={c.body} />
      <path d="M132 55L128 90" stroke={c.dark} strokeWidth="3" opacity=".4" fill="none" />
      <path d="M168 55L172 90" stroke={c.dark} strokeWidth="3" opacity=".25" fill="none" />
    </>
  ),
  trunk: (c) => (
    <>
      <rect x="108" y="55" width="84" height="14" rx="7" fill={c.dark} />
      <path d="M112 69L188 69L184 146L154 146L150 110L146 146L116 146Z" fill={c.body} />
      <path d="M138 69C142 79 158 79 162 69" stroke={c.light} strokeWidth="2.4" fill="none" opacity=".7" />
    </>
  ),
  robe: (c) => (
    <>
      <path d="M115 50L150 65L185 50L215 75L205 260L185 260L185 96L150 110L115 96L115 260L95 260L85 75Z" fill={c.body} />
      <path d="M115 96L85 75L95 260L115 260Z" fill={c.dark} opacity=".18" />
      <line x1="150" y1="65" x2="150" y2="260" stroke={c.trim} strokeWidth="1" opacity=".4" />
      <rect x="120" y="148" width="60" height="10" rx="4" fill={c.trim} opacity=".65" transform="rotate(-7 150 153)" />
    </>
  ),
  intimates: (c) => (
    <>
      <ellipse cx="128" cy="90" rx="26" ry="22" fill={c.body} />
      <ellipse cx="172" cy="90" rx="26" ry="22" fill={c.body} />
      <rect x="102" y="103" width="96" height="10" rx="5" fill={c.dark} opacity=".6" />
      <path d="M112 78L100 55" stroke={c.body} strokeWidth="5" strokeLinecap="round" />
      <path d="M188 78L200 55" stroke={c.body} strokeWidth="5" strokeLinecap="round" />
      <path d="M120 180L180 180L192 218C192 243 172 256 150 256C128 256 108 243 108 218Z" fill={c.body} />
      <rect x="118" y="176" width="64" height="8" rx="4" fill={c.dark} opacity=".55" />
    </>
  ),
  earring: (c) => (
    <>
      <circle cx="118" cy="95" r="11" fill="none" stroke={c.body} strokeWidth="6" />
      <line x1="118" y1="106" x2="118" y2="132" stroke={c.body} strokeWidth="4" />
      <circle cx="118" cy="144" r="9" fill={c.body} />
      <circle cx="182" cy="95" r="11" fill="none" stroke={c.body} strokeWidth="6" />
      <line x1="182" y1="106" x2="182" y2="132" stroke={c.body} strokeWidth="4" />
      <circle cx="182" cy="144" r="9" fill={c.body} />
    </>
  ),
  necklace: (c) => (
    <>
      <path d="M90 70C90 145 210 145 210 70" stroke={c.body} strokeWidth="4" fill="none" />
      <circle cx="150" cy="172" r="20" fill={c.body} />
      <circle cx="150" cy="172" r="7" fill={c.light} opacity=".6" />
    </>
  ),
  bracelet: (c) => (
    <>
      <ellipse cx="150" cy="160" rx="72" ry="92" fill="none" stroke={c.body} strokeWidth="16" />
      <ellipse cx="150" cy="160" rx="72" ry="92" fill="none" stroke={c.dark} strokeWidth="2" opacity=".35" />
    </>
  ),
  ring: (c) => (
    <>
      <circle cx="150" cy="190" r="58" fill="none" stroke={c.body} strokeWidth="17" />
      <path d="M150 96L170 124L150 152L130 124Z" fill={c.light} />
      <path d="M150 96L170 124L150 152L130 124Z" fill="none" stroke={c.dark} strokeWidth="1.5" opacity=".4" />
    </>
  ),
  belt: (c) => (
    <>
      <rect x="55" y="148" width="190" height="26" rx="5" fill={c.body} />
      <rect x="128" y="136" width="44" height="50" rx="5" fill="none" stroke={c.trim} strokeWidth="6" />
      <line x1="150" y1="136" x2="150" y2="186" stroke={c.trim} strokeWidth="4" />
      {[75, 95, 205, 225].map((x) => <circle key={x} cx={x} cy="161" r="2.5" fill={c.trim} opacity=".6" />)}
    </>
  ),
  scarf: (c) => (
    <>
      <path d="M58 118L222 198L206 230L42 150Z" fill={c.body} />
      <path d="M98 138L86 236" stroke={c.body} strokeWidth="16" strokeLinecap="round" />
      <path d="M98 138L86 236" stroke={c.dark} strokeWidth="16" strokeLinecap="round" opacity=".12" />
      {[0, 1, 2].map((i) => <line key={i} x1={80 + i * 6} y1="228" x2={78 + i * 6} y2="240" stroke={c.dark} strokeWidth="2" opacity=".5" />)}
    </>
  ),
  bag: (c) => (
    <>
      <path d="M115 92C115 60 185 60 185 92" stroke={c.dark} strokeWidth="8" fill="none" />
      <path d="M95 96L205 96L215 254C215 264 205 270 195 270L105 270C95 270 85 264 85 254Z" fill={c.body} />
      <line x1="150" y1="150" x2="150" y2="230" stroke={c.dark} strokeWidth="2" opacity=".3" />
    </>
  ),
  sunglasses: (c) => (
    <>
      <line x1="73" y1="150" x2="44" y2="138" stroke={c.dark} strokeWidth="6" strokeLinecap="round" />
      <line x1="227" y1="150" x2="256" y2="138" stroke={c.dark} strokeWidth="6" strokeLinecap="round" />
      <ellipse cx="113" cy="162" rx="42" ry="34" fill={c.dark} />
      <ellipse cx="187" cy="162" rx="42" ry="34" fill={c.dark} />
      <path d="M155 156Q150 148 145 156" stroke={c.dark} strokeWidth="7" fill="none" />
      <ellipse cx="100" cy="150" rx="10" ry="7" fill={c.light} opacity=".4" />
      <ellipse cx="174" cy="150" rx="10" ry="7" fill={c.light} opacity=".4" />
    </>
  ),
  hat: (c) => (
    <>
      <path d="M90 195C90 122 210 122 210 195Z" fill={c.body} />
      <rect x="82" y="184" width="136" height="30" rx="15" fill={c.dark} opacity=".55" />
    </>
  ),
  wallet: (c) => (
    <>
      <rect x="88" y="118" width="124" height="92" rx="10" fill={c.body} />
      <line x1="150" y1="118" x2="150" y2="210" stroke={c.trim} strokeWidth="2" opacity=".5" />
      <rect x="98" y="128" width="44" height="72" rx="6" fill="none" stroke={c.trim} strokeWidth="1.6" opacity=".65" />
      <rect x="158" y="128" width="44" height="72" rx="6" fill="none" stroke={c.trim} strokeWidth="1.6" opacity=".5" />
    </>
  ),
  gloves: (c) => (
    <>
      <path d="M108 220L108 138C108 118 124 106 136 106C148 106 158 118 158 138L158 220Z" fill={c.body} />
      <path d="M108 158C96 152 90 164 96 174C101 182 108 178 108 168Z" fill={c.body} />
      <path d="M192 220L192 138C192 118 176 106 164 106C152 106 142 118 142 138L142 220Z" fill={c.dark} opacity=".85" />
      <path d="M192 158C204 152 210 164 204 174C199 182 192 178 192 168Z" fill={c.dark} opacity=".85" />
    </>
  ),
}

// A fixed near-white or near-black overlay for buttons/lapels/stitching/ribbing —
// details meant to read as an accent against the garment. A shade-of-body overlay
// (like the shadow fills below) washes out completely on an already-dark item,
// so these need a color picked by actual lightness, not by shading the body hue.
function luminance(hex) {
  const n = parseInt(hex.slice(1), 16)
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}

export default function GarmentArt({ category, name, gender, color }) {
  const type = garmentTypeOf(category, name, gender)
  const body = bodyColor(color)
  const family = productColorFamily(color)
  const c = {
    body,
    dark: shade(body, -0.3),
    light: shade(body, 0.35),
    trim: luminance(body) > 0.55 ? 'rgba(0,0,0,.4)' : 'rgba(255,255,255,.6)',
    line: shade(body, family === 'white' ? -0.18 : -0.45),
  }
  const label = type === 'trunk' ? 'swim trunk' : type
  return (
    <svg viewBox="0 0 300 375" className="h-full w-full" role="img" aria-label={`${color ? `${color} ` : ''}${label} illustration`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="garment-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6f3ee" /><stop offset="1" stopColor="#e9e4db" /></linearGradient>
      </defs>
      <rect width="300" height="375" fill="url(#garment-bg)" />
      <ellipse cx="150" cy="322" rx="118" ry="9" fill="#000" opacity=".1" />
      <g stroke={c.line} strokeWidth="1.6" strokeLinejoin="round">{shapes[type](c)}</g>
      <text x="150" y="350" textAnchor="middle" fontSize="8" letterSpacing="1.6" fill="#8b857a" fontFamily="system-ui, sans-serif">ILLUSTRATION</text>
    </svg>
  )
}
