import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/plank-textarea"
import type { PlankTextarea } from "@/web-components/plank-textarea"

describe("PlankTextarea (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<PlankTextarea> {
    container.innerHTML = html
    await customElements.whenDefined("plank-textarea")
    const textarea = container.querySelector("plank-textarea") as PlankTextarea
    await textarea.updateComplete
    return textarea
  }

  it("renders with data-slot attribute", async () => {
    const textareaEl = await renderAndWait(`<plank-textarea></plank-textarea>`)
    expect(textareaEl).toBeDefined()
    expect(textareaEl.dataset.slot).toBe("textarea")
  })

  it("contains a native textarea element", async () => {
    const textareaEl = await renderAndWait(`<plank-textarea></plank-textarea>`)
    const nativeTextarea = textareaEl.querySelector("textarea")
    expect(nativeTextarea).toBeDefined()
  })

  it("supports placeholder", async () => {
    const textareaEl = await renderAndWait(`<plank-textarea placeholder="Enter message"></plank-textarea>`)
    const nativeTextarea = textareaEl.querySelector("textarea") as HTMLTextAreaElement
    expect(nativeTextarea.placeholder).toBe("Enter message")
  })

  it("can be disabled", async () => {
    const textareaEl = await renderAndWait(`<plank-textarea disabled></plank-textarea>`)
    const nativeTextarea = textareaEl.querySelector("textarea") as HTMLTextAreaElement
    expect(nativeTextarea.disabled).toBe(true)
  })

  it("supports rows attribute", async () => {
    const textareaEl = await renderAndWait(`<plank-textarea rows="5"></plank-textarea>`)
    const nativeTextarea = textareaEl.querySelector("textarea") as HTMLTextAreaElement
    expect(nativeTextarea.rows).toBe(5)
  })

  it("supports value property", async () => {
    const textareaEl = await renderAndWait(`<plank-textarea></plank-textarea>`)
    textareaEl.value = "test value"
    await textareaEl.updateComplete
    const nativeTextarea = textareaEl.querySelector("textarea") as HTMLTextAreaElement
    expect(nativeTextarea.value).toBe("test value")
  })
})
