import test from 'node:test';
import assert from 'node:assert/strict';
import { importHeaders, prepareProductImport } from '../shared/product-import.js';
const row = (changes = {}) => importHeaders.map(header => ({
  'Product name / Naam':'Floral Suit', 'Product code':'EW-100', Category:'Ready to Wear',
  'Price (PKR)':'5,500', 'Stock / Pieces':'5', Size:'M', 'Colour / Rang':'Blue', ...changes,
}[header] || ''));
test('groups size rows into one draft product, sums inventory and leaves photos empty', () => {
  const {products,errors} = prepareProductImport([importHeaders,row(),row({Size:'L'})]);
  assert.deepEqual(errors,[]);
  assert.equal(products.length,1);
  assert.equal(products[0].stock,10);
  assert.equal(products[0].variants.length,2);
  assert.equal(products[0].price,'PKR 5500');
  assert.equal(products[0].status,'draft');
  assert.equal(products[0].image,'');
});
test('reports incorrect category, negative price, fractional stock and invalid status with row numbers', () => {
  const {errors} = prepareProductImport([importHeaders,row({Category:'bad','Price (PKR)':'-1','Stock / Pieces':'2.5',Status:'yes'})]);
  assert.equal(errors.length,4);
  assert.ok(errors.every(error=>error.startsWith('Row 2:')));
});
test('rejects existing codes and slugs, duplicate variants and conflicting product details', () => {
  const {errors} = prepareProductImport([importHeaders,row(),row({'Price (PKR)':'6000'})],[{sku:'ew-100'}]);
  assert.ok(errors.some(error=>error.includes('Already exists')));
  assert.ok(errors.some(error=>error.includes('Duplicate size')));
  assert.ok(errors.some(error=>error.includes('Keep price')));
});
test('blank rows are ignored, missing headings and large files are rejected', () => {
  assert.equal(prepareProductImport([importHeaders,[],row()]).products.length,1);
  assert.throws(()=>prepareProductImport([['Name'],row()]),/Missing heading/);
  assert.throws(()=>prepareProductImport(Array(1002).fill([])),/1,000 rows/);
});

