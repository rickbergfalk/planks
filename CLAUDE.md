# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Planks is a hard fork of shadcn/ui with a different goal: converting React components to framework-agnostic web components using **Lit**. Like the Ship of Theseus, we're replacing each React component "plank by plank" until we have something entirely new.

**Target audience**: Developers already using shadcn/ui and Tailwind who want to use web components alongside their existing setup.

## Key Decisions

- **Lit** for web components
- **Light DOM** (not Shadow DOM) for easy Tailwind integration
- **Tailwind required** in consumer's build - components emit Tailwind classes
- **Element prefix**: `plank-` (e.g., `<plank-button>`, class `PlankButton`)
- **Test-driven conversion** - write tests for React component first, then implement web component to pass equivalent tests
- **React components are READ-ONLY** - never modify `src/components/`, they serve as the specification

## Styling

- **shadcn style**: "New York" (smaller border radius, more compact than "Default")
- **Theme**: Default shadcn theme with OKLCH colors
- **Tailwind v4**: Uses `@theme inline` directive for CSS variable mapping

The test CSS (`tests/styles.css`) contains the complete theme definition that matches shadcn's default theme.

## Deferred/Punted

- **`asChild` pattern** - Radix's Slot-based composition doesn't translate to web components. Users needing a button-styled link should use the React version or apply classes manually.

## Commands

```bash
npm test             # Run tests in watch mode (Vitest browser mode)
npm run test:run     # Run tests once
npm run test:ui      # Open Vitest UI in browser
npm run typecheck    # Type-check the codebase
```

## Architecture

### Directory Structure

```
src/
├── components/        # React components (READ-ONLY reference)
├── web-components/    # Lit web component implementations
├── hooks/             # React hooks
└── lib/utils.ts       # Utilities (cn function)

tests/
├── react/             # Tests for React components
└── web-components/    # Tests for web components

reference/
├── examples/          # 230+ React usage examples
└── blocks/            # 32 pre-composed UI patterns
```

### Import Aliases

- `@/*` maps to `./src/*`

### React Component Patterns (Reference)

The React components use:
- **Radix UI primitives** - Headless UI primitives (to be replicated in Lit)
- **class-variance-authority (cva)** - Variant-based styling
- **data-slot attributes** - `data-slot="component-name"` for styling hooks
- **Tailwind CSS** - All styling via utility classes

### Web Component Patterns (Target)

Web components should:
- Use Lit's `@property` decorators for reactive attributes
- Emit the same Tailwind classes as React equivalents
- Fire custom events (e.g., `open-change`) instead of callback props
- Preserve `data-slot` attributes for styling consistency

**Critical: `<slot>` does NOT work in Light DOM!**

In Lit's light DOM mode (`createRenderRoot() { return this }`), the native `<slot>` element does NOT project children. Children stay as siblings of rendered content, not inside it. This breaks semantic structure if you need content inside a native element.

**Three implementation patterns:**

| Pattern | When to use | Examples |
|---------|-------------|----------|
| **Self-styled** | Purely presentational, no semantic element required | badge, card, separator, skeleton |
| **Inner native element** | Wraps a form control that needs native behavior | input, textarea |
| **Manual child distribution** | Needs native semantic element with children inside | label |

**1. Self-styled components** (badge, card, separator, skeleton, button)
```typescript
willUpdate() {
  this.className = cn("...")  // Style the element itself
  this.dataset.slot = "component"
}
render() {
  return html``  // Render nothing, children stay in place
}
```

**2. Inner native element** (input, textarea)
```typescript
render() {
  return html`<input class=${classes} .value=${this.value} />`
}
```

**3. Manual child distribution** (label)
- Required when children must be INSIDE a native semantic element
- Move children in `firstUpdated()` after Lit renders the target element
```typescript
firstUpdated() {
  const label = this.querySelector("label")
  const children = [...this.childNodes].filter(n => n !== label && n.nodeType !== Node.COMMENT_NODE)
  children.forEach(child => label?.appendChild(child))
}
render() {
  return html`<label for=${this.for}></label>`
}
```

**How to decide which pattern:**
1. Does React render a native semantic element (`<label>`, `<input>`, `<button>`)?
2. Must children be INSIDE that element for accessibility?
   - Yes → Use **manual child distribution**
   - No (element has no children, or children can be siblings) → Use **self-styled** or **inner native element**

