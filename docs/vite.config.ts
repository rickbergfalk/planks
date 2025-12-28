import { defineConfig } from "vite"
import tailwindcss from "@tailwindcss/vite"
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
  base: process.env.CI ? "/planks/" : "/",
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "../src"),
    },
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
