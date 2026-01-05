import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-toggle"
import type { HalToggle } from "@/web-components/hal-toggle"

describe("HalToggle (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("renders with default unpressed state", async () => {
    container.innerHTML = `<hal-toggle>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle).toBeDefined()
    expect(toggle.dataset.slot).toBe("toggle")
    expect(toggle.dataset.state).toBe("off")
    expect(toggle.getAttribute("role")).toBe("button")
    expect(toggle.getAttribute("aria-pressed")).toBe("false")
  })

  it("renders in pressed state when pressed attribute present", async () => {
    container.innerHTML = `<hal-toggle pressed>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.dataset.state).toBe("on")
    expect(toggle.getAttribute("aria-pressed")).toBe("true")
  })

  it("can be disabled", async () => {
    container.innerHTML = `<hal-toggle disabled>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.hasAttribute("disabled")).toBe(true)
    expect(toggle.getAttribute("aria-disabled")).toBe("true")
  })

  it("toggles state on click", async () => {
    container.innerHTML = `<hal-toggle>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.dataset.state).toBe("off")

    toggle.click()
    await toggle.updateComplete

    expect(toggle.dataset.state).toBe("on")
    expect(toggle.getAttribute("aria-pressed")).toBe("true")
  })

  it("toggles state on Space key", async () => {
    container.innerHTML = `<hal-toggle>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.dataset.state).toBe("off")

    const event = new KeyboardEvent("keydown", { key: " ", bubbles: true })
    toggle.dispatchEvent(event)
    await toggle.updateComplete

    expect(toggle.dataset.state).toBe("on")
  })

  it("toggles state on Enter key", async () => {
    container.innerHTML = `<hal-toggle>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.dataset.state).toBe("off")

    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    toggle.dispatchEvent(event)
    await toggle.updateComplete

    expect(toggle.dataset.state).toBe("on")
  })

  it("fires pressed-change event on toggle", async () => {
    container.innerHTML = `<hal-toggle>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    const handler = vi.fn()
    toggle.addEventListener("pressed-change", handler)

    toggle.click()
    await toggle.updateComplete

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toBe(true)
  })

  it("does not toggle when disabled", async () => {
    container.innerHTML = `<hal-toggle disabled>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    const handler = vi.fn()
    toggle.addEventListener("pressed-change", handler)

    toggle.click()
    await toggle.updateComplete

    expect(toggle.dataset.state).toBe("off")
    expect(handler).not.toHaveBeenCalled()
  })

  it("is keyboard accessible", async () => {
    container.innerHTML = `<hal-toggle>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.getAttribute("role")).toBe("button")
    expect(toggle.getAttribute("tabindex")).toBe("0")
  })

  it("has tabindex -1 when disabled", async () => {
    container.innerHTML = `<hal-toggle disabled>Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.getAttribute("tabindex")).toBe("-1")
  })

  it("supports outline variant", async () => {
    container.innerHTML = `<hal-toggle variant="outline">Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.classList.contains("border")).toBe(true)
  })

  it("supports size sm", async () => {
    container.innerHTML = `<hal-toggle size="sm">Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.classList.contains("h-8")).toBe(true)
  })

  it("supports size lg", async () => {
    container.innerHTML = `<hal-toggle size="lg">Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.classList.contains("h-10")).toBe(true)
  })

  it("applies custom class", async () => {
    container.innerHTML = `<hal-toggle class="custom-class">Toggle</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.classList.contains("custom-class")).toBe(true)
  })

  it("preserves children content", async () => {
    container.innerHTML = `<hal-toggle><span>Icon</span> Text</hal-toggle>`
    await customElements.whenDefined("hal-toggle")
    const toggle = container.querySelector("hal-toggle") as HalToggle
    await toggle.updateComplete

    expect(toggle.textContent).toContain("Icon")
    expect(toggle.textContent).toContain("Text")
  })
})
