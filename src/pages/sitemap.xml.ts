import { renderSitemap } from '../lib/site.ts';
export function GET() {
  return new Response(renderSitemap(new Date().toISOString().slice(0, 10)), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
