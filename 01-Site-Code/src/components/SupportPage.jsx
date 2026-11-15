import { Link } from 'react-router-dom'

// Shared layout for the customer-care pages (FAQs, delivery and returns, accessibility): a centered
// serif title, then questions grouped under small-caps headings, each opening like a drawer.
export function Faq({ q, a, link, children }) {
  return (
    <details className="group border-b border-neutral-200">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[15px] font-medium marker:content-none">
        {q}
        <span className="shrink-0 text-xl leading-none text-neutral-400 transition group-open:rotate-45" aria-hidden="true">+</span>
      </summary>
      <div className="pb-5 pr-8 text-sm leading-6 text-neutral-600">
        {a && <p>{a}{link && <> <Link to={link[0]} className="text-black underline underline-offset-4">{link[1]}</Link>.</>}</p>}
        {children}
      </div>
    </details>
  )
}

export function FaqGroup({ title, items }) {
  return (
    <div className="mt-12">
      <h3 className="text-[11px] font-semibold uppercase tracking-[.2em] text-neutral-950">{title}</h3>
      <div className="mt-2 border-t border-neutral-300">{items.map((item) => <Faq key={item.q} {...item} />)}</div>
    </div>
  )
}

export default function SupportPage({ eyebrow = 'Customer care', title, intro, groups, children }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 lg:px-8 lg:py-20">
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[.22em] text-neutral-500">{eyebrow}</p>
        <h1 className="mt-3 text-3xl sm:text-4xl">{title}</h1>
        {intro && <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-neutral-600">{intro}</p>}
      </div>
      {children}
      {groups.map((group) => <FaqGroup key={group.title} {...group} />)}
    </section>
  )
}
