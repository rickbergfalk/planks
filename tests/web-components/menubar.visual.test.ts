import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/hal-menubar"

describe("hal-menubar - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "16px"
    container.style.width = "600px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("basic menubar", async () => {
    container.innerHTML = `
      <hal-menubar>
        <hal-menubar-menu>
          <hal-menubar-trigger>File</hal-menubar-trigger>
        </hal-menubar-menu>
        <hal-menubar-menu>
          <hal-menubar-trigger>Edit</hal-menubar-trigger>
        </hal-menubar-menu>
        <hal-menubar-menu>
          <hal-menubar-trigger>View</hal-menubar-trigger>
        </hal-menubar-menu>
      </hal-menubar>
    `
    await customElements.whenDefined("hal-menubar")
    const menubar = container.querySelector("hal-menubar")!
    await (menubar as any).updateComplete

    await new Promise((resolve) => setTimeout(resolve, 50))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "menubar-basic"
    )
  })

  it("menubar with open menu", async () => {
    container.innerHTML = `
      <hal-menubar>
        <hal-menubar-menu>
          <hal-menubar-trigger>File</hal-menubar-trigger>
          <hal-menubar-content>
            <hal-menubar-item>
              New Tab
              <hal-menubar-shortcut>&#8984;T</hal-menubar-shortcut>
            </hal-menubar-item>
            <hal-menubar-item>
              New Window
              <hal-menubar-shortcut>&#8984;N</hal-menubar-shortcut>
            </hal-menubar-item>
            <hal-menubar-separator></hal-menubar-separator>
            <hal-menubar-item>Share</hal-menubar-item>
            <hal-menubar-separator></hal-menubar-separator>
            <hal-menubar-item>Print</hal-menubar-item>
          </hal-menubar-content>
        </hal-menubar-menu>
        <hal-menubar-menu>
          <hal-menubar-trigger>Edit</hal-menubar-trigger>
        </hal-menubar-menu>
      </hal-menubar>
    `
    await customElements.whenDefined("hal-menubar")
    const menubar = container.querySelector("hal-menubar")!
    await (menubar as any).updateComplete
    await new Promise((r) => setTimeout(r, 0))

    // Open the File menu
    const trigger = container.querySelector("hal-menubar-trigger")!
    trigger.click()
    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "menubar-open"
    )
  })

  it("menubar with checkbox items", async () => {
    container.innerHTML = `
      <hal-menubar>
        <hal-menubar-menu>
          <hal-menubar-trigger>View</hal-menubar-trigger>
          <hal-menubar-content>
            <hal-menubar-label>Appearance</hal-menubar-label>
            <hal-menubar-separator></hal-menubar-separator>
            <hal-menubar-checkbox-item checked>Status Bar</hal-menubar-checkbox-item>
            <hal-menubar-checkbox-item>Activity Bar</hal-menubar-checkbox-item>
            <hal-menubar-checkbox-item checked>Panel</hal-menubar-checkbox-item>
          </hal-menubar-content>
        </hal-menubar-menu>
      </hal-menubar>
    `
    await customElements.whenDefined("hal-menubar")
    const menubar = container.querySelector("hal-menubar")!
    await (menubar as any).updateComplete
    await new Promise((r) => setTimeout(r, 0))

    // Open the menu
    const trigger = container.querySelector("hal-menubar-trigger")!
    trigger.click()
    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "menubar-checkbox"
    )
  })
})
