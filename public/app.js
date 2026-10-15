// Clickjacking guard: GitHub Pages cannot send frame headers, so refuse to render inside another site's frame.
if(typeof window!=='undefined'&&window.top!==window.self){try{window.top.location.replace(window.location.href);}catch{document.documentElement.style.display='none';}}
export const normalizeSearch = value => String(value).normalize('NFKD').replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآٱ]/g,'ا').replace(/ى/g,'ي').toLocaleLowerCase('ar').trim();
export function filterProjects(projects, query, category) {
 const terms=normalizeSearch(query).split(/\s+/).filter(Boolean);
 return projects.filter(p=>(category==='all'||p.category===category)&&terms.every(t=>normalizeSearch(p.search).includes(t)));
}
export function composeMessage({kind,name,subject,device,message}) {
 return [kind==='support'?'طلب دعم — عبودين قيمز':'تواصل — عبودين قيمز',name?`الاسم: ${name}`:'',`الموضوع: ${subject}`,device?`الجهاز: ${device}`:'','',message].filter((s,i)=>s||i===4).join('\n');
}
if(typeof document!=='undefined') {
 const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('#mobile-nav');
 function closeMenu(){if(!menu||!nav)return;nav.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','فتح القائمة');}
 menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')==='true';nav.hidden=open;menu.setAttribute('aria-expanded',String(!open));menu.setAttribute('aria-label',open?'فتح القائمة':'إغلاق القائمة');});
 nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav&&!nav.hidden){closeMenu();menu.focus();}});
 document.addEventListener('click',event=>{if(nav&&!nav.hidden&&!event.target.closest('.site-header'))closeMenu();});
 matchMedia('(min-width:861px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
 const search=document.querySelector('#search'),cards=[...document.querySelectorAll('#game-grid [data-project]')],filters=[...document.querySelectorAll('[data-filter]')];
 let category='all';
 function updateGames(){
  const visible=new Set(filterProjects(cards.map((el,i)=>({i,category:el.dataset.category,search:el.dataset.search})),search?.value||'',category).map(x=>x.i));
  cards.forEach((card,i)=>{card.hidden=!visible.has(i);});
  filters.forEach(button=>{const active=button.dataset.filter===category;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
  const count=document.querySelector('#results-count');if(count)count.textContent=`${visible.size} من ${cards.length} ألعاب`;
  const empty=document.querySelector('#no-results');if(empty)empty.hidden=visible.size>0;
 }
 search?.addEventListener('input',updateGames);
 filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.filter;updateGames();}));
 document.querySelector('#reset-search')?.addEventListener('click',()=>{category='all';search.value='';updateGames();search.focus();});
 document.addEventListener('keydown',event=>{if(event.key==='/'&&search&&!event.ctrlKey&&!event.metaKey&&!event.altKey&&!event.target.closest('input,textarea,select,[contenteditable]')){event.preventDefault();search.focus();}});
 // Support: a ?game= link from a game page goes into the email subject.
 const supportMail=document.querySelector('[data-support-mail]'),game=new URLSearchParams(location.search).get('game');
 if(supportMail&&game&&game.length<=80){
  const subject=`دعم — ${game}`;supportMail.href=`mailto:${supportMail.dataset.supportMail}?subject=${encodeURIComponent(subject)}`;
  const note=document.querySelector('[data-support-game]');if(note){note.textContent=`رسالتك عن: ${game}`;note.hidden=false;}
 }

}
