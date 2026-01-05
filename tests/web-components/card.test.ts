import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/hal-card"
import type { HalCard } from "@/web-components/hal-card"

describe("HalCard (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-card")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalCard).updateComplete)
    )
  }

  it("Card renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-card>Content</hal-card>`)
    const card = container.querySelector("hal-card")
    expect(card?.dataset.slot).toBe("card")
  })

  it("CardHeader renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-card-header>Header</hal-card-header>`)
    const header = container.querySelector("hal-card-header")
    expect(header?.dataset.slot).toBe("card-header")
  })

  it("CardTitle renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-card-title>Title</hal-card-title>`)
    const title = container.querySelector("hal-card-title")
    expect(title?.dataset.slot).toBe("card-title")
  })

  it("CardDescription renders with data-slot attribute", async () => {
    await renderAndWait(
      `<hal-card-description>Description</hal-card-description>`
    )
    const desc = container.querySelector("hal-card-description")
    expect(desc?.dataset.slot).toBe("card-description")
  })

  it("CardAction renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-card-action>Action</hal-card-action>`)
    const action = container.querySelector("hal-card-action")
    expect(action?.dataset.slot).toBe("card-action")
  })

  it("CardContent renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-card-content>Content</hal-card-content>`)
    const content = container.querySelector("hal-card-content")
    expect(content?.dataset.slot).toBe("card-content")
  })

  it("CardFooter renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-card-footer>Footer</hal-card-footer>`)
    const footer = container.querySelector("hal-card-footer")
    expect(footer?.dataset.slot).toBe("card-footer")
  })

  it("renders full card composition", async () => {
    await renderAndWait(`
      <hal-card>
        <hal-card-header>
          <hal-card-title>Title</hal-card-title>
          <hal-card-description>Description</hal-card-description>
        </hal-card-header>
        <hal-card-content>Content here</hal-card-content>
        <hal-card-footer>Footer here</hal-card-footer>
      </hal-card>
    `)
    const card = container.querySelector("hal-card")
    expect(card?.textContent).toContain("Title")
    expect(card?.textContent).toContain("Description")
    expect(card?.textContent).toContain("Content here")
    expect(card?.textContent).toContain("Footer here")
  })
})
