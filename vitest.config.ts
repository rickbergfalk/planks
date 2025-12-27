import { defineConfig } from "vitest/config"
import { playwright } from "@vitest/browser-playwright"
import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      "@": new URL("./src", import.meta.url).pathname,
    },
  },
  test: {
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: "chromium" }],
      expect: {
        toMatchScreenshot: {
          // Web component tests compare against React baselines
          resolveScreenshotPath: ({ testFileDirectory, testFileName, arg, browserName, platform, ext }) => {
            // For web component tests, use React screenshots as baseline
            if (testFileDirectory.includes("web-components")) {
              return `tests/react/__screenshots__/button.visual.test.tsx/${arg}-${browserName}-${platform}${ext}`
            }
            // Default path for React tests
            return `${testFileDirectory}/__screenshots__/${testFileName}/${arg}-${browserName}-${platform}${ext}`
          },
        },
      },
    },
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["./tests/setup.ts"],
  },
})
