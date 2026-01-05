import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-slider"
import type { HalSlider } from "@/web-components/hal-slider"

describe("HalSlider (Web Component)", () => {
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
      container.innerHTML = `<hal-slider></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      expect(slider).toBeDefined()
      expect(slider.dataset.slot).toBe("slider")
      expect(slider.min).toBe(0)
      expect(slider.max).toBe(100)
      expect(slider.step).toBe(1)
    })

    it("renders track, range, and thumb elements", async () => {
      container.innerHTML = `<hal-slider value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      const track = slider.querySelector('[data-slot="slider-track"]')
      const range = slider.querySelector('[data-slot="slider-range"]')
      const thumb = slider.querySelector('[data-slot="slider-thumb"]')

      expect(track).toBeTruthy()
      expect(range).toBeTruthy()
      expect(thumb).toBeTruthy()
    })

    it("respects min/max/step attributes", async () => {
      container.innerHTML = `<hal-slider min="10" max="90" step="5"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      expect(slider.min).toBe(10)
      expect(slider.max).toBe(90)
      expect(slider.step).toBe(5)
    })

    it("renders with initial value", async () => {
      container.innerHTML = `<hal-slider value="30"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      expect(slider.value).toBe(30)
    })
  })

  describe("accessibility", () => {
    it("has role slider on thumb", async () => {
      container.innerHTML = `<hal-slider value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("role")).toBe("slider")
    })

    it("has aria-valuemin, aria-valuemax, aria-valuenow", async () => {
      container.innerHTML = `<hal-slider min="10" max="90" value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("aria-valuemin")).toBe("10")
      expect(thumb?.getAttribute("aria-valuemax")).toBe("90")
      expect(thumb?.getAttribute("aria-valuenow")).toBe("50")
    })

    it("thumb is focusable", async () => {
      container.innerHTML = `<hal-slider value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("tabindex")).toBe("0")
    })

    it("thumb is not focusable when disabled", async () => {
      container.innerHTML = `<hal-slider value="50" disabled></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("tabindex")).toBe("-1")
    })

    it("has aria-orientation when vertical", async () => {
      container.innerHTML = `<hal-slider orientation="vertical" value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("aria-orientation")).toBe("vertical")
    })
  })

  describe("keyboard interaction", () => {
    it("increases value with ArrowRight", async () => {
      container.innerHTML = `<hal-slider value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="50" min="10"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="50" max="90"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="50" step="5"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="10" min="10"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="90" max="90"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="50" disabled></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider value="50" disabled></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
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
      container.innerHTML = `<hal-slider disabled></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      expect(slider.hasAttribute("data-disabled")).toBe(true)
    })

    it("thumb has aria-disabled when slider is disabled", async () => {
      container.innerHTML = `<hal-slider value="50" disabled></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      const thumb = slider.querySelector('[data-slot="slider-thumb"]')
      expect(thumb?.getAttribute("aria-disabled")).toBe("true")
    })
  })

  describe("orientation", () => {
    it("defaults to horizontal", async () => {
      container.innerHTML = `<hal-slider value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      expect(slider.getAttribute("data-orientation")).toBe("horizontal")
    })

    it("can be set to vertical", async () => {
      container.innerHTML = `<hal-slider orientation="vertical" value="50"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      expect(slider.getAttribute("data-orientation")).toBe("vertical")
    })
  })

  describe("range position", () => {
    it("range fills based on value percentage", async () => {
      container.innerHTML = `<hal-slider value="50" min="0" max="100"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      const range = slider.querySelector(
        '[data-slot="slider-range"]'
      ) as HTMLElement
      // Range should be 50% wide
      expect(range.style.width).toBe("50%")
    })

    it("thumb position reflects value", async () => {
      container.innerHTML = `<hal-slider value="50" min="0" max="100"></hal-slider>`
      await customElements.whenDefined("hal-slider")
      const slider = container.querySelector("hal-slider") as HalSlider
      await slider.updateComplete

      const thumb = slider.querySelector(
        '[data-slot="slider-thumb"]'
      ) as HTMLElement
      // Thumb should be at 50% (using Radix-style calc for edge bounds)
      expect(thumb.style.left).toBe("calc(50% + 0px)")
    })
  })
})
