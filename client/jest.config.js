/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/src/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  // Transpile-only (no cross-file type-checking) so pure-logic util tests don't
  // pull in React Native / Expo types via `import type` statements.
  // isolatedModules lives in tsconfig.spec.json to keep the app tsconfig untouched.
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
}
