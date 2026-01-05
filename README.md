# hallucn

[shadcn/ui](https://github.com/shadcn-ui/ui) but web components instead of React.

## Why

shadcn is a fantastic approach. Owning your components gives you control and strengthens your skills.

But React comes with costs:

1. **Runtime overhead** — [React hurts real-world performance](https://infrequently.org/2024/11/if-not-react-then-what/)
2. **Framework lock-in** — Your components only work in React projects

hallucn brings shadcn's components to the web platform. Use them in React, Vue, Svelte, vanilla JS—or anywhere HTML works.

## Tech Choices

| Choice                | Why                                                                         |
| --------------------- | --------------------------------------------------------------------------- |
| **Lit**               | Lightweight, fast, great DX with decorators and reactive properties         |
| **Light DOM**         | Tailwind classes apply directly - no shadow DOM styling headaches           |
| **Tailwind required** | Components emit Tailwind classes; consumers provide Tailwind in their build |
| **Test-driven**       | React components are the spec; visual snapshot tests ensure pixel parity    |

## Structure

```
src/
├── components/        # React components (READ-ONLY reference)
├── web-components/    # Lit web component implementations
└── lib/utils.ts       # Utilities (cn function)

tests/
├── react/             # React component tests (generate baselines)
└── web-components/    # Web component tests (compare against baselines)
```

## Progress

See [CLAUDE.md](./CLAUDE.md#conversion-progress) for the full checklist.

## TODO

- Add workflow step to compare implementation to other component libraries
- Add contributing guide on how to contribute (ideall someone has claude code)
- Distribution/demo repo

## Development

```bash
npm install
npm test              # Run tests in watch mode
npm run test:ui       # Open Vitest UI
npm run test:run      # Run tests once
npm run typecheck     # TypeScript validation
npm run lint          # ESLint
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier format
npm run format:check  # Check formatting
```

## License

Licensed under the [MIT license](./LICENSE.md).

## Acknowledgments

This project is a fork of [shadcn/ui](https://github.com/shadcn-ui/ui) by [shadcn](https://twitter.com/shadcn).
