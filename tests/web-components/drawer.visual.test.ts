import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-drawer"
import "@/web-components/plank-button"

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
      <plank-drawer open direction="bottom">
        <plank-drawer-trigger>
          <plank-button variant="outline">Open</plank-button>
        </plank-drawer-trigger>
        <plank-drawer-content direction="bottom">
          <plank-drawer-header>
            <plank-drawer-title>Edit profile</plank-drawer-title>
            <plank-drawer-description>Make changes to your profile here.</plank-drawer-description>
          </plank-drawer-header>
        </plank-drawer-content>
      </plank-drawer>
    `

    await customElements.whenDefined("plank-drawer")
    const drawer = container.querySelector("plank-drawer")!
    await (drawer as any).updateComplete

    // Wait for drawer content to be rendered
    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer open from bottom")
  })

  it("drawer-top", async () => {
    container.innerHTML = `
      <plank-drawer open direction="top">
        <plank-drawer-trigger>
          <plank-button variant="outline">Open</plank-button>
        </plank-drawer-trigger>
        <plank-drawer-content direction="top">
          <plank-drawer-header>
            <plank-drawer-title>Top Drawer</plank-drawer-title>
            <plank-drawer-description>This drawer slides from top.</plank-drawer-description>
          </plank-drawer-header>
        </plank-drawer-content>
      </plank-drawer>
    `

    await customElements.whenDefined("plank-drawer")
    const drawer = container.querySelector("plank-drawer")!
    await (drawer as any).updateComplete

    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer open from top")
  })

  it("drawer-left", async () => {
    container.innerHTML = `
      <plank-drawer open direction="left">
        <plank-drawer-trigger>
          <plank-button variant="outline">Open</plank-button>
        </plank-drawer-trigger>
        <plank-drawer-content direction="left">
          <plank-drawer-header>
            <plank-drawer-title>Left Drawer</plank-drawer-title>
            <plank-drawer-description>This drawer slides from left.</plank-drawer-description>
          </plank-drawer-header>
        </plank-drawer-content>
      </plank-drawer>
    `

    await customElements.whenDefined("plank-drawer")
    const drawer = container.querySelector("plank-drawer")!
    await (drawer as any).updateComplete

    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer open from left")
  })

  it("drawer-right", async () => {
    container.innerHTML = `
      <plank-drawer open direction="right">
        <plank-drawer-trigger>
          <plank-button variant="outline">Open</plank-button>
        </plank-drawer-trigger>
        <plank-drawer-content direction="right">
          <plank-drawer-header>
            <plank-drawer-title>Right Drawer</plank-drawer-title>
            <plank-drawer-description>This drawer slides from right.</plank-drawer-description>
          </plank-drawer-header>
        </plank-drawer-content>
      </plank-drawer>
    `

    await customElements.whenDefined("plank-drawer")
    const drawer = container.querySelector("plank-drawer")!
    await (drawer as any).updateComplete

    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer open from right")
  })

  it("drawer-simple-content", async () => {
    container.innerHTML = `
      <plank-drawer open>
        <plank-drawer-trigger>
          <plank-button variant="outline">Open</plank-button>
        </plank-drawer-trigger>
        <plank-drawer-content>
          <plank-drawer-header>
            <plank-drawer-title>Simple Drawer</plank-drawer-title>
          </plank-drawer-header>
        </plank-drawer-content>
      </plank-drawer>
    `

    await customElements.whenDefined("plank-drawer")
    const drawer = container.querySelector("plank-drawer")!
    await (drawer as any).updateComplete

    await waitForElement('[role="dialog"]')
    await new Promise((r) => setTimeout(r, 150))

    await expect(document.body).toMatchScreenshot("drawer with simple content")
  })
})
