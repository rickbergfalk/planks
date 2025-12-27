import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-button"
import type { PlankButton } from "@/web-components/plank-button"

/**
 * Visual tests for PlankButton web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("PlankButton (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<PlankButton> {
    container.innerHTML = html
    await customElements.whenDefined("plank-button")
    const button = container.querySelector("plank-button") as PlankButton
    await button.updateComplete
    return button
  }

  it("default variant matches React", async () => {
    await renderAndWait(`<plank-button>Button</plank-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-default")
  })

  it("destructive variant matches React", async () => {
    await renderAndWait(`<plank-button variant="destructive">Delete</plank-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-destructive")
  })

  it("outline variant matches React", async () => {
    await renderAndWait(`<plank-button variant="outline">Outline</plank-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-outline")
  })

  it("secondary variant matches React", async () => {
    await renderAndWait(`<plank-button variant="secondary">Secondary</plank-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-secondary")
  })

  it("ghost variant matches React", async () => {
    await renderAndWait(`<plank-button variant="ghost">Ghost</plank-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-ghost")
  })

  it("link variant matches React", async () => {
    await renderAndWait(`<plank-button variant="link">Link</plank-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-link")
  })

  it("small size matches React", async () => {
    await renderAndWait(`<plank-button size="sm">Small</plank-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-size-sm")
  })

  it("large size matches React", async () => {
    await renderAndWait(`<plank-button size="lg">Large</plank-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-size-lg")
  })

  it("disabled state matches React", async () => {
    await renderAndWait(`<plank-button disabled>Disabled</plank-button>`)
    await expect(page.getByRole("button")).toMatchScreenshot("button-disabled")
  })
})
