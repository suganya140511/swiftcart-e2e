import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import type { ProductName } from '../data/checkout-data.js';

export type SortOption =
  | 'az' // Name (A to Z)
  | 'za' // Name (Z to A)
  | 'lohi' // Price (low to high)
  | 'hilo'; // Price (high to low)

export class InventoryPage extends BasePage {
  protected readonly path = '/inventory.html';

  private readonly pageTitle: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly sortDropdown: Locator;
  private readonly itemNames: Locator;
  private readonly itemPrices: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.locator('.title');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.cartLink = page.locator('[data-test="shopping-cart-link"]');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.itemNames = page.locator('[data-test="inventory-item-name"]');
    this.itemPrices = page.locator('[data-test="inventory-item-price"]');
  }

  /** Locate the card for a product by its visible name. */
  private card(product: ProductName): Locator {
    return this.page
      .locator('[data-test="inventory-item"]')
      .filter({ hasText: product });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.pageTitle).toHaveText('Products');
  }

  async addToCart(product: ProductName): Promise<void> {
    await this.clickWhenReady(
      this.card(product).getByRole('button', { name: 'Add to cart' }),
    );
  }

  async removeFromCart(product: ProductName): Promise<void> {
    await this.clickWhenReady(
      this.card(product).getByRole('button', { name: 'Remove' }),
    );
  }

  async openCart(): Promise<void> {
    await this.clickWhenReady(this.cartLink);
  }

  async cartCount(): Promise<number> {
    if ((await this.cartBadge.count()) === 0) return 0;
    return Number(await this.cartBadge.innerText());
  }

  async expectCartCount(expected: number): Promise<void> {
    if (expected === 0) {
      await expect(this.cartBadge).toHaveCount(0);
    } else {
      await expect(this.cartBadge).toHaveText(String(expected));
    }
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async productNames(): Promise<string[]> {
    return this.itemNames.allInnerTexts();
  }

  async productPrices(): Promise<number[]> {
    const raw = await this.itemPrices.allInnerTexts();
    return raw.map((p) => Number(p.replace('$', '')));
  }
}
