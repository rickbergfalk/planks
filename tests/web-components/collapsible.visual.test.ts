import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/hal-collapsible"
import "../../src/web-components/hal-button"
import type { HalCollapsible } from "../../src/web-components/hal-collapsible"

describe("hal-collapsible - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("closed state", async () => {
    container.innerHTML = `
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-collapsible class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <span class="text-sm font-semibold">Toggle me</span>
            <hal-collapsible-trigger>
              <hal-button variant="ghost" size="sm">Toggle</hal-button>
            </hal-collapsible-trigger>
          </div>
          <div class="rounded-md border px-4 py-2 text-sm">
            Always visible
          </div>
          <hal-collapsible-content class="flex flex-col gap-2">
            <div class="rounded-md border px-4 py-2 text-sm">
              Hidden content 1
            </div>
            <div class="rounded-md border px-4 py-2 text-sm">
              Hidden content 2
            </div>
          </hal-collapsible-content>
        </hal-collapsible>
      </div>
    `
    await customElements.whenDefined("hal-collapsible")
    const collapsible = container.querySelector(
      "hal-collapsible"
    ) as HalCollapsible
    await collapsible.updateComplete

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "collapsible-closed"
    )
  })

  it("open state", async () => {
    container.innerHTML = `
      <div data-testid="container" style="padding: 8px; width: 350px;">
        <hal-collapsible open class="flex flex-col gap-2">
          <div class="flex items-center justify-between gap-4">
            <span class="text-sm font-semibold">Toggle me</span>
            <hal-collapsible-trigger>
              <hal-button variant="ghost" size="sm">Toggle</hal-button>
            </hal-collapsible-trigger>
          </div>
          <div class="rounded-md border px-4 py-2 text-sm">
            Always visible
          </div>
          <hal-collapsible-content class="flex flex-col gap-2">
            <div class="rounded-md border px-4 py-2 text-sm">
              Hidden content 1
            </div>
            <div class="rounded-md border px-4 py-2 text-sm">
              Hidden content 2
            </div>
          </hal-collapsible-content>
        </hal-collapsible>
      </div>
    `
    await customElements.whenDefined("hal-collapsible")
    const collapsible = container.querySelector(
      "hal-collapsible"
    ) as HalCollapsible
    await collapsible.updateComplete

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "collapsible-open"
    )
  })
})
