import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-progress"
import type { PlankProgress } from "@/web-components/plank-progress"

describe("PlankProgress (Web Component) - Visual", () => {
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
    await customElements.whenDefined("plank-progress")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as PlankProgress).updateComplete)
    )
  }

  it("progress at 0%", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <plank-progress value="0"></plank-progress>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("progress-0")
  })

  it("progress at 33%", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <plank-progress value="33"></plank-progress>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("progress-33")
  })

  it("progress at 66%", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <plank-progress value="66"></plank-progress>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("progress-66")
  })

  it("progress at 100%", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px">
        <plank-progress value="100"></plank-progress>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "progress-100"
    )
  })
})
