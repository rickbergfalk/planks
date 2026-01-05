import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-spinner"
import type { HalSpinner } from "@/web-components/hal-spinner"

describe("HalSpinner (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<HalSpinner> {
    container.innerHTML = html
    await customElements.whenDefined("hal-spinner")
    const spinner = container.querySelector("hal-spinner") as HalSpinner
    await spinner.updateComplete
    return spinner
  }

  it("renders with data-slot attribute", async () => {
    const spinner = await renderAndWait(`<hal-spinner></hal-spinner>`)
    expect(spinner).toBeDefined()
    expect(spinner.dataset.slot).toBe("spinner")
  })

  it("contains an SVG element", async () => {
    const spinner = await renderAndWait(`<hal-spinner></hal-spinner>`)
    const svg = spinner.querySelector("svg")
    expect(svg).toBeTruthy()
  })

  it("has role=status for accessibility", async () => {
    const spinner = await renderAndWait(`<hal-spinner></hal-spinner>`)
    const svg = spinner.querySelector("svg")
    expect(svg?.getAttribute("role")).toBe("status")
  })

  it("has aria-label for accessibility", async () => {
    const spinner = await renderAndWait(`<hal-spinner></hal-spinner>`)
    const svg = spinner.querySelector("svg")
    expect(svg?.getAttribute("aria-label")).toBe("Loading")
  })

  it("has animate-spin class", async () => {
    const spinner = await renderAndWait(`<hal-spinner></hal-spinner>`)
    const svg = spinner.querySelector("svg")
    expect(svg?.classList.contains("animate-spin")).toBe(true)
  })

  it("supports custom class attribute", async () => {
    const spinner = await renderAndWait(
      `<hal-spinner class="size-8"></hal-spinner>`
    )
    const svg = spinner.querySelector("svg")
    expect(svg?.classList.contains("size-8")).toBe(true)
  })
})
