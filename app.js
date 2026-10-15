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
 document.querySelectorAll('[data-message-form]').forEach(form=>{
  const result=form.querySelector('.message-result'),preview=form.querySelector('.message-preview'),status=form.querySelector('.form-status');
  form.querySelector('[data-enable-submit]').disabled=false;
  const game=new URLSearchParams(location.search).get('game');
  if(game&&form.dataset.kind==='support'){const option=[...form.elements.subject.options].find(o=>o.value===game);if(option)form.elements.subject.value=game;}
  form.addEventListener('submit',event=>{
   event.preventDefault();if(!form.reportValidity())return;
   const fields=Object.fromEntries(new FormData(form));
   preview.value=composeMessage({...fields,kind:form.dataset.kind});result.hidden=false;
   if(form.dataset.email){location.href=`mailto:${encodeURIComponent(form.dataset.email)}?subject=${encodeURIComponent(fields.subject)}&body=${encodeURIComponent(preview.value)}`;status.textContent='تم فتح الطلب في تطبيق البريد. راجعه ثم أرسله من هناك.';}
   else{status.textContent='رسالتك جاهزة للنسخ أو الحفظ. لم تُرسل إلى الاستديو.';preview.focus();}
  });
  form.querySelector('[data-copy-message]').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(preview.value);status.textContent='تم نسخ الرسالة.';}catch{preview.focus();preview.select();status.textContent='حدّدنا الرسالة. انسخها من قائمة جهازك.';}});
  form.querySelector('[data-download-message]').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob(['\ufeff'+preview.value],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='aboden-games-message.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);status.textContent='تم تجهيز الملف للحفظ. لم تُرسل الرسالة.';});
 });
}
