# Owner stats dashboard

Owner request 2026-10-27: «لوحة تحكم ونشوف كم عدد زيارات العابنا وكم لاعب حاليا داخلها» — approved in full («كاملة»).

A Cloudflare Worker (`src/index.js`) with one SQLite Durable Object. The site's `public/app.js` sends:

- a beacon per page view (route, language, referrer host, «new visit» for a tab's first page),
- a heartbeat every minute while the page is visible (who is on the site, or on a `/play/<slug>/` page, right now; play time),
- a note when a Meta store or Roblox link is pressed.

No cookies, no IP addresses, no persistent ids (a random id per browser tab in `sessionStorage`). Country comes from
Cloudflare's request data, device from the user agent. Visitors with Global Privacy Control or Do Not Track are not counted.

Roblox numbers (playing now, visits, favourites, likes) come from Roblox's public API for every item in
`src/data/roblox-maps.json` that has a `placeId` (the number in `roblox.com/games/<placeId>/…`). Meta does not publish
Quest sales or player numbers; the dashboard links the Meta Horizon Developer Dashboard instead.

`/dashboard` (and its data, `/api/summary`) asks for user `aboden` and the `DASHBOARD_PASSWORD` secret.

## Setup (once, by the owner)

1. Free Cloudflare account; open **Workers & Pages** once so the account gets its `<subdomain>.workers.dev`.
2. **My Profile → API Tokens → Create Token → «Edit Cloudflare Workers»** template, scoped to the account.
3. GitHub repo **Settings → Secrets and variables → Actions → New repository secret**, three times:
   `CLOUDFLARE_API_TOKEN` (step 2), `CLOUDFLARE_ACCOUNT_ID` (Cloudflare dashboard, right column of the account
   home), `DASHBOARD_PASSWORD` (any long password; this is what opens the dashboard).
4. Run **Actions → Deploy owner stats dashboard → Run workflow**. The Worker lives at
   `https://aboden-stats.<subdomain>.workers.dev`.
5. Set `endpoint` in `src/data/stats.json` to `https://aboden-stats.<subdomain>.workers.dev/c`; the next site
   publish starts counting (the page CSP allows that origin only when the endpoint is set).

## Local check

```sh
cd stats-worker && npm ci
printf 'DASHBOARD_PASSWORD=test-pass\nDEV_ORIGIN=http://localhost:8765\n' > .dev.vars
npx wrangler dev --port 8787   # dashboard: http://127.0.0.1:8787/dashboard (aboden / test-pass)
npm test
```
