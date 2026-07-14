import { type Page, type Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import type { CustomerInfo } from '../data/checkout-data.js';

/**
 * SauceDemo checkout spans three URLs (information -> overview -> complete).
 * They're modelled here as one page object because they form a single linear
 * flow; the methods map one-to-one to the steps a user takes.
 */
export class CheckoutPage extends BasePage {
  protected readonly path = '/checkout-step-one.html';

  // Step one: customer information
  private readonly firstNameInput: Locator;
  private readonly lastNameInput: Locator;
  private readonly postalCodeInput: Locator;
  private readonly continueButton: Locator;
  private readonly errorMessage: Locator;

  // Step two: overview
  private readonly finishButton: Locator;
  private readonly subtotalLabel: Locator;
  private readonly taxLabel: Locator;
  private readonly totalLabel: Locator;

  // Step three: complete
  private readonly completeHeader: Locator;
  private readonly backHomeButton: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.postalCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.errorMessage = page.locator('[data-test="error"]');

    this.finishButton = page.locator('[data-test="finish"]');
    this.subtotalLabel = page.locator('[data-test="subtotal-label"]');
    this.taxLabel = page.locator('[data-test="tax-label"]');
    this.totalLabel = page.locator('[data-test="total-label"]');

    this.completeHeader = page.locator('[data-test="complete-header"]');
    this.backHomeButton = page.locator('[data-test="back-to-products"]');
  }

  async fillCustomerInfo(info: CustomerInfo): Promise<void> {
    await this.fill(this.firstNameInput, info.firstName);
    await this.fill(this.lastNameInput, info.lastName);
    await this.fill(this.postalCodeInput, info.postalCode);
    await this.clickWhenReady(this.continueButton);
  }

  async submitCustomerInfoExpectingError(
    info: Partial<CustomerInfo>,
  ): Promise<void> {
    if (info.firstName) await this.firstNameInput.fill(info.firstName);
    if (info.lastName) await this.lastNameInput.fill(info.lastName);
    if (info.postalCode) await this.postalCodeInput.fill(info.postalCode);
    await this.clickWhenReady(this.continueButton);
  }

  async expectError(expected: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(expected);
  }

  /** Reads the three money labels from the overview step. */
  async readTotals(): Promise<{
    subtotal: number;
    tax: number;
    total: number;
  }> {
    const parse = async (loc: Locator): Promise<number> => {
      const text = await loc.innerText();
      return Number(text.replace(/[^0-9.]/g, ''));
    };
    return {
      subtotal: await parse(this.subtotalLabel),
      tax: await parse(this.taxLabel),
      total: await parse(this.totalLabel),
    };
  }

  async finish(): Promise<void> {
    await this.clickWhenReady(this.finishButton);
  }

  async expectOrderComplete(): Promise<void> {
    await expect(this.completeHeader).toBeVisible();
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async backToProducts(): Promise<void> {
    await this.clickWhenReady(this.backHomeButton);
  }
}
