import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import type { ProductName } from '../data/checkout-data.js';

export class CartPage extends BasePage {
  protected readonly path = '/cart.html';

  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;
  private readonly itemNames: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.locator('[data-test="inventory-item"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]',
    );
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
  }

  async itemCount(): Promise<number> {
    return this.cartItems.count();
  }

  async expectContainsProduct(product: ProductName): Promise<void> {
    await expect(this.itemNames.filter({ hasText: product })).toHaveCount(1);
  }

  async expectItemCount(expected: number): Promise<void> {
    await expect(this.cartItems).toHaveCount(expected);
  }

  async proceedToCheckout(): Promise<void> {
    await this.clickWhenReady(this.checkoutButton);
  }

  async continueShopping(): Promise<void> {
    await this.clickWhenReady(this.continueShoppingButton);
  }
}
