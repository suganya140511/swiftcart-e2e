import { test, expect } from '../../src/fixtures/test-fixtures.js';
import { products, validCustomer } from '../../src/data/checkout-data.js';

test.describe('Checkout', () => {
  test('completes a full purchase happy path @smoke', async ({
    loggedInStandardUser: inventory,
    cartPage,
    checkoutPage,
  }) => {
    await inventory.addToCart(products.backpack);
    await inventory.addToCart(products.bikeLight);
    await inventory.openCart();

    await cartPage.expectItemCount(2);
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCustomerInfo(validCustomer);

    // Overview: subtotal + tax should equal the displayed total.
    const totals = await checkoutPage.readTotals();
    expect(totals.subtotal + totals.tax).toBeCloseTo(totals.total, 2);

    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });

  test('blocks checkout when postal code is missing @regression', async ({
    loggedInStandardUser: inventory,
    cartPage,
    checkoutPage,
  }) => {
    await inventory.addToCart(products.boltTShirt);
    await inventory.openCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.submitCustomerInfoExpectingError({
      firstName: validCustomer.firstName,
      lastName: validCustomer.lastName,
    });
    await checkoutPage.expectError(/Postal Code is required/i);
  });

  test('returns to products after completing an order @regression', async ({
    loggedInStandardUser: inventory,
    cartPage,
    checkoutPage,
  }) => {
    await inventory.addToCart(products.redTShirt);
    await inventory.openCart();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCustomerInfo(validCustomer);
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
    await checkoutPage.backToProducts();
    await inventory.expectLoaded();
  });
});
