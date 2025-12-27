import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/plank-button"
import type { PlankButton } from "@/web-components/plank-button"

describe("PlankButton (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  it("renders with default variant", async () => {
    container.innerHTML = `<plank-button>Click me</plank-button>`
    await customElements.whenDefined("plank-button")
    const button = container.querySelector("plank-button") as PlankButton
    // Wait for Lit to update
    await button.updateComplete

    expect(button).toBeDefined()
    expect(button.dataset.slot).toBe("button")
    expect(button.dataset.variant).toBe("default")
    expect(button.getAttribute("role")).toBe("button")
  })

  it("renders with destructive variant", async () => {
    container.innerHTML = `<plank-button variant="destructive">Delete</plank-button>`
    await customElements.whenDefined("plank-button")
    const button = container.querySelector("plank-button") as PlankButton
    await button.updateComplete

    expect(button.dataset.variant).toBe("destructive")
  })

  it("renders with different sizes", async () => {
    container.innerHTML = `<plank-button size="sm">Small</plank-button>`
    await customElements.whenDefined("plank-button")
    const button = container.querySelector("plank-button") as PlankButton
    await button.updateComplete

    expect(button.dataset.size).toBe("sm")
  })

  it("contains text content", async () => {
    container.innerHTML = `<plank-button>Custom Text</plank-button>`
    await customElements.whenDefined("plank-button")
    const button = container.querySelector("plank-button") as PlankButton
    await button.updateComplete

    expect(button.textContent?.trim()).toBe("Custom Text")
  })

  it("can be disabled", async () => {
    container.innerHTML = `<plank-button disabled>Disabled</plank-button>`
    await customElements.whenDefined("plank-button")
    const button = container.querySelector("plank-button") as PlankButton
    await button.updateComplete

    expect(button.hasAttribute("disabled")).toBe(true)
    expect(button.getAttribute("aria-disabled")).toBe("true")
    expect(button.getAttribute("tabindex")).toBe("-1")
  })

  it("is keyboard accessible", async () => {
    container.innerHTML = `<plank-button>Accessible</plank-button>`
    await customElements.whenDefined("plank-button")
    const button = container.querySelector("plank-button") as PlankButton
    await button.updateComplete

    expect(button.getAttribute("role")).toBe("button")
    expect(button.getAttribute("tabindex")).toBe("0")
  })
})
