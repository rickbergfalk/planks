# AGENTS.md

This file provides guidance for AI agents working with code in this repository.

## Quick Start

This is a **Lit web component library** that converts shadcn/ui React components to framework-agnostic web components.

### Key Commands
```bash
npm test              # Run tests (Vitest browser mode)
npm run typecheck     # Type-check codebase
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
```

### Architecture
- `src/components/` - React components (READ-ONLY reference)
- `src/web-components/` - Lit web component implementations  
- `tests/` - Behavioral and visual tests
- Component prefix: `hal-` (e.g., `<hal-button>`)

### Critical Rules
- **NEVER modify React components** - they serve as the specification
- **Light DOM only** - no Shadow DOM, no `<slot>` projection
- **Match React styling exactly** - use same Tailwind classes
- **Test-driven development** - write tests first, then implement

### Implementation Patterns
1. **Self-styled** - Style the element directly (badge, card, separator)
2. **Inner native element** - Render form control inside (input, textarea)  
3. **Manual child distribution** - Move children into semantic element (label)

### Testing Requirements
- Visual tests MUST compare against React baselines
- Use `toMatchScreenshot()` not `toMatchFileSnapshot()`
- Add semantic structure tests for native elements
- Maximum 1% variance allowed for complex components

See `CLAUDE.md` for comprehensive documentation.