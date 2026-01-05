import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-input"
import type { HalInput } from "@/web-components/hal-input"

// Helper to wait for next animation frame (label association is deferred)
const nextFrame = () => new Promise((r) => requestAnimationFrame(r))

describe("HalInput (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<HalInput> {
    container.innerHTML = html
    await customElements.whenDefined("hal-input")
    const input = container.querySelector("hal-input") as HalInput
    await input.updateComplete
    return input
  }

  it("renders with data-slot attribute", async () => {
    const inputEl = await renderAndWait(`<hal-input></hal-input>`)
    expect(inputEl).toBeDefined()
    expect(inputEl.dataset.slot).toBe("input")
  })

  it("contains a native input element", async () => {
    const inputEl = await renderAndWait(`<hal-input></hal-input>`)
    const nativeInput = inputEl.querySelector("input")
    expect(nativeInput).toBeDefined()
  })

  it("supports type attribute", async () => {
    const inputEl = await renderAndWait(`<hal-input type="email"></hal-input>`)
    const nativeInput = inputEl.querySelector("input") as HTMLInputElement
    expect(nativeInput.type).toBe("email")
  })

  it("supports placeholder", async () => {
    const inputEl = await renderAndWait(
      `<hal-input placeholder="Enter text"></hal-input>`
    )
    const nativeInput = inputEl.querySelector("input") as HTMLInputElement
    expect(nativeInput.placeholder).toBe("Enter text")
  })

  it("can be disabled", async () => {
    const inputEl = await renderAndWait(`<hal-input disabled></hal-input>`)
    const nativeInput = inputEl.querySelector("input") as HTMLInputElement
    expect(nativeInput.disabled).toBe(true)
  })

  it("supports value property", async () => {
    const inputEl = await renderAndWait(`<hal-input></hal-input>`)
    inputEl.value = "test value"
    await inputEl.updateComplete
    const nativeInput = inputEl.querySelector("input") as HTMLInputElement
    expect(nativeInput.value).toBe("test value")
  })

  it("focuses input when associated label is clicked", async () => {
    container.innerHTML = `
      <label for="test-input">Label</label>
      <hal-input id="test-input"></hal-input>
    `
    await customElements.whenDefined("hal-input")
    const inputEl = container.querySelector("hal-input") as HalInput
    await inputEl.updateComplete
    await nextFrame() // Wait for label association to be set up

    const label = container.querySelector("label")!
    const nativeInput = inputEl.querySelector("input") as HTMLInputElement

    label.click()

    expect(document.activeElement).toBe(nativeInput)
  })
})
