import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/hal-pagination"
import type {
  HalPagination,
  HalPaginationContent,
  HalPaginationItem,
  HalPaginationLink,
  HalPaginationPrevious,
  HalPaginationNext,
  HalPaginationEllipsis,
} from "../../src/web-components/hal-pagination"

describe("hal-pagination", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("HalPagination", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `<hal-pagination></hal-pagination>`
      await customElements.whenDefined("hal-pagination")
      const el = container.querySelector("hal-pagination")!
      await (el as HalPagination).updateComplete
      expect(el.dataset.slot).toBe("pagination")
    })

    it("has role=navigation", async () => {
      container.innerHTML = `<hal-pagination></hal-pagination>`
      await customElements.whenDefined("hal-pagination")
      const el = container.querySelector("hal-pagination") as HalPagination
      await el.updateComplete
      expect(el.getAttribute("role")).toBe("navigation")
    })

    it("has aria-label=pagination", async () => {
      container.innerHTML = `<hal-pagination></hal-pagination>`
      await customElements.whenDefined("hal-pagination")
      const el = container.querySelector("hal-pagination") as HalPagination
      await el.updateComplete
      expect(el.getAttribute("aria-label")).toBe("pagination")
    })

    it("applies flex and center classes", async () => {
      container.innerHTML = `<hal-pagination></hal-pagination>`
      await customElements.whenDefined("hal-pagination")
      const el = container.querySelector("hal-pagination") as HalPagination
      await el.updateComplete
      expect(el.classList.contains("flex")).toBe(true)
      expect(el.classList.contains("justify-center")).toBe(true)
    })

    it("applies custom class", async () => {
      container.innerHTML = `<hal-pagination class="custom-class"></hal-pagination>`
      await customElements.whenDefined("hal-pagination")
      const el = container.querySelector("hal-pagination") as HalPagination
      await el.updateComplete
      expect(el.classList.contains("custom-class")).toBe(true)
    })
  })

  describe("HalPaginationContent", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content></hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-content")
      const content = container.querySelector(
        "hal-pagination-content"
      ) as HalPaginationContent
      await content.updateComplete
      expect(content.dataset.slot).toBe("pagination-content")
    })

    it("applies flex and gap classes", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content></hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-content")
      const content = container.querySelector(
        "hal-pagination-content"
      ) as HalPaginationContent
      await content.updateComplete
      expect(content.classList.contains("flex")).toBe(true)
      expect(content.classList.contains("gap-1")).toBe(true)
    })
  })

  describe("HalPaginationItem", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item></hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-item")
      const item = container.querySelector(
        "hal-pagination-item"
      ) as HalPaginationItem
      await item.updateComplete
      expect(item.dataset.slot).toBe("pagination-item")
    })
  })

  describe("HalPaginationLink", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-link href="#">1</hal-pagination-link>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-link")
      const link = container.querySelector(
        "hal-pagination-link"
      ) as HalPaginationLink
      await link.updateComplete
      expect(link.dataset.slot).toBe("pagination-link")
    })

    it("renders an anchor element", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-link href="#">1</hal-pagination-link>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-link")
      const link = container.querySelector(
        "hal-pagination-link"
      ) as HalPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor).toBeTruthy()
    })

    it("has aria-current=page when active", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-link href="#" active>1</hal-pagination-link>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-link")
      const link = container.querySelector(
        "hal-pagination-link"
      ) as HalPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.getAttribute("aria-current")).toBe("page")
    })

    it("does not have aria-current when not active", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-link href="#">1</hal-pagination-link>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-link")
      const link = container.querySelector(
        "hal-pagination-link"
      ) as HalPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.hasAttribute("aria-current")).toBe(false)
    })

    it("uses outline variant when active", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-link href="#" active>1</hal-pagination-link>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-link")
      const link = container.querySelector(
        "hal-pagination-link"
      ) as HalPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.classList.contains("border")).toBe(true)
    })

    it("uses ghost variant when not active", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-link href="#">1</hal-pagination-link>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-link")
      const link = container.querySelector(
        "hal-pagination-link"
      ) as HalPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.classList.contains("hover:bg-accent")).toBe(true)
    })

    it("defaults to icon size", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-link href="#">1</hal-pagination-link>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-link")
      const link = container.querySelector(
        "hal-pagination-link"
      ) as HalPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.classList.contains("size-9")).toBe(true)
    })
  })

  describe("HalPaginationPrevious", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-previous href="#"></hal-pagination-previous>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-previous")
      const prev = container.querySelector(
        "hal-pagination-previous"
      ) as HalPaginationPrevious
      await prev.updateComplete
      expect(prev.dataset.slot).toBe("pagination-previous")
    })

    it("has aria-label for accessibility", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-previous href="#"></hal-pagination-previous>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-previous")
      const prev = container.querySelector(
        "hal-pagination-previous"
      ) as HalPaginationPrevious
      await prev.updateComplete
      const anchor = prev.querySelector("a")
      expect(anchor?.getAttribute("aria-label")).toBe("Go to previous page")
    })

    it("shows Previous text", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-previous href="#"></hal-pagination-previous>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-previous")
      const prev = container.querySelector(
        "hal-pagination-previous"
      ) as HalPaginationPrevious
      await prev.updateComplete
      expect(prev.textContent).toContain("Previous")
    })

    it("contains chevron icon", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-previous href="#"></hal-pagination-previous>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-previous")
      const prev = container.querySelector(
        "hal-pagination-previous"
      ) as HalPaginationPrevious
      await prev.updateComplete
      const svg = prev.querySelector("svg")
      expect(svg).toBeTruthy()
    })
  })

  describe("HalPaginationNext", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-next href="#"></hal-pagination-next>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-next")
      const next = container.querySelector(
        "hal-pagination-next"
      ) as HalPaginationNext
      await next.updateComplete
      expect(next.dataset.slot).toBe("pagination-next")
    })

    it("has aria-label for accessibility", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-next href="#"></hal-pagination-next>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-next")
      const next = container.querySelector(
        "hal-pagination-next"
      ) as HalPaginationNext
      await next.updateComplete
      const anchor = next.querySelector("a")
      expect(anchor?.getAttribute("aria-label")).toBe("Go to next page")
    })

    it("shows Next text", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-next href="#"></hal-pagination-next>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-next")
      const next = container.querySelector(
        "hal-pagination-next"
      ) as HalPaginationNext
      await next.updateComplete
      expect(next.textContent).toContain("Next")
    })
  })

  describe("HalPaginationEllipsis", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-ellipsis></hal-pagination-ellipsis>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-ellipsis")
      const ellipsis = container.querySelector(
        "hal-pagination-ellipsis"
      ) as HalPaginationEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.dataset.slot).toBe("pagination-ellipsis")
    })

    it("has aria-hidden", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-ellipsis></hal-pagination-ellipsis>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-ellipsis")
      const ellipsis = container.querySelector(
        "hal-pagination-ellipsis"
      ) as HalPaginationEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.getAttribute("aria-hidden")).toBe("true")
    })

    it("has sr-only text for accessibility", async () => {
      container.innerHTML = `
        <hal-pagination>
          <hal-pagination-content>
            <hal-pagination-item>
              <hal-pagination-ellipsis></hal-pagination-ellipsis>
            </hal-pagination-item>
          </hal-pagination-content>
        </hal-pagination>
      `
      await customElements.whenDefined("hal-pagination-ellipsis")
      const ellipsis = container.querySelector(
        "hal-pagination-ellipsis"
      ) as HalPaginationEllipsis
      await ellipsis.updateComplete
      const srOnly = ellipsis.querySelector(".sr-only")
      expect(srOnly?.textContent).toBe("More pages")
    })
  })
})
