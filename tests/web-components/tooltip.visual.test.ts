import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-tooltip"
import "@/web-components/plank-button"

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
        <plank-tooltip open>
          <plank-tooltip-trigger>
            <plank-button variant="outline">Hover</plank-button>
          </plank-tooltip-trigger>
          <plank-tooltip-content side="top">Add to library</plank-tooltip-content>
        </plank-tooltip>
      </div>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete
    // Wait for positioning
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot("tooltip-top")
  })

  it("tooltip on right side", async () => {
    container.innerHTML = `
      <div data-testid="container" style="padding: 60px; display: flex; justify-content: center; align-items: center;">
        <plank-tooltip open>
          <plank-tooltip-trigger>
            <plank-button variant="outline">Hover</plank-button>
          </plank-tooltip-trigger>
          <plank-tooltip-content side="right">Add to library</plank-tooltip-content>
        </plank-tooltip>
      </div>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-right"
    )
  })

  it("tooltip on bottom", async () => {
    container.innerHTML = `
      <div data-testid="container" style="padding: 60px; display: flex; justify-content: center; align-items: center;">
        <plank-tooltip open>
          <plank-tooltip-trigger>
            <plank-button variant="outline">Hover</plank-button>
          </plank-tooltip-trigger>
          <plank-tooltip-content side="bottom">Add to library</plank-tooltip-content>
        </plank-tooltip>
      </div>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-bottom"
    )
  })

  it("tooltip on left side", async () => {
    container.innerHTML = `
      <div data-testid="container" style="padding: 60px; display: flex; justify-content: center; align-items: center;">
        <plank-tooltip open>
          <plank-tooltip-trigger>
            <plank-button variant="outline">Hover</plank-button>
          </plank-tooltip-trigger>
          <plank-tooltip-content side="left">Add to library</plank-tooltip-content>
        </plank-tooltip>
      </div>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tooltip-left"
    )
  })
})
