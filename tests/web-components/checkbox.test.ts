import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-checkbox"
import type { HalCheckbox } from "@/web-components/hal-checkbox"

// Helper to wait for next animation frame (label association is deferred)
const nextFrame = () => new Promise((r) => requestAnimationFrame(r))

describe("HalCheckbox (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("renders with default unchecked state", async () => {
    container.innerHTML = `<hal-checkbox></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    expect(checkbox).toBeDefined()
    expect(checkbox.dataset.slot).toBe("checkbox")
    expect(checkbox.dataset.state).toBe("unchecked")
    expect(checkbox.getAttribute("role")).toBe("checkbox")
    expect(checkbox.getAttribute("aria-checked")).toBe("false")
  })

  it("renders in checked state when checked attribute present", async () => {
    container.innerHTML = `<hal-checkbox checked></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    expect(checkbox.dataset.state).toBe("checked")
    expect(checkbox.getAttribute("aria-checked")).toBe("true")
  })

  it("can be disabled", async () => {
    container.innerHTML = `<hal-checkbox disabled></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    expect(checkbox.hasAttribute("disabled")).toBe(true)
    expect(checkbox.getAttribute("aria-disabled")).toBe("true")
  })

  it("toggles state on click", async () => {
    container.innerHTML = `<hal-checkbox></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    expect(checkbox.dataset.state).toBe("unchecked")

    checkbox.click()
    await checkbox.updateComplete

    expect(checkbox.dataset.state).toBe("checked")
    expect(checkbox.getAttribute("aria-checked")).toBe("true")
  })

  it("toggles state on Space key", async () => {
    container.innerHTML = `<hal-checkbox></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    expect(checkbox.dataset.state).toBe("unchecked")

    const event = new KeyboardEvent("keydown", { key: " ", bubbles: true })
    checkbox.dispatchEvent(event)
    await checkbox.updateComplete

    expect(checkbox.dataset.state).toBe("checked")
  })

  it("fires checked-change event on toggle", async () => {
    container.innerHTML = `<hal-checkbox></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    const handler = vi.fn()
    checkbox.addEventListener("checked-change", handler)

    checkbox.click()
    await checkbox.updateComplete

    expect(handler).toHaveBeenCalledTimes(1)
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toBe(true)
  })

  it("does not toggle when disabled", async () => {
    container.innerHTML = `<hal-checkbox disabled></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    const handler = vi.fn()
    checkbox.addEventListener("checked-change", handler)

    checkbox.click()
    await checkbox.updateComplete

    expect(checkbox.dataset.state).toBe("unchecked")
    expect(handler).not.toHaveBeenCalled()
  })

  it("has an indicator element when checked", async () => {
    container.innerHTML = `<hal-checkbox checked></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    const indicator = checkbox.querySelector('[data-slot="checkbox-indicator"]')
    expect(indicator).toBeTruthy()
  })

  it("hides indicator when unchecked", async () => {
    container.innerHTML = `<hal-checkbox></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    const indicator = checkbox.querySelector('[data-slot="checkbox-indicator"]')
    // Indicator should have hidden/invisible styling when unchecked
    expect(indicator).toBeTruthy()
    // The indicator's visibility is controlled by CSS, verify data-state
    expect(checkbox.dataset.state).toBe("unchecked")
  })

  it("is keyboard accessible", async () => {
    container.innerHTML = `<hal-checkbox></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    expect(checkbox.getAttribute("role")).toBe("checkbox")
    expect(checkbox.getAttribute("tabindex")).toBe("0")
  })

  it("has tabindex -1 when disabled", async () => {
    container.innerHTML = `<hal-checkbox disabled></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    expect(checkbox.getAttribute("tabindex")).toBe("-1")
  })

  it("forwards id attribute", async () => {
    container.innerHTML = `<hal-checkbox id="my-checkbox"></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    expect(checkbox.id).toBe("my-checkbox")
  })

  it("toggles when associated label is clicked", async () => {
    container.innerHTML = `
      <hal-checkbox id="test-checkbox"></hal-checkbox>
      <label for="test-checkbox">Toggle me</label>
    `
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete
    await nextFrame() // Wait for label association to be set up

    expect(checkbox.checked).toBe(false)

    const label = container.querySelector("label")!
    label.click()
    await checkbox.updateComplete

    expect(checkbox.checked).toBe(true)
  })

  it("does not toggle via label when disabled", async () => {
    container.innerHTML = `
      <hal-checkbox id="test-checkbox" disabled></hal-checkbox>
      <label for="test-checkbox">Toggle me</label>
    `
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete
    await nextFrame() // Wait for label association to be set up

    expect(checkbox.checked).toBe(false)

    const label = container.querySelector("label")!
    label.click()
    await checkbox.updateComplete

    expect(checkbox.checked).toBe(false)
  })

  it("contains check icon SVG when checked", async () => {
    container.innerHTML = `<hal-checkbox checked></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    const svg = checkbox.querySelector("svg")
    expect(svg).toBeTruthy()
  })

  it("applies custom class", async () => {
    container.innerHTML = `<hal-checkbox class="custom-class"></hal-checkbox>`
    await customElements.whenDefined("hal-checkbox")
    const checkbox = container.querySelector("hal-checkbox") as HalCheckbox
    await checkbox.updateComplete

    expect(checkbox.classList.contains("custom-class")).toBe(true)
  })
})
