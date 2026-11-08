// Guest and signed-in checkouts use the same delivery validation.
export function checkoutCustomer(input = {}, account = null) {
  const text = value => typeof value === 'string' ? value.trim() : '';
  const customer = {
    name: text(input.name) || text(account?.name),
    email: (text(input.email) || text(account?.email)).toLowerCase(),
    phone: text(input.phone) || text(account?.phone),
    address: text(input.address),
  };
  if (!customer.name || customer.name.length > 120) throw new Error('Please enter your full name (up to 120 characters).');
  const digits = customer.phone.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15 || !/^[+\d\s().-]+$/.test(customer.phone)) throw new Error('Please enter a valid mobile number, such as 0300 1234567.');
  if (!customer.address || customer.address.length > 1000) throw new Error('Please enter your delivery address, including your city.');
  if (customer.email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) || customer.email.length > 254)) throw new Error('Please enter a valid email address or leave it blank.');
  return customer;
}
