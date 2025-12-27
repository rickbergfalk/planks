# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Planks is a hard fork of shadcn/ui with a different goal: converting React components to framework-agnostic web components. Like the Ship of Theseus, we're replacing each React component "plank by plank" until we have something entirely new.

**Current state**: 55 React components in `src/components/` that need to be converted to web components.

## Commands

```bash
npm run typecheck    # Type-check the codebase
```

## Architecture

### Directory Structure

- `src/components/` - 55 UI components (currently React, to be converted to web components)
- `src/hooks/` - React hooks (e.g., `use-mobile.ts`)
- `src/lib/utils.ts` - Utility functions (primarily `cn()` for class name merging)
- `reference/examples/` - 230+ component usage examples (React, for reference only)
- `reference/blocks/` - 32 pre-composed UI patterns (React, for reference only)

### Import Aliases

- `@/*` maps to `./src/*`

### Component Patterns

Current React components use:
- **Radix UI primitives** - Headless UI primitives that will need web component alternatives
- **class-variance-authority (cva)** - Variant-based styling with Tailwind classes
- **data-slot attributes** - Each component has `data-slot="component-name"` for styling hooks
- **Tailwind CSS** - All styling via utility classes

Example component structure:
```tsx
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", destructive: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
  defaultVariants: { variant: "default", size: "default" },
})

function Button({ className, variant, size, ...props }) {
  return (
    <button
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Dependencies to Replace

When converting to web components, these React-specific dependencies need alternatives:
- `@radix-ui/*` - Radix primitives (accessibility, behavior)
- `react-hook-form` - Form state management
- `lucide-react` - Icons
- `class-variance-authority` - May keep for variant logic
- `clsx` + `tailwind-merge` - Can keep for `cn()` utility

## Conversion Goals

The end goal is web components that:
1. Work in any framework (React, Vue, Svelte, vanilla JS)
2. Maintain the same Tailwind-based styling approach
3. Preserve accessibility features from Radix primitives
4. Keep the variant-based API pattern
