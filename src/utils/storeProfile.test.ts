import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseStoreProfile } from './storeProfile';

test('store profile accepts optional values and trims multiple links', () => {
  assert.deepEqual(parseStoreProfile({ logo: null, website: '', socialLinks: '' }), {
    storeLogo: null, storeWebsite: null, storeSocialLinks: [],
  });
  assert.deepEqual(parseStoreProfile({
    logo: null, website: ' https://loja.example ', socialLinks: 'https://social.example/a\n\n https://social.example/b ',
  }), {
    storeLogo: null, storeWebsite: 'https://loja.example',
    storeSocialLinks: ['https://social.example/a', 'https://social.example/b'],
  });
});

test('store profile rejects unsafe or too many links', () => {
  assert.throws(() => parseStoreProfile({ logo: null, website: 'javascript:alert(1)', socialLinks: '' }), /http/);
  assert.throws(() => parseStoreProfile({ logo: null, website: '', socialLinks: 'https://social.example\ninvalid' }), /http/);
  assert.throws(() => parseStoreProfile({
    logo: null, website: '', socialLinks: Array(11).fill('https://social.example').join('\n'),
  }), /10/);
});
