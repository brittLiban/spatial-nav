# Test Suite Design: Spatial Awareness Navigator

**Date:** 2026-06-15
**Status:** Approved, implementing
**Scope:** Focused & high-value. Server-side pipeline e2e.

## Goal

Add unit, integration, and e2e tests to a repo that currently has **zero** test
infrastructure. Match effort to a 4-week capstone demo: cover the high-value
pure logic and the server request surface, plus one realistic end-to-end pass.
Everything must run in CI without a phone, camera, or emulator. The e2e layer is
opt-in and self-skips when the live stack isn't available.

## Frameworks

| Layer | Runner | Notes |
|-------|--------|-------|
| Client logic | Jest + ts-jest | Util files are pure TS with type-only RN imports, no native mocking needed |
| Server unit/integration | Jest + supertest | `global.fetch` and `groq-sdk` mocked for determinism |
| E2E | Jest (real HTTP) | Drives the running Node + Python stack; opt-in |

## 1. Unit tests

### `client/src/utils/detectionFilters.test.ts`
- `getBoxAreaRatio`, area ratio math from `[x, y, w, h]`
- `getDirection`, left (<0.35) / right (>0.65) / ahead, by box-center x
- proximity (via `filterDetections` output), immediate ≥0.12, close ≥0.04, else approaching
- `filterDetections`, drops below `MIN_CONFIDENCE`, drops non-`RELEVANT_CLASSES`,
  drops boxes below `MIN_BOX_AREA_RATIO`, keeps valid; returns `[]` when frame dims are 0
- `pickPrimaryDetection`, highest `alarmScore` wins; verifies
  `areaRatio × classPriority × directionWeight` ranking (e.g. person-ahead beats
  a small bicycle on the side; ahead's 1.5× weight applies); returns `null` when empty

### `server/test/unit/alert.fallback.test.js`
- `buildFallback(class, direction, proximity)` phrasing:
  - immediate → urgent ("... right in front of you!")
  - close → moderate ("... close on your left")
  - approaching/other → standard ("... on your right")
  - capitalizes the class label

## 2. Integration tests (server routes, externals mocked)

### `server/test/integration/health.test.js`
- `detectService: 'ok'` when the Python `/health` fetch resolves ok
- `detectService: 'down'` when the fetch rejects

### `server/test/integration/detect.test.js`
- 400 when `image` is missing
- proxies to Python and returns `{ width, height, detections }` on success
- forwards Python's non-ok status + body
- 503 when the Python fetch rejects (service unreachable)

### `server/test/integration/alert.test.js`
- 400 when `class` or `direction` is missing
- returns Groq-generated `alertText` on success (groq-sdk mocked)
- returns `buildFallback` text when the Groq call throws

## 3. E2E, server-side pipeline

### `server/test/e2e/pipeline.e2e.test.js`
Real image → `POST /detect` (real YOLOv8) → pick top detection by score →
compute direction/proximity with the same thresholds → `POST /alert` (real Groq)
→ assert a non-empty alert string ≤ ~12 words.

- Runs via `npm run test:e2e` only (excluded from default `npm test`)
- Base URL from `E2E_BASE_URL` (default `http://localhost:3001`)
- **Self-skips** (does not fail) when `/health` is unreachable or `detectService` is down
- Fixture image at `server/test/fixtures/sample.jpg`; downloads Ultralytics
  `bus.jpg` if absent and network is available, else skips

## Refactors (testability seams, no behavior change)

1. `server/index.js`, `module.exports = app`; guard `app.listen(...)` with
   `if (require.main === module)` so tests import the app without binding a port.
2. `server/routes/alert.js`, also export `buildFallback`
   (`module.exports.buildFallback = buildFallback`).

## Scripts / deps added

- `client/package.json`: `"test": "jest"`; devDeps `jest`, `ts-jest`, `@types/jest`
- `server/package.json`: `"test": "jest"`, `"test:e2e": "jest --config jest.e2e.config.js"`;
  devDeps `jest`, `supertest`

## Out of scope (deliberate, per Focused choice)

- Python `pytest` suite
- React Native component-render tests
- GitHub Actions CI workflow

All three are noted as easy follow-ups.
