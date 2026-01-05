import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/hal-empty"
import type { HalEmpty } from "@/web-components/hal-empty"

describe("HalEmpty (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-empty")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalEmpty).updateComplete)
    )
  }

  it("Empty renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-empty>Content</hal-empty>`)
    const empty = container.querySelector("hal-empty")
    expect(empty?.dataset.slot).toBe("empty")
  })

  it("EmptyHeader renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-empty-header>Header</hal-empty-header>`)
    const header = container.querySelector("hal-empty-header")
    expect(header?.dataset.slot).toBe("empty-header")
  })

  it("EmptyMedia renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-empty-media>Media</hal-empty-media>`)
    const media = container.querySelector("hal-empty-media")
    expect(media?.dataset.slot).toBe("empty-icon")
  })

  it("EmptyMedia renders with default variant", async () => {
    await renderAndWait(`<hal-empty-media>Media</hal-empty-media>`)
    const media = container.querySelector("hal-empty-media")
    expect(media?.dataset.variant).toBe("default")
  })

  it("EmptyMedia renders with icon variant", async () => {
    await renderAndWait(
      `<hal-empty-media variant="icon">Media</hal-empty-media>`
    )
    const media = container.querySelector("hal-empty-media")
    expect(media?.dataset.variant).toBe("icon")
  })

  it("EmptyTitle renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-empty-title>Title</hal-empty-title>`)
    const title = container.querySelector("hal-empty-title")
    expect(title?.dataset.slot).toBe("empty-title")
  })

  it("EmptyDescription renders with data-slot attribute", async () => {
    await renderAndWait(
      `<hal-empty-description>Description</hal-empty-description>`
    )
    const desc = container.querySelector("hal-empty-description")
    expect(desc?.dataset.slot).toBe("empty-description")
  })

  it("EmptyContent renders with data-slot attribute", async () => {
    await renderAndWait(`<hal-empty-content>Content</hal-empty-content>`)
    const content = container.querySelector("hal-empty-content")
    expect(content?.dataset.slot).toBe("empty-content")
  })

  it("renders full empty composition", async () => {
    await renderAndWait(`
      <hal-empty>
        <hal-empty-header>
          <hal-empty-media variant="icon">Icon</hal-empty-media>
          <hal-empty-title>Title</hal-empty-title>
          <hal-empty-description>Description</hal-empty-description>
        </hal-empty-header>
        <hal-empty-content>Actions here</hal-empty-content>
      </hal-empty>
    `)
    const empty = container.querySelector("hal-empty")
    expect(empty?.textContent).toContain("Title")
    expect(empty?.textContent).toContain("Description")
    expect(empty?.textContent).toContain("Actions here")
  })
})
