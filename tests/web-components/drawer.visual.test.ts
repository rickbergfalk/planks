import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-drawer"
import "@/web-components/hal-button"

// Helper to wait for element to appear (more robust than fixed timeout)
async function waitForElement(
  selector: string,
  timeout = 500
): Promise<Element | null> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const element = document.querySelector(selector)
    if (element) return element
    await new Promise((r) => setTimeout(r, 20))
  }
  return null
}

// Drawer tests now use self-contained Plank animations matching vaul's behavior
// (uses global 2% tolerance for normal text anti-aliasing variations)

describe("Drawer Visual Tests (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    container.style.cssText =
      "width: 600px; height: 400px; position: relative; background: #f0f0f0;"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content (dialogs render to body)
    document.querySelectorAll('[role="dialog"]').forEach((el) => {
      el.closest("[data-vaul-drawer]")?.remove()
      el.parentElement?.remove()
    })
  })

  it("drawer-bottom", async () => {
    container.innerHTML = `
      <hal-drawer open direction="bottom">
        <hal-drawer-trigger>
          <hal-button variant="outline">Open</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content direction="bottom">
          <hal-drawer-header>
            <hal-drawer-title>Edit profile</hal-drawer-title>
            <hal-drawer-description>Make changes to your profile here.</hal-drawer-description>
          </hal-drawer-header>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    // Wait for drawer content to be rendered
    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer open from bottom")
  })

  it("drawer-top", async () => {
    container.innerHTML = `
      <hal-drawer open direction="top">
        <hal-drawer-trigger>
          <hal-button variant="outline">Open</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content direction="top">
          <hal-drawer-header>
            <hal-drawer-title>Top Drawer</hal-drawer-title>
            <hal-drawer-description>This drawer slides from top.</hal-drawer-description>
          </hal-drawer-header>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer open from top")
  })

  it("drawer-left", async () => {
    container.innerHTML = `
      <hal-drawer open direction="left">
        <hal-drawer-trigger>
          <hal-button variant="outline">Open</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content direction="left">
          <hal-drawer-header>
            <hal-drawer-title>Left Drawer</hal-drawer-title>
            <hal-drawer-description>This drawer slides from left.</hal-drawer-description>
          </hal-drawer-header>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer open from left")
  })

  it("drawer-right", async () => {
    container.innerHTML = `
      <hal-drawer open direction="right">
        <hal-drawer-trigger>
          <hal-button variant="outline">Open</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content direction="right">
          <hal-drawer-header>
            <hal-drawer-title>Right Drawer</hal-drawer-title>
            <hal-drawer-description>This drawer slides from right.</hal-drawer-description>
          </hal-drawer-header>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer open from right")
  })

  it("drawer-simple-content", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button variant="outline">Open</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-header>
            <hal-drawer-title>Simple Drawer</hal-drawer-title>
          </hal-drawer-header>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer with simple content")
  })
})
