import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-progress"
import type { PlankProgress } from "@/web-components/plank-progress"

describe("PlankProgress (Web Component)", () => {
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
    await customElements.whenDefined("plank-progress")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as PlankProgress).updateComplete)
    )
  }

  describe("Basic rendering", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-progress value="50"></plank-progress>`)
      const progress = container.querySelector("plank-progress")
      expect(progress?.dataset.slot).toBe("progress")
    })

    it("renders with default value of 0", async () => {
      await renderAndWait(`<plank-progress></plank-progress>`)
      const progress = container.querySelector("plank-progress")
      expect(progress?.getAttribute("aria-valuenow")).toBe("0")
    })

    it("renders with specified value", async () => {
      await renderAndWait(`<plank-progress value="75"></plank-progress>`)
      const progress = container.querySelector("plank-progress")
      expect(progress?.getAttribute("aria-valuenow")).toBe("75")
    })

    it("clamps value to 0-100 range", async () => {
      await renderAndWait(`<plank-progress value="150"></plank-progress>`)
      const progress = container.querySelector("plank-progress")
      expect(progress?.getAttribute("aria-valuenow")).toBe("100")

      await renderAndWait(`<plank-progress value="-10"></plank-progress>`)
      const progress2 = container.querySelector("plank-progress")
      expect(progress2?.getAttribute("aria-valuenow")).toBe("0")
    })
  })

  describe("Accessibility", () => {
    it("has role='progressbar'", async () => {
      await renderAndWait(`<plank-progress value="50"></plank-progress>`)
      const progress = container.querySelector("plank-progress")
      expect(progress?.getAttribute("role")).toBe("progressbar")
    })

    it("has aria-valuemin='0'", async () => {
      await renderAndWait(`<plank-progress value="50"></plank-progress>`)
      const progress = container.querySelector("plank-progress")
      expect(progress?.getAttribute("aria-valuemin")).toBe("0")
    })

    it("has aria-valuemax='100'", async () => {
      await renderAndWait(`<plank-progress value="50"></plank-progress>`)
      const progress = container.querySelector("plank-progress")
      expect(progress?.getAttribute("aria-valuemax")).toBe("100")
    })

    it("has aria-valuenow matching value", async () => {
      await renderAndWait(`<plank-progress value="33"></plank-progress>`)
      const progress = container.querySelector("plank-progress")
      expect(progress?.getAttribute("aria-valuenow")).toBe("33")
    })
  })

  describe("Indicator positioning", () => {
    it("has indicator element with correct transform at 0%", async () => {
      await renderAndWait(`<plank-progress value="0"></plank-progress>`)
      const indicator = container.querySelector(
        "[data-slot='progress-indicator']"
      )
      expect(indicator).toBeTruthy()
      expect((indicator as HTMLElement)?.style.transform).toBe(
        "translateX(-100%)"
      )
    })

    it("has indicator element with correct transform at 50%", async () => {
      await renderAndWait(`<plank-progress value="50"></plank-progress>`)
      const indicator = container.querySelector(
        "[data-slot='progress-indicator']"
      )
      expect((indicator as HTMLElement)?.style.transform).toBe(
        "translateX(-50%)"
      )
    })

    it("has indicator element with correct transform at 100%", async () => {
      await renderAndWait(`<plank-progress value="100"></plank-progress>`)
      const indicator = container.querySelector(
        "[data-slot='progress-indicator']"
      )
      expect((indicator as HTMLElement)?.style.transform).toBe("translateX(0%)")
    })
  })

  describe("Styling", () => {
    it("has track styling classes", async () => {
      await renderAndWait(`<plank-progress value="50"></plank-progress>`)
      const progress = container.querySelector("plank-progress")
      expect(progress?.classList.contains("bg-primary/20")).toBe(true)
      expect(progress?.classList.contains("rounded-full")).toBe(true)
    })

    it("has indicator styling classes", async () => {
      await renderAndWait(`<plank-progress value="50"></plank-progress>`)
      const indicator = container.querySelector(
        "[data-slot='progress-indicator']"
      )
      expect(indicator?.classList.contains("bg-primary")).toBe(true)
    })
  })
})
