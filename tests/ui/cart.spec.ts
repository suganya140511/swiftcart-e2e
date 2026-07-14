import { test } from '../../src/fixtures/test-fixtures.js';
import { products } from '../../src/data/checkout-data.js';

test.describe('Cart @regression', () => {
  test('cart reflects items added from inventory', async ({
    loggedInStandardUser: inventory,
    cartPage,
  }) => {
    await inventory.addToCart(products.backpack);
    await inventory.addToCart(products.fleeceJacket);
    await inventory.openCart();

    await cartPage.expectItemCount(2);
    await cartPage.expectContainsProduct(products.backpack);
    await cartPage.expectContainsProduct(products.fleeceJacket);
  });

  test('continue shopping returns to inventory', async ({
    loggedInStandardUser: inventory,
    cartPage,
  }) => {
    await inventory.addToCart(products.onesie);
    await inventory.openCart();
    await cartPage.continueShopping();
    await inventory.expectLoaded();
  });
});
