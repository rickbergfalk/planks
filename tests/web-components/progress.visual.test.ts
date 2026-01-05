import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-progress"
import type { HalProgress } from "@/web-components/hal-progress"

describe("HalProgress (Web Component) - Visual", () => {
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
    await customElements.whenDefined("hal-progress")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalProgress).updateComplete)
    )
  }

  it("progress at 0%", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <hal-progress value="0"></hal-progress>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("progress-0")
  })

  it("progress at 33%", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <hal-progress value="33"></hal-progress>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("progress-33")
  })

  it("progress at 66%", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <hal-progress value="66"></hal-progress>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("progress-66")
  })

  it("progress at 100%", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <hal-progress value="100"></hal-progress>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "progress-100"
    )
  })
})
