import { ArrowRight, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CONTACT_EMAIL, LEGAL_UPDATED, legalPages } from '../data/legalPages'

const pageLinks = [
  ['privacy', 'Privacy', '/privacy'],
  ['terms', 'Terms of use', '/terms'],
  ['disclosures', 'How our listings work', '/disclosures'],
]

export default function Legal({ page }) {
  const content = legalPages[page]

  return (
    <section className="mx-auto max-w-3xl px-4 py-14 lg:py-20">
      <p className="text-xs font-bold uppercase tracking-widest text-gold-700">{content.eyebrow}</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{content.title}</h1>
      <p className="mt-5 text-lg leading-8 text-neutral-600">{content.intro}</p>
      <p className="mt-3 text-xs font-bold uppercase tracking-wider text-neutral-400">Last updated {LEGAL_UPDATED}</p>

      <nav aria-label="Policies" className="mt-8 flex flex-wrap gap-2">
        {pageLinks.map(([key, label, to]) => (
          <Link key={key} to={to} aria-current={key === page ? 'page' : undefined} className={`flex min-h-11 items-center rounded-full px-5 text-sm font-bold transition ${key === page ? 'bg-black text-white' : 'border border-neutral-300 bg-white hover:border-black'}`}>{label}</Link>
        ))}
      </nav>

      <div className="mt-12 grid gap-10">
        {content.sections.map((section) => (
          <section key={section.h}>
            <h2 className="text-xl font-black tracking-tight">{section.h}</h2>
            {section.p?.map((text) => <p key={text} className="mt-3 leading-7 text-neutral-700">{text}</p>)}
            {section.list && (
              <ul className="mt-3 grid gap-2 leading-7 text-neutral-700">
                {section.list.map((item) => <li key={item} className="flex gap-3"><span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-600" />{item}</li>)}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="mt-14 rounded-[2rem] bg-gold-50 p-8">
        <h2 className="text-xl font-black">Questions about this page?</h2>
        <p className="mt-2 leading-7 text-neutral-700">Write to us and we&rsquo;ll answer as soon as we can.</p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="mt-5 inline-flex items-center gap-3 rounded-full bg-black px-6 py-3.5 text-sm font-black text-white"><Mail size={16} /> {CONTACT_EMAIL.toUpperCase()}</a>
      </div>

      <Link to="/help" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-neutral-700 hover:text-black">HELP &amp; CONTACT <ArrowRight size={15} /></Link>
    </section>
  )
}
