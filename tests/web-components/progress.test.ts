import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-progress"
import type { HalProgress } from "@/web-components/hal-progress"

describe("HalProgress (Web Component)", () => {
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
    await customElements.whenDefined("hal-progress")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalProgress).updateComplete)
    )
  }

  describe("Basic rendering", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-progress value="50"></hal-progress>`)
      const progress = container.querySelector("hal-progress")
      expect(progress?.dataset.slot).toBe("progress")
    })

    it("renders with default value of 0", async () => {
      await renderAndWait(`<hal-progress></hal-progress>`)
      const progress = container.querySelector("hal-progress")
      expect(progress?.getAttribute("aria-valuenow")).toBe("0")
    })

    it("renders with specified value", async () => {
      await renderAndWait(`<hal-progress value="75"></hal-progress>`)
      const progress = container.querySelector("hal-progress")
      expect(progress?.getAttribute("aria-valuenow")).toBe("75")
    })

    it("clamps value to 0-100 range", async () => {
      await renderAndWait(`<hal-progress value="150"></hal-progress>`)
      const progress = container.querySelector("hal-progress")
      expect(progress?.getAttribute("aria-valuenow")).toBe("100")

      await renderAndWait(`<hal-progress value="-10"></hal-progress>`)
      const progress2 = container.querySelector("hal-progress")
      expect(progress2?.getAttribute("aria-valuenow")).toBe("0")
    })
  })

  describe("Accessibility", () => {
    it("has role='progressbar'", async () => {
      await renderAndWait(`<hal-progress value="50"></hal-progress>`)
      const progress = container.querySelector("hal-progress")
      expect(progress?.getAttribute("role")).toBe("progressbar")
    })

    it("has aria-valuemin='0'", async () => {
      await renderAndWait(`<hal-progress value="50"></hal-progress>`)
      const progress = container.querySelector("hal-progress")
      expect(progress?.getAttribute("aria-valuemin")).toBe("0")
    })

    it("has aria-valuemax='100'", async () => {
      await renderAndWait(`<hal-progress value="50"></hal-progress>`)
      const progress = container.querySelector("hal-progress")
      expect(progress?.getAttribute("aria-valuemax")).toBe("100")
    })

    it("has aria-valuenow matching value", async () => {
      await renderAndWait(`<hal-progress value="33"></hal-progress>`)
      const progress = container.querySelector("hal-progress")
      expect(progress?.getAttribute("aria-valuenow")).toBe("33")
    })
  })

  describe("Indicator positioning", () => {
    it("has indicator element with correct transform at 0%", async () => {
      await renderAndWait(`<hal-progress value="0"></hal-progress>`)
      const indicator = container.querySelector(
        "[data-slot='progress-indicator']"
      )
      expect(indicator).toBeTruthy()
      expect((indicator as HTMLElement)?.style.transform).toBe(
        "translateX(-100%)"
      )
    })

    it("has indicator element with correct transform at 50%", async () => {
      await renderAndWait(`<hal-progress value="50"></hal-progress>`)
      const indicator = container.querySelector(
        "[data-slot='progress-indicator']"
      )
      expect((indicator as HTMLElement)?.style.transform).toBe(
        "translateX(-50%)"
      )
    })

    it("has indicator element with correct transform at 100%", async () => {
      await renderAndWait(`<hal-progress value="100"></hal-progress>`)
      const indicator = container.querySelector(
        "[data-slot='progress-indicator']"
      )
      expect((indicator as HTMLElement)?.style.transform).toBe("translateX(0%)")
    })
  })

  describe("Styling", () => {
    it("has track styling classes", async () => {
      await renderAndWait(`<hal-progress value="50"></hal-progress>`)
      const progress = container.querySelector("hal-progress")
      expect(progress?.classList.contains("bg-primary/20")).toBe(true)
      expect(progress?.classList.contains("rounded-full")).toBe(true)
    })

    it("has indicator styling classes", async () => {
      await renderAndWait(`<hal-progress value="50"></hal-progress>`)
      const indicator = container.querySelector(
        "[data-slot='progress-indicator']"
      )
      expect(indicator?.classList.contains("bg-primary")).toBe(true)
    })
  })
})
