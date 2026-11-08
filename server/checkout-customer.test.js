import test from 'node:test';
import assert from 'node:assert/strict';
import { checkoutCustomer } from '../shared/checkout-customer.js';

const delivery = { name: ' Ayesha ', phone: '0300 1234567', address: 'House 1, Township, Lahore' };
test('guest delivery needs no account and no email', () => {
  assert.deepEqual(checkoutCustomer(delivery), { ...delivery, name: 'Ayesha', email: '' });
});
test('optional email and signed-in details remain supported', () => {
  assert.equal(checkoutCustomer({ ...delivery, email: ' AYESHA@example.com ' }).email, 'ayesha@example.com');
  assert.equal(checkoutCustomer({ address: delivery.address }, { ...delivery, email: 'a@example.com' }).email, 'a@example.com');
});
test('rejects missing delivery details, malformed phones and invalid optional emails', () => {
  for (const invalid of [{ name: '' }, { phone: 'abc' }, { phone: '12' }, { address: '' }, { email: 'bad-email' }, { name: 'x'.repeat(121) }]) {
    assert.throws(() => checkoutCustomer({ ...delivery, ...invalid }));
  }
  assert.equal(checkoutCustomer({ ...delivery, phone: '+92 300 1234567' }).phone, '+92 300 1234567');
});
