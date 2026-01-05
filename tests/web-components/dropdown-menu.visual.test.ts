import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-dropdown-menu"
import "@/web-components/hal-button"

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
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <hal-button variant="outline">Open</hal-button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content align="start">
            <hal-dropdown-menu-label>My Account</hal-dropdown-menu-label>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-group>
              <hal-dropdown-menu-item>
                Profile
                <hal-dropdown-menu-shortcut>⇧⌘P</hal-dropdown-menu-shortcut>
              </hal-dropdown-menu-item>
              <hal-dropdown-menu-item>
                Billing
                <hal-dropdown-menu-shortcut>⌘B</hal-dropdown-menu-shortcut>
              </hal-dropdown-menu-item>
              <hal-dropdown-menu-item>
                Settings
                <hal-dropdown-menu-shortcut>⌘S</hal-dropdown-menu-shortcut>
              </hal-dropdown-menu-item>
            </hal-dropdown-menu-group>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-item>Log out</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("hal-dropdown-menu")
    const menu = container.querySelector("hal-dropdown-menu")!
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
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <hal-button variant="outline">Open</hal-button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content class="w-56" align="start">
            <hal-dropdown-menu-label>Appearance</hal-dropdown-menu-label>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-checkbox-item checked>
              Status Bar
            </hal-dropdown-menu-checkbox-item>
            <hal-dropdown-menu-checkbox-item>
              Activity Bar
            </hal-dropdown-menu-checkbox-item>
            <hal-dropdown-menu-checkbox-item checked>
              Panel
            </hal-dropdown-menu-checkbox-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("hal-dropdown-menu")
    const menu = container.querySelector("hal-dropdown-menu")!
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
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <hal-button variant="outline">Open</hal-button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content class="w-56" align="start">
            <hal-dropdown-menu-label>Panel Position</hal-dropdown-menu-label>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-radio-group value="bottom">
              <hal-dropdown-menu-radio-item value="top">Top</hal-dropdown-menu-radio-item>
              <hal-dropdown-menu-radio-item value="bottom">
                Bottom
              </hal-dropdown-menu-radio-item>
              <hal-dropdown-menu-radio-item value="right">Right</hal-dropdown-menu-radio-item>
            </hal-dropdown-menu-radio-group>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("hal-dropdown-menu")
    const menu = container.querySelector("hal-dropdown-menu")!
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
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <hal-button variant="outline">Open</hal-button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content align="start">
            <hal-dropdown-menu-item>Enabled Item</hal-dropdown-menu-item>
            <hal-dropdown-menu-item disabled>Disabled Item</hal-dropdown-menu-item>
            <hal-dropdown-menu-item>Another Enabled</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("hal-dropdown-menu")
    const menu = container.querySelector("hal-dropdown-menu")!
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
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <hal-button variant="outline">Open</hal-button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content align="start">
            <hal-dropdown-menu-item>Edit</hal-dropdown-menu-item>
            <hal-dropdown-menu-item>Duplicate</hal-dropdown-menu-item>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-item variant="destructive">Delete</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("hal-dropdown-menu")
    const menu = container.querySelector("hal-dropdown-menu")!
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
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <hal-button variant="outline">Open</hal-button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content align="start">
            <hal-dropdown-menu-label inset>Settings</hal-dropdown-menu-label>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-item inset>Profile</hal-dropdown-menu-item>
            <hal-dropdown-menu-item inset>Account</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("hal-dropdown-menu")
    const menu = container.querySelector("hal-dropdown-menu")!
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
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <hal-button variant="outline">Open</hal-button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content align="start">
            <hal-dropdown-menu-item>New Tab</hal-dropdown-menu-item>
            <hal-dropdown-menu-item>New Window</hal-dropdown-menu-item>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-sub open>
              <hal-dropdown-menu-sub-trigger>More Tools</hal-dropdown-menu-sub-trigger>
              <hal-dropdown-menu-sub-content>
                <hal-dropdown-menu-item>Save Page As...</hal-dropdown-menu-item>
                <hal-dropdown-menu-item>Create Shortcut...</hal-dropdown-menu-item>
                <hal-dropdown-menu-item>Name Window...</hal-dropdown-menu-item>
                <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
                <hal-dropdown-menu-item>Developer Tools</hal-dropdown-menu-item>
              </hal-dropdown-menu-sub-content>
            </hal-dropdown-menu-sub>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-item>Quit</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      </div>
    `

    await customElements.whenDefined("hal-dropdown-menu")
    const menu = container.querySelector("hal-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-submenu",
      DROPDOWN_SCREENSHOT_OPTIONS
    )
  })
})