**Gotchas:**
- `disabled:` Tailwind variants don't work on custom elements - add `opacity-50 pointer-events-none` explicitly
- Custom elements are `display: inline` by default - add `block` class when needed
- Use `willUpdate()` not `updated()` when setting `this.className` to avoid infinite update loops

## API Mapping

| React | Web Component (Lit) |
|-------|---------------------|
| `variant="destructive"` | `variant="destructive"` attribute |
| `disabled={true}` | `disabled` boolean attribute |
| `onClick={fn}` | `@click` / `addEventListener('click', fn)` |
| `onOpenChange={fn}` | `@open-change` / custom event |
| `children` | Children stay in place (no slot projection in light DOM) |
| `className="..."` | `class="..."` |
| `asChild` | Not supported (see Deferred section) |

## Testing Requirements

### Test Categories

1. **Behavioral tests** (`tests/web-components/*.test.ts`)
   - Property/attribute handling
   - Event firing
   - State management

2. **Visual tests** (`tests/web-components/*.visual.test.ts`)
   - Screenshot comparison against React baselines
   - Pixel-perfect verification

3. **Semantic structure tests** (`tests/web-components/semantic-structure.test.ts`)
   - Verify native semantic elements exist where required
   - Verify text content is INSIDE semantic elements (catches slot bugs)
   - Verify ARIA roles and attributes

### Adding Semantic Tests for New Components

When converting a new component, add a test to `semantic-structure.test.ts`:

```typescript
describe("plank-newcomponent", () => {
  it("must contain native <element> with content inside", async () => {
    container.innerHTML = `<plank-newcomponent>Test Content</plank-newcomponent>`
    await customElements.whenDefined("plank-newcomponent")
    const element = container.querySelector("plank-newcomponent")!
    await (element as any).updateComplete

    // If component needs a native semantic element:
    const nativeEl = element.querySelector("element")
    expect(nativeEl, "Must contain native <element>").toBeTruthy()
    expect(nativeEl?.textContent).toContain("Test Content")
  })
})
```

## Conversion Workflow

1. **Analyze React component structure**
   - What native semantic elements does it render? (`<label>`, `<button>`, `<input>`, etc.)
   - Must children be inside those elements for accessibility?
   - This determines which implementation pattern to use

2. Write behavioral + visual tests for React component
3. **Add semantic structure test** for any native semantic elements identified in step 1
4. Create equivalent test stubs for web component (all failing)
5. Implement Lit component until tests pass
6. Compare visual snapshots

## Conversion Progress

### Tier 1 - Simple leaf components ✅
- [x] button
- [x] badge
- [x] separator
- [x] skeleton
- [x] label

### Tier 2 - Simple styled elements (no Radix, no state)
- [x] input
- [x] textarea
- [x] card (multi-part)
- [ ] alert
- [ ] kbd
- [ ] progress
- [ ] aspect-ratio

### Tier 3 - Components with state
- [ ] switch
- [ ] checkbox
- [ ] toggle
- [ ] avatar (multi-part)

### Tier 4 - Multi-part with state
- [ ] collapsible
- [ ] accordion
- [ ] tabs
- [ ] radio-group
- [ ] toggle-group
- [ ] slider

### Tier 5 - Positioned/Portal components
- [ ] tooltip
- [ ] popover
- [ ] dropdown-menu
- [ ] context-menu
- [ ] dialog
- [ ] alert-dialog
- [ ] sheet
- [ ] drawer
- [ ] hover-card
- [ ] select
- [ ] combobox
- [ ] command

### Tier 6 - Complex compositions
- [ ] table
- [ ] calendar
- [ ] carousel
- [ ] form
- [ ] pagination
- [ ] breadcrumb
- [ ] navigation-menu
- [ ] menubar
- [ ] sidebar
- [ ] resizable
- [ ] scroll-area
- [ ] input-group
- [ ] input-otp
- [ ] sonner
- [ ] chart

## Open Questions

- [ ] How to replicate Radix accessibility patterns in Lit?
- [ ] Bundle/distribution format?

## References

- [Simon Willison: Porting via LLM with TDD](https://simonwillison.net/2025/Dec/15/porting-justhtml/)
- [Frontend Masters: Light-DOM-Only Web Components](https://frontendmasters.com/blog/light-dom-only/)
- [Vitest Browser Mode](https://vitest.dev/guide/browser.html)
- [Lit Documentation](https://lit.dev/docs/)
- [Lit Light DOM](https://lit.dev/docs/components/shadow-dom/#implementing-createrenderroot)
