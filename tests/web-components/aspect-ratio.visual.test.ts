import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-aspect-ratio"
import type { HalAspectRatio } from "@/web-components/hal-aspect-ratio"

describe("HalAspectRatio (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-aspect-ratio")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalAspectRatio).updateComplete)
    )
  }

  it("16/9 ratio with colored background", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <hal-aspect-ratio ratio="16/9" class="bg-muted rounded-lg"></hal-aspect-ratio>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "aspect-ratio-16-9"
    )
  })

  it("4/3 ratio with colored background", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <hal-aspect-ratio ratio="4/3" class="bg-muted rounded-lg"></hal-aspect-ratio>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "aspect-ratio-4-3"
    )
  })

  it("1/1 ratio (square) with colored background", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 200px">
        <hal-aspect-ratio ratio="1/1" class="bg-muted rounded-lg"></hal-aspect-ratio>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "aspect-ratio-1-1"
    )
  })

  it("21/9 ultra-wide ratio", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <hal-aspect-ratio ratio="21/9" class="bg-muted rounded-lg"></hal-aspect-ratio>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "aspect-ratio-21-9"
    )
  })
})
