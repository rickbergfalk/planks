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
- Use `<slot>` for content projection (replaces `children`)
- Fire custom events (e.g., `open-change`) instead of callback props
- Preserve `data-slot` attributes for styling consistency
- **Gotcha**: `disabled:` Tailwind variants don't work on custom elements - add `opacity-50 pointer-events-none` explicitly when disabled
- **Gotcha**: Custom elements are `display: inline` by default - add `block` class when the React equivalent is a block-level element

## API Mapping

| React | Web Component (Lit) |
|-------|---------------------|
| `variant="destructive"` | `variant="destructive"` attribute |
| `disabled={true}` | `disabled` boolean attribute |
| `onClick={fn}` | `@click` / `addEventListener('click', fn)` |
| `onOpenChange={fn}` | `@open-change` / custom event |
| `children` | `<slot></slot>` |
| `className="..."` | `class="..."` |
| `asChild` | Not supported (see Deferred section) |

## Conversion Workflow

See `CONVERSION-STRATEGY.md` for the full test-driven approach:

1. Write behavioral + visual tests for React component
2. Create equivalent test stubs for web component (all failing)
3. Implement Lit component until tests pass
4. Compare visual snapshots

## Starting Order

Begin with simple leaf components:
1. button, badge, separator, skeleton, label
2. Then components with state/interaction
3. Finally compound components (Dialog, Sheet, etc.)
