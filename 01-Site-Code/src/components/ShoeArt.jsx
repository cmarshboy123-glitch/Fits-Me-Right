import { productColorFamily } from '../utils/searchIntent'
import { shade, bodyColor } from '../utils/artColor'

// Stand-in artwork for shoes that don't have a retailer photo yet: a clean side-view
// illustration of the right kind of shoe, tinted to the product's own color.

const typeRules = [
  ['sandal', /sandal|slide|slider|thong|espadrille|flip/i],
  ['slipper', /slipper|scuff|tasman|tazz|clog|mule|disquette|coquette|cozetta/i],
  ['heel', /heel|pump|slingback|stiletto|kitten|d'orsay|dorsay/i],
  ['flat', /ballet|ballerina|flat|mary jane/i],
  ['oxford', /oxford|derby|brogue|lace-up shoe|laced shoe|boat shoe/i],
  ['loafer', /loafer|moccasin|driver|penny|tassel/i],
  ['boot', /boot|bootie|chelsea|chukka|combat/i],
  ['sneaker', /sneaker|trainer|runner|running|air max|air force|ultraboost|court|platform/i],
]
export const shoeTypeOf = (name = '') => typeRules.find(([, re]) => re.test(name))?.[0] || 'sneaker'

const shapes = {
  sneaker: (c) => (
    <>
      <path d="M38 262C38 246 60 242 90 242L232 242C258 242 268 254 268 264C268 274 258 280 244 280L60 280C46 280 38 274 38 262Z" fill={c.sole} />
      <path d="M48 246L50 190C50 178 58 170 70 168L108 160C122 150 128 132 140 120C148 112 162 112 172 118C190 130 208 158 236 172C256 182 266 200 266 226L266 246Z" fill={c.body} />
      <path d="M200 165C228 175 258 190 266 226L266 246L214 246C216 214 214 190 200 165Z" fill={c.dark} />
      <path d="M52 200L96 196L100 246L50 246Z" fill={c.dark} opacity=".55" />
      <g stroke={c.lace} strokeWidth="5" strokeLinecap="round"><path d="M138 128L160 148" /><path d="M150 118L174 140" /><path d="M126 138L146 156" /></g>
    </>
  ),
  boot: (c) => (
    <>
      <path d="M44 270L44 254L262 254C268 254 270 262 268 270L262 280L50 280C46 280 44 276 44 270Z" fill={c.sole} />
      <path d="M44 254H84V280H44Z" fill={c.dark} />
      <path d="M66 62L138 62L142 158C160 168 210 172 246 196C262 206 268 226 266 254L52 254L58 170Z" fill={c.body} />
      <path d="M66 62L138 62L139 82L65 82Z" fill={c.dark} opacity=".6" />
      <path d="M170 176C204 184 244 200 262 222" stroke={c.dark} strokeWidth="4" fill="none" opacity=".6" />
    </>
  ),
  loafer: (c) => (
    <>
      <path d="M42 270C42 262 52 258 66 258L236 258C256 258 268 262 268 270C268 278 256 282 240 282L62 282C50 282 42 278 42 270Z" fill={c.dark} />
      <path d="M52 258L54 214C54 200 66 194 82 194L128 190C150 188 168 200 190 210C222 222 262 232 266 258Z" fill={c.body} />
      <path d="M118 192C128 214 132 236 130 258" stroke={c.dark} strokeWidth="14" fill="none" strokeLinecap="round" opacity=".7" />
      <ellipse cx="152" cy="222" rx="14" ry="7" fill={c.dark} opacity=".7" />
    </>
  ),
  oxford: (c) => (
    <>
      <path d="M42 270C42 262 52 258 66 258L236 258C256 258 268 262 268 270C268 278 256 282 240 282L62 282C50 282 42 278 42 270Z" fill={c.dark} />
      <path d="M52 258L54 210C54 196 66 190 82 190L118 188C140 176 176 190 196 208C226 222 262 232 266 258Z" fill={c.body} />
      <path d="M200 214C226 224 254 234 264 256L232 258C230 240 218 226 200 214Z" fill={c.dark} opacity=".5" />
      <g stroke={c.lace} strokeWidth="5" strokeLinecap="round"><path d="M112 194L142 210" /><path d="M104 206L134 222" /><path d="M98 220L126 236" /></g>
    </>
  ),
  heel: (c) => (
    <>
      <path d="M70 196C66 214 70 232 82 244C118 262 190 282 260 292L262 286C232 272 190 258 156 240C126 224 108 210 100 198Z" fill={c.body} />
      <path d="M70 196C68 204 68 210 70 218L96 214C92 208 92 202 100 198Z" fill={c.dark} opacity=".5" />
      <path d="M82 244C118 262 190 282 260 292" stroke={c.dark} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M82 246L104 254L94 300L86 300Z" fill={c.dark} />
    </>
  ),
  flat: (c) => (
    <>
      <path d="M50 274C50 268 60 266 80 266L236 266C256 266 268 270 268 276L266 280L50 280Z" fill={c.dark} />
      <path d="M50 268C50 240 76 228 104 232C126 220 150 226 170 236C210 240 252 252 264 270L264 272L50 272Z" fill={c.body} />
      <ellipse cx="96" cy="238" rx="24" ry="9" fill={c.dark} opacity=".6" />
      <circle cx="196" cy="250" r="9" fill={c.dark} opacity=".7" />
    </>
  ),
  sandal: (c) => (
    <>
      <path d="M40 272C40 262 100 258 160 260C212 262 262 266 266 276C268 286 222 290 160 290C96 291 40 286 40 272Z" fill={c.sole} />
      <path d="M80 264C86 220 130 216 138 262" stroke={c.body} strokeWidth="15" fill="none" strokeLinecap="round" />
      <path d="M150 262C156 224 196 222 206 264" stroke={c.body} strokeWidth="15" fill="none" strokeLinecap="round" />
    </>
  ),
  slipper: (c) => (
    <>
      <path d="M46 274C46 214 96 196 150 200C196 204 222 232 262 246C270 252 268 274 262 278L52 278C48 278 46 276 46 274Z" fill={c.body} />
      <path d="M46 268H266V284Q266 288 260 288H52Q46 288 46 284Z" fill={c.dark} />
      <g fill={c.light}>{[62, 84, 106, 128, 150, 172].map((x, i) => <circle key={x} cx={x} cy={228 - Math.abs(i - 2) * 6 + i * 2} r="12" />)}</g>
    </>
  ),
}

export default function ShoeArt({ name, color }) {
  const type = shoeTypeOf(name)
  const body = bodyColor(color)
  const family = productColorFamily(color)
  const c = {
    body,
    dark: shade(body, -0.3),
    light: shade(body, 0.35),
    sole: type === 'sandal' || type === 'sneaker' ? (family === 'white' ? '#d9d4ca' : '#f1ece3') : shade(body, -0.35),
    lace: family === 'black' ? '#e9e5dc' : '#ffffff',
    line: shade(body, family === 'white' ? -0.18 : -0.45),
  }
  return (
    <svg viewBox="0 0 300 375" className="h-full w-full" role="img" aria-label={`${color ? `${color} ` : ''}${type} illustration`} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="shoe-bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6f3ee" /><stop offset="1" stopColor="#e9e4db" /></linearGradient>
      </defs>
      <rect width="300" height="375" fill="url(#shoe-bg)" />
      <ellipse cx="152" cy="302" rx="118" ry="9" fill="#000" opacity=".1" />
      <g transform="translate(-34 -60) scale(1.2)" stroke={c.line} strokeWidth="2.2" strokeLinejoin="round">{shapes[type](c)}</g>
      <text x="150" y="350" textAnchor="middle" fontSize="8" letterSpacing="1.6" fill="#8b857a" fontFamily="system-ui, sans-serif">ILLUSTRATION</text>
    </svg>
  )
}
