import js from "@eslint/js"
import tseslint from "typescript-eslint"
import lit from "eslint-plugin-lit"
import wc from "eslint-plugin-wc"
import litA11y from "eslint-plugin-lit-a11y"
import jsxA11y from "eslint-plugin-jsx-a11y"
import react from "eslint-plugin-react"
import globals from "globals"

export default tseslint.config(
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript rules
  ...tseslint.configs.recommended,

  // Global settings
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },

  // Web components (Lit)
  {
    files: ["src/web-components/**/*.ts"],
    plugins: {
      lit,
      wc,
      "lit-a11y": litA11y,
    },
    rules: {
      // Lit rules
      ...lit.configs.recommended.rules,

      // Web component rules
      ...wc.configs.recommended.rules,
      "wc/require-listener-teardown": "warn",
      // Our light DOM approach intentionally sets this.className for Tailwind
      "wc/no-self-class": "off",

      // Lit accessibility rules
      ...litA11y.configs.recommended.rules,
    },
  },

  // React reference components (READ-ONLY from shadcn)
  // We lint these lightly - they're the spec, not our code to fix
  {
    files: ["src/components/**/*.tsx"],
    plugins: {
      react,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // Basic React rules only
      ...react.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // Using TypeScript for types
      "react/display-name": "off",

      // a11y rules - warn only since these are reference files
      ...Object.fromEntries(
        Object.entries(jsxA11y.configs.recommended.rules).map(([key, value]) => [
          key,
          value === "error" ? "warn" : value,
        ])
      ),

      // Relax TypeScript rules for reference files
      "@typescript-eslint/no-unused-vars": "warn",
      // Explicit override for rule that uses numeric severity
      "jsx-a11y/no-noninteractive-element-interactions": "warn",
    },
  },

  // Test files - more relaxed
  {
    files: ["tests/**/*.ts", "tests/**/*.tsx"],
    rules: {
      // Allow any in tests
      "@typescript-eslint/no-explicit-any": "off",
    },
  },

  // Ignore patterns
  {
    ignores: [
      "node_modules/**",
      "reference/**",
      "dist/**",
      // Files with @ts-nocheck have type issues we're ignoring
      "src/components/chart.tsx",
      "src/components/resizable.tsx",
    ],
  }
)
