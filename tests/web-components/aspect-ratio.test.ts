import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-aspect-ratio"
import type { HalAspectRatio } from "@/web-components/hal-aspect-ratio"

describe("HalAspectRatio (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-aspect-ratio")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalAspectRatio).updateComplete)
    )
  }

  describe("Basic rendering", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-aspect-ratio ratio="16/9"></hal-aspect-ratio>`)
      const el = container.querySelector("hal-aspect-ratio")
      expect(el?.dataset.slot).toBe("aspect-ratio")
    })

    it("renders children", async () => {
      await renderAndWait(`
        <hal-aspect-ratio ratio="16/9">
          <div data-testid="child">Content</div>
        </hal-aspect-ratio>
      `)
      const el = container.querySelector("hal-aspect-ratio")
      expect(el?.textContent).toContain("Content")
    })
  })

  describe("Ratio handling", () => {
    it("applies default ratio of 1 (square)", async () => {
      await renderAndWait(`<hal-aspect-ratio></hal-aspect-ratio>`)
      const el = container.querySelector("hal-aspect-ratio") as HTMLElement
      expect(el?.style.aspectRatio).toBe("1 / 1")
    })

    it("applies 16/9 ratio", async () => {
      await renderAndWait(`<hal-aspect-ratio ratio="16/9"></hal-aspect-ratio>`)
      const el = container.querySelector("hal-aspect-ratio") as HTMLElement
      expect(el?.style.aspectRatio).toBe("16 / 9")
    })

    it("applies 4/3 ratio", async () => {
      await renderAndWait(`<hal-aspect-ratio ratio="4/3"></hal-aspect-ratio>`)
      const el = container.querySelector("hal-aspect-ratio") as HTMLElement
      expect(el?.style.aspectRatio).toBe("4 / 3")
    })

    it("applies 1/1 ratio (square)", async () => {
      await renderAndWait(`<hal-aspect-ratio ratio="1/1"></hal-aspect-ratio>`)
      const el = container.querySelector("hal-aspect-ratio") as HTMLElement
      expect(el?.style.aspectRatio).toBe("1 / 1")
    })

    it("applies numeric ratio", async () => {
      await renderAndWait(`<hal-aspect-ratio ratio="1.777"></hal-aspect-ratio>`)
      const el = container.querySelector("hal-aspect-ratio") as HTMLElement
      // Browser normalizes numeric ratio
      expect(el?.style.aspectRatio).toBeTruthy()
    })
  })

  describe("Styling", () => {
    it("has position relative for child positioning", async () => {
      await renderAndWait(`<hal-aspect-ratio ratio="16/9"></hal-aspect-ratio>`)
      const el = container.querySelector("hal-aspect-ratio")
      expect(el?.classList.contains("relative")).toBe(true)
    })

    it("has full width by default", async () => {
      await renderAndWait(`<hal-aspect-ratio ratio="16/9"></hal-aspect-ratio>`)
      const el = container.querySelector("hal-aspect-ratio")
      expect(el?.classList.contains("w-full")).toBe(true)
    })
  })
})
