import { test, expect } from '../../src/fixtures/test-fixtures.js';
import { products } from '../../src/data/checkout-data.js';

test.describe('Inventory @regression', () => {
  test('displays all six products', async ({ loggedInStandardUser }) => {
    const names = await loggedInStandardUser.productNames();
    expect(names).toHaveLength(6);
  });

  test('adds and removes items, updating the cart badge', async ({
    loggedInStandardUser: inventory,
  }) => {
    await inventory.expectCartCount(0);

    await inventory.addToCart(products.backpack);
    await inventory.expectCartCount(1);

    await inventory.addToCart(products.bikeLight);
    await inventory.expectCartCount(2);

    await inventory.removeFromCart(products.backpack);
    await inventory.expectCartCount(1);
  });

  test('sorts products by name Z to A', async ({
    loggedInStandardUser: inventory,
  }) => {
    await inventory.sortBy('za');
    const names = await inventory.productNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('sorts products by price low to high', async ({
    loggedInStandardUser: inventory,
  }) => {
    await inventory.sortBy('lohi');
    const prices = await inventory.productPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });
});
