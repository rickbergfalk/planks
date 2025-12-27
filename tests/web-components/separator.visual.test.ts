import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-separator"
import type { PlankSeparator } from "@/web-components/plank-separator"

/**
 * Visual tests for PlankSeparator web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("PlankSeparator (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<PlankSeparator> {
    container.innerHTML = html
    await customElements.whenDefined("plank-separator")
    const sep = container.querySelector("plank-separator") as PlankSeparator
    await sep.updateComplete
    return sep
  }

  it("horizontal separator matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="width: 200px; padding: 8px;">
        <plank-separator></plank-separator>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("separator-horizontal")
  })

  it("vertical separator matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="height: 100px; display: flex; padding: 8px;">
        <plank-separator orientation="vertical"></plank-separator>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("separator-vertical")
  })
})
