import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-drawer"
import "@/web-components/hal-button"

describe("Drawer (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document
      .querySelectorAll('[data-slot="drawer-overlay"]')
      .forEach((el) => el.remove())
    document
      .querySelectorAll('[data-slot="drawer-content"]')
      .forEach((el) => el.remove())
    document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove())
  })

  it("trigger has correct data-slot", async () => {
    container.innerHTML = `
      <hal-drawer>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    const trigger = container.querySelector("hal-drawer-trigger")
    expect(trigger?.getAttribute("data-slot")).toBe("drawer-trigger")
  })

  it("drawer is hidden by default", async () => {
    container.innerHTML = `
      <hal-drawer>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Drawer Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("opens on trigger click", async () => {
    container.innerHTML = `
      <hal-drawer>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Drawer Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    const trigger = container.querySelector("hal-drawer-trigger")!
    ;(trigger.querySelector("hal-button") as HTMLElement)?.click()
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  })

  it("trigger has aria-haspopup=dialog", async () => {
    container.innerHTML = `
      <hal-drawer>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    const button = container.querySelector("hal-button")
    expect(button?.getAttribute("aria-haspopup")).toBe("dialog")
  })

  it("can be controlled via open attribute", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Drawer Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).not.toBeNull()
  })

  it("fires open-change event when opened", async () => {
    container.innerHTML = `
      <hal-drawer>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete

    const handleOpenChange = vi.fn()
    drawer.addEventListener("open-change", handleOpenChange)

    const trigger = container.querySelector("hal-drawer-trigger")!
    ;(trigger.querySelector("hal-button") as HTMLElement)?.click()
    await (drawer as any).updateComplete

    expect(handleOpenChange).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { open: true },
      })
    )
  })

  it("drawer has aria-labelledby pointing to title", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>My Drawer Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const dialog = document.querySelector('[role="dialog"]')
    const labelledBy = dialog?.getAttribute("aria-labelledby")
    expect(labelledBy).toBeTruthy()

    const title = document.getElementById(labelledBy!)
    expect(title?.textContent).toContain("My Drawer Title")
  })

  it("drawer has aria-describedby pointing to description", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
          <hal-drawer-description>My description text</hal-drawer-description>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const dialog = document.querySelector('[role="dialog"]')
    const describedBy = dialog?.getAttribute("aria-describedby")
    expect(describedBy).toBeTruthy()

    const description = document.getElementById(describedBy!)
    expect(description?.textContent).toContain("My description text")
  })

  it("header has correct data-slot", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-header>
            <hal-drawer-title>Title</hal-drawer-title>
          </hal-drawer-header>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const header = document.querySelector('[data-slot="drawer-header"]')
    expect(header).not.toBeNull()
  })

  it("footer has correct data-slot", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
          <hal-drawer-footer>
            <hal-button>Action</hal-button>
          </hal-drawer-footer>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const footer = document.querySelector('[data-slot="drawer-footer"]')
    expect(footer).not.toBeNull()
  })

  it("title has correct data-slot", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title Text</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const title = document.querySelector('[data-slot="drawer-title"]')
    expect(title).not.toBeNull()
    expect(title?.textContent).toContain("Title Text")
  })

  it("description has correct data-slot", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
          <hal-drawer-description>Description Text</hal-drawer-description>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const description = document.querySelector(
      '[data-slot="drawer-description"]'
    )
    expect(description).not.toBeNull()
    expect(description?.textContent).toContain("Description Text")
  })

  it("content has correct data-slot", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[data-slot="drawer-content"]')
    expect(content).not.toBeNull()
  })

  it("overlay has correct data-slot", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const overlay = document.querySelector('[data-slot="drawer-overlay"]')
    expect(overlay).not.toBeNull()
  })

  it("close button closes the drawer", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
          <hal-drawer-close>
            <hal-button>Close</hal-button>
          </hal-drawer-close>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).not.toBeNull()

    const closeButton = document.querySelector("hal-drawer-close hal-button")
    ;(closeButton as HTMLElement)?.click()
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("supports direction attribute for bottom (default)", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content direction="bottom">
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-direction")).toBe("bottom")
  })

  it("supports direction attribute for top", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content direction="top">
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-direction")).toBe("top")
  })

  it("supports direction attribute for left", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content direction="left">
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-direction")).toBe("left")
  })

  it("supports direction attribute for right", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content direction="right">
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-direction")).toBe("right")
  })

  it("closes on Escape key", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).not.toBeNull()

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("closes on overlay click", async () => {
    container.innerHTML = `
      <hal-drawer open>
        <hal-drawer-trigger>
          <hal-button>Open drawer</hal-button>
        </hal-drawer-trigger>
        <hal-drawer-content>
          <hal-drawer-title>Title</hal-drawer-title>
        </hal-drawer-content>
      </hal-drawer>
    `

    await customElements.whenDefined("hal-drawer")
    const drawer = container.querySelector("hal-drawer")!
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).not.toBeNull()

    const overlay = document.querySelector('[data-slot="drawer-overlay"]')
    ;(overlay as HTMLElement)?.click()
    await (drawer as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })
})
