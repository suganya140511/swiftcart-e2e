import { test } from '../../src/fixtures/test-fixtures.js';
import { users } from '../../src/data/users.js';

test.describe('Login @smoke', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('standard user can log in and reach the inventory', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(users.standard);
    await inventoryPage.expectLoaded();
  });

  test('locked-out user sees a lockout error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut);
    await loginPage.expectErrorMessage(/locked out/i);
    await loginPage.expectOnLoginPage();
  });

  test('invalid password is rejected', async ({ loginPage }) => {
    await loginPage.login({
      username: users.standard.username,
      password: 'wrong_password',
    });
    await loginPage.expectErrorMessage(/Username and password do not match/i);
  });

  test('missing username is rejected', async ({ loginPage }) => {
    await loginPage.login({ username: '', password: users.standard.password });
    await loginPage.expectErrorMessage(/Username is required/i);
  });
});
