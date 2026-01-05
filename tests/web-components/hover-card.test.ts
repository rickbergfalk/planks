import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-hover-card"
import "@/web-components/hal-button"

describe("hal-hover-card", () => {
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
      <hal-hover-card>
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const trigger = container.querySelector("hal-hover-card-trigger")
    expect(trigger?.dataset.slot).toBe("hover-card-trigger")
  })

  it("hover card content is hidden by default", async () => {
    container.innerHTML = `
      <hal-hover-card>
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    // Look for the portaled content (should not exist)
    const content = document.querySelector(
      'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
    )
    expect(content).toBeNull()
  })

  it("shows hover card on hover", async () => {
    container.innerHTML = `
      <hal-hover-card open-delay="0">
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Hover card content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const trigger = container.querySelector("hal-hover-card-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))

    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[data-slot="hover-card-content"]')
    expect(content).not.toBeNull()
    expect(content?.textContent).toContain("Hover card content")
  })

  it("hides hover card on mouse leave", async () => {
    container.innerHTML = `
      <hal-hover-card open-delay="0" close-delay="0">
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const trigger = container.querySelector("hal-hover-card-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))

    await new Promise((r) => setTimeout(r, 50))
    expect(
      document.querySelector('[data-slot="hover-card-content"]')
    ).not.toBeNull()

    trigger.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }))

    await new Promise((r) => setTimeout(r, 50))
    // Look for the portaled content (not the source element)
    const portaledContent = document.querySelector(
      'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
    )
    expect(portaledContent).toBeNull()
  })

  it("shows hover card on focus", async () => {
    container.innerHTML = `
      <hal-hover-card open-delay="0">
        <hal-hover-card-trigger>
          <button>@nextjs</button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const button = container.querySelector("button")!
    button.dispatchEvent(new FocusEvent("focus", { bubbles: true }))

    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[data-slot="hover-card-content"]')
    expect(content).not.toBeNull()
  })

  it("hover card content has correct data-slot", async () => {
    container.innerHTML = `
      <hal-hover-card open>
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    // Look for the portaled content
    const content = document.querySelector(
      'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
    )
    expect(content?.getAttribute("data-slot")).toBe("hover-card-content")
  })

  it("hover card content has data-side attribute", async () => {
    container.innerHTML = `
      <hal-hover-card open>
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    // Look for the portaled content
    const content = document.querySelector(
      'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
    )
    expect(content?.getAttribute("data-side")).toBeDefined()
  })

  it("hover card content has data-state attribute", async () => {
    container.innerHTML = `
      <hal-hover-card open>
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    // Look for the portaled content
    const content = document.querySelector(
      'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
    )
    expect(content?.getAttribute("data-state")).toBe("open")
  })

  it("can be controlled via open attribute", async () => {
    container.innerHTML = `
      <hal-hover-card open>
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    // Look for the portaled content
    const content = document.querySelector(
      'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
    )
    expect(content).not.toBeNull()
  })

  it("fires open-change when opened", async () => {
    container.innerHTML = `
      <hal-hover-card open-delay="0">
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const onOpenChange = vi.fn()
    hoverCard.addEventListener("open-change", onOpenChange)

    const trigger = container.querySelector("hal-hover-card-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))

    await new Promise((r) => setTimeout(r, 50))

    expect(onOpenChange).toHaveBeenCalled()
    expect(onOpenChange.mock.calls[0][0].detail.open).toBe(true)
  })

  it("respects openDelay property", async () => {
    container.innerHTML = `
      <hal-hover-card open-delay="100">
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const onOpenChange = vi.fn()
    hoverCard.addEventListener("open-change", onOpenChange)

    const trigger = container.querySelector("hal-hover-card-trigger")!
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))

    // Should not be open immediately
    await new Promise((r) => setTimeout(r, 20))
    expect(onOpenChange).not.toHaveBeenCalled()

    // Wait for delay
    await new Promise((r) => setTimeout(r, 150))
    expect(onOpenChange).toHaveBeenCalled()
    expect(onOpenChange.mock.calls[0][0].detail.open).toBe(true)
  })

  it("respects closeDelay property", async () => {
    container.innerHTML = `
      <hal-hover-card open-delay="0" close-delay="100">
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const trigger = container.querySelector("hal-hover-card-trigger")!

    // Open the hover card
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))
    await new Promise((r) => setTimeout(r, 50))

    const onOpenChange = vi.fn()
    hoverCard.addEventListener("open-change", onOpenChange)

    // Start leaving
    trigger.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }))

    // Should not be closed immediately
    await new Promise((r) => setTimeout(r, 20))
    expect(onOpenChange).not.toHaveBeenCalled()

    // Wait for delay
    await new Promise((r) => setTimeout(r, 150))
    expect(onOpenChange).toHaveBeenCalled()
    expect(onOpenChange.mock.calls[0][0].detail.open).toBe(false)
  })

  it("does not open on touch events", async () => {
    container.innerHTML = `
      <hal-hover-card open-delay="0">
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const onOpenChange = vi.fn()
    hoverCard.addEventListener("open-change", onOpenChange)

    const trigger = container.querySelector("hal-hover-card-trigger")!

    // Simulate touch event - hover card should not open
    trigger.dispatchEvent(
      new PointerEvent("pointerenter", {
        bubbles: true,
        pointerType: "touch",
      })
    )

    // Give it some time to potentially open (it shouldn't)
    await new Promise((r) => setTimeout(r, 50))

    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("trigger has data-state attribute", async () => {
    container.innerHTML = `
      <hal-hover-card open>
        <hal-hover-card-trigger>
          <button>@nextjs</button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const button = container.querySelector("button")
    expect(button?.getAttribute("data-state")).toBe("open")
  })

  it("stays open when hovering over content", async () => {
    container.innerHTML = `
      <hal-hover-card open-delay="0" close-delay="0">
        <hal-hover-card-trigger>
          <hal-button variant="link">@nextjs</hal-button>
        </hal-hover-card-trigger>
        <hal-hover-card-content>Content</hal-hover-card-content>
      </hal-hover-card>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete

    const trigger = container.querySelector("hal-hover-card-trigger")!

    // Open the hover card
    trigger.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))
    await new Promise((r) => setTimeout(r, 50))

    // Look for the portaled content
    const content = document.querySelector(
      'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
    )!
    expect(content).not.toBeNull()

    // Leave trigger but enter content
    trigger.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true }))
    content.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true }))

    await new Promise((r) => setTimeout(r, 50))

    // Content should still be visible
    const portaledContent = document.querySelector(
      'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
    )
    expect(portaledContent).not.toBeNull()
  })
})
