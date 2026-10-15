# Aboden Fun World: publishing policy

- Work only in this repository. Never modify a linked project's repository or deployment.
- The owner must explicitly approve EACH repository before it is added to the website.
- Approval of the design, implementation or publication does NOT approve any repositories.
- `src/data/catalog.json` must contain only exact repositories explicitly recorded in `src/data/approvals.json`.
- Do not discover/import repositories at runtime, call the GitHub API from the browser, or publish pending/private repository metadata.
- Record each approval with its exact repository, date and a faithful description of the owner's instruction. Do not invent approval.
- Use actual screenshots/assets from approved projects. No invented gameplay, reviews, player counts, compatibility badges, or working launch links.
- A project without a verified live URL has no play/open action. Never substitute its GitHub source URL as a play link.
- The owner requested completing publication on 2026-10-02. Screenshot approval originally covered nine projects; subsequent removal leaves eight currently approved repositories in approvals.json.
- Owner instruction: «احذف الرماية بالواقع المعزز». AR-Shooter must stay out of the directory, search, detail routes, published covers and license source list unless explicitly reapproved. Do not delete or modify its original repository.
- Owner instruction: «عدل صورة هجولة وحط صورة الواجهه للعبه اللي فيها شاص». Use the actual Hajwala images/menu/menu-bg.jpg artwork, verified against its source Git blob. Do not invent artwork or use the old racetrack screenshot.
- Keep preview mode and noindex until public indexing is explicitly approved.
- Pages currently serves main at the repository root. The publication workflow validates, builds Astro, commits generated static files and explicitly requests a Pages build. `.nojekyll` prevents Jekyll from parsing Astro source.
- Edit `src/` and `public/`, NOT generated root HTML/CSS/JS. `scripts/sync-pages.mjs` and `.pages-files.json` manage generated files and remove obsolete generated pages.
- Keep Arabic RTL/mobile-first design. Respect browser zoom and reduced-motion preferences.
- Run `npm test` and `npm run build` before release. Do not bypass approval validation.
- The portal itself is not a project card. Future repositories still require explicit approval.

- Owner-approved Dahrooj artwork exception: the owner attached 074E9DC1-BAAC-4DF1-9681-28DA210356C9.jpeg and explicitly requested replacing its portal cover. Use public/assets/projects/dahrooj-poster-80d2b29c.jpeg with the SHA-256 recorded in cover-sources.json. This is approved promotional artwork, not an in-game screenshot. Do not regenerate or replace it with another poster; retain the full composition. This does not authorize game-repository changes.

## Owner-authorized studio migration — 2026-10-15

- The owner explicitly requested copying this site to `aboden-games1/aboden-games1.github.io`, redesigning it as the official studio, and retaining EVERY game/policy file. The source repository and linked game repositories must remain untouched.
- Preserve `dahrooj-cover.jpg`, `dahrooj-icon.png`, `dahrooj-privacy.html`, and the existing CNAME byte-for-byte. Keep the old privacy URL working. Its identical organized copy lives in `public/privacy-policies/dahrooj-meta-quest.html`.
- Privacy pages must not appear in navigation, game cards, search results or sitemap. Direct policy links must remain available for stores.
- Never delete any game/policy file during builds or migration. The sync script now retains previous generated files.
- No repository/source links or internal repository names in public site UI. Preserve legally required attribution text.
- The Meta Quest Dahrooj content was already on the destination site at af212c4. Its inclusion is preservation of existing studio content, not approval to import a new repository.
- Use the exact approved white/navy logo and Cairo fonts. Contact details and team members must come from the owner; never invent a working inbox or send-success state.
- Keep the existing noindex policy. Run npm test, npm run build, and python3 scripts/verify-build.py before release.

## Owner instructions — 2026-10-15 (story, team, AR, accent)

- Team provided by the owner: عبودين (design and programming with AI assistance) and the owner's children ناصر وجود ونجد (game idea and play style). Do not add other members or invent bios.
- Family image: the owner supplied an illustration on 2026-10-15, stored as `public/assets/team/aboden-family.webp`. Use only owner-supplied images here; never substitute a stock or self-generated image.
- Augmented-reality experiences have their own page at `/ar/`, separate from the games grid. Owner instruction 2026-10-15: «انقل قائمة تجارب المختبر بأوصافها وروابطها وصمم لها صور», mobile only, both shooting experiences shown. Data in `src/data/ar-experiences.json` (verbatim from the lab index), designed art in `public/assets/ar/`.
- Accent colour `--accent:#ff8a3d` (sunset orange) is approved to break the navy/white palette; use it for highlights only.

## Design refresh — 2026-10-15

- Owner asked for better image layout/quality, smaller typography and less all-navy background. Overrides live in `public/assets/refresh.css` (loaded last): fluid type scale, 4:5 poster cards (whole artwork kept with a blurred fill), sand-coloured bands (`.band-sand`).
- Owner allowed taking images from the game repositories or designing new ones. Higher-resolution copies and the designed AR-lab poster live in `public/assets/posters/`; each is recorded in `src/data/poster-sources.json` and wired through `poster`/`art` in `game-sections.json`. Original `assets/projects/` covers stay byte-identical.
- Team portraits (`public/assets/team/{aboden,nasser,joud,najd}.webp`) are each member's full quadrant of the owner-supplied team illustration, frame and details intact, transparent background kept (WebP with alpha; never flatten to a square), no face crops, no upscaling. Show them small. The group illustration is not shown on the team page.
- Search indexing stays off (noindex) until the owner says the site is finished.
- AR lab hosted here (owner instruction 2026-10-15: «التجارب انقل الصفحة لنفس المستودع وخليها بنفس الهوية»): the lab's runtime files from 3wasfnjd/AR-Aboden@56a234f live in `public/ar-lab/` and are served at `/ar-lab/`. Each page links `ar-lab/brand.css` (Cairo, navy/orange, branded way back to `/ar/`) and is noindex; `ar-lab/index.html` redirects to `/ar/`. Licence files (including the GPL-3.0 sand experience notice) are kept. The original repository stays untouched.
- Tools section on the studio page (owner request 2026-10-15): Claude, ChatGPT, Gemini, Tripo AI, GitHub from `src/data/tools.json`; logos from simple-icons where available, a plain name badge otherwise. The domain registrar logo is pending until the owner names the registrar.
- Owner instruction 2026-10-15 (later): «الرماية احذفها» — the «رماية عبودين» shooting-gallery experience (and its CC BY duck model) is removed from `/ar-lab/`, the AR page and the published root. «حرب الألوان AR» stays. The AR-lab card description is overridden in `game-sections.json` so it no longer lists shooting. The sand experience (GPL-3.0) is credited on the licences page.
- Studio email (owner, 2026-10-15): aboden.games@gmail.com for contact and support. Forms still only open the visitor's mail app with a prepared message; never claim the site sent it.
- Hardening (owner request 2026-10-15): every studio page sends a Content-Security-Policy meta (scripts only from this site, no plugins, no foreign base/form targets) and a strict referrer policy; `app.js` refuses to render inside another site's frame; `/.well-known/security.txt` names the studio email; GitHub Actions are pinned to commit SHAs and Dependabot watches npm and actions. Do not add inline scripts or third-party scripts to studio pages without updating the CSP. Privacy pages stay byte-identical (no CSP added there).
- Character cut-outs (owner-supplied, 2026-10-15) in `public/assets/characters/`, one per page and never grouped: Aboden in Quest 3 → home Dahrooj/Quest section; Nasser with controller → games page; girl drawing (pink) → contact; girl pointing (purple) → support. The girls are not named in alt text until the owner says which is which.
