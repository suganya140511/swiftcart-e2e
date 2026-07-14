import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { InventoryPage } from '../pages/InventoryPage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckoutPage.js';
import { BookingApiClient } from '../api/BookingApiClient.js';
import { users } from '../data/users.js';

/**
 * Fixtures keep tests declarative: a spec just names `inventoryPage` or
 * `loggedInStandardUser` and receives a ready-to-use object. Setup lives here
 * once instead of being copy-pasted into every beforeEach.
 */
interface Pages {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  /** InventoryPage already authenticated as standard_user and loaded. */
  loggedInStandardUser: InventoryPage;
}

interface ApiFixtures {
  bookingApi: BookingApiClient;
}

export const test = base.extend<Pages & ApiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  loggedInStandardUser: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.open();
    await loginPage.login(users.standard);
    await inventoryPage.expectLoaded();
    await use(inventoryPage);
  },

  bookingApi: async ({ request }, use) => {
    await use(new BookingApiClient(request));
  },
});

export { expect } from '@playwright/test';
