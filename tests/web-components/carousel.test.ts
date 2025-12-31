import { describe, it, expect, beforeEach, vi } from "vitest"
import "../../src/web-components/plank-carousel"
import type {
  PlankCarousel,
  PlankCarouselContent,
  PlankCarouselItem,
  PlankCarouselPrevious,
  PlankCarouselNext,
} from "../../src/web-components/plank-carousel"

describe("plank-carousel", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("PlankCarousel", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `<plank-carousel></plank-carousel>`
      await customElements.whenDefined("plank-carousel")
      const el = container.querySelector("plank-carousel")!
      await (el as PlankCarousel).updateComplete
      expect(el.dataset.slot).toBe("carousel")
    })

    it("has role=region and aria-roledescription=carousel", async () => {
      container.innerHTML = `<plank-carousel></plank-carousel>`
      await customElements.whenDefined("plank-carousel")
      const el = container.querySelector("plank-carousel") as PlankCarousel
      await el.updateComplete
      expect(el.getAttribute("role")).toBe("region")
      expect(el.getAttribute("aria-roledescription")).toBe("carousel")
    })

    it("defaults to horizontal orientation", async () => {
      container.innerHTML = `<plank-carousel></plank-carousel>`
      await customElements.whenDefined("plank-carousel")
      const el = container.querySelector("plank-carousel") as PlankCarousel
      await el.updateComplete
      expect(el.orientation).toBe("horizontal")
    })

    it("can be set to vertical orientation", async () => {
      container.innerHTML = `<plank-carousel orientation="vertical"></plank-carousel>`
      await customElements.whenDefined("plank-carousel")
      const el = container.querySelector("plank-carousel") as PlankCarousel
      await el.updateComplete
      expect(el.orientation).toBe("vertical")
    })

    it("applies relative class", async () => {
      container.innerHTML = `<plank-carousel></plank-carousel>`
      await customElements.whenDefined("plank-carousel")
      const el = container.querySelector("plank-carousel") as PlankCarousel
      await el.updateComplete
      expect(el.classList.contains("relative")).toBe(true)
    })

    it("applies custom class", async () => {
      container.innerHTML = `<plank-carousel class="custom-class"></plank-carousel>`
      await customElements.whenDefined("plank-carousel")
      const el = container.querySelector("plank-carousel") as PlankCarousel
      await el.updateComplete
      expect(el.classList.contains("custom-class")).toBe(true)
      expect(el.classList.contains("relative")).toBe(true)
    })

    it("handles ArrowLeft key to scroll previous", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
            <plank-carousel-item>Slide 2</plank-carousel-item>
          </plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      // Allow time for embla to initialize
      await new Promise((r) => setTimeout(r, 100))

      const scrollPrevSpy = vi.spyOn(carousel, "scrollPrev")
      carousel.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft" }))
      expect(scrollPrevSpy).toHaveBeenCalled()
    })

    it("handles ArrowRight key to scroll next", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
            <plank-carousel-item>Slide 2</plank-carousel-item>
          </plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      await new Promise((r) => setTimeout(r, 100))

      const scrollNextSpy = vi.spyOn(carousel, "scrollNext")
      carousel.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight" })
      )
      expect(scrollNextSpy).toHaveBeenCalled()
    })
  })

  describe("PlankCarouselContent", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content></plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-content")
      const content = container.querySelector(
        "plank-carousel-content"
      ) as PlankCarouselContent
      await content.updateComplete
      expect(content.dataset.slot).toBe("carousel-content")
    })

    it("has overflow-hidden class", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content></plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-content")
      const content = container.querySelector(
        "plank-carousel-content"
      ) as PlankCarouselContent
      await content.updateComplete
      expect(content.classList.contains("overflow-hidden")).toBe(true)
    })

    it("renders inner div with flex class", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content></plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-content")
      const content = container.querySelector(
        "plank-carousel-content"
      ) as PlankCarouselContent
      await content.updateComplete
      const innerDiv = content.querySelector("div")
      expect(innerDiv?.classList.contains("flex")).toBe(true)
    })

    it("applies -ml-4 for horizontal orientation", async () => {
      container.innerHTML = `
        <plank-carousel orientation="horizontal">
          <plank-carousel-content></plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      const content = container.querySelector(
        "plank-carousel-content"
      ) as PlankCarouselContent
      await content.updateComplete
      const innerDiv = content.querySelector("div")
      expect(innerDiv?.classList.contains("-ml-4")).toBe(true)
    })

    it("applies -mt-4 and flex-col for vertical orientation", async () => {
      container.innerHTML = `
        <plank-carousel orientation="vertical">
          <plank-carousel-content></plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      const content = container.querySelector(
        "plank-carousel-content"
      ) as PlankCarouselContent
      await content.updateComplete
      const innerDiv = content.querySelector("div")
      expect(innerDiv?.classList.contains("-mt-4")).toBe(true)
      expect(innerDiv?.classList.contains("flex-col")).toBe(true)
    })
  })

  describe("PlankCarouselItem", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-item")
      const item = container.querySelector(
        "plank-carousel-item"
      ) as PlankCarouselItem
      await item.updateComplete
      expect(item.dataset.slot).toBe("carousel-item")
    })

    it("has role=group and aria-roledescription=slide", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-item")
      const item = container.querySelector(
        "plank-carousel-item"
      ) as PlankCarouselItem
      await item.updateComplete
      expect(item.getAttribute("role")).toBe("group")
      expect(item.getAttribute("aria-roledescription")).toBe("slide")
    })

    it("applies base classes", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-item")
      const item = container.querySelector(
        "plank-carousel-item"
      ) as PlankCarouselItem
      await item.updateComplete
      expect(item.classList.contains("min-w-0")).toBe(true)
      expect(item.classList.contains("shrink-0")).toBe(true)
      expect(item.classList.contains("grow-0")).toBe(true)
      expect(item.classList.contains("basis-full")).toBe(true)
    })

    it("applies pl-4 for horizontal orientation", async () => {
      container.innerHTML = `
        <plank-carousel orientation="horizontal">
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      const item = container.querySelector(
        "plank-carousel-item"
      ) as PlankCarouselItem
      await item.updateComplete
      expect(item.classList.contains("pl-4")).toBe(true)
    })

    it("applies pt-4 for vertical orientation", async () => {
      container.innerHTML = `
        <plank-carousel orientation="vertical">
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      const item = container.querySelector(
        "plank-carousel-item"
      ) as PlankCarouselItem
      await item.updateComplete
      expect(item.classList.contains("pt-4")).toBe(true)
    })
  })

  describe("PlankCarouselPrevious", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-previous></plank-carousel-previous>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-previous")
      const prev = container.querySelector(
        "plank-carousel-previous"
      ) as PlankCarouselPrevious
      await prev.updateComplete
      expect(prev.dataset.slot).toBe("carousel-previous")
    })

    it("renders a button inside", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-previous></plank-carousel-previous>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-previous")
      const prev = container.querySelector(
        "plank-carousel-previous"
      ) as PlankCarouselPrevious
      await prev.updateComplete
      const button = prev.querySelector("button")
      expect(button).toBeTruthy()
    })

    it("has sr-only text for accessibility", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-previous></plank-carousel-previous>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-previous")
      const prev = container.querySelector(
        "plank-carousel-previous"
      ) as PlankCarouselPrevious
      await prev.updateComplete
      const srText = prev.querySelector(".sr-only")
      expect(srText?.textContent).toBe("Previous slide")
    })

    it("has absolute positioning classes for horizontal", async () => {
      container.innerHTML = `
        <plank-carousel orientation="horizontal">
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-previous></plank-carousel-previous>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      const prev = container.querySelector(
        "plank-carousel-previous"
      ) as PlankCarouselPrevious
      await prev.updateComplete
      const button = prev.querySelector("button")
      expect(button?.classList.contains("absolute")).toBe(true)
      expect(button?.classList.contains("-left-12")).toBe(true)
      expect(button?.classList.contains("top-1/2")).toBe(true)
    })

    it("has absolute positioning classes for vertical", async () => {
      container.innerHTML = `
        <plank-carousel orientation="vertical">
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-previous></plank-carousel-previous>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      const prev = container.querySelector(
        "plank-carousel-previous"
      ) as PlankCarouselPrevious
      await prev.updateComplete
      const button = prev.querySelector("button")
      expect(button?.classList.contains("absolute")).toBe(true)
      expect(button?.classList.contains("-top-12")).toBe(true)
      expect(button?.classList.contains("left-1/2")).toBe(true)
    })

    it("calls scrollPrev on click when not on first slide", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
            <plank-carousel-item>Slide 2</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-previous></plank-carousel-previous>
          <plank-carousel-next></plank-carousel-next>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      await new Promise((r) => setTimeout(r, 100))

      // First scroll to the next slide so we can scroll back
      carousel.scrollNext()
      await new Promise((r) => setTimeout(r, 300))

      const scrollPrevSpy = vi.spyOn(carousel, "scrollPrev")
      const prev = container.querySelector(
        "plank-carousel-previous"
      ) as PlankCarouselPrevious
      await prev.updateComplete
      const button = prev.querySelector("button")
      button?.click()
      expect(scrollPrevSpy).toHaveBeenCalled()
    })
  })

  describe("PlankCarouselNext", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-next></plank-carousel-next>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-next")
      const next = container.querySelector(
        "plank-carousel-next"
      ) as PlankCarouselNext
      await next.updateComplete
      expect(next.dataset.slot).toBe("carousel-next")
    })

    it("renders a button inside", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-next></plank-carousel-next>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-next")
      const next = container.querySelector(
        "plank-carousel-next"
      ) as PlankCarouselNext
      await next.updateComplete
      const button = next.querySelector("button")
      expect(button).toBeTruthy()
    })

    it("has sr-only text for accessibility", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-next></plank-carousel-next>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel-next")
      const next = container.querySelector(
        "plank-carousel-next"
      ) as PlankCarouselNext
      await next.updateComplete
      const srText = next.querySelector(".sr-only")
      expect(srText?.textContent).toBe("Next slide")
    })

    it("has absolute positioning classes for horizontal", async () => {
      container.innerHTML = `
        <plank-carousel orientation="horizontal">
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-next></plank-carousel-next>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      const next = container.querySelector(
        "plank-carousel-next"
      ) as PlankCarouselNext
      await next.updateComplete
      const button = next.querySelector("button")
      expect(button?.classList.contains("absolute")).toBe(true)
      expect(button?.classList.contains("-right-12")).toBe(true)
      expect(button?.classList.contains("top-1/2")).toBe(true)
    })

    it("has absolute positioning classes for vertical", async () => {
      container.innerHTML = `
        <plank-carousel orientation="vertical">
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-next></plank-carousel-next>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      const next = container.querySelector(
        "plank-carousel-next"
      ) as PlankCarouselNext
      await next.updateComplete
      const button = next.querySelector("button")
      expect(button?.classList.contains("absolute")).toBe(true)
      expect(button?.classList.contains("-bottom-12")).toBe(true)
      expect(button?.classList.contains("left-1/2")).toBe(true)
    })

    it("calls scrollNext on click", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
            <plank-carousel-item>Slide 2</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-next></plank-carousel-next>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      await new Promise((r) => setTimeout(r, 100))

      const scrollNextSpy = vi.spyOn(carousel, "scrollNext")
      const next = container.querySelector(
        "plank-carousel-next"
      ) as PlankCarouselNext
      await next.updateComplete
      const button = next.querySelector("button")
      button?.click()
      expect(scrollNextSpy).toHaveBeenCalled()
    })
  })

  describe("Events", () => {
    it("fires select event when slide changes", async () => {
      container.innerHTML = `
        <plank-carousel>
          <plank-carousel-content>
            <plank-carousel-item>Slide 1</plank-carousel-item>
            <plank-carousel-item>Slide 2</plank-carousel-item>
          </plank-carousel-content>
          <plank-carousel-next></plank-carousel-next>
        </plank-carousel>
      `
      await customElements.whenDefined("plank-carousel")
      const carousel = container.querySelector(
        "plank-carousel"
      ) as PlankCarousel
      await carousel.updateComplete
      await new Promise((r) => setTimeout(r, 100))

      const events: CustomEvent[] = []
      carousel.addEventListener("select", (e) => events.push(e as CustomEvent))

      // Navigate to next slide
      carousel.scrollNext()
      await new Promise((r) => setTimeout(r, 300))

      expect(events.length).toBeGreaterThan(0)
    })
  })
})
