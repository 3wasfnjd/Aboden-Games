import { test } from 'node:test';
import assert from 'node:assert/strict';
import { clean, deviceOf, dayOf, games } from '../src/lib.js';

test('beacons are cleaned to known shapes', () => {
  assert.deepEqual(clean({ t: 'v', id: 'abcdefgh1', p: '/en/games/kassab/', n: 1, r: 'www.google.com' }), { t: 'v', id: 'abcdefgh1', route: '/games/kassab/', lang: 'en', isNew: true, ref: 'google.com' });
  assert.equal(clean({ t: 'p', id: 'abcdefgh1', p: '/play/kassab' }).route, '/play/kassab/');
  assert.equal(clean({ t: 'v', id: 'short', p: '/' }), null);
  assert.equal(clean({ t: 'v', id: 'abcdefgh1', p: '/<script>' }), null);
  assert.equal(clean({ t: 'e', id: 'abcdefgh1', p: '/', e: 'DROP TABLE' }), null);
  assert.equal(clean({ t: 'x', id: 'abcdefgh1', p: '/' }), null);
  assert.equal(clean('nope'), null);
});

test('devices, Saudi days and the game list', () => {
  assert.equal(deviceOf('Mozilla/5.0 (X11; Linux x86_64; Quest 3) OculusBrowser/35'), 'quest');
  assert.equal(deviceOf('Mozilla/5.0 (iPhone) Mobile'), 'mobile');
  assert.equal(deviceOf('Mozilla/5.0 (Windows NT 10.0)'), 'desktop');
  assert.equal(dayOf(Date.UTC(2026, 9, 27, 21, 30)), '2026-10-28');
  const kassab = games().find(g => g.slug === 'kassab');
  assert.deepEqual([kassab.page, kassab.play], ['/games/kassab/', '/play/kassab/']);
  assert.equal(games().find(g => g.slug === 'dahrooj-quest').play, null);
});
