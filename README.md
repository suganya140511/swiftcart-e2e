# swiftcart-e2e

A production-grade end-to-end test automation framework built with **Playwright** and **TypeScript**, using the **Page Object Model**. It exercises a real e-commerce UI ([SauceDemo](https://www.saucedemo.com)) across Chromium, Firefox, and WebKit, and a real REST API ([Restful-Booker](https://restful-booker.herokuapp.com)) through a typed API client — all wired into **CI via GitHub Actions**.

[![Playwright Tests](https://github.com/<your-username>/swiftcart-e2e/actions/workflows/playwright.yml/badge.svg)](https://github.com/<your-username>/swiftcart-e2e/actions/workflows/playwright.yml)

---

## What this demonstrates

- **Page Object Model** with a shared `BasePage` — selectors and interactions live in one place, tests read like user stories.
- **Cross-browser coverage** — the UI suite runs on Chromium, Firefox, and WebKit, plus a mobile-emulation smoke project (Pixel 7).
- **UI + API in one framework** — SauceDemo UI flows and a full Restful-Booker CRUD lifecycle share the same config, fixtures, and reporting.
- **Custom fixtures** — page objects and a pre-authenticated user are injected into tests, eliminating repetitive setup.
- **Typed test data** — users, products, customers, and booking payloads are strongly typed with a booking builder for overrides.
- **CI/CD** — GitHub Actions runs lint + type-check, the API suite, and a sharded cross-browser UI matrix, uploading HTML reports as artifacts. Includes a nightly scheduled run to catch drift in the demo sites.
- **Quality gates** — strict TypeScript, ESLint (with the Playwright plugin), and Prettier all enforced in CI.

## Tech stack

| Concern            | Choice                                   |
| ------------------ | ---------------------------------------- |
| Runner             | Playwright Test                          |
| Language           | TypeScript (strict)                      |
| Pattern            | Page Object Model + fixtures             |
| UI target          | SauceDemo                                |
| API target         | Restful-Booker                           |
| CI                 | GitHub Actions (matrix + scheduled)      |
| Reporting          | HTML, list, JSON, JUnit                  |
| Lint / format      | ESLint + eslint-plugin-playwright, Prettier |

## Project structure

```
swiftcart-e2e/
├── .github/workflows/playwright.yml   # CI: lint, API, cross-browser UI matrix
├── playwright.config.ts               # projects: api + chromium/firefox/webkit + mobile
├── src/
│   ├── pages/                         # Page Object Model
│   │   ├── BasePage.ts
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   ├── api/
│   │   └── BookingApiClient.ts        # typed Restful-Booker client (auth + CRUD)
│   ├── fixtures/
│   │   └── test-fixtures.ts           # injects page objects, logged-in user, API client
│   ├── data/                          # typed test data + builders
│   │   ├── users.ts
│   │   ├── checkout-data.ts
│   │   └── booking-data.ts
│   └── utils/
│       └── logger.ts
└── tests/
    ├── ui/                            # login, inventory, cart, checkout
    └── api/                           # auth, booking CRUD, contracts & authorization
```

## Getting started

Requires Node.js 18+.

```bash
# 1. Install dependencies
npm ci

# 2. Install browsers (first run only)
npx playwright install --with-deps

# 3. (Optional) point the suites elsewhere
cp .env.example .env   # override UI_BASE_URL / API_BASE_URL if needed
```

## Running the tests

```bash
npm test                 # everything (API + all browsers)
npm run test:ui          # UI suite only
npm run test:api         # API suite only
npm run test:chromium    # single browser
npm run test:smoke       # @smoke-tagged tests only
npm run test:regression  # @regression-tagged tests only
npm run test:headed      # watch it run
npm run test:debug       # Playwright inspector
npm run report           # open the last HTML report
```

Quality gates:

```bash
npm run typecheck
npm run lint
npm run format:check
```

## Test coverage

**UI — SauceDemo**

- Login: standard user success, locked-out user, invalid password, missing username.
- Inventory: product count, add/remove with cart-badge assertions, sort by name and price.
- Cart: contents mirror inventory actions, continue-shopping navigation.
- Checkout: full happy-path purchase with total-math validation, required-field validation, post-order navigation.

**API — Restful-Booker**

- Auth & health: `/ping` health check, token issuance, bad-credentials handling.
- CRUD lifecycle: create, read-back, full update (PUT), partial update (PATCH), delete + 404 confirmation.
- Contracts & authorization: list shape, name filtering, unauthorized delete (403), non-existent resource (404).

## Design notes

- **Why POM + fixtures?** The `BasePage` centralizes waits and click/fill helpers; concrete pages expose intent-revealing methods (`addToCart`, `fillCustomerInfo`) instead of raw locators. Fixtures then hand a test exactly the objects it needs, so setup isn't copy-pasted across `beforeEach` blocks.
- **Locator strategy** — SauceDemo's `data-test` attributes are used throughout, which are the most stable selectors available on that site.
- **API auth** — Restful-Booker guards writes behind a token from `POST /auth`; `BookingApiClient` fetches it lazily and sends it as a cookie, matching the documented contract.
- **Flake control** — retries and traces are enabled only on CI (`trace: 'on-first-retry'`), so local failures surface immediately while CI stays resilient to demo-site hiccups.

## CI pipeline

On every push and pull request (plus a nightly cron and manual dispatch):

1. **lint** — Prettier check, ESLint, and `tsc --noEmit`.
2. **api-tests** — the Restful-Booker suite.
3. **ui-tests** — a `fail-fast: false` matrix across Chromium, Firefox, and WebKit.

HTML reports upload as artifacts on every run for post-mortem debugging.

## License

MIT
