import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-toggle"
import type { HalToggle } from "@/web-components/hal-toggle"

describe("HalToggle (Web Component) - Visual", () => {
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
    await customElements.whenDefined("hal-toggle")
    const elements = container.querySelectorAll("hal-toggle")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalToggle).updateComplete)
    )
  }

  it("default unpressed", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-toggle aria-label="Toggle">B</hal-toggle>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-default-unpressed"
    )
  })

  it("default pressed", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-toggle aria-label="Toggle" pressed>B</hal-toggle>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-default-pressed"
    )
  })

  it("outline variant", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-toggle variant="outline" aria-label="Toggle">B</hal-toggle>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-outline"
    )
  })

  it("size sm", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-toggle size="sm" aria-label="Toggle">B</hal-toggle>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("toggle-sm")
  })

  it("size lg", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-toggle size="lg" aria-label="Toggle">B</hal-toggle>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("toggle-lg")
  })

  it("disabled", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-toggle aria-label="Toggle" disabled>B</hal-toggle>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-disabled"
    )
  })
})
