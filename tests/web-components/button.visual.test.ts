import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-button"
import type { HalButton } from "@/web-components/hal-button"

/**
 * Visual tests for HalButton web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalButton (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<HalButton> {
    container.innerHTML = html
    await customElements.whenDefined("hal-button")
    const button = container.querySelector("hal-button") as HalButton
    await button.updateComplete
    return button
  }

  it("default variant matches React", async () => {
    await renderAndWait(`<hal-button>Button</hal-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-default")
  })

  it("destructive variant matches React", async () => {
    await renderAndWait(`<hal-button variant="destructive">Delete</hal-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot(
      "button-destructive"
    )
  })

  it("outline variant matches React", async () => {
    await renderAndWait(`<hal-button variant="outline">Outline</hal-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-outline")
  })

  it("secondary variant matches React", async () => {
    await renderAndWait(
      `<hal-button variant="secondary">Secondary</hal-button>`
    )
    await expect(page.getByRole("button")).toMatchScreenshot("button-secondary")
  })

  it("ghost variant matches React", async () => {
    await renderAndWait(`<hal-button variant="ghost">Ghost</hal-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-ghost")
  })

  it("link variant matches React", async () => {
    await renderAndWait(`<hal-button variant="link">Link</hal-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-link")
  })

  it("small size matches React", async () => {
    await renderAndWait(`<hal-button size="sm">Small</hal-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-size-sm")
  })

  it("large size matches React", async () => {
    await renderAndWait(`<hal-button size="lg">Large</hal-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-size-lg")
  })

  it("disabled state matches React", async () => {
    await renderAndWait(`<hal-button disabled>Disabled</hal-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-disabled")
  })
})
