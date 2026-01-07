import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import bundleSizePlugin from "./vite-plugin-bundle-size"
import { resolve } from "path"
import { readdirSync } from "fs"

// Get all HTML files in components/ directory
const componentPages = readdirSync(resolve(__dirname, "components"))
  .filter((file) => file.endsWith(".html"))
  .reduce(
    (entries, file) => {
      const name = file.replace(".html", "")
      entries[`components/${name}`] = resolve(__dirname, "components", file)
      return entries
    },
    {} as Record<string, string>
  )

export default defineConfig({
  // Base path for GitHub Pages (repo name)
  base: process.env.CI ? "/hallucn-ui/" : "/",
  plugins: [tailwindcss(), react(), bundleSizePlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "../src"),
      // Use React from root node_modules to avoid duplicate instances
      react: resolve(__dirname, "../node_modules/react"),
      "react-dom": resolve(__dirname, "../node_modules/react-dom"),
      "react-resizable-panels": resolve(
        __dirname,
        "../node_modules/react-resizable-panels"
      ),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@radix-ui/react-switch",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-toggle",
      "@radix-ui/react-progress",
      "@radix-ui/react-slider",
      "@radix-ui/react-avatar",
      "@radix-ui/react-collapsible",
      "@radix-ui/react-accordion",
      "@radix-ui/react-tabs",
      "@radix-ui/react-radio-group",
      "@radix-ui/react-toggle-group",
      "@radix-ui/react-label",
      "@radix-ui/react-separator",
      "class-variance-authority",
      "clsx",
      "tailwind-merge",
      "lucide-react",
      "react-resizable-panels",
    ],
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        ...componentPages,
      },
    },
  },
})
