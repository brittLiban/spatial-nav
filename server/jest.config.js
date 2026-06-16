/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/setup.js'],
  testMatch: ['<rootDir>/test/**/*.test.js'],
  // E2E tests hit the real running stack — run them explicitly via `npm run test:e2e`.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/test/e2e/'],
}
