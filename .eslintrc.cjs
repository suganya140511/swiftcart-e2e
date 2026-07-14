module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 2022, sourceType: 'module' },
  plugins: ['@typescript-eslint', 'playwright'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:playwright/recommended',
    'prettier',
  ],
  env: { node: true, es2022: true },
  ignorePatterns: ['node_modules', 'test-results', 'playwright-report', 'dist'],
  rules: {
    '@typescript-eslint/no-non-null-assertion': 'off',
    'playwright/no-conditional-in-test': 'off',
    'playwright/expect-expect': 'off',
  },
};
