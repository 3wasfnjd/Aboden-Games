// The owner's dashboard page: one self-contained HTML document that reads /api/summary every 30 seconds.
export const dashboardHtml = `<!doctype html>
<html lang="ar" dir="rtl"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/><title>لوحة عبودين قيمز</title>
<style>
:root{--bg:#0b1428;--card:#121e38;--line:#22304f;--ink:#f3f5fa;--muted:#9aa7c2;--accent:#f39a2b;--accent-soft:rgba(243,154,43,.14);--good:#3fbf7f}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 system-ui,-apple-system,"Segoe UI",Tahoma,sans-serif}
main{max-width:1180px;margin:0 auto;padding:20px 16px 48px}
header{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:18px}
h1{font-size:24px;margin:0}h2{font-size:17px;margin:0 0 12px}.muted{color:var(--muted)}small{font-size:12.5px}
.seg{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:3px}
.seg button{background:none;border:0;color:var(--muted);font:inherit;padding:5px 14px;border-radius:999px;cursor:pointer}
.seg button[aria-pressed=true]{background:var(--accent);color:#1b1200;font-weight:700}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:16px}
.tile,.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:16px}
.tile b{display:block;font-size:34px;line-height:1.15;font-variant-numeric:tabular-nums}
.live b{color:var(--good)}.dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:var(--good);margin-inline-end:6px;animation:pulse 2s infinite}
@keyframes pulse{50%{opacity:.35}}@media (prefers-reduced-motion:reduce){.dot{animation:none}}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:12px;margin-top:12px}
.chart{position:relative}.chart svg{display:block;width:100%;height:220px}
.tip{position:absolute;pointer-events:none;background:#fff;color:#111;border-radius:8px;padding:6px 10px;font-size:13px;white-space:nowrap;transform:translate(50%,-110%);display:none;box-shadow:0 4px 14px rgba(0,0,0,.3)}
table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}th,td{padding:9px 8px;text-align:start;border-bottom:1px solid var(--line);white-space:nowrap}
th{color:var(--muted);font-weight:600;font-size:13px}td.num,th.num{text-align:end}.scroll{overflow-x:auto}
.badge{display:inline-block;font-size:11.5px;border:1px solid var(--line);border-radius:999px;padding:1px 8px;color:var(--muted);margin-inline-start:6px}
.livecell{color:var(--good);font-weight:700}
.bars{list-style:none;margin:0;padding:0}.bars li{display:grid;grid-template-columns:minmax(90px,38%) 1fr auto;gap:10px;align-items:center;padding:5px 0}
.bars .track{height:10px;background:var(--accent-soft);border-radius:4px;overflow:hidden}.bars .fill{display:block;height:100%;background:var(--accent);border-radius:4px}
.bars .lbl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bars .n{font-variant-numeric:tabular-nums;color:var(--muted)}
.rb{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px}.rb dl{display:grid;grid-template-columns:1fr auto;gap:4px 12px;margin:10px 0 0}.rb dd{margin:0;font-weight:700;font-variant-numeric:tabular-nums}
.note{border-inline-start:3px solid var(--accent);padding:4px 12px;color:var(--muted)}a{color:var(--accent)}
.err{background:#3a1520;border:1px solid #7a2c3c;border-radius:12px;padding:10px 14px;margin-bottom:12px;display:none}
</style></head><body><main>
<header><div><h1>لوحة عبودين قيمز</h1><small class="muted" id="updated">جاري التحميل…</small></div>
<div class="seg" role="group" aria-label="الفترة"><button data-range="today" aria-pressed="false">اليوم</button><button data-range="week" aria-pressed="true">٧ أيام</button><button data-range="month" aria-pressed="false">٣٠ يوم</button></div></header>
<div class="err" id="err">تعذّر تحديث الأرقام، بنحاول مرة ثانية بعد شوي.</div>
<section class="tiles" aria-label="الحين">
<div class="tile live"><small class="muted"><span class="dot"></span>بالموقع الحين</small><b id="t-live">–</b></div>
<div class="tile live"><small class="muted"><span class="dot"></span>يلعبون الحين</small><b id="t-playing">–</b><small class="muted" id="t-playing-sub"></small></div>
<div class="tile"><small class="muted" id="t-visits-l">زيارات</small><b id="t-visits">–</b></div>
<div class="tile"><small class="muted" id="t-views-l">مشاهدات صفحات</small><b id="t-views">–</b></div>
<div class="tile"><small class="muted">أعلى تواجد بنفس الوقت</small><b id="t-peak">–</b><small class="muted" id="t-peak-sub"></small></div>
</section>
<section class="card"><h2>الزيارات آخر ٣٠ يوم</h2><div class="chart" id="chart"><svg aria-hidden="true"></svg><div class="tip" id="tip"></div></div>
<details><summary class="muted">عرض الأرقام كجدول</summary><div class="scroll"><table id="daily-table"></table></div></details></section>
<section class="card" style="margin-top:12px"><h2>ألعابنا</h2><div class="scroll"><table id="games"></table></div>
<p class="muted"><small>«يلعبون الحين» = صفحة اللعب مفتوحة عندهم آخر دقيقتين. «مرات اللعب» = فتح صفحة «العب الآن». ألعاب الويب اللي تنفتح من رابطها المباشر برا الموقع ما تنحسب.</small></p></section>
<section class="card" style="margin-top:12px"><h2>روبلوكس <small class="muted">أرقام روبلوكس الرسمية</small></h2><div class="rb" id="roblox"></div></section>
<section class="card" style="margin-top:12px"><h2>ميتا كويست</h2><p class="note">ميتا ما تعطي أرقام المبيعات واللاعبين برا لوحة المطورين. تلقاها في <a href="https://developers.meta.com/horizon/manage/" target="_blank" rel="noopener noreferrer">Meta Horizon Developer Dashboard</a>. فوق في جدول الألعاب: زيارات صفحة دحروج ومفاتيح في موقعنا وكم مرة انضغط زر المتجر.</p></section>
<div class="grid">
<section class="card"><h2>أكثر الصفحات <small class="muted">٧ أيام</small></h2><ul class="bars" id="pages"></ul></section>
<section class="card"><h2>الدول <small class="muted">٧ أيام</small></h2><ul class="bars" id="countries"></ul></section>
<section class="card"><h2>الأجهزة <small class="muted">٧ أيام</small></h2><ul class="bars" id="devices"></ul></section>
<section class="card"><h2>من وين جوا <small class="muted">٧ أيام</small></h2><ul class="bars" id="refs"></ul></section>
</div>
<p class="muted" style="margin-top:20px"><small>بدون كوكيز وبدون تخزين عناوين IP. العدّ بتوقيت السعودية ويبدأ من يوم تركيب العداد.</small></p>
</main>
<script>
const $=id=>document.getElementById(id),fmt=n=>n==null?'–':Number(n).toLocaleString('ar-SA');
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const RANGE={today:'اليوم',week:'آخر ٧ أيام',month:'آخر ٣٠ يوم'};let range='week',data=null;
let regions;try{regions=new Intl.DisplayNames(['ar'],{type:'region'});}catch{}
const country=c=>c==='??'?'غير معروف':(regions?.of(c)||c);
const DEVICES={mobile:'جوال',desktop:'كمبيوتر',tablet:'تابلت',quest:'نظارة Meta Quest'},LANGS={ar:'عربي',en:'إنجليزي'};
function bars(id,rows,label){const max=Math.max(1,...rows.map(r=>r.n));$(id).innerHTML=rows.length?rows.map(r=>'<li><span class="lbl" title="'+esc(label(r))+'">'+esc(label(r))+'</span><span class="track"><span class="fill" style="width:'+(r.n/max*100).toFixed(1)+'%"></span></span><span class="n">'+fmt(r.n)+'</span></li>').join(''):'<li class="muted">ما فيه بيانات للحين</li>';}
function pageName(route){const g=data.games.find(g=>g.page===route||g.play===route);if(g)return (g.play===route?'العب: ':'')+g.title;return {'/':'الرئيسية','/games/':'الألعاب','/ar/':'الواقع المعزز','/roblox/':'روبلوكس','/studio/':'الاستديو','/team/':'الفريق','/support/':'الدعم','/contact/':'تواصل معنا'}[route]||route;}
function chart(){
 const svg=document.querySelector('#chart svg'),W=svg.clientWidth||800,H=220,pad={t:12,b:24,l:8,r:36},d=data.daily,max=Math.max(4,...d.map(x=>x.visits));
 const step=Math.pow(10,Math.floor(Math.log10(max))),top=Math.ceil(max/step)*step,band=(W-pad.l-pad.r)/d.length,bw=Math.min(24,band-2);
 const y=v=>H-pad.b-(v/top)*(H-pad.t-pad.b);let s='';
 for(let i=0;i<=4;i++){const v=top*i/4,yy=y(v);s+='<line x1="'+pad.l+'" x2="'+(W-pad.r)+'" y1="'+yy+'" y2="'+yy+'" stroke="#22304f"/><text x="'+(W-pad.r+6)+'" y="'+(yy+4)+'" fill="#9aa7c2" font-size="11">'+fmt(Math.round(v))+'</text>';}
 d.forEach((x,i)=>{const cx=W-pad.r-band*(i+0.5),h=H-pad.b-y(x.visits),x0=cx-bw/2;
  if(h>0){const r=Math.min(4,h);s+='<path d="M'+x0+','+(H-pad.b)+'V'+(H-pad.b-h+r)+'q0,-'+r+' '+r+',-'+r+'H'+(x0+bw-r)+'q'+r+',0 '+r+','+r+'V'+(H-pad.b)+'Z" fill="#f39a2b"/>';}
  if(i%5===0||i===d.length-1)s+='<text x="'+cx+'" y="'+(H-6)+'" fill="#9aa7c2" font-size="11" text-anchor="middle">'+x.day.slice(5).replace('-','/')+'</text>';
  s+='<rect x="'+(cx-band/2)+'" y="0" width="'+band+'" height="'+H+'" fill="transparent" data-i="'+i+'"/>';});
 svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.innerHTML=s;
}
const tip=$('tip');
document.querySelector('#chart svg').addEventListener('pointermove',e=>{const i=e.target.dataset?.i;if(i==null){tip.style.display='none';return;}const x=data.daily[i],b=document.getElementById('chart').getBoundingClientRect();tip.innerHTML='<b>'+x.day+'</b><br/>زيارات '+fmt(x.visits)+' · مشاهدات '+fmt(x.views);tip.style.display='block';tip.style.left=(e.clientX-b.left)+'px';tip.style.top=(e.clientY-b.top)+'px';});
document.querySelector('#chart svg').addEventListener('pointerleave',()=>tip.style.display='none');
function render(){
 if(!data)return;const t=data.totals[range];
 $('t-live').textContent=fmt(data.live.total);
 const rbPlaying=data.roblox.reduce((s,r)=>s+(r.playing||0),0);
 $('t-playing').textContent=fmt(data.live.playing+rbPlaying);$('t-playing-sub').textContent='ويب '+fmt(data.live.playing)+' · روبلوكس '+fmt(rbPlaying);
 $('t-visits').textContent=fmt(t.visits);$('t-views').textContent=fmt(t.views);$('t-visits-l').textContent='زيارات '+RANGE[range];$('t-views-l').textContent='مشاهدات صفحات '+RANGE[range];
 $('t-peak').textContent=fmt(data.peak.today);$('t-peak-sub').textContent='اليوم · أعلى رقم بالأسبوع '+fmt(data.peak.week);
 const rows=[...data.games].sort((a,b)=>(b.liveNow-a.liveNow)||((b.plays?.[range]||0)-(a.plays?.[range]||0))||(b.pageViews[range]-a.pageViews[range]));
 $('games').innerHTML='<thead><tr><th>اللعبة</th><th class="num">يلعبون الحين</th><th class="num">مرات اللعب</th><th class="num">دقائق لعب</th><th class="num">زيارات صفحتها</th><th class="num">ضغطات المتجر</th></tr></thead><tbody>'+rows.map(g=>'<tr><td>'+esc(g.title)+'<span class="badge">'+(g.platform==='quest'?'Meta Quest':'ويب')+'</span></td><td class="num '+(g.liveNow?'livecell':'')+'">'+(g.play?fmt(g.liveNow):'–')+'</td><td class="num">'+(g.plays?fmt(g.plays[range]):'–')+'</td><td class="num">'+(g.minutes?fmt(g.minutes[range]):'–')+'</td><td class="num">'+fmt(g.pageViews[range])+'</td><td class="num">'+(g.storeClicks?fmt(range==='month'?g.storeClicks.month:g.storeClicks.week):'–')+'</td></tr>').join('')+'</tbody>';
 $('roblox').innerHTML=data.roblox.length?data.roblox.map(r=>'<div class="tile"><b style="font-size:18px">'+esc(r.title)+'</b>'+(r.error?'<p class="muted">تعذّر الوصول لروبلوكس الحين.</p>':'<dl><dt class="muted"><span class="dot"></span>يلعبون الحين</dt><dd>'+fmt(r.playing)+'</dd><dt class="muted">الزيارات</dt><dd>'+fmt(r.visits)+'</dd><dt class="muted">المفضلة</dt><dd>'+fmt(r.favorites)+'</dd><dt class="muted">الإعجاب</dt><dd>'+(r.up+r.down?Math.round(r.up/(r.up+r.down)*100)+'٪':'–')+'</dd></dl>')+'</div>').join(''):'<p class="muted">ما فيه تجارب مربوطة للحين.</p>';
 bars('pages',data.pages,r=>pageName(r.route));bars('countries',data.countries,r=>country(r.value));bars('devices',data.devices,r=>DEVICES[r.value]||r.value);bars('refs',data.refs,r=>r.value);
 $('daily-table').innerHTML='<thead><tr><th>اليوم</th><th class="num">زيارات</th><th class="num">مشاهدات</th></tr></thead><tbody>'+[...data.daily].reverse().map(x=>'<tr><td>'+x.day+'</td><td class="num">'+fmt(x.visits)+'</td><td class="num">'+fmt(x.views)+'</td></tr>').join('')+'</tbody>';
 chart();$('updated').textContent='آخر تحديث '+new Date(data.now).toLocaleTimeString('ar-SA',{hour:'numeric',minute:'2-digit'})+' · يتحدث كل ٣٠ ثانية';
}
async function load(){try{const r=await fetch('/api/summary',{cache:'no-store'});if(!r.ok)throw 0;data=await r.json();$('err').style.display='none';render();}catch{$('err').style.display='block';}}
document.querySelectorAll('[data-range]').forEach(b=>b.addEventListener('click',()=>{range=b.dataset.range;document.querySelectorAll('[data-range]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));render();}));
addEventListener('resize',()=>data&&chart());load();setInterval(()=>{if(!document.hidden)load();},30000);
</script></body></html>`;
