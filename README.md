# planks

[shadcn/ui](https://github.com/shadcn-ui/ui) but web components instead of React.

Like the [Ship of Theseus](https://en.wikipedia.org/wiki/Ship_of_Theseus), we're replacing each React component plank by plank until we have something entirely new.

## Why

shadcn is a fantastic approach. Owning your components gives you control and strengthens your skills.

But React comes with costs:

1. **Runtime overhead** — [React hurts real-world performance](https://infrequently.org/2024/11/if-not-react-then-what/)
2. **Framework lock-in** — Your components only work in React projects

planks brings shadcn's components to the web platform. Use them in React, Vue, Svelte, vanilla JS—or anywhere HTML works.

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

- ~~Add github actions to validate tests~~ ✅ (typecheck + tests run on push/PR)
- Add linting and formatting (ESLint, Prettier)
- Add workflow step to compare implementation to other component libraries
- Add simple demo pages, with note on setting up a real docs site using web components once done
- Add workflow step to add a demo page
- Add contributing guide on how to contribute (ideall someone has claude code)
- Distribution/demo repo

## Development

```bash
npm install
npm test              # Run tests in watch mode
npm run test:ui       # Open Vitest UI
npm run test:run      # Run tests once
npm run typecheck     # TypeScript validation
```

## License

Licensed under the [MIT license](./LICENSE.md).

## Acknowledgments

This project is a fork of [shadcn/ui](https://github.com/shadcn-ui/ui) by [shadcn](https://twitter.com/shadcn).
