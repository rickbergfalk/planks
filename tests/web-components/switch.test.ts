import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-switch"
import type { HalSwitch } from "@/web-components/hal-switch"

// Helper to wait for next animation frame (label association is deferred)
const nextFrame = () => new Promise((r) => requestAnimationFrame(r))

describe("HalSwitch (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("renders with default unchecked state", async () => {
    container.innerHTML = `<hal-switch></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    expect(switchEl).toBeDefined()
    expect(switchEl.dataset.slot).toBe("switch")
    expect(switchEl.dataset.state).toBe("unchecked")
    expect(switchEl.getAttribute("role")).toBe("switch")
    expect(switchEl.getAttribute("aria-checked")).toBe("false")
  })

  it("renders in checked state when checked attribute present", async () => {
    container.innerHTML = `<hal-switch checked></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    expect(switchEl.dataset.state).toBe("checked")
    expect(switchEl.getAttribute("aria-checked")).toBe("true")
  })

  it("can be disabled", async () => {
    container.innerHTML = `<hal-switch disabled></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    expect(switchEl.hasAttribute("disabled")).toBe(true)
    expect(switchEl.getAttribute("aria-disabled")).toBe("true")
  })

  it("toggles state on click", async () => {
    container.innerHTML = `<hal-switch></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    expect(switchEl.dataset.state).toBe("unchecked")

    switchEl.click()
    await switchEl.updateComplete

    expect(switchEl.dataset.state).toBe("checked")
    expect(switchEl.getAttribute("aria-checked")).toBe("true")
  })

  it("toggles state on Space key", async () => {
    container.innerHTML = `<hal-switch></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    expect(switchEl.dataset.state).toBe("unchecked")

    const event = new KeyboardEvent("keydown", { key: " ", bubbles: true })
    switchEl.dispatchEvent(event)
    await switchEl.updateComplete

    expect(switchEl.dataset.state).toBe("checked")
  })

  it("toggles state on Enter key", async () => {
    container.innerHTML = `<hal-switch></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    expect(switchEl.dataset.state).toBe("unchecked")

    const event = new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    switchEl.dispatchEvent(event)
    await switchEl.updateComplete

    expect(switchEl.dataset.state).toBe("checked")
  })

  it("fires checked-change event on toggle", async () => {
    container.innerHTML = `<hal-switch></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    const handler = vi.fn()
    switchEl.addEventListener("checked-change", handler)

    switchEl.click()
    await switchEl.updateComplete

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toBe(true)
  })

  it("does not toggle when disabled", async () => {
    container.innerHTML = `<hal-switch disabled></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    const handler = vi.fn()
    switchEl.addEventListener("checked-change", handler)

    switchEl.click()
    await switchEl.updateComplete

    expect(switchEl.dataset.state).toBe("unchecked")
    expect(handler).not.toHaveBeenCalled()
  })

  it("has a thumb element with correct data-slot", async () => {
    container.innerHTML = `<hal-switch></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    const thumb = switchEl.querySelector('[data-slot="switch-thumb"]')
    expect(thumb).toBeDefined()
  })

  it("thumb has correct data-state", async () => {
    container.innerHTML = `<hal-switch></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    let thumb = switchEl.querySelector('[data-slot="switch-thumb"]')
    expect(thumb?.getAttribute("data-state")).toBe("unchecked")

    switchEl.click()
    await switchEl.updateComplete

    thumb = switchEl.querySelector('[data-slot="switch-thumb"]')
    expect(thumb?.getAttribute("data-state")).toBe("checked")
  })

  it("is keyboard accessible", async () => {
    container.innerHTML = `<hal-switch></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    expect(switchEl.getAttribute("role")).toBe("switch")
    expect(switchEl.getAttribute("tabindex")).toBe("0")
  })

  it("has tabindex -1 when disabled", async () => {
    container.innerHTML = `<hal-switch disabled></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    expect(switchEl.getAttribute("tabindex")).toBe("-1")
  })

  it("forwards id attribute", async () => {
    container.innerHTML = `<hal-switch id="my-switch"></hal-switch>`
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete

    expect(switchEl.id).toBe("my-switch")
  })

  it("toggles when associated label is clicked", async () => {
    container.innerHTML = `
      <hal-switch id="test-switch"></hal-switch>
      <label for="test-switch">Toggle me</label>
    `
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete
    await nextFrame() // Wait for label association to be set up

    expect(switchEl.checked).toBe(false)

    const label = container.querySelector("label")!
    label.click()
    await switchEl.updateComplete

    expect(switchEl.checked).toBe(true)
  })

  it("does not toggle via label when disabled", async () => {
    container.innerHTML = `
      <hal-switch id="test-switch" disabled></hal-switch>
      <label for="test-switch">Toggle me</label>
    `
    await customElements.whenDefined("hal-switch")
    const switchEl = container.querySelector("hal-switch") as HalSwitch
    await switchEl.updateComplete
    await nextFrame() // Wait for label association to be set up

    expect(switchEl.checked).toBe(false)

    const label = container.querySelector("label")!
    label.click()
    await switchEl.updateComplete

    expect(switchEl.checked).toBe(false)
  })
})
