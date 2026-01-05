import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/hal-label"
import type { HalLabel } from "@/web-components/hal-label"

describe("HalLabel (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<HalLabel> {
    container.innerHTML = html
    await customElements.whenDefined("hal-label")
    const label = container.querySelector("hal-label") as HalLabel
    await label.updateComplete
    return label
  }

  it("renders with data-slot attribute", async () => {
    const labelEl = await renderAndWait(`<hal-label>Email</hal-label>`)
    expect(labelEl).toBeDefined()
    expect(labelEl.dataset.slot).toBe("label")
  })

  it("contains a native label element", async () => {
    const labelEl = await renderAndWait(`<hal-label>Username</hal-label>`)
    const nativeLabel = labelEl.querySelector("label")
    expect(nativeLabel).toBeDefined()
    // Content is projected via slot, so check the custom element's text
    expect(labelEl.textContent).toBe("Username")
  })

  it("has correct base classes", async () => {
    const labelEl = await renderAndWait(`<hal-label>Name</hal-label>`)
    expect(labelEl.classList.contains("text-sm")).toBe(true)
    expect(labelEl.classList.contains("font-medium")).toBe(true)
  })

  it("supports for attribute", async () => {
    const labelEl = await renderAndWait(
      `<hal-label for="email-input">Email</hal-label>`
    )
    const nativeLabel = labelEl.querySelector("label")
    expect(nativeLabel?.htmlFor).toBe("email-input")
  })

  it("clicking label focuses associated input", async () => {
    await renderAndWait(`
      <hal-label for="test-input">Test</hal-label>
      <input id="test-input" type="text" />
    `)
    const nativeLabel = container.querySelector("label")
    const input = container.querySelector("input")

    nativeLabel?.click()
    expect(document.activeElement).toBe(input)
  })
})
