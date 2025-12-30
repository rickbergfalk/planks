import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-context-menu"

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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-label>My Account</plank-context-menu-label>
            <plank-context-menu-separator></plank-context-menu-separator>
            <plank-context-menu-group>
              <plank-context-menu-item>
                Profile
                <plank-context-menu-shortcut>⇧⌘P</plank-context-menu-shortcut>
              </plank-context-menu-item>
              <plank-context-menu-item>
                Billing
                <plank-context-menu-shortcut>⌘B</plank-context-menu-shortcut>
              </plank-context-menu-item>
              <plank-context-menu-item>
                Settings
                <plank-context-menu-shortcut>⌘S</plank-context-menu-shortcut>
              </plank-context-menu-item>
            </plank-context-menu-group>
            <plank-context-menu-separator></plank-context-menu-separator>
            <plank-context-menu-item>Log out</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      </div>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </plank-context-menu-trigger>
          <plank-context-menu-content class="w-56">
            <plank-context-menu-label>Appearance</plank-context-menu-label>
            <plank-context-menu-separator></plank-context-menu-separator>
            <plank-context-menu-checkbox-item checked>
              Status Bar
            </plank-context-menu-checkbox-item>
            <plank-context-menu-checkbox-item>
              Activity Bar
            </plank-context-menu-checkbox-item>
            <plank-context-menu-checkbox-item checked>
              Panel
            </plank-context-menu-checkbox-item>
          </plank-context-menu-content>
        </plank-context-menu>
      </div>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </plank-context-menu-trigger>
          <plank-context-menu-content class="w-56">
            <plank-context-menu-label>Panel Position</plank-context-menu-label>
            <plank-context-menu-separator></plank-context-menu-separator>
            <plank-context-menu-radio-group value="bottom">
              <plank-context-menu-radio-item value="top">Top</plank-context-menu-radio-item>
              <plank-context-menu-radio-item value="bottom">
                Bottom
              </plank-context-menu-radio-item>
              <plank-context-menu-radio-item value="right">Right</plank-context-menu-radio-item>
            </plank-context-menu-radio-group>
          </plank-context-menu-content>
        </plank-context-menu>
      </div>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-item>Enabled Item</plank-context-menu-item>
            <plank-context-menu-item disabled>Disabled Item</plank-context-menu-item>
            <plank-context-menu-item>Another Enabled</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      </div>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-item>Edit</plank-context-menu-item>
            <plank-context-menu-item>Duplicate</plank-context-menu-item>
            <plank-context-menu-separator></plank-context-menu-separator>
            <plank-context-menu-item variant="destructive">Delete</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      </div>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 300px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-label inset>Settings</plank-context-menu-label>
            <plank-context-menu-separator></plank-context-menu-separator>
            <plank-context-menu-item inset>Profile</plank-context-menu-item>
            <plank-context-menu-item inset>Account</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      </div>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div
              data-testid="trigger"
              style="width: 200px; height: 150px; border: 2px dashed #ccc; display: flex; align-items: center; justify-content: center; border-radius: 8px;"
            >
              Right click here
            </div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-item>New Tab</plank-context-menu-item>
            <plank-context-menu-item>New Window</plank-context-menu-item>
            <plank-context-menu-separator></plank-context-menu-separator>
            <plank-context-menu-sub open>
              <plank-context-menu-sub-trigger>More Tools</plank-context-menu-sub-trigger>
              <plank-context-menu-sub-content>
                <plank-context-menu-item>Save Page As...</plank-context-menu-item>
                <plank-context-menu-item>Create Shortcut...</plank-context-menu-item>
                <plank-context-menu-item>Name Window...</plank-context-menu-item>
                <plank-context-menu-separator></plank-context-menu-separator>
                <plank-context-menu-item>Developer Tools</plank-context-menu-item>
              </plank-context-menu-sub-content>
            </plank-context-menu-sub>
            <plank-context-menu-separator></plank-context-menu-separator>
            <plank-context-menu-item>Quit</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      </div>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
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
    const subTrigger = document.querySelector("plank-context-menu-sub-trigger")!
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
