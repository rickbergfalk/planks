import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-context-menu"

// Small pixel variance allowed for context menu tests:
// - React uses Radix's SVG-based icons (CheckIcon, CircleIcon, ChevronRightIcon)
// - Web component uses inline SVG elements with different rendering
// - This causes minor subpixel antialiasing differences (~1% of image)
// - Differences are imperceptible to humans
const CONTEXT_MENU_SCREENSHOT_OPTIONS = {
  comparatorOptions: { allowedMismatchedPixelRatio: 0.015 },
}

describe("ContextMenu (Web Component) - Visual", () => {
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

  it("context menu basic", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-label>My Account</hal-context-menu-label>
            <hal-context-menu-separator></hal-context-menu-separator>
            <hal-context-menu-group>
              <hal-context-menu-item>
                Profile
                <hal-context-menu-shortcut>⇧⌘P</hal-context-menu-shortcut>
              </hal-context-menu-item>
              <hal-context-menu-item>
                Billing
                <hal-context-menu-shortcut>⌘B</hal-context-menu-shortcut>
              </hal-context-menu-item>
              <hal-context-menu-item>
                Settings
                <hal-context-menu-shortcut>⌘S</hal-context-menu-shortcut>
              </hal-context-menu-item>
            </hal-context-menu-group>
            <hal-context-menu-separator></hal-context-menu-separator>
            <hal-context-menu-item>Log out</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      </div>
    `

    await customElements.whenDefined("hal-context-menu")
    const menu = container.querySelector("hal-context-menu")!
    await (menu as any).updateComplete

    // Trigger the context menu with right-click at center of trigger area
    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    // Wait for animations to complete (animate-in takes ~150ms)
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-basic",
      CONTEXT_MENU_SCREENSHOT_OPTIONS
    )
  })

  it("context menu with checkboxes", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </hal-context-menu-trigger>
          <hal-context-menu-content class="w-56">
            <hal-context-menu-label>Appearance</hal-context-menu-label>
            <hal-context-menu-separator></hal-context-menu-separator>
            <hal-context-menu-checkbox-item checked>
              Status Bar
            </hal-context-menu-checkbox-item>
            <hal-context-menu-checkbox-item>
              Activity Bar
            </hal-context-menu-checkbox-item>
            <hal-context-menu-checkbox-item checked>
              Panel
            </hal-context-menu-checkbox-item>
          </hal-context-menu-content>
        </hal-context-menu>
      </div>
    `

    await customElements.whenDefined("hal-context-menu")
    const menu = container.querySelector("hal-context-menu")!
    await (menu as any).updateComplete

    // Trigger the context menu with right-click at center of trigger area
    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    // Wait for animations to complete (animate-in takes ~150ms)
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-checkboxes",
      CONTEXT_MENU_SCREENSHOT_OPTIONS
    )
  })

  it("context menu with radio group", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </hal-context-menu-trigger>
          <hal-context-menu-content class="w-56">
            <hal-context-menu-label>Panel Position</hal-context-menu-label>
            <hal-context-menu-separator></hal-context-menu-separator>
            <hal-context-menu-radio-group value="bottom">
              <hal-context-menu-radio-item value="top">Top</hal-context-menu-radio-item>
              <hal-context-menu-radio-item value="bottom">
                Bottom
              </hal-context-menu-radio-item>
              <hal-context-menu-radio-item value="right">Right</hal-context-menu-radio-item>
            </hal-context-menu-radio-group>
          </hal-context-menu-content>
        </hal-context-menu>
      </div>
    `

    await customElements.whenDefined("hal-context-menu")
    const menu = container.querySelector("hal-context-menu")!
    await (menu as any).updateComplete

    // Trigger the context menu with right-click at center of trigger area
    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    // Wait for animations to complete (animate-in takes ~150ms)
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-radio",
      CONTEXT_MENU_SCREENSHOT_OPTIONS
    )
  })

  it("context menu with disabled item", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-item>Enabled Item</hal-context-menu-item>
            <hal-context-menu-item disabled>Disabled Item</hal-context-menu-item>
            <hal-context-menu-item>Another Enabled</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      </div>
    `

    await customElements.whenDefined("hal-context-menu")
    const menu = container.querySelector("hal-context-menu")!
    await (menu as any).updateComplete

    // Trigger the context menu with right-click at center of trigger area
    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    // Wait for animations to complete (animate-in takes ~150ms)
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-disabled",
      CONTEXT_MENU_SCREENSHOT_OPTIONS
    )
  })

  it("context menu with destructive item", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-item>Edit</hal-context-menu-item>
            <hal-context-menu-item>Duplicate</hal-context-menu-item>
            <hal-context-menu-separator></hal-context-menu-separator>
            <hal-context-menu-item variant="destructive">Delete</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      </div>
    `

    await customElements.whenDefined("hal-context-menu")
    const menu = container.querySelector("hal-context-menu")!
    await (menu as any).updateComplete

    // Trigger the context menu with right-click at center of trigger area
    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    // Wait for animations to complete (animate-in takes ~150ms)
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-destructive",
      CONTEXT_MENU_SCREENSHOT_OPTIONS
    )
  })

  it("context menu with inset items", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-label inset>Settings</hal-context-menu-label>
            <hal-context-menu-separator></hal-context-menu-separator>
            <hal-context-menu-item inset>Profile</hal-context-menu-item>
            <hal-context-menu-item inset>Account</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      </div>
    `

    await customElements.whenDefined("hal-context-menu")
    const menu = container.querySelector("hal-context-menu")!
    await (menu as any).updateComplete

    // Trigger the context menu with right-click at center of trigger area
    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    // Wait for animations to complete (animate-in takes ~150ms)
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-inset",
      CONTEXT_MENU_SCREENSHOT_OPTIONS
    )
  })

  it("context menu with submenu", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 100px; width: 500px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 200px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-item>New Tab</hal-context-menu-item>
            <hal-context-menu-item>New Window</hal-context-menu-item>
            <hal-context-menu-separator></hal-context-menu-separator>
            <hal-context-menu-sub open>
              <hal-context-menu-sub-trigger>More Tools</hal-context-menu-sub-trigger>
              <hal-context-menu-sub-content>
                <hal-context-menu-item>Save Page As...</hal-context-menu-item>
                <hal-context-menu-item>Create Shortcut...</hal-context-menu-item>
                <hal-context-menu-item>Name Window...</hal-context-menu-item>
                <hal-context-menu-separator></hal-context-menu-separator>
                <hal-context-menu-item>Developer Tools</hal-context-menu-item>
              </hal-context-menu-sub-content>
            </hal-context-menu-sub>
            <hal-context-menu-separator></hal-context-menu-separator>
            <hal-context-menu-item>Quit</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      </div>
    `

    await customElements.whenDefined("hal-context-menu")
    const menu = container.querySelector("hal-context-menu")!
    await (menu as any).updateComplete

    // Trigger the context menu with right-click at center of trigger area
    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    // Wait for main menu to open
    await new Promise((r) => setTimeout(r, 100))

    // Open the submenu by finding and clicking the sub-trigger
    const subTrigger = document.querySelector("hal-context-menu-sub-trigger")!
    ;(subTrigger as any).open = true
    await (subTrigger as any).updateComplete

    // Wait for animations to complete (animate-in takes ~150ms)
    await new Promise((r) => setTimeout(r, 200))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-submenu",
      CONTEXT_MENU_SCREENSHOT_OPTIONS
    )
  })
})
