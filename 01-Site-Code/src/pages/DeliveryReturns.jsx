import SupportPage from '../components/SupportPage'

const groups = [
  {
    title: 'Delivery',
    items: [
      { q: 'Who ships my order?', a: 'The store you buy from. Fits Me Right never takes an order, holds stock or ships anything. Every “View at” button opens the item on the store’s own website, and the store handles checkout, payment and delivery.' },
      { q: 'How long will delivery take, and what will it cost?', a: 'That is set by each store and shown at its checkout, usually before you pay. Times and prices differ by store, item and where you live.' },
      { q: 'Can I get something today?', a: 'Some stores offer same-day delivery or pickup. Our Need It Fast page shows which ones and how to order, and is honest about what is realistic for your deadline.', link: ['/fast', 'See Need It Fast'] },
      { q: 'How do I track an order?', a: 'Use the confirmation email the store sent you. It normally has a tracking link, or a number you can enter on the store’s site.' },
    ],
  },
  {
    title: 'Returns and exchanges',
    items: [
      { q: 'How do I return or exchange something?', a: 'Through the store you bought it from, on its own returns page or by contacting its customer service. Return windows, fees and conditions differ from store to store, so it is worth reading them before you buy.' },
      { q: 'Where do I find a store’s shipping and returns policy?', a: 'Most stores link it at the bottom of their website. Open the item with its “View at” button, then scroll to the footer.' },
      { q: 'An item arrived damaged or wrong. What now?', a: 'Contact the store first, with your order number. We can’t change an order, but if a listing on our site seems unreliable, we want to hear about it.', link: ['/contact', 'Contact us'] },
    ],
  },
  {
    title: 'Before you buy',
    items: [
      { q: 'The store’s price or stock is different from what Fits Me Right shows.', a: 'Prices and stock change all the time. Each card shows the date we read the price, and the store always has the final, live price. If we’re out of date, please tell us.', link: ['/contact', 'Contact us'] },
      { q: 'How do I pick the right size?', a: 'Check the store’s own size chart on the item page. Our Fit Guide collects stylist tips by body type, and in your Look Book you can note the size you chose and how it fit.', link: ['/fit-guide', 'Open the Fit Guide'] },
    ],
  },
]

export default function DeliveryReturns() {
  return (
    <SupportPage
      title="Delivery & returns."
      intro="Fits Me Right helps you find and compare. The store you choose sells, ships and takes returns, so this page explains where to look and what to ask."
      groups={groups}
    />
  )
}
