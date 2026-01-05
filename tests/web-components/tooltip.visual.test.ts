import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-tooltip"
import "@/web-components/hal-button"

// Small pixel variance allowed for tooltip tests:
// - React uses Radix's SVG arrow primitive
// - Web component uses a rotated CSS div for the arrow
// - This causes minor subpixel rendering differences at arrow edges (~35-98 pixels)
// - Differences are imperceptible to humans (~1% of image)
const TOOLTIP_SCREENSHOT_OPTIONS = {
  comparatorOptions: { allowedMismatchedPixelRatio: 0.015 },
}

describe("Tooltip (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document
      .querySelectorAll('body > div[style*="position: fixed"]')
      .forEach((el) => {
        el.remove()
      })
  })

  it("tooltip open above button", async () => {
    container.innerHTML = `
      <div data-testid="container" style="padding: 60px; display: flex; justify-content: center; align-items: center;">
        <hal-tooltip open>
          <hal-tooltip-trigger>
            <hal-button variant="outline">Hover</hal-button>
          </hal-tooltip-trigger>
          <hal-tooltip-content side="top">Add to library</hal-tooltip-content>
        </hal-tooltip>
      </div>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete
    // Wait for positioning
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-top",
      TOOLTIP_SCREENSHOT_OPTIONS
    )
  })

  it("tooltip on right side", async () => {
    container.innerHTML = `
      <div data-testid="container" style="padding: 60px; display: flex; justify-content: center; align-items: center;">
        <hal-tooltip open>
          <hal-tooltip-trigger>
            <hal-button variant="outline">Hover</hal-button>
          </hal-tooltip-trigger>
          <hal-tooltip-content side="right">Add to library</hal-tooltip-content>
        </hal-tooltip>
      </div>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-right",
      TOOLTIP_SCREENSHOT_OPTIONS
    )
  })

  it("tooltip on bottom", async () => {
    container.innerHTML = `
      <div data-testid="container" style="padding: 60px; display: flex; justify-content: center; align-items: center;">
        <hal-tooltip open>
          <hal-tooltip-trigger>
            <hal-button variant="outline">Hover</hal-button>
          </hal-tooltip-trigger>
          <hal-tooltip-content side="bottom">Add to library</hal-tooltip-content>
        </hal-tooltip>
      </div>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-bottom",
      TOOLTIP_SCREENSHOT_OPTIONS
    )
  })

  it("tooltip on left side", async () => {
    container.innerHTML = `
      <div data-testid="container" style="padding: 60px; display: flex; justify-content: center; align-items: center;">
        <hal-tooltip open>
          <hal-tooltip-trigger>
            <hal-button variant="outline">Hover</hal-button>
          </hal-tooltip-trigger>
          <hal-tooltip-content side="left">Add to library</hal-tooltip-content>
        </hal-tooltip>
      </div>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-left",
      TOOLTIP_SCREENSHOT_OPTIONS
    )
  })
})
