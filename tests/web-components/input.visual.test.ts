import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-input"
import type { HalInput } from "@/web-components/hal-input"

/**
 * Visual tests for HalInput web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalInput (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-input")
    const inputs = container.querySelectorAll("hal-input")
    await Promise.all(
      Array.from(inputs).map((i) => (i as HalInput).updateComplete)
    )
  }

  it("default input matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <hal-input placeholder="Enter text..."></hal-input>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-default"
    )
  })

  it("disabled input matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <hal-input placeholder="Disabled" disabled></hal-input>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-disabled"
    )
  })

  it("input with value matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <hal-input value="Hello world"></hal-input>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "input-with-value"
    )
  })
})
