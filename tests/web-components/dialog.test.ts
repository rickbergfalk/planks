import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/plank-dialog"
import "@/web-components/plank-button"

describe("Dialog (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document
      .querySelectorAll('[data-slot="dialog-overlay"]')
      .forEach((el) => el.remove())
    document
      .querySelectorAll('[data-slot="dialog-content"]')
      .forEach((el) => el.remove())
    document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove())
  })

  it("renders trigger with correct data-slot", async () => {
    container.innerHTML = `
      <plank-dialog>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete

    const trigger = container.querySelector("plank-dialog-trigger")
    expect(trigger?.dataset.slot).toBe("dialog-trigger")
  })

  it("dialog content is hidden by default", async () => {
    container.innerHTML = `
      <plank-dialog>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete

    const content = document.querySelector('[role="dialog"]')
    expect(content).toBeNull()
  })

  it("opens dialog on click", async () => {
    container.innerHTML = `
      <plank-dialog>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Dialog Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete

    const trigger = container.querySelector("plank-dialog-trigger")!
    trigger.click()
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content).toBeDefined()
    expect(content?.textContent).toContain("Dialog Title")
  })

  it("closes dialog on Escape key", async () => {
    container.innerHTML = `
      <plank-dialog open>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeDefined()

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("closes dialog on overlay click", async () => {
    container.innerHTML = `
      <plank-dialog open>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeDefined()

    const overlay = document.querySelector('[data-slot="dialog-overlay"]')
    ;(overlay as HTMLElement)?.click()
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("dialog content has correct data-slot", async () => {
    container.innerHTML = `
      <plank-dialog open>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-slot")).toBe("dialog-content")
  })

  it("trigger has aria-haspopup and aria-expanded", async () => {
    container.innerHTML = `
      <plank-dialog>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete

    const button = container.querySelector("plank-button")!
    expect(button.getAttribute("aria-haspopup")).toBe("dialog")
    expect(button.getAttribute("aria-expanded")).toBe("false")

    const trigger = container.querySelector("plank-dialog-trigger")!
    trigger.click()
    await (dialog as any).updateComplete

    expect(button.getAttribute("aria-expanded")).toBe("true")
  })

  it("can be controlled via open attribute", async () => {
    container.innerHTML = `
      <plank-dialog open>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeDefined()
  })

  it("fires open-change event when opened", async () => {
    container.innerHTML = `
      <plank-dialog>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete

    const openChangeSpy = vi.fn()
    dialog.addEventListener("open-change", openChangeSpy)

    const trigger = container.querySelector("plank-dialog-trigger")!
    trigger.click()
    await (dialog as any).updateComplete

    expect(openChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { open: true },
      })
    )
  })

  it("dialog has aria-labelledby pointing to title", async () => {
    container.innerHTML = `
      <plank-dialog open>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>My Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    const labelledBy = content?.getAttribute("aria-labelledby")
    expect(labelledBy).toBeTruthy()
    const title = document.getElementById(labelledBy!)
    expect(title?.textContent).toContain("My Title")
  })

  it("dialog has aria-describedby pointing to description", async () => {
    container.innerHTML = `
      <plank-dialog open>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
          <plank-dialog-description>My Description</plank-dialog-description>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    const describedBy = content?.getAttribute("aria-describedby")
    expect(describedBy).toBeTruthy()
    const description = document.getElementById(describedBy!)
    expect(description?.textContent).toContain("My Description")
  })

  it("has data-state attribute on content", async () => {
    container.innerHTML = `
      <plank-dialog open>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-state")).toBe("open")
  })

  it("has overlay with correct data-slot", async () => {
    container.innerHTML = `
      <plank-dialog open>
        <plank-dialog-trigger>
          <plank-button>Open</plank-button>
        </plank-dialog-trigger>
        <plank-dialog-content>
          <plank-dialog-title>Title</plank-dialog-title>
        </plank-dialog-content>
      </plank-dialog>
    `

    await customElements.whenDefined("plank-dialog")
    const dialog = container.querySelector("plank-dialog")!
    await (dialog as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const overlay = document.querySelector('[data-slot="dialog-overlay"]')
    expect(overlay).toBeTruthy()
  })
})
