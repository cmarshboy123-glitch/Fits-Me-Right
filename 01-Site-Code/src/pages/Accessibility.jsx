import SupportPage from '../components/SupportPage'
import { CONTACT_EMAIL } from '../data/legalPages'

const groups = [
  {
    title: 'What we do',
    items: [
      { q: 'How the site is built to be usable', a: 'A “skip to main content” link appears at the top when you press Tab, and the menus, filters and forms are built from standard buttons and fields so they can be used with a keyboard. Buttons and links on phones are sized to be easy to tap, text can be enlarged in your browser, and several of the site’s animations switch off when your device asks for reduced motion.' },
      { q: 'Photos and images', a: 'Product photos carry a description made from the brand and item name. Decorative images are marked so screen readers skip them. Most product photos come from the stores themselves, so their quality and detail are out of our hands.' },
      { q: 'Forms and settings', a: 'Fields have visible labels, switches and buttons say what they do, and the cookie settings window can be closed with the Escape key.' },
    ],
  },
  {
    title: 'What we haven’t done',
    items: [
      { q: 'No independent audit yet', a: 'We have tested the site ourselves, on desktop and phone widths, but we have not had it formally audited, and we don’t claim it meets any specific accessibility standard. We would rather say so plainly and keep improving it.' },
      { q: 'Stores’ own websites', a: 'When you click through, you are on the store’s site, which has its own accessibility. We can’t change it, but the store’s customer service can help.' },
    ],
  },
  {
    title: 'Tell us what isn’t working',
    items: [
      { q: 'How do I report a problem or ask for help?', a: `Write to ${CONTACT_EMAIL} and tell us which page, what you were trying to do, and what got in the way. Mention any assistive technology you use if you’re happy to. We will use your report to fix the problem.`, link: ['/contact', 'Contact us'] },
    ],
  },
]

export default function Accessibility() {
  return (
    <SupportPage
      title="Accessibility."
      intro="Everyone should be able to find clothes that fit. This page says what we have done to make Fits Me Right easy to use, and what we haven’t."
      groups={groups}
    />
  )
}
