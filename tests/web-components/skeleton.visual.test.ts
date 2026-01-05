import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-skeleton"
import type { HalSkeleton } from "@/web-components/hal-skeleton"

/**
 * Visual tests for HalSkeleton web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalSkeleton (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-skeleton")
    const skeletons = container.querySelectorAll("hal-skeleton")
    await Promise.all(
      Array.from(skeletons).map((s) => (s as HalSkeleton).updateComplete)
    )
  }

  it("text skeleton matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px;">
        <hal-skeleton class="h-4 w-48"></hal-skeleton>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "skeleton-text"
    )
  })

  it("avatar skeleton matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px;">
        <hal-skeleton class="h-12 w-12 rounded-full"></hal-skeleton>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "skeleton-avatar"
    )
  })

  it("card skeleton matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 300px;">
        <div class="flex items-center space-x-4">
          <hal-skeleton class="h-12 w-12 rounded-full"></hal-skeleton>
          <div class="space-y-2">
            <hal-skeleton class="h-4 w-48"></hal-skeleton>
            <hal-skeleton class="h-4 w-32"></hal-skeleton>
          </div>
        </div>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "skeleton-card"
    )
  })
})
