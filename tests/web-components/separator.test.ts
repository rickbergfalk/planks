import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/hal-separator"
import type { HalSeparator } from "@/web-components/hal-separator"

describe("HalSeparator (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<HalSeparator> {
    container.innerHTML = html
    await customElements.whenDefined("hal-separator")
    const sep = container.querySelector("hal-separator") as HalSeparator
    await sep.updateComplete
    return sep
  }

  it("renders with horizontal orientation by default", async () => {
    const sep = await renderAndWait(`<hal-separator></hal-separator>`)
    expect(sep).toBeDefined()
    expect(sep.dataset.slot).toBe("separator")
    expect(sep.dataset.orientation).toBe("horizontal")
  })

  it("renders with vertical orientation", async () => {
    const sep = await renderAndWait(
      `<hal-separator orientation="vertical"></hal-separator>`
    )
    expect(sep.dataset.orientation).toBe("vertical")
  })

  it("is decorative by default (role=none)", async () => {
    const sep = await renderAndWait(`<hal-separator></hal-separator>`)
    expect(sep.getAttribute("role")).toBe("none")
  })

  it("has separator role when not decorative", async () => {
    const sep = await renderAndWait(
      `<hal-separator decorative="false"></hal-separator>`
    )
    // Need to set the property since boolean attributes work differently
    sep.decorative = false
    await sep.updateComplete
    expect(sep.getAttribute("role")).toBe("separator")
  })

  it("applies horizontal classes", async () => {
    const sep = await renderAndWait(`<hal-separator></hal-separator>`)
    expect(sep.classList.contains("h-px")).toBe(true)
    expect(sep.classList.contains("w-full")).toBe(true)
  })

  it("applies vertical classes", async () => {
    const sep = await renderAndWait(
      `<hal-separator orientation="vertical"></hal-separator>`
    )
    expect(sep.classList.contains("h-full")).toBe(true)
    expect(sep.classList.contains("w-px")).toBe(true)
  })
})
