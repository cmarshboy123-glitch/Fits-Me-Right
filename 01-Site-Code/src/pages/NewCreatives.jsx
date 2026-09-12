import { ArrowRight, Leaf, MapPin, Pause, Play, Scissors, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const designers = [
  {
    name: 'Amara Osei', studio: 'Maison Osei', location: 'Accra · Brooklyn', discipline: 'Ready-to-wear',
    bio: 'Architectural tailoring softened by movement, made in small runs with an exacting eye for how a garment feels on different bodies.',
    pointOfView: 'A strong silhouette should make room for the person inside it.',
    image: '/assets/unique/creative-amara-spotlight-v1.webp', imageAlt: 'Black independent designer draping cocoa satin in her studio',
    piece: 'Sculpted Evening Gown', price: '$485', material: 'Deadstock satin · made to order',
  },
  {
    name: 'Nami Kuroda', studio: 'Nami Atelier', location: 'Osaka · Los Angeles', discipline: 'Jewelry',
    bio: 'Sculptural accessories inspired by ocean forms, hand-finished in recycled metals and natural pearl with an emphasis on quiet asymmetry.',
    pointOfView: 'Adornment can be intimate, useful, and a little unexpected.',
    image: '/assets/unique/creative-nami-spotlight-v1.webp', imageAlt: 'Japanese independent jewelry designer working at her metalsmith bench',
    piece: 'Tide Pearl Drop Pair', price: '$380', material: 'Recycled silver · natural pearl',
  },
  {
    name: 'Theo Arceneaux', studio: 'Arc Studio', location: 'New Orleans', discipline: 'Gender-open essentials',
    bio: 'Workwear codes, relaxed proportions, and responsible natural fibers come together in clothes designed to be shared, repaired, and lived in.',
    pointOfView: 'The most sustainable favorite is the one you keep reaching for.',
    image: '/assets/unique/creative-theo-spotlight-v1.webp', imageAlt: 'Black independent designer checking an overshirt in his New Orleans studio',
    piece: 'The Workshop Overshirt', price: '$210', material: 'Washed cotton hemp · small batch',
  },
]

const principles = [
  { icon: Scissors, title: 'Original practice', copy: 'A clear design language, thoughtful construction, and work that adds something new.' },
  { icon: Leaf, title: 'Responsible scale', copy: 'Small runs, transparent materials, repair-minded making, or a credible path toward better production.' },
  { icon: Sparkles, title: 'A wider fashion story', copy: 'Independent voices across cultures, identities, disciplines, geographies, sizes, and price points.' },
]

const runwayDispatches = [
  {
    city: 'New York',
    edition: 'Downtown / 05:42 PM',
    title: 'Independent silhouettes in motion.',
    copy: 'A warm late-day runway study shaped by downtown loft light, decisive tailoring, and a cast that reflects the city.',
    image: '/assets/creative-new-york-runway-v1.webp',
    position: 'center center',
  },
  {
    city: 'Vietnam',
    edition: 'Ho Chi Minh City / 06:18 PM',
    title: 'New texture at blue hour.',
    copy: 'Contemporary Vietnamese fashion energy meets fluid form, tropical architecture, and a global independent runway.',
    image: '/assets/creative-vietnam-runway-v1.webp',
    position: 'center center',
  },
]

export default function CreativeCorner() {
  return (
    <>
      <section className="border-b border-black bg-[#1C1711] text-white">
        <div className="mx-auto grid max-w-[1440px] lg:grid-cols-[1.05fr_.95fr]">
          <div className="flex min-h-[590px] flex-col justify-center px-5 py-20 lg:px-12 lg:py-28">
            <p className="text-xs font-black uppercase tracking-[.24em] text-gold-300">Creative Corner · Independent fashion</p>
            <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[.94] tracking-[-.045em] sm:text-7xl">The ideas shaping what we wear next.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/75">A living directory and editorial spotlight for independent designers—who they are, what they make, and why their point of view matters.</p>
            <div className="mt-10 flex flex-wrap gap-3"><a href="#spotlights" className="flex min-h-12 items-center gap-3 bg-[#D3A11E] px-6 text-xs font-black text-black">MEET THE DESIGNERS <ArrowRight size={16} /></a><a href="#selection" className="flex min-h-12 items-center border border-white/40 px-6 text-xs font-black">HOW WE CURATE</a></div>
          </div>
          <div className="relative min-h-[480px] overflow-hidden border-t border-white/20 lg:border-l lg:border-t-0"><img src="/assets/unique/creative-cover-amara-v1.webp" alt="Independent Black designer directing a fitting in her atelier" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-7 pt-28"><p className="text-[10px] font-black uppercase tracking-[.22em] text-gold-300">Current cover story</p><p className="mt-2 text-2xl font-black">Amara Osei builds clothes around movement.</p></div></div>
        </div>
      </section>

      <section className="border-b border-black bg-[#F3E8D4]"><div className="mx-auto grid max-w-[1440px] grid-cols-2 md:grid-cols-4">{[['03', 'Studios in this edition'], ['03', 'Cities represented'], ['03', 'Design disciplines'], ['Quarterly', 'New editorial rotation']].map(([value, label]) => <div key={label} className="border-r border-t border-black p-6 last:border-r-0 md:border-t-0 lg:p-8"><p className="text-3xl font-black">{value}</p><p className="mt-2 text-xs font-bold uppercase tracking-wider text-neutral-600">{label}</p></div>)}</div></section>

      <section className="border-b border-black bg-[#17130E] px-4 py-16 text-white lg:px-8 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-5 border-b border-white/25 pb-8 md:flex-row md:items-end">
            <div><p className="text-xs font-black uppercase tracking-[.22em] text-gold-300">Runway dispatches</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">A few seconds from somewhere new.</h2></div>
            <p className="max-w-md text-sm leading-6 text-white/65">Short original motion studies from fashion cities around the world—an atmospheric glimpse, never the whole story.</p>
          </div>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {runwayDispatches.map((dispatch, index) => <RunwaySnippet key={dispatch.city} dispatch={dispatch} index={index} />)}
          </div>
        </div>
      </section>

      <section id="spotlights" className="mx-auto max-w-[1440px] px-4 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-5 border-b border-black pb-8 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[.22em] text-[#A97800]">Edition 01</p><h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Three makers to know.</h2></div><p className="max-w-md text-sm leading-6 text-neutral-600">Selected for distinctive craft, responsible scale, and a point of view that expands the fashion conversation.</p></div>
        <div className="divide-y divide-black">{designers.map((designer, index) => <article key={designer.name} className="grid gap-8 py-12 md:grid-cols-[minmax(260px,.8fr)_1.2fr] md:gap-14 lg:py-16"><div className={`aspect-[4/5] overflow-hidden bg-neutral-100 ${index % 2 ? 'md:order-2' : ''}`}><img src={designer.image} alt={designer.imageAlt} className="h-full w-full object-cover transition duration-700 hover:scale-[1.02]" /></div><div className={`flex flex-col justify-center ${index % 2 ? 'md:order-1' : ''}`}><div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] font-black uppercase tracking-[.18em] text-neutral-500"><span>Spotlight {String(index + 1).padStart(2, '0')}</span><span className="h-1 w-1 rounded-full bg-[#D3A11E]" /><span>{designer.discipline}</span></div><h3 className="mt-4 text-4xl font-black tracking-tight">{designer.name}</h3><p className="mt-1 text-lg font-bold text-[#A97800]">{designer.studio}</p><p className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500"><MapPin size={14} />{designer.location}</p><p className="mt-7 max-w-xl text-lg leading-8 text-neutral-700">{designer.bio}</p><blockquote className="mt-8 border-l-4 border-[#D3A11E] pl-5 text-xl font-bold leading-8">“{designer.pointOfView}”</blockquote><div className="mt-8 grid gap-4 border-y border-neutral-300 py-5 sm:grid-cols-2"><div><p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Featured piece</p><p className="mt-2 font-bold">{designer.piece} · {designer.price}</p></div><div><p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Material note</p><p className="mt-2 font-bold">{designer.material}</p></div></div></div></article>)}</div>
      </section>

      <section id="selection" className="border-y border-black bg-[#FFF8EC] px-4 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-[1440px]"><p className="text-xs font-black uppercase tracking-[.22em] text-[#A97800]">Our editorial standard</p><h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">How a studio earns a place in the corner.</h2><div className="mt-10 grid border border-black md:grid-cols-3">{principles.map(({ icon: Icon, title, copy }, index) => <article key={title} className="border-b border-black p-7 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:p-9"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D3A11E]"><Icon size={20} /></div><p className="mt-7 text-[10px] font-black uppercase tracking-[.2em] text-neutral-500">0{index + 1}</p><h3 className="mt-2 text-2xl font-black">{title}</h3><p className="mt-4 leading-7 text-neutral-600">{copy}</p></article>)}</div></div></section>

      <section className="bg-[#D3A11E] px-4 py-16 lg:px-8 lg:py-20"><div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="text-xs font-black uppercase tracking-[.22em]">For independent studios</p><h2 className="mt-3 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">Your work belongs in the wider fashion conversation.</h2><p className="mt-5 max-w-2xl leading-7">Creative Corner will grow through studio submissions, community nominations, and independent editorial research.</p></div><Link to="/shop?market=Everyday+%26+Designer" className="flex min-h-12 shrink-0 items-center gap-3 bg-black px-6 text-xs font-black text-white">EXPLORE INDEPENDENT DESIGN <ArrowRight size={16} /></Link></div></section>
    </>
  )
}

function RunwaySnippet({ dispatch, index }) {
  const [paused, setPaused] = useState(false)

  return (
    <article className="border border-white/25 bg-black">
      <div className={`runway-snippet relative aspect-[16/10] overflow-hidden ${paused ? 'is-paused' : ''}`}>
        <img src={dispatch.image} alt={`Original fashion runway scene inspired by ${dispatch.city}`} style={{ objectPosition: dispatch.position }} className={`runway-snippet-image runway-snippet-image-${index + 1} absolute inset-0 h-full w-full object-cover`} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/5 to-black/20" />
        <div className="runway-scan absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 text-[9px] font-black uppercase tracking-[.22em]">
          <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#E4B62F] shadow-[0_0_12px_#E4B62F]" /> Creative Corner Film</span>
          <span>0{index + 1} / 02</span>
        </div>
        <button type="button" onClick={() => setPaused((value) => !value)} aria-label={`${paused ? 'Play' : 'Pause'} ${dispatch.city} runway snippet`} className="absolute right-4 top-12 grid h-11 w-11 place-items-center rounded-full border border-white/50 bg-black/40 backdrop-blur-sm transition hover:bg-[#D3A11E] hover:text-black">
          {paused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
        </button>
        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
          <p className="text-[9px] font-black uppercase tracking-[.23em] text-gold-300">{dispatch.edition}</p>
          <h3 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">{dispatch.title}</h3>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20"><span className="runway-progress block h-full bg-[#D3A11E]" /></div>
      </div>
      <div className="flex items-start justify-between gap-5 border-t border-white/25 p-5 sm:p-6">
        <div><p className="text-lg font-black">{dispatch.city}</p><p className="mt-2 max-w-lg text-sm leading-6 text-white/60">{dispatch.copy}</p></div>
        <span className="shrink-0 text-[9px] font-black uppercase tracking-[.2em] text-white/45">Silent loop</span>
      </div>
    </article>
  )
}
