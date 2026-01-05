import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-tooltip"
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
      <hal-tooltip>
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content>Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete

    const trigger = container.querySelector("hal-tooltip-trigger")
    expect(trigger).toBeDefined()
    expect(trigger?.dataset.slot).toBe("tooltip-trigger")
  })

  it("tooltip content is hidden by default", async () => {
    container.innerHTML = `
      <hal-tooltip>
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content>Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete

    // Content should not be portaled initially
    const portaledContent = document.querySelector(
      'body > div > [data-slot="tooltip-content"]'
    )
    expect(portaledContent).toBeNull()
  })

  it("shows tooltip when open attribute is set", async () => {
    container.innerHTML = `
      <hal-tooltip open>
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content>Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete

    // Wait for positioning with polling (more robust for CI)
    const portaledContent = await waitForElement('[role="tooltip"]')
    expect(portaledContent).not.toBeNull()
    expect(portaledContent?.textContent).toContain("Tooltip text")
  })

  it("shows tooltip on hover", async () => {
    container.innerHTML = `
      <hal-tooltip>
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content>Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete

    const trigger = container.querySelector("hal-tooltip-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))
    await (tooltip as any).updateComplete

    // Wait for positioning with polling (more robust for CI)
    const portaledContent = await waitForElement('[role="tooltip"]')
    expect(portaledContent).not.toBeNull()
  })

  it("hides tooltip on pointer leave", async () => {
    container.innerHTML = `
      <hal-tooltip open>
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content>Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete

    // Wait for tooltip to appear with polling
    const tooltipEl = await waitForElement('[role="tooltip"]')
    expect(tooltipEl).not.toBeNull()

    const trigger = container.querySelector("hal-tooltip-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }))
    await (tooltip as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    expect(document.querySelector('[role="tooltip"]')).toBeNull()
  })

  it("tooltip content has correct data-slot", async () => {
    container.innerHTML = `
      <hal-tooltip open>
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content>Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete

    // Wait for positioning with polling (more robust for CI)
    const content = await waitForElement('[role="tooltip"]')
    expect(content).not.toBeNull()
    expect(content?.getAttribute("data-slot")).toBe("tooltip-content")
  })

  it("tooltip content has data-side attribute", async () => {
    container.innerHTML = `
      <hal-tooltip open>
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content side="bottom">Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete

    // Wait for positioning with polling (more robust for CI)
    const content = await waitForElement('[role="tooltip"]')
    expect(content).not.toBeNull()
    expect(content?.getAttribute("data-side")).toBeDefined()
  })

  it("trigger has aria-describedby when open", async () => {
    container.innerHTML = `
      <hal-tooltip open>
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content>Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete

    const button = container.querySelector("hal-button")!
    expect(button.getAttribute("aria-describedby")).toBeDefined()
  })

  it("fires open-change event when opened", async () => {
    container.innerHTML = `
      <hal-tooltip>
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content>Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")!
    await (tooltip as any).updateComplete

    const openChangeSpy = vi.fn()
    tooltip.addEventListener("open-change", openChangeSpy)

    const trigger = container.querySelector("hal-tooltip-trigger")!
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
      <hal-tooltip delay-duration="100">
        <hal-tooltip-trigger>
          <hal-button>Hover me</hal-button>
        </hal-tooltip-trigger>
        <hal-tooltip-content>Tooltip text</hal-tooltip-content>
      </hal-tooltip>
    `

    await customElements.whenDefined("hal-tooltip")
    const tooltip = container.querySelector("hal-tooltip")! as any
    tooltip.delayDuration = 100
    await tooltip.updateComplete

    const trigger = container.querySelector("hal-tooltip-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))

    // Should not be open immediately
    await tooltip.updateComplete
    expect(document.querySelector('[role="tooltip"]')).toBeNull()

    // Wait for delay
    await new Promise((r) => setTimeout(r, 150))

    expect(document.querySelector('[role="tooltip"]')).toBeDefined()
  })
})
