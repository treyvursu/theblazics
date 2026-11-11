# theblazics.com

The Blazic Collective website. Monticello, Indiana. Static HTML, CSS and JS. Editing rules for people and Claude are in `CLAUDE.md`.

## How it runs

| Piece | Where |
|---|---|
| Code | GitHub, `treyvursu/theblazics` (public. Everything in it is already public on the site) |
| Hosting | Vercel, project `theblazics` in the Vursu team (Pro) |
| Config | `vercel.json` (output folder, clean URLs, headers) |
| Domain | Registered at Namecheap. DNS at Namecheap: A `@` and CNAME `www` point to Vercel |
| Redirects | `www.theblazics.com` and `http://` go to `https://theblazics.com` (set in Vercel) |
| Email | `hello@theblazics.com` via Namecheap Redirect Email |

Every push to `main` deploys to production in about a minute. Other branches get a Vercel preview URL.

## Run it locally

```bash
npx serve public
```

Then open the URL it prints. Clean URLs like `/bakes` work the same as on Vercel.

## Pages

| File | URL | Logo |
|---|---|---|
| `public/index.html` | `/` | BC logo in header |
| `public/about.html` | `/about` | BC logo in header |
| `public/bakes.html` | `/bakes` | `blazic-bakes.webp` |
| `public/handmade.html` | `/handmade` | `blazic-handmade.webp` |
| `public/gift-wrap.html` | `/gift-wrap` | `blazic-gift-wrap.webp` |

Photo direction from the brand guide: natural light, warm whites, hands in frame doing the work, flat lay on white or kraft paper, no heavy filters.

## Search setup

1. Google Search Console: add the domain, verify by DNS at Namecheap, submit `https://theblazics.com/sitemap.xml`.
2. Bing Webmaster Tools: import from Search Console. Bing feeds ChatGPT and Copilot search.
3. Google Business Profile as a service-area business in Monticello, IN, with the address hidden.

## Still to fill in

See "Open items" in `CLAUDE.md`.
