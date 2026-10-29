// Plain-language policy pages. Every statement here describes how the site actually works today
// (no accounts, no analytics, no cookies of our own, live web search through SerpApi); if the
// code changes in any of those ways, update this file in the same change.

export const LEGAL_UPDATED = 'October 28, 2026'
export const CONTACT_EMAIL = 'hello@fitsmeright.com'
// Who runs the site (a person's name or a registered business name, plus a city/state). Left empty
// until the owner decides; the terms show a "Who runs Fits Me Right" section as soon as it is set.
export const OPERATOR_NAME = ''

export const legalPages = {
  privacy: {
    eyebrow: 'Privacy',
    title: 'Your privacy, in plain words.',
    intro: 'Fits Me Right is a place to find clothes. You don’t need an account, we don’t run ads, and we don’t sell information about you. Here is exactly what happens to your information.',
    sections: [
      {
        h: 'The short version',
        list: [
          'No account, sign-up, or password.',
          'No advertising, no tracking pixels, and no analytics tools on the site today.',
          'We don’t set cookies of our own.',
          'We don’t sell or rent information about you.',
        ],
      },
      {
        h: 'What stays on your own device',
        p: ['Your wishlist and any saved style profiles (the name you give a profile, plus the choices in it) are kept in your browser’s storage on this device. They are never sent to us, so we can’t see them and can’t recover them. Clearing your browser data, or using another device, clears them.',
          'The site also keeps a one-time note in your browser for the current visit, so it can refresh itself once after we publish an update.'],
      },
      {
        h: 'What our servers receive',
        p: ['Like any website, the companies that host Fits Me Right receive the standard details of each request: your IP address, your browser and device type, and which page or file was requested. Our website is hosted by Kinsta and our product data comes from a server hosted on Heroku. They may keep ordinary server logs for security and to keep things running. We don’t use those logs to build profiles of visitors.'],
      },
      {
        h: 'What you search for',
        p: ['Searching the catalog happens in your browser, against product data the page has already downloaded. Those searches are not sent to us.',
          'If you search for something the catalog doesn’t cover well, the site may run a live web search. When it does, the words you typed are sent to our server, which asks SerpApi (a search-results service) for Google Shopping results. We keep a copy of those words and the results so repeat searches are quick, and refresh it after about a week. We don’t attach your name or any account to it. Please don’t type personal details into the search box.'],
      },
      {
        h: 'Other companies you meet along the way',
        list: [
          'Product photos load straight from the retailers’ own servers (and thumbnails in live web results from Google’s), so they can see your IP address and browser. Your browser is asked not to tell them which page you were on.',
          'When you click through to a store, Google Shopping, DoorDash, Google Maps or any other site, you leave Fits Me Right and that site’s own privacy policy applies. We don’t handle payments and never see your card details.',
        ],
      },
      {
        h: 'Children',
        p: ['Fits Me Right isn’t aimed at children under 13, and we don’t knowingly collect personal information from them. The site lists children’s clothing for parents and guardians to shop.'],
      },
      {
        h: 'Your choices',
        p: ['You can clear your wishlist and profiles at any time from the site, or by clearing your browser’s site data. To ask a question about this page, write to us at the address below.'],
      },
      {
        h: 'If this changes',
        p: ['If we add accounts, analytics, advertising or anything else that changes what is described here, we will update this page first and change the date at the top.'],
      },
    ],
  },

  terms: {
    eyebrow: 'Terms of use',
    title: 'The ground rules.',
    intro: 'These terms cover your use of Fits Me Right. By using the site you agree to them; if you don’t agree, please don’t use it.',
    sections: [
      {
        h: 'What Fits Me Right is',
        p: ['Fits Me Right is an independent site for discovering clothing. We don’t sell products, take orders or process payments. Every item links to the store that sells it, and any purchase is between you and that store.'],
      },
      ...(OPERATOR_NAME ? [{
        h: 'Who runs Fits Me Right',
        p: [`Fits Me Right is operated by ${OPERATOR_NAME}. You can reach us at ${CONTACT_EMAIL}.`],
      }] : []),
      {
        h: 'We are not the stores',
        p: ['We are not affiliated with, endorsed by or sponsored by the retailers or brands shown. Their names, logos and trademarks belong to them and appear only to show where an item is sold. Product photos and descriptions belong to the retailers.'],
      },
      {
        h: 'Prices, sizes and availability can change',
        p: ['Prices, sizes, colors and stock are snapshots taken on the date shown and can change without notice. The store’s own page always has the final price, size availability, shipping and return terms, so check there before you buy. We work hard to be accurate, but we can’t promise every listing is current or error-free.'],
      },
      {
        h: 'Style and fit suggestions',
        p: ['The Fit Guide, body-type options and recommendations are general styling suggestions drawn from published sources. They are opinions, not professional advice, and they won’t suit everybody. Sizing varies by brand, so always check a store’s own size chart.'],
      },
      {
        h: 'Delivery information',
        p: ['The “Need it fast” page points to same-day and pickup options offered by other companies. We don’t deliver anything ourselves, and what is available depends on your address and the store.'],
      },
      {
        h: 'Using the site fairly',
        list: [
          'Don’t copy or scrape the site’s catalog or content in bulk, or reuse our text, design or data commercially without asking.',
          'Don’t try to disrupt the site, overload it, or reach areas that aren’t meant for visitors.',
          'Don’t use automated tools to run large numbers of searches, which use up a shared monthly allowance.',
        ],
      },
      {
        h: 'Links to other sites',
        p: ['We link to sites we don’t control and aren’t responsible for their content, products, prices or policies.'],
      },
      {
        h: 'No warranty, and limits on our responsibility',
        p: ['The site is provided “as is” and “as available,” without promises about accuracy, availability or fitness for a particular purpose. To the fullest extent the law allows, Fits Me Right isn’t responsible for losses that result from using the site or relying on what is on it, including purchases made from other companies. Nothing here takes away rights you have under the law that can’t be waived.'],
      },
      {
        h: 'Changes',
        p: ['We may update these terms and the site from time to time. The date at the top shows when this page last changed, and continuing to use the site means you accept the current version.'],
      },
    ],
  },

  disclosures: {
    eyebrow: 'How our listings work',
    title: 'What you’re looking at.',
    intro: 'A few plain facts about where the products come from, how current they are, and what we do and don’t earn. We’d rather you know.',
    sections: [
      {
        h: 'We don’t earn money from your clicks or purchases',
        p: ['Today Fits Me Right earns nothing when you click a link or buy something, and no store pays to be listed or ranked higher. If that ever changes, for example by adding affiliate links, we will mark those links clearly and update this page before it does.'],
      },
      {
        h: 'Where the products come from',
        p: ['About three in four listings are real products collected from stores’ own public product pages and product feeds: the item name, price, color, photo and the link to the exact product page. A smaller number were checked by hand against the store’s site.',
          'The rest, roughly one in four, are sample listings. They show a drawn illustration instead of a photo, the name and price are examples of what that store typically sells, and the card says “Shop this look.” They are not a specific item we know is in stock, and they open the store’s search so you can find the real thing. Sample listings are hidden by default; the shop offers them when a search finds few real items, and you can turn them on in its filters. Stores such as Bergdorf Goodman that don’t allow automated reading of their site are listed as a place to search, without products from them.'],
      },
      {
        h: 'Dates and prices',
        p: ['On a real listing, the price is a snapshot taken on the date shown on the card (“price as of” a date), not a live price. On a sample listing (when you choose to show them) the price is labeled “example price,” because it is a typical price rather than one we read from the store. Stores change prices and sell out of sizes without telling us, so the store’s page decides the final price and what’s in stock. We refresh the catalog from time to time, but not minute by minute.'],
      },
      {
        h: 'What “Verified retailer item” means',
        p: ['It means the link goes to that item’s own page at the store, and that we read the price and photo from the store on the date shown. “Shop this look” means we haven’t confirmed an exact page yet, so the link opens that store’s search for the item instead.'],
      },
      {
        h: 'Photos',
        p: ['Product photos are loaded from the retailers’ own websites. If a store removes a photo, we show our own illustration in its place.'],
      },
      {
        h: 'Body types, sizes and fit',
        p: ['Stores don’t publish which body type an item suits, so for items collected from stores, every body type for that collection is listed and the body-type filter doesn’t narrow them. Sizes are the ones the store listed on the date shown; some listings have none. Use the Fit Guide for ideas, and the store’s size chart for fit.'],
      },
      {
        h: 'The Fit Guide',
        p: ['The Fit Guide summarizes published styling advice, names its sources, and says where they disagree. It is opinion, not science. Some of the guides are several years old.'],
      },
      {
        h: 'Spotted a mistake?',
        p: ['Tell us about a broken link, a wrong price or an item that’s no longer sold, and we’ll fix it.'],
      },
    ],
  },
}
