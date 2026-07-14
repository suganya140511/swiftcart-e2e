import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Common behaviour shared by every page object. Concrete pages extend this and
 * expose intent-revealing methods (e.g. addToCart) rather than raw locators, so
 * tests read like user stories and selectors live in exactly one place.
 */
export abstract class BasePage {
  protected readonly page: Page;

  /** Path relative to baseURL that `open()` navigates to. */
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  async title(): Promise<string> {
    return this.page.title();
  }

  protected async clickWhenReady(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.click();
  }

  protected async fill(locator: Locator, value: string): Promise<void> {
    await expect(locator).toBeVisible();
    await locator.fill(value);
  }
}
