# Research: VanillaJS Web Components Testing in 2026

## Original Stack (2020)
- Jest 25.x
- jest-environment-jsdom-sixteen (workaround for custom elements)
- jsdom 16.x
- live-server for visual testing
- concurrently

## Current Landscape (2026)

### Primary Recommendation: Web Test Runner

**@web/test-runner** from modern-web.dev

- Specifically designed for testing web components
- Runs tests in **real browsers** (Chromium, Firefox, WebKit via Playwright)
- Native ES modules support
- No jsdom limitations with Shadow DOM
- Recommended by Lit team for web component testing

```bash
npm install --save-dev @web/test-runner @web/test-runner-playwright
```

**Sources:**
- https://modern-web.dev/docs/test-runner/overview/
- https://lit.dev/docs/tools/testing/

### Alternative: Vitest with Browser Mode

**Vitest** - Modern Jest replacement

- 10-20x faster than Jest
- Native ESM support
- Browser mode runs tests in real browser (via Playwright)
- Same syntax as Jest (easy migration)

```bash
npm install --save-dev vitest @vitest/browser playwright
```

**Sources:**
- https://vitest.dev/guide/browser/
- https://www.epicweb.dev/vitest-browser-mode-vs-playwright

### If Staying with Jest: Happy-DOM

**@happy-dom/jest-environment**

- Better web components support than jsdom
- Drop-in replacement for jest-environment-jsdom
- Supports custom elements and shadow DOM

```bash
npm install --save-dev @happy-dom/jest-environment
```

**Sources:**
- https://github.com/capricorn86/jest-environment-happy-dom

## Key Issues with Original Approach

1. **jest-environment-jsdom-sixteen** - Deprecated, no longer maintained
2. **jsdom limitations** - Shadow DOM still not fully reliable
3. **Node environment** - Testing browser code in Node is inherently limited
4. **concurrently + live-server** - Still valid for visual testing

## Recommended Modern Stack

### Option A: Web Test Runner (Recommended)
```json
{
  "devDependencies": {
    "@web/test-runner": "^0.19.0",
    "@web/test-runner-playwright": "^0.11.0",
    "@esm-bundle/chai": "^4.3.4"
  },
  "scripts": {
    "test": "web-test-runner \"**/*.test.js\" --node-resolve --playwright --browsers chromium",
    "test:watch": "npm run test -- --watch"
  }
}
```

### Option B: Vitest Browser Mode
```json
{
  "devDependencies": {
    "vitest": "^2.0.0",
    "@vitest/browser": "^2.0.0",
    "playwright": "^1.45.0"
  },
  "scripts": {
    "test": "vitest --browser.enabled --browser.name=chromium",
    "test:watch": "vitest --browser.enabled --browser.name=chromium --watch"
  }
}
```

### Visual Testing (unchanged)
```json
{
  "devDependencies": {
    "live-server": "^1.2.2"
  },
  "scripts": {
    "dev": "live-server"
  }
}
```

## What to Update in Article

1. Replace Jest + jsdom-sixteen with Web Test Runner
2. Update all npm package versions
3. Simplify test configuration (WTR is simpler)
4. Keep visual testing with live-server (still valid)
5. Update test file syntax (minor changes)
6. Add section on modern alternatives (Vitest, Playwright)
7. Update the component code to modern ES standards

## Modern Web Component Patterns (2026)

- Native ES modules (no CommonJS/require)
- Declarative Shadow DOM option
- CSS Constructable Stylesheets
- Form-associated custom elements
- ElementInternals API
