import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-separator"
import type { HalSeparator } from "@/web-components/hal-separator"

/**
 * Visual tests for HalSeparator web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalSeparator (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<HalSeparator> {
    container.innerHTML = html
    await customElements.whenDefined("hal-separator")
    const sep = container.querySelector("hal-separator") as HalSeparator
    await sep.updateComplete
    return sep
  }

  it("horizontal separator matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="width: 200px; padding: 8px;">
        <hal-separator></hal-separator>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "separator-horizontal"
    )
  })

  it("vertical separator matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="height: 100px; display: flex; padding: 8px;">
        <hal-separator orientation="vertical"></hal-separator>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "separator-vertical"
    )
  })
})
