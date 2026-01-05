import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-item"
import "@/web-components/hal-separator"
import type { HalItem } from "@/web-components/hal-item"

// Simple SVG icons for tests (same as React)
const UserIcon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
`

const MoreIcon = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
`

/**
 * Visual tests for HalItem web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalItem (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    // Wait for all item-related elements to be defined and updated
    const itemElements = [
      "hal-item",
      "hal-item-group",
      "hal-item-separator",
      "hal-item-media",
      "hal-item-content",
      "hal-item-title",
      "hal-item-description",
      "hal-item-actions",
      "hal-item-header",
      "hal-item-footer",
      "hal-separator",
    ]
    await Promise.all(
      itemElements.map((el) => customElements.whenDefined(el).catch(() => {}))
    )
    const elements = container.querySelectorAll(
      "hal-item, hal-item-group, hal-item-separator, hal-item-media, hal-item-content, hal-item-title, hal-item-description, hal-item-actions, hal-item-header, hal-item-footer, hal-separator"
    )
    await Promise.all(
      Array.from(elements).map((el) => (el as HalItem).updateComplete)
    )
  }

  it("basic item matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <hal-item>
          <hal-item-media variant="icon">
            ${UserIcon}
          </hal-item-media>
          <hal-item-content>
            <hal-item-title>John Doe</hal-item-title>
            <hal-item-description>Software Engineer at Acme Inc.</hal-item-description>
          </hal-item-content>
          <hal-item-actions>
            <button class="rounded p-1 hover:bg-muted">
              ${MoreIcon}
            </button>
          </hal-item-actions>
        </hal-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("item-basic")
  })

  it("item with outline variant matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <hal-item variant="outline">
          <hal-item-media variant="icon">
            ${UserIcon}
          </hal-item-media>
          <hal-item-content>
            <hal-item-title>Jane Smith</hal-item-title>
            <hal-item-description>Product Designer</hal-item-description>
          </hal-item-content>
        </hal-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-outline"
    )
  })

  it("item with muted variant matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <hal-item variant="muted">
          <hal-item-media variant="icon">
            ${UserIcon}
          </hal-item-media>
          <hal-item-content>
            <hal-item-title>Bob Johnson</hal-item-title>
            <hal-item-description>Marketing Manager</hal-item-description>
          </hal-item-content>
        </hal-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("item-muted")
  })

  it("item with small size matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <hal-item size="sm">
          <hal-item-media variant="icon">
            ${UserIcon}
          </hal-item-media>
          <hal-item-content>
            <hal-item-title>Compact Item</hal-item-title>
            <hal-item-description>A smaller item variant</hal-item-description>
          </hal-item-content>
        </hal-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("item-sm")
  })

  it("item with image media matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <hal-item>
          <hal-item-media variant="image">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%236366f1' width='40' height='40'/%3E%3C/svg%3E"
              alt="Avatar"
            />
          </hal-item-media>
          <hal-item-content>
            <hal-item-title>User with Avatar</hal-item-title>
            <hal-item-description>Has a custom profile picture</hal-item-description>
          </hal-item-content>
        </hal-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-image-media"
    )
  })

  it("item with header and footer matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <hal-item>
          <hal-item-header>
            <hal-item-title>Item Header</hal-item-title>
            <span class="text-xs text-muted-foreground">2 hours ago</span>
          </hal-item-header>
          <hal-item-content>
            <hal-item-description>
              This item has both a header and footer section.
            </hal-item-description>
          </hal-item-content>
          <hal-item-footer>
            <span class="text-xs text-muted-foreground">
              3 comments • 5 likes
            </span>
          </hal-item-footer>
        </hal-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-header-footer"
    )
  })

  it("item group with separators matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <hal-item-group class="border rounded-lg overflow-hidden">
          <hal-item>
            <hal-item-media variant="icon">
              ${UserIcon}
            </hal-item-media>
            <hal-item-content>
              <hal-item-title>First Person</hal-item-title>
              <hal-item-description>Team Lead</hal-item-description>
            </hal-item-content>
          </hal-item>
          <hal-item-separator></hal-item-separator>
          <hal-item>
            <hal-item-media variant="icon">
              ${UserIcon}
            </hal-item-media>
            <hal-item-content>
              <hal-item-title>Second Person</hal-item-title>
              <hal-item-description>Developer</hal-item-description>
            </hal-item-content>
          </hal-item>
          <hal-item-separator></hal-item-separator>
          <hal-item>
            <hal-item-media variant="icon">
              ${UserIcon}
            </hal-item-media>
            <hal-item-content>
              <hal-item-title>Third Person</hal-item-title>
              <hal-item-description>Designer</hal-item-description>
            </hal-item-content>
          </hal-item>
        </hal-item-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-group-separators"
    )
  })

  it("item minimal matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <hal-item>
          <hal-item-content>
            <hal-item-title>Simple Item</hal-item-title>
          </hal-item-content>
        </hal-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-minimal"
    )
  })

  it("item with default media variant matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <hal-item>
          <hal-item-media>
            ${UserIcon}
          </hal-item-media>
          <hal-item-content>
            <hal-item-title>Default Media</hal-item-title>
            <hal-item-description>Uses default media variant (no background)</hal-item-description>
          </hal-item-content>
        </hal-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-media-default"
    )
  })
})
