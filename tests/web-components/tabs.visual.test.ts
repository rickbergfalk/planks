import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/hal-tabs"
import type { HalTabs } from "../../src/web-components/hal-tabs"

describe("hal-tabs - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "8px"
    container.style.width = "400px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("first tab selected", async () => {
    container.innerHTML = `
      <hal-tabs value="account" class="w-full">
        <hal-tabs-list>
          <hal-tabs-trigger value="account">Account</hal-tabs-trigger>
          <hal-tabs-trigger value="password">Password</hal-tabs-trigger>
        </hal-tabs-list>
        <hal-tabs-content value="account">
          <div class="p-4 border rounded-md">
            Make changes to your account here.
          </div>
        </hal-tabs-content>
        <hal-tabs-content value="password">
          <div class="p-4 border rounded-md">
            Change your password here.
          </div>
        </hal-tabs-content>
      </hal-tabs>
    `
    await customElements.whenDefined("hal-tabs")
    const tabs = container.querySelector("hal-tabs") as HalTabs
    await tabs.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tabs-first-selected"
    )
  })

  it("second tab selected", async () => {
    container.innerHTML = `
      <hal-tabs value="password" class="w-full">
        <hal-tabs-list>
          <hal-tabs-trigger value="account">Account</hal-tabs-trigger>
          <hal-tabs-trigger value="password">Password</hal-tabs-trigger>
        </hal-tabs-list>
        <hal-tabs-content value="account">
          <div class="p-4 border rounded-md">
            Make changes to your account here.
          </div>
        </hal-tabs-content>
        <hal-tabs-content value="password">
          <div class="p-4 border rounded-md">
            Change your password here.
          </div>
        </hal-tabs-content>
      </hal-tabs>
    `
    await customElements.whenDefined("hal-tabs")
    const tabs = container.querySelector("hal-tabs") as HalTabs
    await tabs.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tabs-second-selected"
    )
  })
})
