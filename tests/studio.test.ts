import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { loadCatalog } from '../src/lib/catalog.ts';
import {renderHome,renderGames,renderProject,renderStudio,renderTeam,renderSupport,renderContact,renderQuest,renderLicenses} from '../src/lib/site.ts';
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
 const pages=[renderHome(),renderGames(),renderStudio(),renderTeam(),renderSupport(),renderContact(),renderQuest(),renderLicenses(),...loadCatalog().map(p=>renderProject(p))];
 for(const html of pages){
  assert.doesNotMatch(html,/href=["'][^"']*(?:github\.com|api\.github\.com|raw\.githubusercontent\.com)/i);
  assert.doesNotMatch(html.replace(/<[^>]*>/g,''),/GitHub|مستودع|3wasfnjd\//i);
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
test('contact preparation never reports delivery with no configured email',()=>{
 assert.match(renderContact(),/لا يتم إرسالها من هذا النموذج/);
 assert.match(renderSupport(),/لا يتم إرسالها من هذا النموذج/);
 assert.match(renderTeam(),/قريبًا/);
 assert.equal(JSON.parse(read('src/data/studio.json')).team.length,0);
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
