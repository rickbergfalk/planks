import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-spinner"
import type { HalSpinner } from "@/web-components/hal-spinner"

/**
 * Visual tests for HalSpinner web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalSpinner (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-spinner")
    const spinners = container.querySelectorAll("hal-spinner")
    await Promise.all(
      Array.from(spinners).map((s) => (s as HalSpinner).updateComplete)
    )
  }

  it("default spinner matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 16px;">
        <hal-spinner></hal-spinner>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "spinner-default"
    )
  })

  it("spinner with custom size matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 16px;">
        <hal-spinner class="size-8"></hal-spinner>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "spinner-size-8"
    )
  })

  it("spinner with custom color matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 16px;">
        <hal-spinner class="text-primary"></hal-spinner>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "spinner-primary"
    )
  })
})
