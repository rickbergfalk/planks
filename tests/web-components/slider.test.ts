import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/plank-slider"
import type { PlankSlider } from "@/web-components/plank-slider"

describe("PlankSlider (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("rendering", () => {
    it("renders with default values", async () => {
      container.innerHTML = `<plank-slider></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      expect(slider).toBeDefined()
      expect(slider.dataset.slot).toBe("slider")
      expect(slider.min).toBe(0)
      expect(slider.max).toBe(100)
      expect(slider.step).toBe(1)
    })

    it("renders track, range, and thumb elements", async () => {
      container.innerHTML = `<plank-slider value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const track = slider.querySelector('[data-slot="slider-track"]')
      const range = slider.querySelector('[data-slot="slider-range"]')
      const thumb = slider.querySelector('[data-slot="slider-thumb"]')

      expect(track).toBeTruthy()
      expect(range).toBeTruthy()
      expect(thumb).toBeTruthy()
    })

    it("respects min/max/step attributes", async () => {
      container.innerHTML = `<plank-slider min="10" max="90" step="5"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      expect(slider.min).toBe(10)
      expect(slider.max).toBe(90)
      expect(slider.step).toBe(5)
    })

    it("renders with initial value", async () => {
      container.innerHTML = `<plank-slider value="30"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      expect(slider.value).toBe(30)
    })
  })

  describe("accessibility", () => {
    it("has role slider on thumb", async () => {
      container.innerHTML = `<plank-slider value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("role")).toBe("slider")
    })

    it("has aria-valuemin, aria-valuemax, aria-valuenow", async () => {
      container.innerHTML = `<plank-slider min="10" max="90" value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("aria-valuemin")).toBe("10")
      expect(thumb?.getAttribute("aria-valuemax")).toBe("90")
      expect(thumb?.getAttribute("aria-valuenow")).toBe("50")
    })

    it("thumb is focusable", async () => {
      container.innerHTML = `<plank-slider value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("tabindex")).toBe("0")
    })

    it("thumb is not focusable when disabled", async () => {
      container.innerHTML = `<plank-slider value="50" disabled></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("tabindex")).toBe("-1")
    })

    it("has aria-orientation when vertical", async () => {
      container.innerHTML = `<plank-slider orientation="vertical" value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("aria-orientation")).toBe("vertical")
    })
  })

  describe("keyboard interaction", () => {
    it("increases value with ArrowRight", async () => {
      container.innerHTML = `<plank-slider value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(51)
    })

    it("increases value with ArrowUp", async () => {
      container.innerHTML = `<plank-slider value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(51)
    })

    it("decreases value with ArrowLeft", async () => {
      container.innerHTML = `<plank-slider value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(49)
    })

    it("decreases value with ArrowDown", async () => {
      container.innerHTML = `<plank-slider value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(49)
    })

    it("jumps to min with Home key", async () => {
      container.innerHTML = `<plank-slider value="50" min="10"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Home", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(10)
    })

    it("jumps to max with End key", async () => {
      container.innerHTML = `<plank-slider value="50" max="90"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "End", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(90)
    })

    it("respects step increment", async () => {
      container.innerHTML = `<plank-slider value="50" step="5"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(55)
    })

    it("does not go below min", async () => {
      container.innerHTML = `<plank-slider value="10" min="10"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(10)
    })

    it("does not go above max", async () => {
      container.innerHTML = `<plank-slider value="90" max="90"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(90)
    })

    it("does not respond to keyboard when disabled", async () => {
      container.innerHTML = `<plank-slider value="50" disabled></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      )
      await slider.updateComplete

      expect(slider.value).toBe(50)
    })
  })

  describe("events", () => {
    it("fires value-change event on keyboard input", async () => {
      container.innerHTML = `<plank-slider value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const handler = vi.fn()
      slider.addEventListener("value-change", handler)

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      )
      await slider.updateComplete

      expect(handler).toHaveBeenCalledTimes(1)
      expect((handler.mock.calls[0][0] as CustomEvent).detail.value).toBe(51)
    })

    it("does not fire event when disabled", async () => {
      container.innerHTML = `<plank-slider value="50" disabled></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const handler = vi.fn()
      slider.addEventListener("value-change", handler)

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      thumb.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      )
      await slider.updateComplete

      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe("disabled state", () => {
    it("has data-disabled attribute when disabled", async () => {
      container.innerHTML = `<plank-slider disabled></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      expect(slider.hasAttribute("data-disabled")).toBe(true)
    })

    it("thumb has aria-disabled when slider is disabled", async () => {
      container.innerHTML = `<plank-slider value="50" disabled></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("aria-disabled")).toBe("true")
    })
  })

  describe("orientation", () => {
    it("defaults to horizontal", async () => {
      container.innerHTML = `<plank-slider value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      expect(slider.getAttribute("data-orientation")).toBe("horizontal")
    })

    it("can be set to vertical", async () => {
      container.innerHTML = `<plank-slider orientation="vertical" value="50"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      expect(slider.getAttribute("data-orientation")).toBe("vertical")
    })
  })

  describe("range position", () => {
    it("range fills based on value percentage", async () => {
      container.innerHTML = `<plank-slider value="50" min="0" max="100"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const range = slider.querySelector(
        '[data-slot="slider-range"]'
      ) as HTMLElement
      // Range should be 50% wide
      expect(range.style.width).toBe("50%")
    })

    it("thumb position reflects value", async () => {
      container.innerHTML = `<plank-slider value="50" min="0" max="100"></plank-slider>`
      await customElements.whenDefined("plank-slider")
      const slider = container.querySelector("plank-slider") as PlankSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      // Thumb should be at 50%
      expect(thumb.style.left).toBe("50%")
    })
  })
})
