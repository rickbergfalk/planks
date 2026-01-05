import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/hal-scroll-area"
import "../../src/web-components/hal-separator"
import type { HalScrollArea } from "../../src/web-components/hal-scroll-area"

describe("hal-scroll-area - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "16px"
    container.style.width = "300px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("vertical scroll area with visible scrollbar", async () => {
    // Generate tags like the React example
    const tags = Array.from({ length: 20 }).map(
      (_, i, a) => `v1.2.0-beta.${a.length - i}`
    )

    container.innerHTML = `
      <hal-scroll-area type="always" class="h-48 w-48 rounded-md border">
        <hal-scroll-area-viewport>
          <div class="p-4">
            <h4 class="mb-4 text-sm leading-none font-medium">Tags</h4>
            ${tags
              .map(
                (tag) => `
              <div class="text-sm">${tag}</div>
              <hal-separator class="my-2"></hal-separator>
            `
              )
              .join("")}
          </div>
        </hal-scroll-area-viewport>
        <hal-scroll-bar></hal-scroll-bar>
      </hal-scroll-area>
    `
    await customElements.whenDefined("hal-scroll-area")
    const scrollArea = container.querySelector(
      "hal-scroll-area"
    ) as HalScrollArea
    await scrollArea.updateComplete

    // Wait for content wrapper and resize observer
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "scroll-area-vertical"
    )
  })

  it("horizontal scroll area", async () => {
    container.innerHTML = `
      <hal-scroll-area class="w-64 rounded-md border whitespace-nowrap">
        <hal-scroll-area-viewport>
          <div class="flex gap-4 p-4" style="width: max-content;">
            <div class="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
              Item 1
            </div>
            <div class="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
              Item 2
            </div>
            <div class="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
              Item 3
            </div>
            <div class="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
              Item 4
            </div>
            <div class="w-32 h-24 bg-muted rounded-md flex items-center justify-center text-sm">
              Item 5
            </div>
          </div>
        </hal-scroll-area-viewport>
        <hal-scroll-bar orientation="horizontal"></hal-scroll-bar>
      </hal-scroll-area>
    `
    await customElements.whenDefined("hal-scroll-area")
    const scrollArea = container.querySelector(
      "hal-scroll-area"
    ) as HalScrollArea
    await scrollArea.updateComplete

    // Wait for content wrapper and resize observer
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "scroll-area-horizontal"
    )
  })
})
