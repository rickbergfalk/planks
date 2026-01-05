import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-label"
import type { HalLabel } from "@/web-components/hal-label"

/**
 * Visual tests for HalLabel web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalLabel (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-label")
    const labels = container.querySelectorAll("hal-label")
    await Promise.all(
      Array.from(labels).map((l) => (l as HalLabel).updateComplete)
    )
  }

  it("default label matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px;">
        <hal-label>Email address</hal-label>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "label-default"
    )
  })

  it("label with input matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; display: flex; flex-direction: column; gap: 4px;">
        <hal-label for="email">Email</hal-label>
        <input id="email" type="email" placeholder="Enter email" class="border rounded px-2 py-1 text-sm" />
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "label-with-input"
    )
  })
})
