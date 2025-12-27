# Component Conversion Strategy

This document outlines our test-driven approach for converting React components to web components using **Lit**.

## Philosophy

The React components in `src/components/` are **artifacts and guiding stars** - we never modify them. They represent the target behavior and visual appearance we're trying to replicate.

We use tests as the specification. Tests written for React components define what the web component must do.

## Approach

### Phase 1: Test the React Component

1. **Behavioral tests** - Test component behavior, props, events, accessibility attributes
2. **Visual snapshots** - Capture rendered appearance using Vitest browser mode
3. **Interaction tests** - Test user interactions (clicks, keyboard, focus)

### Phase 2: Create Web Component Test Stubs

1. Copy/adapt React tests for web component API
2. Adjust for web component patterns (attributes vs props, custom events vs callbacks)
3. All tests will fail initially - this is expected

### Phase 3: Implement Web Component

1. Implement until tests pass
2. Compare visual snapshots between React and web component versions
3. Iterate until behavior and appearance match

## Directory Structure

```
src/
├── components/           # React components (READ-ONLY, never modify)
├── web-components/       # Web component implementations
├── lib/
│   └── utils.ts
└── hooks/

tests/
├── react/               # Tests for React components
│   ├── button.test.tsx
│   └── __snapshots__/
├── web-components/      # Tests for web components
│   ├── button.test.ts
│   └── __snapshots__/
└── setup.ts
```

## API Mapping Principles

| React Pattern | Web Component Pattern |
|---------------|----------------------|
| `props.variant="destructive"` | `attribute variant="destructive"` |
| `props.disabled={true}` | `attribute disabled` (boolean) |
| `props.onClick={fn}` | `addEventListener('click', fn)` |
| `props.onOpenChange={fn}` | `addEventListener('open-change', fn)` (custom event) |
| `props.children` | `<slot></slot>` (default slot) |
| `props.asChild` | **Not supported** - Radix Slot pattern doesn't translate |
| `className` | `class` attribute (Tailwind classes merge naturally) |

## Component Conversion Checklist

For each component:

- [ ] **React Tests**
  - [ ] Write behavioral tests for all props/variants
  - [ ] Write accessibility tests (ARIA attributes, keyboard navigation)
  - [ ] Capture visual snapshots for each variant/state
  - [ ] Test interaction behaviors

- [ ] **Web Component Test Stubs**
  - [ ] Create equivalent tests adapted for web component API
  - [ ] Verify all tests fail (no implementation yet)

- [ ] **Implementation (Lit)**
  - [ ] Create Lit component class extending `LitElement`
  - [ ] Use `createRenderRoot() { return this }` for light DOM
  - [ ] Define `@property()` decorators for reactive attributes
  - [ ] Implement `<slot>` for content projection
  - [ ] Apply same Tailwind classes as React version
  - [ ] Add accessibility attributes (ARIA)
  - [ ] Implement keyboard handling
  - [ ] Pass all behavioral tests
  - [ ] Visual snapshots match React version (within tolerance)

- [ ] **Documentation**
  - [ ] Document any API differences from React version
  - [ ] Note any limitations or intentional deviations

## Test Configuration

Using Vitest with browser mode for real DOM testing and visual snapshots.

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
    },
  },
})
```

## Starting Point

Start with simple, leaf components that have no dependencies on other components:

1. **button** - Simple, foundational, well-understood
2. **badge** - Simple variant-based styling
3. **separator** - Minimal behavior
4. **skeleton** - Pure styling
5. **label** - Simple with accessibility concerns

Then progress to components with increasing complexity:
- Components with internal state
- Components with slots/children
- Components with keyboard interaction
- Compound components (e.g., Dialog with DialogTrigger, DialogContent)

## Resolved Decisions

- [x] **Tailwind**: Consumer must have Tailwind in their build. Components emit Tailwind classes.
- [x] **Light DOM**: No Shadow DOM. This allows Tailwind styles to apply naturally.
- [x] **Framework**: Lit for web components.
- [x] **asChild**: Not supported. Users needing button-as-link should use React version or apply classes manually.
- [x] **Element prefix**: `plank-` (e.g., `<plank-button>`, class `PlankButton`)
- [x] **shadcn style**: "New York" variant (smaller border radius, more compact)
- [x] **Theme**: Default shadcn theme with OKLCH colors

## Open Questions

- [ ] How to replicate Radix accessibility patterns in Lit?
- [ ] Bundle/distribution format?

## References

- [Simon Willison: Porting via LLM with TDD](https://simonwillison.net/2025/Dec/15/porting-justhtml/)
- [Vitest Browser Mode](https://vitest.dev/guide/browser.html)
- [Lit Documentation](https://lit.dev/docs/)
- [Lit Light DOM](https://lit.dev/docs/components/shadow-dom/#implementing-createrenderroot)
