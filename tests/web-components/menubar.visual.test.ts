import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/plank-menubar"

describe("plank-menubar - Visual", () => {
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
      <plank-menubar>
        <plank-menubar-menu>
          <plank-menubar-trigger>File</plank-menubar-trigger>
        </plank-menubar-menu>
        <plank-menubar-menu>
          <plank-menubar-trigger>Edit</plank-menubar-trigger>
        </plank-menubar-menu>
        <plank-menubar-menu>
          <plank-menubar-trigger>View</plank-menubar-trigger>
        </plank-menubar-menu>
      </plank-menubar>
    `
    await customElements.whenDefined("plank-menubar")
    const menubar = container.querySelector("plank-menubar")!
    await (menubar as any).updateComplete

    await new Promise((resolve) => setTimeout(resolve, 50))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "menubar-basic"
    )
  })

  it("menubar with open menu", async () => {
    container.innerHTML = `
      <plank-menubar>
        <plank-menubar-menu>
          <plank-menubar-trigger>File</plank-menubar-trigger>
          <plank-menubar-content>
            <plank-menubar-item>
              New Tab
              <plank-menubar-shortcut>&#8984;T</plank-menubar-shortcut>
            </plank-menubar-item>
            <plank-menubar-item>
              New Window
              <plank-menubar-shortcut>&#8984;N</plank-menubar-shortcut>
            </plank-menubar-item>
            <plank-menubar-separator></plank-menubar-separator>
            <plank-menubar-item>Share</plank-menubar-item>
            <plank-menubar-separator></plank-menubar-separator>
            <plank-menubar-item>Print</plank-menubar-item>
          </plank-menubar-content>
        </plank-menubar-menu>
        <plank-menubar-menu>
          <plank-menubar-trigger>Edit</plank-menubar-trigger>
        </plank-menubar-menu>
      </plank-menubar>
    `
    await customElements.whenDefined("plank-menubar")
    const menubar = container.querySelector("plank-menubar")!
    await (menubar as any).updateComplete
    await new Promise((r) => setTimeout(r, 0))

    // Open the File menu
    const trigger = container.querySelector("plank-menubar-trigger")!
    trigger.click()
    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "menubar-open"
    )
  })

  it("menubar with checkbox items", async () => {
    container.innerHTML = `
      <plank-menubar>
        <plank-menubar-menu>
          <plank-menubar-trigger>View</plank-menubar-trigger>
          <plank-menubar-content>
            <plank-menubar-label>Appearance</plank-menubar-label>
            <plank-menubar-separator></plank-menubar-separator>
            <plank-menubar-checkbox-item checked>Status Bar</plank-menubar-checkbox-item>
            <plank-menubar-checkbox-item>Activity Bar</plank-menubar-checkbox-item>
            <plank-menubar-checkbox-item checked>Panel</plank-menubar-checkbox-item>
          </plank-menubar-content>
        </plank-menubar-menu>
      </plank-menubar>
    `
    await customElements.whenDefined("plank-menubar")
    const menubar = container.querySelector("plank-menubar")!
    await (menubar as any).updateComplete
    await new Promise((r) => setTimeout(r, 0))

    // Open the menu
    const trigger = container.querySelector("plank-menubar-trigger")!
    trigger.click()
    await new Promise((resolve) => setTimeout(resolve, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "menubar-checkbox"
    )
  })
})
