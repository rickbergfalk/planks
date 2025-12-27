# planks

A web components library built plank by plank. Forked from [shadcn/ui](https://github.com/shadcn-ui/ui) and gradually transforming into framework-agnostic web components.

Like the [Ship of Theseus](https://en.wikipedia.org/wiki/Ship_of_Theseus), we're replacing each React component plank by plank until we have something entirely new.

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

## Development

```bash
npm install
npm test              # Run tests in watch mode
npm run test:ui       # Open Vitest UI
npm run test:run      # Run tests once
```

## On AI Use

This project was developed with AI assistance. The author is [really conflicted about it](./AI-DISCLOSURE.md).

## License

Licensed under the [MIT license](./LICENSE.md).

## Acknowledgments

This project is a fork of [shadcn/ui](https://github.com/shadcn-ui/ui) by [shadcn](https://twitter.com/shadcn).
