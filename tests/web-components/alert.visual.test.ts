import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-alert"
import type { HalAlert } from "@/web-components/hal-alert"

/**
 * Visual tests for HalAlert web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalAlert (Web Component) - Visual", () => {
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
    await customElements.whenDefined("hal-alert")
    const alertElements = [
      "hal-alert",
      "hal-alert-title",
      "hal-alert-description",
    ]
    await Promise.all(
      alertElements.map((el) => customElements.whenDefined(el).catch(() => {}))
    )
    const elements = container.querySelectorAll(
      "hal-alert, hal-alert-title, hal-alert-description"
    )
    await Promise.all(
      Array.from(elements).map((el) => (el as HalAlert).updateComplete)
    )
  }

  it("default alert with icon, title, and description matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 450px;">
        <hal-alert>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
          <hal-alert-title>Success! Your changes have been saved</hal-alert-title>
          <hal-alert-description>This is an alert with icon, title and description.</hal-alert-description>
        </hal-alert>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "alert-default-full"
    )
  })

  it("alert with only icon and title matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 450px;">
        <hal-alert>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M21 7.5h-4"/><path d="M21 16.5h-4"/><path d="M17 3v18"/></svg>
          <hal-alert-title>This Alert has a title and an icon. No description.</hal-alert-title>
        </hal-alert>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "alert-title-only"
    )
  })

  it("destructive alert matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 450px;">
        <hal-alert variant="destructive">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
          <hal-alert-title>Error</hal-alert-title>
          <hal-alert-description>Your session has expired. Please log in again.</hal-alert-description>
        </hal-alert>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "alert-destructive"
    )
  })
})
