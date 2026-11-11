# The Blazic Collective website

Live at https://theblazics.com. Plain HTML, CSS and a little JavaScript. No framework, no build step, no dependencies. Based in Monticello, Indiana. Hosted on Vercel (project `theblazics`, Vursu team) from the GitHub repo `treyvursu/theblazics`. `vercel.json` holds the output folder, clean URLs and headers. Every push to `main` deploys to production in about a minute. Other branches get a preview URL.

Two people edit this repo with Claude: Trey and Brittani. Keep it simple enough that either one can ask for a change in plain English.

## This repo is public

Anyone can read every file and commit here. Never commit customer names, orders, phone numbers, home address, school names, passwords, API keys or anything else that isn't already meant for the public site. Keep that kind of information out of the repo entirely.

## Before every edit

1. `git pull` first. The other person may have pushed since your last session.
2. Make the change.
3. Check it locally if it touches layout (see "Run it locally").
4. Commit with a plain message that says what changed ("Update combo cookie to brown butter toffee").
5. Small content edits (prices, the weekly cookie, market dates, text fixes) go straight to `main`. Anything that changes layout, adds a page or touches more than a few lines of CSS goes on a branch. Share the preview link before merging.

Never add a framework, package, build step, tracking script or third-party embed without asking first.

## Where things live

```
public/              everything served on the site
  index.html         Home (/)
  bakes.html         Blazic Bakes (/bakes)
  handmade.html      Blazic Handmade (/handmade)
  gift-wrap.html     Blazic Gift Wrap (/gift-wrap)
  about.html         About (/about)
  404.html           Not found page
  css/styles.css     all styles; brand tokens at the top
  js/main.js         menu, scroll reveal, contact form
  fonts/             self-hosted Jost and Playfair Display
  assets/Logos/      logos (WebP) and og-image.jpg for link previews
  assets/images/     photos
  sitemap.xml, robots.txt, llms.txt
vercel.json          Vercel config
```

## Shared blocks: change them everywhere

These are copied into all six HTML files (the five pages plus 404.html). A change to one means the same change in all of them:

- Announcement bar (`.announce`)
- Header (menu button left on phones, BC logo center) and mobile menu
- Contact Us section (`#contact`) and its form: Name, Email, Message
- Footer

## Navigation

Desktop (1024px and up): Home, About Us, Blazic Bakes on the left of the header. BC logo in the center. Blazic Handmade, Blazic Gift Wrap and Contact on the right. There is no light/dark toggle; the site follows the visitor's system setting. Between 1024px and 1199px the header uses tighter spacing so the logo stays centered; check that width after adding a link.

Phone menu (the 3-line button, top left): Home, About Us, Blazic Bakes, Blazic Handmade, Blazic Gift Wrap, Contact. Contact points to `#contact` in both places (`/#contact` on the 404 page).

The current page's link gets `aria-current="page"` in both places.

## Links

Use clean, root-relative URLs: `/bakes`, `/handmade`, `/gift-wrap`, `/about`, `/#contact`. Never `bakes.html`. The host serves the `.html` file at the clean path.

## Common edits

**This week's combo cookie.** `public/bakes.html`, the `.highlight` block near the top. Update the `<h3>` (cookie name) and the `<p>` (what is in it).

**Prices.** Every product card has `<span class="price">$00</span>`. Replace `$00`. When a price is added, also add an `offers` price to that item in the page's JSON-LD block in `<head>`.

**Next holiday market.** `public/handmade.html`, the `.highlight--sage` block. Name, date, town, table number.

**Swapping in a photo.**
1. Resize to at most 1600px on the long edge. Save as `.webp` (quality around 80) in `public/assets/images/` with the file name the placeholder shows.
2. In the HTML, find the placeholder with that `data-image` path. Replace its inner `<div class="ph__inner">…</div>` with `<img src="/assets/images/<name>.webp" alt="What the photo shows" loading="lazy" width="W" height="H">`. Use the real pixel size for width and height.
3. Drop `loading="lazy"` only for the big banner photo at the top of a page.

**Instagram or Pinterest on the home page.** `public/index.html`, section `#follow` ("Follow Along"). Each has a ready-made icon block inside an HTML comment. Paste the profile link in place of `#`, remove the comment markers, and the icon appears next to Facebook. Also add the link to the footer icons, the contact sections and `sameAs` in the home page JSON-LD.

**FAQ.** `public/bakes.html`, section `#faq`, after "How ordering works". The visible questions and the `FAQPage` JSON-LD in `<head>` must match word for word. Edit both.

**Sitemap.** Adding a page means adding it to `public/sitemap.xml` and `public/llms.txt`. Update `<lastmod>` when a page changes meaningfully.

## SEO and AEO rules

- Every page needs a unique `<title>`, meta description, `<link rel="canonical">` and `og:url`, all using `https://theblazics.com` and the clean path.
- Every page has a JSON-LD block in `<head>`. Keep it true to what the page says. Never add facts to schema that are not visible on the page.
- One `<h1>` per page.
- Every image needs real `alt` text, plus `width` and `height`.
- Do not put the scroll-reveal class (`reveal`) on anything in the first screen of a page (the hero). It delays the largest element from showing and hurts load speed.

## Voice and copy

- Short sentences. Plain words. Warm, not cute.
- No em-dashes. No decorative colons. No buzzwords.
- "Piper" is the maker. "Brittani" runs operations. "We" is the collective.
- Sub-brand names: Blazic Bakes, Blazic Handmade, Blazic Gift Wrap. Never "Blazic Wrapped" or "Blazic Wrap".
- Location is "Monticello, Indiana" in body copy and "Monticello, IN" in page titles. Town only.
- Never publish a street address, Piper's school, or a last name beyond "Blazic" without both parents agreeing.

## Brand

Colors, type and spacing are tokens at the top of `public/css/styles.css`. Use the tokens, never raw hex values in new CSS. Logos are raster images with a paper background, so they always sit on a paper-colored panel. Each sub-brand logo appears only on its own page. Pages covering more than one line use the master lockup.

## Run it locally

```bash
npx serve public
```

Then open the URL it prints. Clean URLs like `/bakes` work the same as on Vercel.

## Open items

- My Fave Things page: planned, not built yet. When it is, add it to the phone menu after Contact, `sitemap.xml` and `llms.txt`.

- Instagram link (currently `#` and "@blazic (to add)"). Facebook is done: footer icon, contact list and `sameAs` in the home page Organization JSON-LD. Add Instagram to all three when it exists.
- Prices and product details on every card.
- Pickup times and place on `/bakes`.
- Higher-resolution logo exports (current files are about 600px wide and look soft on retina screens at full size).
- Contact form opens the visitor's email app addressed to hello@theblazics.com (which forwards to the business Gmail). To receive submissions directly, connect a form service such as Web3Forms: set the form's `action` and access key, remove `data-mailto`, in every page.
