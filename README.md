# rshibak.com

Rashil Shibakoti's personal site. React + TypeScript + Vite, hosted on Cloudflare Workers
(static assets plus a small Worker for the contact form).

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server. Pages work; the contact form shows its error state because there is no API here. |
| `npm run build` | Type-checks the site and the Worker, builds to `dist/`, then writes one HTML file per page plus `sitemap.xml` (`scripts/prerender.mjs`). |
| `npm run preview:worker` | Builds, then runs the real Worker locally with `wrangler dev` (contact form included; emails are written to `.wrangler/tmp/email/` instead of being sent). |
| `npm run og-image` | Re-renders `public/og-image.png` and the favicons from `scripts/*.html` with local Chrome. |

## Deploying

Cloudflare Workers Builds deploys automatically on every push to `main`
(build command `npm run build`, deploy command `npx wrangler deploy`, which reads `wrangler.jsonc`).

## Pages and routing

Real paths: `/`, `/work`, `/about`, `/contact`, `/privacy`, `/thank-you`. Each page has its own
HTML file in `dist/` with its title, description, canonical URL, and social tags already in the
`<head>`. Metadata lives in `src/siteMeta.json`. Unknown paths get `dist/404.html` with a real 404
status. Old `#/work`-style links redirect to the new paths.

## Contact form setup (one time, in the Cloudflare dashboard)

The form posts to `/api/contact` (`worker/index.ts`), which emails the message to
rashil9955@gmail.com through **Cloudflare Email Routing's `send_email` binding**. It's free and
needs no API keys, but Email Routing must be enabled on the domain and the Gmail address verified.
Until then, the form shows an error and nothing claims to be delivered.

1. Cloudflare dashboard → **rshibak.com** → **Email** → **Email Routing**.
2. Enable it / click **Fix DNS records** and let Cloudflare add its records. rshibak.com currently
   has no MX record and an SPF record of `v=spf1 -all` (meaning "this domain sends no mail");
   Cloudflare replaces that with its own MX and SPF records.
3. **Destination addresses** → add `rashil9955@gmail.com`, then click the link in the
   verification email Cloudflare sends.
4. Optional but recommended: **Routing rules** → create `r@rshibak.com` → send to
   `rashil9955@gmail.com`. That's the address shown on the Contact page, and it can't receive
   mail until a rule like this exists.
5. Push to `main` (or redeploy). Then send yourself a test message from https://rshibak.com/contact.
   The first one may land in Gmail's Spam folder; mark it "Not spam".

Spam protection: hidden honeypot field, a minimum fill time, an Origin check, server-side validation
(shared with the browser in `src/contactValidation.ts`), and a Workers rate limit of 3 submissions
per minute per IP (`ratelimits` in `wrangler.jsonc`). Message contents are never logged.

## Google Analytics 4 (optional)

Off until a measurement ID is configured. When on, it only loads after the visitor clicks "Sure" in
the consent banner, and only sends page views plus two events (`cta_click`,
`contact_form_submit_success` / `contact_form_submit_error`, with no names, emails, or message text).

1. In Google Analytics, create a GA4 property and a **Web** data stream for `https://rshibak.com`.
   Copy its **Measurement ID** (`G-XXXXXXXXXX`).
2. Cloudflare dashboard → Workers & Pages → **rashil-portfolio-website** → **Settings** →
   **Builds** → **Variables and secrets** → add `VITE_GA_MEASUREMENT_ID` = your ID.
   This is a *build* variable (Vite bakes it into the page at build time). It's a public ID,
   not a secret.
3. Trigger a new deploy (push a commit, or **Deployments** → retry the latest build).
4. Verify: open the site, accept the banner, and watch **Reports → Realtime** in GA4.
   For **Admin → DebugView**, run locally with
   `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run dev` (development builds set `debug_mode`),
   or use the Google Analytics Debugger browser extension on the live site.

## Adding testimonials

Add real quotes, shared with permission and in the person's own words, to
`src/testimonials.ts`. The "Kind Words" section on the Work page appears automatically once the
list isn't empty.

## Adding a photo

Save a real photo as `src/assets/rashil.jpg` (about 800px on the long side) and follow the
comment in `src/profilePhoto.ts`. It appears beside the intro on the About page.
