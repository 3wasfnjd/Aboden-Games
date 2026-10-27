// Pure helpers for the stats Worker (kept apart: a Worker module may only export handlers and classes).
import studio from '../../src/data/studio-games.json' with { type: 'json' };
import catalog from '../../src/data/catalog.json' with { type: 'json' };

export const ORIGINS = ['https://abodengames.com', 'https://www.abodengames.com'];
export const LIVE_WINDOW = 150; // seconds since the last heartbeat that still count as «on the site now»
export const TZ_OFFSET = 3 * 3600 * 1000; // days are counted in Saudi time (UTC+3)

export const dayOf = ms => new Date(ms + TZ_OFFSET).toISOString().slice(0, 10);
export const daysAgo = (ms, n) => dayOf(ms - n * 86400000);

// Every game the site lists, with the routes that belong to it.
export function games() {
  const list = studio.games.map(g => ({ slug: g.slug, title: g.title, titleEn: g.titleEn, platform: g.platform, image: g.spotlight?.art?.src || g.keyArt.src, page: `/games/${g.slug}/`, play: g.webUrl ? `/play/${g.slug}/` : null }));
  for (const p of catalog) if (p.category === 'games' && p.liveUrl) list.push({ slug: p.slug, title: p.title, titleEn: p.titleEn, platform: 'web', image: p.cover, page: `/projects/${p.slug}/`, play: `/play/${p.slug}/` });
  return list;
}

// Beacon input → a clean record, or null. Routes are the Arabic route ("/en" dropped, kept as lang).
export function clean(body) {
  if (!body || typeof body !== 'object') return null;
  const t = body.t;
  if (!['v', 'p', 'e'].includes(t)) return null;
  const id = typeof body.id === 'string' && /^[a-z0-9]{8,32}$/.test(body.id) ? body.id : null;
  if (!id) return null;
  let path = typeof body.p === 'string' ? body.p.slice(0, 120) : '/';
  if (!/^\/[a-z0-9\-/.]*$/.test(path)) return null;
  path = path.replace(/index\.html$/, '');
  const lang = path === '/en' || path.startsWith('/en/') ? 'en' : 'ar';
  let route = lang === 'en' ? path.slice(3) || '/' : path;
  if (!route.endsWith('/') && !route.includes('.')) route += '/';
  const out = { t, id, route, lang };
  if (t === 'v') {
    out.isNew = body.n === 1;
    out.ref = typeof body.r === 'string' && /^[a-z0-9.-]{1,80}$/.test(body.r) ? body.r.replace(/^www\./, '') : '';
  }
  if (t === 'e') {
    if (typeof body.e !== 'string' || !/^[a-z]{2,20}$/.test(body.e)) return null;
    out.event = body.e;
  }
  return out;
}

export function deviceOf(ua = '') {
  if (/OculusBrowser|Quest/i.test(ua)) return 'quest';
  if (/iPad|Tablet/i.test(ua)) return 'tablet';
  if (/Mobi|Android|iPhone/i.test(ua)) return 'mobile';
  return 'desktop';
}
