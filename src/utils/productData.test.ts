import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isValidGtin } from '../../shared/gtin';
import { discountedPrice } from '../../shared/productPrice';

test('validates GTIN lengths, check digits and leading zeroes', () => {
  for (const code of ['96385074', '036000291452', '7894900011517', '10012345000017']) {
    assert.equal(isValidGtin(code), true);
  }
  for (const code of ['00000000', '7894900011518', '123456789', '789490001151a']) {
    assert.equal(isValidGtin(code), false);
  }
});

test('rounds discounted prices to cents, including edge cases', () => {
  assert.equal(discountedPrice(25, 12.5), 21.88);
  assert.equal(discountedPrice(0.01, 50), 0.01);
  assert.equal(discountedPrice(100, 100), 0);
  assert.equal(discountedPrice(9999999999, 0.01), 9998999999);
});
