import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/hal-scroll-area"
import type {
  HalScrollArea,
  HalScrollAreaViewport,
  HalScrollBar,
} from "../../src/web-components/hal-scroll-area"

describe("hal-scroll-area", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("HalScrollArea", () => {
    it("renders with default properties", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-area")
      const scrollArea = container.querySelector(
        "hal-scroll-area"
      ) as HalScrollArea
      await scrollArea.updateComplete

      expect(scrollArea.dataset.slot).toBe("scroll-area")
      expect(scrollArea.type).toBe("hover")
      expect(scrollArea.scrollHideDelay).toBe(600)
    })

    it("applies custom class", async () => {
      container.innerHTML = `
        <hal-scroll-area class="h-72 w-48 rounded-md border">
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-area")
      const scrollArea = container.querySelector(
        "hal-scroll-area"
      ) as HalScrollArea
      await scrollArea.updateComplete

      expect(scrollArea.className).toContain("h-72")
      expect(scrollArea.className).toContain("w-48")
      expect(scrollArea.className).toContain("rounded-md")
      expect(scrollArea.className).toContain("border")
    })

    it("supports type attribute", async () => {
      container.innerHTML = `
        <hal-scroll-area type="always">
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-area")
      const scrollArea = container.querySelector(
        "hal-scroll-area"
      ) as HalScrollArea
      await scrollArea.updateComplete

      expect(scrollArea.type).toBe("always")
    })

    it("supports scroll-hide-delay attribute", async () => {
      container.innerHTML = `
        <hal-scroll-area scroll-hide-delay="1000">
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-area")
      const scrollArea = container.querySelector(
        "hal-scroll-area"
      ) as HalScrollArea
      await scrollArea.updateComplete

      expect(scrollArea.scrollHideDelay).toBe(1000)
    })
  })

  describe("HalScrollAreaViewport", () => {
    it("renders with viewport attributes", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-area-viewport")
      const viewport = container.querySelector(
        "hal-scroll-area-viewport"
      ) as HalScrollAreaViewport
      await viewport.updateComplete

      expect(viewport.dataset.slot).toBe("scroll-area-viewport")
      expect(viewport.hasAttribute("data-hal-scroll-viewport")).toBe(true)
    })

    it("wraps children in content div", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div class="test-content">Content</div>
          </hal-scroll-area-viewport>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-area-viewport")
      const viewport = container.querySelector(
        "hal-scroll-area-viewport"
      ) as HalScrollAreaViewport
      await viewport.updateComplete

      // Wait for requestAnimationFrame
      await new Promise((resolve) => requestAnimationFrame(resolve))

      const contentWrapper = viewport.querySelector("[data-hal-scroll-content]")
      expect(contentWrapper).toBeTruthy()
      expect(contentWrapper?.querySelector(".test-content")).toBeTruthy()
    })

    it("has scroll overflow styles based on scrollbars", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-area-viewport")
      const viewport = container.querySelector(
        "hal-scroll-area-viewport"
      ) as HalScrollAreaViewport
      await viewport.updateComplete

      // With vertical scrollbar, overflowY should be scroll
      expect(viewport.style.overflowY).toBe("scroll")
    })
  })

  describe("HalScrollBar", () => {
    it("renders with default vertical orientation", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-bar")
      const scrollbar = container.querySelector(
        "hal-scroll-bar"
      ) as HalScrollBar
      await scrollbar.updateComplete

      expect(scrollbar.orientation).toBe("vertical")
      expect(scrollbar.dataset.orientation).toBe("vertical")
      expect(scrollbar.dataset.slot).toBe("scroll-bar")
    })

    it("supports horizontal orientation", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar orientation="horizontal"></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-bar")
      const scrollbar = container.querySelector(
        "hal-scroll-bar"
      ) as HalScrollBar
      await scrollbar.updateComplete

      expect(scrollbar.orientation).toBe("horizontal")
      expect(scrollbar.dataset.orientation).toBe("horizontal")
    })

    it("contains thumb element", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-bar")
      const scrollbar = container.querySelector(
        "hal-scroll-bar"
      ) as HalScrollBar
      await scrollbar.updateComplete

      const thumb = scrollbar.querySelector("[data-scroll-thumb]")
      expect(thumb).toBeTruthy()
    })

    it("has absolute positioning for vertical", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-bar")
      const scrollbar = container.querySelector(
        "hal-scroll-bar"
      ) as HalScrollBar
      await scrollbar.updateComplete

      expect(scrollbar.style.position).toBe("absolute")
      expect(scrollbar.style.top).toBe("0px")
      expect(scrollbar.style.right).toBe("0px")
      expect(scrollbar.style.bottom).toBe("0px")
    })

    it("has absolute positioning for horizontal", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar orientation="horizontal"></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-bar")
      const scrollbar = container.querySelector(
        "hal-scroll-bar"
      ) as HalScrollBar
      await scrollbar.updateComplete

      expect(scrollbar.style.position).toBe("absolute")
      expect(scrollbar.style.bottom).toBe("0px")
      expect(scrollbar.style.left).toBe("0px")
      expect(scrollbar.style.right).toBe("0px")
    })

    it("has data-state attribute", async () => {
      container.innerHTML = `
        <hal-scroll-area type="always">
          <hal-scroll-area-viewport>
            <div style="height: 500px">Long content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-bar")
      const scrollbar = container.querySelector(
        "hal-scroll-bar"
      ) as HalScrollBar
      await scrollbar.updateComplete

      expect(scrollbar.hasAttribute("data-state")).toBe(true)
    })
  })

  describe("Accessibility", () => {
    it("viewport is focusable with proper focus ring styles", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-area-viewport")
      const viewport = container.querySelector(
        "hal-scroll-area-viewport"
      ) as HalScrollAreaViewport
      await viewport.updateComplete

      expect(viewport.className).toContain("focus-visible:ring")
    })
  })

  describe("Styling", () => {
    it("applies correct Tailwind classes to vertical scrollbar", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-bar")
      const scrollbar = container.querySelector(
        "hal-scroll-bar"
      ) as HalScrollBar
      await scrollbar.updateComplete

      expect(scrollbar.className).toContain("w-2.5")
      expect(scrollbar.className).toContain("border-l")
      expect(scrollbar.className).toContain("border-l-transparent")
    })

    it("applies correct Tailwind classes to horizontal scrollbar", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar orientation="horizontal"></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-bar")
      const scrollbar = container.querySelector(
        "hal-scroll-bar"
      ) as HalScrollBar
      await scrollbar.updateComplete

      expect(scrollbar.className).toContain("h-2.5")
      expect(scrollbar.className).toContain("border-t")
      expect(scrollbar.className).toContain("border-t-transparent")
    })

    it("thumb has correct styling", async () => {
      container.innerHTML = `
        <hal-scroll-area>
          <hal-scroll-area-viewport>
            <div>Content</div>
          </hal-scroll-area-viewport>
          <hal-scroll-bar></hal-scroll-bar>
        </hal-scroll-area>
      `
      await customElements.whenDefined("hal-scroll-bar")
      const scrollbar = container.querySelector(
        "hal-scroll-bar"
      ) as HalScrollBar
      await scrollbar.updateComplete

      const thumb = scrollbar.querySelector("[data-scroll-thumb]")
      expect(thumb?.className).toContain("bg-border")
      expect(thumb?.className).toContain("rounded-full")
    })
  })
})
