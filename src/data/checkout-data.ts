export interface CustomerInfo {
  readonly firstName: string;
  readonly lastName: string;
  readonly postalCode: string;
}

export const validCustomer: CustomerInfo = {
  firstName: 'Lakshmi',
  lastName: 'QA',
  postalCode: 'V3S 0A1',
};

/**
 * Product display names as they appear on SauceDemo. Keeping them centralized
 * means a copy change on the site is a one-line fix here, not a scavenger hunt
 * through the specs.
 */
export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
  fleeceJacket: 'Sauce Labs Fleece Jacket',
  onesie: 'Sauce Labs Onesie',
  redTShirt: 'Test.allTheThings() T-Shirt (Red)',
} as const;

export type ProductName = (typeof products)[keyof typeof products];
