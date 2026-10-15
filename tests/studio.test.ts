import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { loadCatalog } from '../src/lib/catalog.ts';
import {renderHome,renderGames,renderProject,renderStudio,renderTeam,renderSupport,renderContact,renderQuest,renderLicenses,renderAR} from '../src/lib/site.ts';
import {filterProjects,composeMessage} from '../public/app.js';
const read=(p:string)=>readFileSync(p,'utf8');
const hash=(p:string)=>createHash('sha256').update(readFileSync(p)).digest('hex');
test('destination game images, domain and policy remain byte-identical',()=>{
 const files=JSON.parse(read('migration/destination-original-sha256.json'));
 for(const name of ['CNAME','dahrooj-cover.jpg','dahrooj-icon.png','dahrooj-privacy.html']){
  assert.equal(hash(name),files[name],name);assert.equal(hash('public/'+name),files[name]);
 }
 assert.equal(hash('public/privacy-policies/dahrooj-meta-quest.html'),files['dahrooj-privacy.html']);
});
test('every migrated source file is retained; game covers, approvals and catalog are byte-identical',()=>{
 const files=JSON.parse(read('migration/source-inventory.json')).files;
 for(const [name,digest] of Object.entries(files)) {
  assert.ok(existsSync(name),`Missing original file: ${name}`);
  if(/^(public\/)?assets\/projects\//.test(name)||/^src\/data\/(catalog|approvals|cover-sources)\.json$/.test(name))assert.equal(hash(name),digest,`Changed protected game content: ${name}`);
 }
});
test('all public studio HTML removes repository links and internal repository names',()=>{
 const pages=[renderHome(),renderGames(),renderStudio(),renderTeam(),renderSupport(),renderContact(),renderQuest(),renderLicenses(),renderAR(),...loadCatalog().map(p=>renderProject(p))];
 for(const html of pages){
  assert.doesNotMatch(html,/href=["'][^"']*(?:github\.com|api\.github\.com|raw\.githubusercontent\.com)/i);
  // The owner-requested tools section may name GitHub as a tool; everything else must not.
  assert.doesNotMatch(html.replace(/<section class="tools"[\s\S]*?<\/section>/,'').replace(/<[^>]*>/g,''),/GitHub|مستودع|3wasfnjd\//i);
  assert.doesNotMatch(html,/\{\{[A-Z_]+\}\}/);
  assert.match(html,/noindex, nofollow/);
  assert.doesNotMatch(html,/href="[^"']*(?:privacy-policies|dahrooj-privacy)/);
 }
});
test('game platform sections distinguish touch web games and Quest',()=>{
 const html=renderGames();for(const id of ['web','mobile','quest'])assert.ok(html.includes(`id="${id}"`));
 assert.match(html,/نسخ متصفح/);assert.match(html,/دحروج/);
 const groups=JSON.parse(read('src/data/game-sections.json'));
 assert.deepEqual(Object.keys(groups).sort(),loadCatalog().map(p=>p.slug).sort());
 assert.equal(groups['ar-aboden'].mobile,false);
 assert.doesNotMatch(renderQuest(),/href="https:\/\/.*(?:store|horizon)/);
});
test('contact uses the owner-provided studio email and never claims the form sent it',()=>{
 const studio=JSON.parse(read('src/data/studio.json'));
 assert.equal(studio.contactEmail,'aboden.games@gmail.com');assert.equal(studio.supportEmail,'aboden.games@gmail.com');
 for(const html of [renderContact(),renderSupport()]){assert.ok(html.includes('data-email="aboden.games@gmail.com"'));assert.match(html,/تطبيق بريدك/);assert.doesNotMatch(html,/تم الإرسال|أُرسلت بنجاح/);}
 assert.ok(renderContact().includes('href="mailto:aboden.games@gmail.com"'));
 assert.deepEqual(studio.team.map((m:any)=>m.name),['عبودين','ناصر','جود','نجد']);
});
test('team story and photo slot render without inventing a photo',()=>{
 const team=renderTeam(),studioPage=renderStudio();
 for(const name of ['عبودين','ناصر','جود','نجد'])assert.ok(team.includes(name));
 assert.match(studioPage,/id="story"/);assert.match(studioPage,/الذكاء الاصطناعي/);
 if(!JSON.parse(read('src/data/studio.json')).familyPhoto)assert.match(team,/صورة الفريق قريبًا/);
});
test('augmented reality has its own page, separate from the games grid',()=>{
 const ar=renderAR(),games=renderGames();
 assert.match(ar,/مختبر عبودين/);assert.match(ar,/الكتابة على الرمل/);
 assert.ok(ar.includes('/ar-lab/arena.html'));assert.doesNotMatch(ar,/3wasfnjd\.github\.io\/AR-Aboden/);
 assert.doesNotMatch(games.split('id="game-grid"')[1].split('</div><div class="empty-state"')[0],/projects\/ar-aboden\//);
 assert.ok(games.includes('href="/ar/"'));assert.ok(renderHome().includes('href="/ar/"'));
});
test('Arabic search intersects text and genre and handles no results',()=>{
 const projects=[{category:'أكشن',search:'بوم BOOM مطاردات'},{category:'قيادة',search:'هجولة Hajwala'}];
 assert.equal(filterProjects(projects,'بُوم','all').length,1);
 assert.equal(filterProjects(projects,'boom','قيادة').length,0);
 assert.equal(filterProjects(projects,'HAJWALA','قيادة').length,1);
 assert.equal(filterProjects(projects,'غير موجود','all').length,0);
});
test('support message includes user-selected details as text',()=>{
 const text=composeMessage({kind:'support',name:'عبدالله',subject:'دحروج — Meta Quest',device:'Quest 3',message:'المشكلة عند البدء'});
 for(const phrase of ['عبدالله','دحروج — Meta Quest','Quest 3','المشكلة عند البدء'])assert.ok(text.includes(phrase));
});
test('AR page lists the lab experiences, mobile only, with designed art and live links',()=>{
 const ar=renderAR(),list=JSON.parse(read('src/data/ar-experiences.json')).experiences;
 assert.equal(list.length,8);
 for(const x of list){assert.ok(ar.includes(x.title));assert.ok(existsSync('public/'+x.image));assert.ok(ar.includes('/ar-lab/'+x.file));assert.ok(existsSync('public/ar-lab/'+x.file));}
 assert.ok(!ar.includes('رماية عبودين'));assert.ok(!existsSync('public/ar-lab/gallery.html'));assert.ok(ar.includes('حرب الألوان AR'));
 assert.equal((ar.match(/class="ar-exp-device"/g)||[]).length,8);
});
test('studio page shows the tools the owner asked for',()=>{
 const html=renderStudio();for(const n of ['Claude','ChatGPT','Gemini','Tripo AI','GitHub'])assert.ok(html.includes(n));
});
test('licences page credits the GPL sand experience',()=>{const html=renderLicenses();assert.match(html,/Sandboard/);assert.ok(html.includes('ar-lab/js/sand/LICENSE.txt'));});
