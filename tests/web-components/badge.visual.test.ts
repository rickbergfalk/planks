import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-badge"
import type { HalBadge } from "@/web-components/hal-badge"

/**
 * Visual tests for HalBadge web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalBadge (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<HalBadge> {
    container.innerHTML = html
    await customElements.whenDefined("hal-badge")
    const badge = container.querySelector("hal-badge") as HalBadge
    await badge.updateComplete
    return badge
  }

  it("default variant matches React", async () => {
    const badge = await renderAndWait(`<hal-badge>Badge</hal-badge>`)
    badge.setAttribute("data-testid", "badge")
    await expect(page.getByTestId("badge")).toMatchScreenshot("badge-default")
  })

  it("secondary variant matches React", async () => {
    const badge = await renderAndWait(
      `<hal-badge variant="secondary">Secondary</hal-badge>`
    )
    badge.setAttribute("data-testid", "badge")
    await expect(page.getByTestId("badge")).toMatchScreenshot("badge-secondary")
  })

  it("destructive variant matches React", async () => {
    const badge = await renderAndWait(
      `<hal-badge variant="destructive">Destructive</hal-badge>`
    )
    badge.setAttribute("data-testid", "badge")
    await expect(page.getByTestId("badge")).toMatchScreenshot(
      "badge-destructive"
    )
  })

  it("outline variant matches React", async () => {
    const badge = await renderAndWait(
      `<hal-badge variant="outline">Outline</hal-badge>`
    )
    badge.setAttribute("data-testid", "badge")
    await expect(page.getByTestId("badge")).toMatchScreenshot("badge-outline")
  })
})
