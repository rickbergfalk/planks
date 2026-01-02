import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-item"
import "@/web-components/plank-separator"
import type { PlankItem } from "@/web-components/plank-item"

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
 * Visual tests for PlankItem web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("PlankItem (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    // Wait for all item-related elements to be defined and updated
    const itemElements = [
      "plank-item",
      "plank-item-group",
      "plank-item-separator",
      "plank-item-media",
      "plank-item-content",
      "plank-item-title",
      "plank-item-description",
      "plank-item-actions",
      "plank-item-header",
      "plank-item-footer",
      "plank-separator",
    ]
    await Promise.all(
      itemElements.map((el) => customElements.whenDefined(el).catch(() => {}))
    )
    const elements = container.querySelectorAll(
      "plank-item, plank-item-group, plank-item-separator, plank-item-media, plank-item-content, plank-item-title, plank-item-description, plank-item-actions, plank-item-header, plank-item-footer, plank-separator"
    )
    await Promise.all(
      Array.from(elements).map((el) => (el as PlankItem).updateComplete)
    )
  }

  it("basic item matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <plank-item>
          <plank-item-media variant="icon">
            ${UserIcon}
          </plank-item-media>
          <plank-item-content>
            <plank-item-title>John Doe</plank-item-title>
            <plank-item-description>Software Engineer at Acme Inc.</plank-item-description>
          </plank-item-content>
          <plank-item-actions>
            <button class="rounded p-1 hover:bg-muted">
              ${MoreIcon}
            </button>
          </plank-item-actions>
        </plank-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("item-basic")
  })

  it("item with outline variant matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <plank-item variant="outline">
          <plank-item-media variant="icon">
            ${UserIcon}
          </plank-item-media>
          <plank-item-content>
            <plank-item-title>Jane Smith</plank-item-title>
            <plank-item-description>Product Designer</plank-item-description>
          </plank-item-content>
        </plank-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-outline"
    )
  })

  it("item with muted variant matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <plank-item variant="muted">
          <plank-item-media variant="icon">
            ${UserIcon}
          </plank-item-media>
          <plank-item-content>
            <plank-item-title>Bob Johnson</plank-item-title>
            <plank-item-description>Marketing Manager</plank-item-description>
          </plank-item-content>
        </plank-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("item-muted")
  })

  it("item with small size matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <plank-item size="sm">
          <plank-item-media variant="icon">
            ${UserIcon}
          </plank-item-media>
          <plank-item-content>
            <plank-item-title>Compact Item</plank-item-title>
            <plank-item-description>A smaller item variant</plank-item-description>
          </plank-item-content>
        </plank-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("item-sm")
  })

  it("item with image media matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <plank-item>
          <plank-item-media variant="image">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%236366f1' width='40' height='40'/%3E%3C/svg%3E"
              alt="Avatar"
            />
          </plank-item-media>
          <plank-item-content>
            <plank-item-title>User with Avatar</plank-item-title>
            <plank-item-description>Has a custom profile picture</plank-item-description>
          </plank-item-content>
        </plank-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-image-media"
    )
  })

  it("item with header and footer matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <plank-item>
          <plank-item-header>
            <plank-item-title>Item Header</plank-item-title>
            <span class="text-xs text-muted-foreground">2 hours ago</span>
          </plank-item-header>
          <plank-item-content>
            <plank-item-description>
              This item has both a header and footer section.
            </plank-item-description>
          </plank-item-content>
          <plank-item-footer>
            <span class="text-xs text-muted-foreground">
              3 comments • 5 likes
            </span>
          </plank-item-footer>
        </plank-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-header-footer"
    )
  })

  it("item group with separators matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <plank-item-group class="border rounded-lg overflow-hidden">
          <plank-item>
            <plank-item-media variant="icon">
              ${UserIcon}
            </plank-item-media>
            <plank-item-content>
              <plank-item-title>First Person</plank-item-title>
              <plank-item-description>Team Lead</plank-item-description>
            </plank-item-content>
          </plank-item>
          <plank-item-separator></plank-item-separator>
          <plank-item>
            <plank-item-media variant="icon">
              ${UserIcon}
            </plank-item-media>
            <plank-item-content>
              <plank-item-title>Second Person</plank-item-title>
              <plank-item-description>Developer</plank-item-description>
            </plank-item-content>
          </plank-item>
          <plank-item-separator></plank-item-separator>
          <plank-item>
            <plank-item-media variant="icon">
              ${UserIcon}
            </plank-item-media>
            <plank-item-content>
              <plank-item-title>Third Person</plank-item-title>
              <plank-item-description>Designer</plank-item-description>
            </plank-item-content>
          </plank-item>
        </plank-item-group>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-group-separators"
    )
  })

  it("item minimal matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <plank-item>
          <plank-item-content>
            <plank-item-title>Simple Item</plank-item-title>
          </plank-item-content>
        </plank-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-minimal"
    )
  })

  it("item with default media variant matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 400px;">
        <plank-item>
          <plank-item-media>
            ${UserIcon}
          </plank-item-media>
          <plank-item-content>
            <plank-item-title>Default Media</plank-item-title>
            <plank-item-description>Uses default media variant (no background)</plank-item-description>
          </plank-item-content>
        </plank-item>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-media-default"
    )
  })
})
