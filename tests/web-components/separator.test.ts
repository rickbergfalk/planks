import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/plank-separator"
import type { PlankSeparator } from "@/web-components/plank-separator"

describe("PlankSeparator (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<PlankSeparator> {
    container.innerHTML = html
    await customElements.whenDefined("plank-separator")
    const sep = container.querySelector("plank-separator") as PlankSeparator
    await sep.updateComplete
    return sep
  }

  it("renders with horizontal orientation by default", async () => {
    const sep = await renderAndWait(`<plank-separator></plank-separator>`)
    expect(sep).toBeDefined()
    expect(sep.dataset.slot).toBe("separator")
    expect(sep.dataset.orientation).toBe("horizontal")
  })

  it("renders with vertical orientation", async () => {
    const sep = await renderAndWait(`<plank-separator orientation="vertical"></plank-separator>`)
    expect(sep.dataset.orientation).toBe("vertical")
  })

  it("is decorative by default (role=none)", async () => {
    const sep = await renderAndWait(`<plank-separator></plank-separator>`)
    expect(sep.getAttribute("role")).toBe("none")
  })

  it("has separator role when not decorative", async () => {
    const sep = await renderAndWait(`<plank-separator decorative="false"></plank-separator>`)
    // Need to set the property since boolean attributes work differently
    sep.decorative = false
    await sep.updateComplete
    expect(sep.getAttribute("role")).toBe("separator")
  })

  it("applies horizontal classes", async () => {
    const sep = await renderAndWait(`<plank-separator></plank-separator>`)
    expect(sep.classList.contains("h-px")).toBe(true)
    expect(sep.classList.contains("w-full")).toBe(true)
  })

  it("applies vertical classes", async () => {
    const sep = await renderAndWait(`<plank-separator orientation="vertical"></plank-separator>`)
    expect(sep.classList.contains("h-full")).toBe(true)
    expect(sep.classList.contains("w-px")).toBe(true)
  })
})
