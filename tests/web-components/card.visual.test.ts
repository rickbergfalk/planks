import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-card"
import type { HalCard } from "@/web-components/hal-card"

/**
 * Visual tests for HalCard web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalCard (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-card")
    // Wait for all card-related elements to be defined and updated
    const cardElements = [
      "hal-card",
      "hal-card-header",
      "hal-card-title",
      "hal-card-description",
      "hal-card-content",
      "hal-card-footer",
    ]
    await Promise.all(
      cardElements.map((el) => customElements.whenDefined(el).catch(() => {}))
    )
    const elements = container.querySelectorAll(
      "hal-card, hal-card-header, hal-card-title, hal-card-description, hal-card-content, hal-card-footer"
    )
    await Promise.all(
      Array.from(elements).map((el) => (el as HalCard).updateComplete)
    )
  }

  it("basic card matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-card>
          <hal-card-header>
            <hal-card-title>Card Title</hal-card-title>
            <hal-card-description>Card description goes here.</hal-card-description>
          </hal-card-header>
          <hal-card-content>
            <p>This is the card content area.</p>
          </hal-card-content>
          <hal-card-footer>
            <p>Footer content</p>
          </hal-card-footer>
        </hal-card>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("card-basic")
  })

  it("card without footer matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-card>
          <hal-card-header>
            <hal-card-title>Simple Card</hal-card-title>
            <hal-card-description>A card without a footer.</hal-card-description>
          </hal-card-header>
          <hal-card-content>
            <p>Just some content here.</p>
          </hal-card-content>
        </hal-card>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "card-no-footer"
    )
  })

  it("card with only content matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-card>
          <hal-card-content>
            <p>Minimal card with just content.</p>
          </hal-card-content>
        </hal-card>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "card-content-only"
    )
  })
})
