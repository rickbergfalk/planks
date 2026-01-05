import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/hal-button"
import type { HalButton } from "@/web-components/hal-button"

describe("HalButton (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  it("renders with default variant", async () => {
    container.innerHTML = `<hal-button>Click me</hal-button>`
    await customElements.whenDefined("hal-button")
    const button = container.querySelector("hal-button") as HalButton
    // Wait for Lit to update
    await button.updateComplete

    expect(button).toBeDefined()
    expect(button.dataset.slot).toBe("button")
    expect(button.dataset.variant).toBe("default")
    expect(button.getAttribute("role")).toBe("button")
  })

  it("renders with destructive variant", async () => {
    container.innerHTML = `<hal-button variant="destructive">Delete</hal-button>`
    await customElements.whenDefined("hal-button")
    const button = container.querySelector("hal-button") as HalButton
    await button.updateComplete

    expect(button.dataset.variant).toBe("destructive")
  })

  it("renders with different sizes", async () => {
    container.innerHTML = `<hal-button size="sm">Small</hal-button>`
    await customElements.whenDefined("hal-button")
    const button = container.querySelector("hal-button") as HalButton
    await button.updateComplete

    expect(button.dataset.size).toBe("sm")
  })

  it("contains text content", async () => {
    container.innerHTML = `<hal-button>Custom Text</hal-button>`
    await customElements.whenDefined("hal-button")
    const button = container.querySelector("hal-button") as HalButton
    await button.updateComplete

    expect(button.textContent?.trim()).toBe("Custom Text")
  })

  it("can be disabled", async () => {
    container.innerHTML = `<hal-button disabled>Disabled</hal-button>`
    await customElements.whenDefined("hal-button")
    const button = container.querySelector("hal-button") as HalButton
    await button.updateComplete

    expect(button.hasAttribute("disabled")).toBe(true)
    expect(button.getAttribute("aria-disabled")).toBe("true")
    expect(button.getAttribute("tabindex")).toBe("-1")
  })

  it("is keyboard accessible", async () => {
    container.innerHTML = `<hal-button>Accessible</hal-button>`
    await customElements.whenDefined("hal-button")
    const button = container.querySelector("hal-button") as HalButton
    await button.updateComplete

    expect(button.getAttribute("role")).toBe("button")
    expect(button.getAttribute("tabindex")).toBe("0")
  })
})
