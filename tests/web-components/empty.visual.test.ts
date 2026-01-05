import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-empty"
import type { HalEmpty } from "@/web-components/hal-empty"

// Simple SVG icons for tests (same as React)
const InboxIcon = `
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
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </svg>
`

const SearchIcon = `
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
`

/**
 * Visual tests for HalEmpty web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalEmpty (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-empty")
    // Wait for all empty-related elements to be defined and updated
    const emptyElements = [
      "hal-empty",
      "hal-empty-header",
      "hal-empty-media",
      "hal-empty-title",
      "hal-empty-description",
      "hal-empty-content",
    ]
    await Promise.all(
      emptyElements.map((el) => customElements.whenDefined(el).catch(() => {}))
    )
    const elements = container.querySelectorAll(
      "hal-empty, hal-empty-header, hal-empty-media, hal-empty-title, hal-empty-description, hal-empty-content"
    )
    await Promise.all(
      Array.from(elements).map((el) => (el as HalEmpty).updateComplete)
    )
  }

  it("basic empty state matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 500px;">
        <hal-empty class="border">
          <hal-empty-header>
            <hal-empty-media variant="icon">
              ${InboxIcon}
            </hal-empty-media>
            <hal-empty-title>No messages</hal-empty-title>
            <hal-empty-description>
              You don't have any messages yet. When you receive messages,
              they will appear here.
            </hal-empty-description>
          </hal-empty-header>
        </hal-empty>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot("empty-basic")
  })

  it("empty state with content matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 500px;">
        <hal-empty class="border">
          <hal-empty-header>
            <hal-empty-media variant="icon">
              ${SearchIcon}
            </hal-empty-media>
            <hal-empty-title>No results found</hal-empty-title>
            <hal-empty-description>
              We couldn't find what you're looking for. Try adjusting
              your search or filters.
            </hal-empty-description>
          </hal-empty-header>
          <hal-empty-content>
            <button class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
              Clear filters
            </button>
          </hal-empty-content>
        </hal-empty>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "empty-with-content"
    )
  })

  it("empty state with default media variant matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 500px;">
        <hal-empty class="border">
          <hal-empty-header>
            <hal-empty-media>
              ${InboxIcon}
            </hal-empty-media>
            <hal-empty-title>Empty inbox</hal-empty-title>
            <hal-empty-description>
              Your inbox is empty. New messages will show up here.
            </hal-empty-description>
          </hal-empty-header>
        </hal-empty>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "empty-media-default"
    )
  })

  it("empty state minimal matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 500px;">
        <hal-empty class="border">
          <hal-empty-header>
            <hal-empty-title>Nothing here yet</hal-empty-title>
          </hal-empty-header>
        </hal-empty>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "empty-minimal"
    )
  })
})
