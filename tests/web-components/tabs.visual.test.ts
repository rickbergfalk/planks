import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/plank-tabs"
import type { PlankTabs } from "../../src/web-components/plank-tabs"

describe("plank-tabs - Visual", () => {
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
      <plank-tabs value="account" class="w-full">
        <plank-tabs-list>
          <plank-tabs-trigger value="account">Account</plank-tabs-trigger>
          <plank-tabs-trigger value="password">Password</plank-tabs-trigger>
        </plank-tabs-list>
        <plank-tabs-content value="account">
          <div class="p-4 border rounded-md">
            Make changes to your account here.
          </div>
        </plank-tabs-content>
        <plank-tabs-content value="password">
          <div class="p-4 border rounded-md">
            Change your password here.
          </div>
        </plank-tabs-content>
      </plank-tabs>
    `
    await customElements.whenDefined("plank-tabs")
    const tabs = container.querySelector("plank-tabs") as PlankTabs
    await tabs.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tabs-first-selected"
    )
  })

  it("second tab selected", async () => {
    container.innerHTML = `
      <plank-tabs value="password" class="w-full">
        <plank-tabs-list>
          <plank-tabs-trigger value="account">Account</plank-tabs-trigger>
          <plank-tabs-trigger value="password">Password</plank-tabs-trigger>
        </plank-tabs-list>
        <plank-tabs-content value="account">
          <div class="p-4 border rounded-md">
            Make changes to your account here.
          </div>
        </plank-tabs-content>
        <plank-tabs-content value="password">
          <div class="p-4 border rounded-md">
            Change your password here.
          </div>
        </plank-tabs-content>
      </plank-tabs>
    `
    await customElements.whenDefined("plank-tabs")
    const tabs = container.querySelector("plank-tabs") as PlankTabs
    await tabs.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "tabs-second-selected"
    )
  })
})
