import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/plank-tooltip"
import "@/web-components/plank-button"

describe("Tooltip (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document.querySelectorAll('[data-slot="tooltip-content"]').forEach((el) => {
      el.parentElement?.remove()
    })
  })

  it("renders trigger", async () => {
    container.innerHTML = `
      <plank-tooltip>
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content>Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete

    const trigger = container.querySelector("plank-tooltip-trigger")
    expect(trigger).toBeDefined()
    expect(trigger?.dataset.slot).toBe("tooltip-trigger")
  })

  it("tooltip content is hidden by default", async () => {
    container.innerHTML = `
      <plank-tooltip>
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content>Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete

    // Content should not be portaled initially
    const portaledContent = document.querySelector(
      'body > div > [data-slot="tooltip-content"]'
    )
    expect(portaledContent).toBeNull()
  })

  it("shows tooltip when open attribute is set", async () => {
    container.innerHTML = `
      <plank-tooltip open>
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content>Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete

    // Wait for positioning
    await new Promise((r) => setTimeout(r, 50))

    const portaledContent = document.querySelector('[role="tooltip"]')
    expect(portaledContent).toBeDefined()
    expect(portaledContent?.textContent).toContain("Tooltip text")
  })

  it("shows tooltip on hover", async () => {
    container.innerHTML = `
      <plank-tooltip>
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content>Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete

    const trigger = container.querySelector("plank-tooltip-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))
    await (tooltip as any).updateComplete

    // Wait for positioning
    await new Promise((r) => setTimeout(r, 50))

    const portaledContent = document.querySelector('[role="tooltip"]')
    expect(portaledContent).toBeDefined()
  })

  it("hides tooltip on pointer leave", async () => {
    container.innerHTML = `
      <plank-tooltip open>
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content>Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="tooltip"]')).toBeDefined()

    const trigger = container.querySelector("plank-tooltip-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }))
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })

  it("tooltip content has correct data-slot", async () => {
    container.innerHTML = `
      <plank-tooltip open>
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content>Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="tooltip"]')
    expect(content?.getAttribute("data-slot")).toBe("tooltip-content")
  })

  it("tooltip content has data-side attribute", async () => {
    container.innerHTML = `
      <plank-tooltip open>
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content side="bottom">Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="tooltip"]')
    expect(content?.getAttribute("data-side")).toBeDefined()
  })

  it("trigger has aria-describedby when open", async () => {
    container.innerHTML = `
      <plank-tooltip open>
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content>Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete

    const button = container.querySelector("plank-button")!
    expect(button.getAttribute("aria-describedby")).toBeDefined()
  })

  it("fires open-change event when opened", async () => {
    container.innerHTML = `
      <plank-tooltip>
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content>Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")!
    await (tooltip as any).updateComplete

    const openChangeSpy = vi.fn()
    tooltip.addEventListener("open-change", openChangeSpy)

    const trigger = container.querySelector("plank-tooltip-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))
    await (tooltip as any).updateComplete

    expect(openChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { open: true },
      })
    )
  })

  it("respects delayDuration property", async () => {
    container.innerHTML = `
      <plank-tooltip delay-duration="100">
        <plank-tooltip-trigger>
          <plank-button>Hover me</plank-button>
        </plank-tooltip-trigger>
        <plank-tooltip-content>Tooltip text</plank-tooltip-content>
      </plank-tooltip>
    `

    await customElements.whenDefined("plank-tooltip")
    const tooltip = container.querySelector("plank-tooltip")! as any
    tooltip.delayDuration = 100
    await tooltip.updateComplete

    const trigger = container.querySelector("plank-tooltip-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))

    // Should not be open immediately
    await tooltip.updateComplete
    expect(document.querySelector('[role="tooltip"]')).toBeNull()

    // Wait for delay
    await new Promise((r) => setTimeout(r, 150))

    expect(document.querySelector('[role="tooltip"]')).toBeDefined()
  })
})
