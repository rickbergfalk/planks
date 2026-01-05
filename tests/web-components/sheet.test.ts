import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-sheet"
import "@/web-components/hal-button"

describe("Sheet (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document
      .querySelectorAll('[data-slot="sheet-overlay"]')
      .forEach((el) => el.remove())
    document
      .querySelectorAll('[data-slot="sheet-content"]')
      .forEach((el) => el.remove())
    document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove())
  })

  it("renders trigger with correct data-slot", async () => {
    container.innerHTML = `
      <hal-sheet>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete

    const trigger = container.querySelector("hal-sheet-trigger")
    expect(trigger?.dataset.slot).toBe("sheet-trigger")
  })

  it("sheet content is hidden by default", async () => {
    container.innerHTML = `
      <hal-sheet>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete

    const content = document.querySelector('[role="dialog"]')
    expect(content).toBeNull()
  })

  it("opens sheet on click", async () => {
    container.innerHTML = `
      <hal-sheet>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Sheet Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete

    const trigger = container.querySelector("hal-sheet-trigger")!
    trigger.click()
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content).toBeDefined()
    expect(content?.textContent).toContain("Sheet Title")
  })

  it("closes sheet on Escape key", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeDefined()

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("closes sheet on overlay click", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeDefined()

    const overlay = document.querySelector('[data-slot="sheet-overlay"]')
    ;(overlay as HTMLElement)?.click()
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("sheet content has correct data-slot", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-slot")).toBe("sheet-content")
  })

  it("trigger has aria-haspopup and aria-expanded", async () => {
    container.innerHTML = `
      <hal-sheet>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete

    const button = container.querySelector("hal-button")!
    expect(button.getAttribute("aria-haspopup")).toBe("dialog")
    expect(button.getAttribute("aria-expanded")).toBe("false")

    const trigger = container.querySelector("hal-sheet-trigger")!
    trigger.click()
    await (sheet as any).updateComplete

    expect(button.getAttribute("aria-expanded")).toBe("true")
  })

  it("can be controlled via open attribute", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeDefined()
  })

  it("fires open-change event when opened", async () => {
    container.innerHTML = `
      <hal-sheet>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete

    const openChangeSpy = vi.fn()
    sheet.addEventListener("open-change", openChangeSpy)

    const trigger = container.querySelector("hal-sheet-trigger")!
    trigger.click()
    await (sheet as any).updateComplete

    expect(openChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { open: true },
      })
    )
  })

  it("sheet has aria-labelledby pointing to title", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>My Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    const labelledBy = content?.getAttribute("aria-labelledby")
    expect(labelledBy).toBeTruthy()
    const title = document.getElementById(labelledBy!)
    expect(title?.textContent).toContain("My Title")
  })

  it("sheet has aria-describedby pointing to description", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
          <hal-sheet-description>My Description</hal-sheet-description>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    const describedBy = content?.getAttribute("aria-describedby")
    expect(describedBy).toBeTruthy()
    const description = document.getElementById(describedBy!)
    expect(description?.textContent).toContain("My Description")
  })

  it("has data-state attribute on content", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-state")).toBe("open")
  })

  it("has overlay with correct data-slot", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const overlay = document.querySelector('[data-slot="sheet-overlay"]')
    expect(overlay).toBeTruthy()
  })

  // Sheet-specific tests for side prop
  describe("side attribute", () => {
    it("defaults to right side", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <hal-button>Open</hal-button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      // Check for right-side positioning classes
      expect(content?.className).toContain("right-0")
      expect(content?.className).toContain("inset-y-0")
    })

    it("renders on left side when side=left", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <hal-button>Open</hal-button>
          </hal-sheet-trigger>
          <hal-sheet-content side="left">
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content?.className).toContain("left-0")
      expect(content?.className).toContain("inset-y-0")
    })

    it("renders on top when side=top", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <hal-button>Open</hal-button>
          </hal-sheet-trigger>
          <hal-sheet-content side="top">
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content?.className).toContain("top-0")
      expect(content?.className).toContain("inset-x-0")
    })

    it("renders on bottom when side=bottom", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <hal-button>Open</hal-button>
          </hal-sheet-trigger>
          <hal-sheet-content side="bottom">
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content?.className).toContain("bottom-0")
      expect(content?.className).toContain("inset-x-0")
    })
  })

  // Sheet close button tests
  describe("close button", () => {
    it("has close button in content", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <hal-button>Open</hal-button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const closeButton = document.querySelector(
        '[data-slot="sheet-content"] button'
      )
      expect(closeButton).toBeTruthy()
      // Check for sr-only text
      expect(closeButton?.textContent).toContain("Close")
    })

    it("hal-sheet-close component has correct data-slot", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <hal-button>Open</hal-button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Title</hal-sheet-title>
            <hal-sheet-close>
              <hal-button>Close Sheet</hal-button>
            </hal-sheet-close>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const closeButton = document.querySelector('[data-slot="sheet-close"]')
      expect(closeButton).toBeTruthy()
      expect(closeButton?.textContent).toContain("Close Sheet")
    })
  })

  it("title has correct data-slot", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>My Title</hal-sheet-title>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const title = document.querySelector('[data-slot="sheet-title"]')
    expect(title).toBeTruthy()
    expect(title?.textContent).toContain("My Title")
  })

  it("description has correct data-slot", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-title>Title</hal-sheet-title>
          <hal-sheet-description>My Description</hal-sheet-description>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const description = document.querySelector(
      '[data-slot="sheet-description"]'
    )
    expect(description).toBeTruthy()
    expect(description?.textContent).toContain("My Description")
  })

  it("renders header and footer with correct data-slots", async () => {
    container.innerHTML = `
      <hal-sheet open>
        <hal-sheet-trigger>
          <hal-button>Open</hal-button>
        </hal-sheet-trigger>
        <hal-sheet-content>
          <hal-sheet-header>
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-header>
          <hal-sheet-footer>
            <hal-button>Save</hal-button>
          </hal-sheet-footer>
        </hal-sheet-content>
      </hal-sheet>
    `

    await customElements.whenDefined("hal-sheet")
    const sheet = container.querySelector("hal-sheet")!
    await (sheet as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const header = document.querySelector('[data-slot="sheet-header"]')
    const footer = document.querySelector('[data-slot="sheet-footer"]')
    expect(header).toBeTruthy()
    expect(footer).toBeTruthy()
  })
})
