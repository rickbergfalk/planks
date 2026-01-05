import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-button-group"
import "@/web-components/hal-button"
import "@/web-components/hal-separator"
import type { HalButtonGroup } from "@/web-components/hal-button-group"

/**
 * Visual tests for HalButtonGroup web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalButtonGroup (Web Component) - Visual", () => {
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
    const elements = [
      "hal-button-group",
      "hal-button-group-text",
      "hal-button-group-separator",
      "hal-button",
    ]
    await Promise.all(
      elements.map((el) => customElements.whenDefined(el).catch(() => {}))
    )
    const allElements = container.querySelectorAll(
      "hal-button-group, hal-button-group-text, hal-button-group-separator, hal-button"
    )
    await Promise.all(
      Array.from(allElements).map((el) => (el as HalButtonGroup).updateComplete)
    )
  }

  it("horizontal button group matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px;">
        <hal-button-group>
          <hal-button variant="outline">Left</hal-button>
          <hal-button variant="outline">Center</hal-button>
          <hal-button variant="outline">Right</hal-button>
        </hal-button-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "button-group-horizontal"
    )
  })

  it("vertical button group matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px;">
        <hal-button-group orientation="vertical">
          <hal-button variant="outline">Top</hal-button>
          <hal-button variant="outline">Middle</hal-button>
          <hal-button variant="outline">Bottom</hal-button>
        </hal-button-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "button-group-vertical"
    )
  })

  it("button group with text matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px;">
        <hal-button-group>
          <hal-button-group-text>Label</hal-button-group-text>
          <hal-button variant="outline">Action</hal-button>
        </hal-button-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "button-group-with-text"
    )
  })

  it("button group with separator matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px;">
        <hal-button-group>
          <hal-button variant="outline">Save</hal-button>
          <hal-button-group-separator></hal-button-group-separator>
          <hal-button variant="outline">Cancel</hal-button>
        </hal-button-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "button-group-with-separator"
    )
  })

  it("button group with icon buttons matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px;">
        <hal-button-group>
          <hal-button variant="outline" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
          </hal-button>
          <hal-button variant="outline" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </hal-button>
          <hal-button variant="outline" size="icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" x2="12" y1="3" y2="15" />
            </svg>
          </hal-button>
        </hal-button-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "button-group-icons"
    )
  })

  it("button group mixed sizes matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px;">
        <hal-button-group>
          <hal-button variant="outline" size="sm">Small</hal-button>
          <hal-button variant="outline">Default</hal-button>
          <hal-button variant="outline" size="lg">Large</hal-button>
        </hal-button-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "button-group-mixed-sizes"
    )
  })
})
