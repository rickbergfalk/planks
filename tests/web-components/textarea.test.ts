import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-textarea"
import type { HalTextarea } from "@/web-components/hal-textarea"

// Helper to wait for next animation frame (label association is deferred)
const nextFrame = () => new Promise((r) => requestAnimationFrame(r))

describe("HalTextarea (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<HalTextarea> {
    container.innerHTML = html
    await customElements.whenDefined("hal-textarea")
    const textarea = container.querySelector("hal-textarea") as HalTextarea
    await textarea.updateComplete
    return textarea
  }

  it("renders with data-slot attribute", async () => {
    const textareaEl = await renderAndWait(`<hal-textarea></hal-textarea>`)
    expect(textareaEl).toBeDefined()
    expect(textareaEl.dataset.slot).toBe("textarea")
  })

  it("contains a native textarea element", async () => {
    const textareaEl = await renderAndWait(`<hal-textarea></hal-textarea>`)
    const nativeTextarea = textareaEl.querySelector("textarea")
    expect(nativeTextarea).toBeDefined()
  })

  it("supports placeholder", async () => {
    const textareaEl = await renderAndWait(
      `<hal-textarea placeholder="Enter message"></hal-textarea>`
    )
    const nativeTextarea = textareaEl.querySelector(
      "textarea"
    ) as HTMLTextAreaElement
    expect(nativeTextarea.placeholder).toBe("Enter message")
  })

  it("can be disabled", async () => {
    const textareaEl = await renderAndWait(
      `<hal-textarea disabled></hal-textarea>`
    )
    const nativeTextarea = textareaEl.querySelector(
      "textarea"
    ) as HTMLTextAreaElement
    expect(nativeTextarea.disabled).toBe(true)
  })

  it("supports rows attribute", async () => {
    const textareaEl = await renderAndWait(
      `<hal-textarea rows="5"></hal-textarea>`
    )
    const nativeTextarea = textareaEl.querySelector(
      "textarea"
    ) as HTMLTextAreaElement
    expect(nativeTextarea.rows).toBe(5)
  })

  it("supports value property", async () => {
    const textareaEl = await renderAndWait(`<hal-textarea></hal-textarea>`)
    textareaEl.value = "test value"
    await textareaEl.updateComplete
    const nativeTextarea = textareaEl.querySelector(
      "textarea"
    ) as HTMLTextAreaElement
    expect(nativeTextarea.value).toBe("test value")
  })

  it("focuses textarea when associated label is clicked", async () => {
    container.innerHTML = `
      <label for="test-textarea">Label</label>
      <hal-textarea id="test-textarea"></hal-textarea>
    `
    await customElements.whenDefined("hal-textarea")
    const textareaEl = container.querySelector("hal-textarea") as HalTextarea
    await textareaEl.updateComplete
    await nextFrame() // Wait for label association to be set up

    const label = container.querySelector("label")!
    const nativeTextarea = textareaEl.querySelector(
      "textarea"
    ) as HTMLTextAreaElement

    label.click()

    expect(document.activeElement).toBe(nativeTextarea)
  })
})
