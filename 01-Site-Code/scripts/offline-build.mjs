// Build for the "offline" branch only: instead of the real site, publish a single
// "coming soon" page that search engines are told not to index. The real site lives on
// the main branch; deploy main again (and purge the CDN cache) to go live.
import { mkdirSync, writeFileSync } from 'node:fs'

const page = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow, noarchive" />
    <meta name="theme-color" content="#1C1711" />
    <title>Fits Me Right — Coming soon</title>
    <style>
      html, body { height: 100%; margin: 0; }
      body { display: flex; align-items: center; justify-content: center; background: #1C1711; color: #fff; font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 24px; box-sizing: border-box; }
      .eyebrow { font-size: 12px; letter-spacing: .24em; text-transform: uppercase; color: #E4B62F; font-weight: 800; }
      h1 { font-size: clamp(36px, 8vw, 72px); line-height: 1; margin: 20px 0 0; letter-spacing: -.03em; font-weight: 900; }
      p { margin: 24px auto 0; max-width: 32rem; font-size: 18px; line-height: 1.6; color: rgba(255,255,255,.72); }
    </style>
  </head>
  <body>
    <main>
      <div class="eyebrow">Your fashion concierge</div>
      <h1>Fits Me Right</h1>
      <p>We are getting things ready. Please check back soon.</p>
    </main>
  </body>
</html>
`

mkdirSync('dist', { recursive: true })
writeFileSync('dist/index.html', page)
writeFileSync('dist/robots.txt', 'User-agent: *\nDisallow: /\n')
console.log('Wrote the coming-soon page to dist/ (offline build)')
