import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-dropdown-menu"
import "@/web-components/plank-button"

// Small pixel variance allowed for dropdown menu tests:
// - React uses Radix's SVG-based icons (CheckIcon, CircleIcon, ChevronRightIcon)
// - Web component uses inline SVG elements with different rendering
// - This causes minor subpixel antialiasing differences (~1% of image)
// - Differences are imperceptible to humans
const DROPDOWN_SCREENSHOT_OPTIONS = {
  comparatorOptions: { allowedMismatchedPixelRatio: 0.015 },
}

describe("DropdownMenu (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    document
      .querySelectorAll('body > div[style*="position: fixed"]')
      .forEach((el) => {
        el.remove()
      })
  })

  it("dropdown menu basic", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button variant="outline">Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content align="start">
            <plank-dropdown-menu-label>My Account</plank-dropdown-menu-label>
            <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
            <plank-dropdown-menu-group>
              <plank-dropdown-menu-item>
                Profile
                <plank-dropdown-menu-shortcut>⇧⌘P</plank-dropdown-menu-shortcut>
              </plank-dropdown-menu-item>
              <plank-dropdown-menu-item>
                Billing
                <plank-dropdown-menu-shortcut>⌘B</plank-dropdown-menu-shortcut>
              </plank-dropdown-menu-item>
              <plank-dropdown-menu-item>
                Settings
                <plank-dropdown-menu-shortcut>⌘S</plank-dropdown-menu-shortcut>
              </plank-dropdown-menu-item>
            </plank-dropdown-menu-group>
            <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
            <plank-dropdown-menu-item>Log out</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    // Wait for animations to complete (animate-in takes ~150ms)
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-basic",
      DROPDOWN_SCREENSHOT_OPTIONS
    )
  })

  it("dropdown menu with checkboxes", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button variant="outline">Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content class="w-56" align="start">
            <plank-dropdown-menu-label>Appearance</plank-dropdown-menu-label>
            <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
            <plank-dropdown-menu-checkbox-item checked>
              Status Bar
            </plank-dropdown-menu-checkbox-item>
            <plank-dropdown-menu-checkbox-item>
              Activity Bar
            </plank-dropdown-menu-checkbox-item>
            <plank-dropdown-menu-checkbox-item checked>
              Panel
            </plank-dropdown-menu-checkbox-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-checkboxes",
      DROPDOWN_SCREENSHOT_OPTIONS
    )
  })

  it("dropdown menu with radio group", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button variant="outline">Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content class="w-56" align="start">
            <plank-dropdown-menu-label>Panel Position</plank-dropdown-menu-label>
            <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
            <plank-dropdown-menu-radio-group value="bottom">
              <plank-dropdown-menu-radio-item value="top">Top</plank-dropdown-menu-radio-item>
              <plank-dropdown-menu-radio-item value="bottom">
                Bottom
              </plank-dropdown-menu-radio-item>
              <plank-dropdown-menu-radio-item value="right">Right</plank-dropdown-menu-radio-item>
            </plank-dropdown-menu-radio-group>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-radio",
      DROPDOWN_SCREENSHOT_OPTIONS
    )
  })

  it("dropdown menu with disabled item", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button variant="outline">Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content align="start">
            <plank-dropdown-menu-item>Enabled Item</plank-dropdown-menu-item>
            <plank-dropdown-menu-item disabled>Disabled Item</plank-dropdown-menu-item>
            <plank-dropdown-menu-item>Another Enabled</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-disabled",
      DROPDOWN_SCREENSHOT_OPTIONS
    )
  })

  it("dropdown menu with destructive item", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button variant="outline">Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content align="start">
            <plank-dropdown-menu-item>Edit</plank-dropdown-menu-item>
            <plank-dropdown-menu-item>Duplicate</plank-dropdown-menu-item>
            <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
            <plank-dropdown-menu-item variant="destructive">Delete</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-destructive",
      DROPDOWN_SCREENSHOT_OPTIONS
    )
  })

  it("dropdown menu with inset items", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button variant="outline">Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content align="start">
            <plank-dropdown-menu-label inset>Settings</plank-dropdown-menu-label>
            <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
            <plank-dropdown-menu-item inset>Profile</plank-dropdown-menu-item>
            <plank-dropdown-menu-item inset>Account</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-inset",
      DROPDOWN_SCREENSHOT_OPTIONS
    )
  })

  it("dropdown menu with submenu", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; width: 400px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button variant="outline">Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content align="start">
            <plank-dropdown-menu-item>New Tab</plank-dropdown-menu-item>
            <plank-dropdown-menu-item>New Window</plank-dropdown-menu-item>
            <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
            <plank-dropdown-menu-sub open>
              <plank-dropdown-menu-sub-trigger>More Tools</plank-dropdown-menu-sub-trigger>
              <plank-dropdown-menu-sub-content>
                <plank-dropdown-menu-item>Save Page As...</plank-dropdown-menu-item>
                <plank-dropdown-menu-item>Create Shortcut...</plank-dropdown-menu-item>
                <plank-dropdown-menu-item>Name Window...</plank-dropdown-menu-item>
                <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
                <plank-dropdown-menu-item>Developer Tools</plank-dropdown-menu-item>
              </plank-dropdown-menu-sub-content>
            </plank-dropdown-menu-sub>
            <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
            <plank-dropdown-menu-item>Quit</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-submenu",
      DROPDOWN_SCREENSHOT_OPTIONS
    )
  })
})
