import test from 'node:test';
import assert from 'node:assert/strict';
import { localizeBrandContent } from '../shared/brand-copy.js';
import { defaultContent } from './defaultData.js';

test('brand copy preserves owner contact details, uploaded assets and custom settings', () => {
  const existing = { key:'main', settings:{contactEmail:'owner@example.test',contactPhone:'03001234567',contactAddress:'Owner address',logoUrl:'/api/media/logo',offerEnabled:false}, pageHeroes:{about:{image:'/api/media/about'}}, sections:{about:{poster:'/api/media/story'}}, featureCards:[{image:'/api/media/feature'}], collections:[{image:'/api/media/collection'}], heroSlides:[{image:'/api/media/hero'}], custom:{keep:true} };
  const next=localizeBrandContent(existing);
  for(const key of ['contactEmail','contactPhone','contactAddress','logoUrl','offerEnabled']) assert.equal(next.settings[key],existing.settings[key]);
  assert.equal(next.pageHeroes.about.image,'/api/media/about');
  assert.equal(next.sections.about.poster,'/api/media/story');
  assert.equal(next.collections[0].image,'/api/media/collection');
  assert.equal(next.heroSlides[0].image,'/api/media/hero');
  assert.deepEqual(next.custom,{keep:true});
  assert.equal(next.brandCopyVersion,1);
  assert.equal(existing.brandCopyVersion,undefined);
});

test('new defaults remove fabricated ratings, discount, warranty and overseas location copy', () => {
  const visible=JSON.stringify({settings:defaultContent.settings,sections:defaultContent.sections,reviewItems:defaultContent.reviewItems,statCards:defaultContent.statCards,collections:defaultContent.collections});
  for(const old of ['50% off','2014','James Carter','4.9/5','10M+','England, London','e-commerce template']) assert.ok(!visible.includes(old),old);
  assert.ok(defaultContent.reviewItems.every(item=>!item.rating && item.name==='Eastern Western'));
  assert.ok(defaultContent.collections.every(item=>!item.price && !item.oldPrice));
});

