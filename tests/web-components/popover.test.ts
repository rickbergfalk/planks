import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-popover"
import "@/web-components/hal-button"

describe("Popover (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document
      .querySelectorAll('body > div[style*="position: fixed"]')
      .forEach((el) => {
        el.remove()
      })
  })

  it("renders trigger with correct data-slot", async () => {
    container.innerHTML = `
      <hal-popover>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete

    const trigger = container.querySelector("hal-popover-trigger")
    expect(trigger?.dataset.slot).toBe("popover-trigger")
  })

  it("popover content is hidden by default", async () => {
    container.innerHTML = `
      <hal-popover>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete

    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).toBeNull()
  })

  it("opens popover on click", async () => {
    container.innerHTML = `
      <hal-popover>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Popover content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete

    const trigger = container.querySelector("hal-popover-trigger")!
    trigger.click()
    await (popover as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).toBeDefined()
    expect(dialog?.textContent).toContain("Popover content")
  })

  it("closes popover on second click", async () => {
    container.innerHTML = `
      <hal-popover>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete

    const trigger = container.querySelector("hal-popover-trigger")!
    trigger.click()
    await (popover as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeDefined()

    trigger.click()
    await (popover as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("popover content has correct data-slot", async () => {
    container.innerHTML = `
      <hal-popover open>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-slot")).toBe("popover-content")
  })

  it("trigger has aria-haspopup and aria-expanded", async () => {
    container.innerHTML = `
      <hal-popover>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete

    const button = container.querySelector("hal-button")!
    expect(button.getAttribute("aria-haspopup")).toBe("dialog")
    expect(button.getAttribute("aria-expanded")).toBe("false")

    const trigger = container.querySelector("hal-popover-trigger")!
    trigger.click()
    await (popover as any).updateComplete

    expect(button.getAttribute("aria-expanded")).toBe("true")
  })

  it("can be controlled via open attribute", async () => {
    container.innerHTML = `
      <hal-popover open>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeDefined()
  })

  it("fires open-change event when opened", async () => {
    container.innerHTML = `
      <hal-popover>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete

    const openChangeSpy = vi.fn()
    popover.addEventListener("open-change", openChangeSpy)

    const trigger = container.querySelector("hal-popover-trigger")!
    trigger.click()
    await (popover as any).updateComplete

    expect(openChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { open: true },
      })
    )
  })

  it("closes on Escape key", async () => {
    container.innerHTML = `
      <hal-popover open>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeDefined()

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    await (popover as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="dialog"]')).toBeNull()
  })

  it("has data-side attribute on content", async () => {
    container.innerHTML = `
      <hal-popover open>
        <hal-popover-trigger>
          <hal-button>Open</hal-button>
        </hal-popover-trigger>
        <hal-popover-content>Content</hal-popover-content>
      </hal-popover>
    `

    await customElements.whenDefined("hal-popover")
    const popover = container.querySelector("hal-popover")!
    await (popover as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="dialog"]')
    expect(content?.getAttribute("data-side")).toBeDefined()
  })
})
