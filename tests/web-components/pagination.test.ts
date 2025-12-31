import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/plank-pagination"
import type {
  PlankPagination,
  PlankPaginationContent,
  PlankPaginationItem,
  PlankPaginationLink,
  PlankPaginationPrevious,
  PlankPaginationNext,
  PlankPaginationEllipsis,
} from "../../src/web-components/plank-pagination"

describe("plank-pagination", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("PlankPagination", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `<plank-pagination></plank-pagination>`
      await customElements.whenDefined("plank-pagination")
      const el = container.querySelector("plank-pagination")!
      await (el as PlankPagination).updateComplete
      expect(el.dataset.slot).toBe("pagination")
    })

    it("has role=navigation", async () => {
      container.innerHTML = `<plank-pagination></plank-pagination>`
      await customElements.whenDefined("plank-pagination")
      const el = container.querySelector("plank-pagination") as PlankPagination
      await el.updateComplete
      expect(el.getAttribute("role")).toBe("navigation")
    })

    it("has aria-label=pagination", async () => {
      container.innerHTML = `<plank-pagination></plank-pagination>`
      await customElements.whenDefined("plank-pagination")
      const el = container.querySelector("plank-pagination") as PlankPagination
      await el.updateComplete
      expect(el.getAttribute("aria-label")).toBe("pagination")
    })

    it("applies flex and center classes", async () => {
      container.innerHTML = `<plank-pagination></plank-pagination>`
      await customElements.whenDefined("plank-pagination")
      const el = container.querySelector("plank-pagination") as PlankPagination
      await el.updateComplete
      expect(el.classList.contains("flex")).toBe(true)
      expect(el.classList.contains("justify-center")).toBe(true)
    })

    it("applies custom class", async () => {
      container.innerHTML = `<plank-pagination class="custom-class"></plank-pagination>`
      await customElements.whenDefined("plank-pagination")
      const el = container.querySelector("plank-pagination") as PlankPagination
      await el.updateComplete
      expect(el.classList.contains("custom-class")).toBe(true)
    })
  })

  describe("PlankPaginationContent", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content></plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-content")
      const content = container.querySelector(
        "plank-pagination-content"
      ) as PlankPaginationContent
      await content.updateComplete
      expect(content.dataset.slot).toBe("pagination-content")
    })

    it("applies flex and gap classes", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content></plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-content")
      const content = container.querySelector(
        "plank-pagination-content"
      ) as PlankPaginationContent
      await content.updateComplete
      expect(content.classList.contains("flex")).toBe(true)
      expect(content.classList.contains("gap-1")).toBe(true)
    })
  })

  describe("PlankPaginationItem", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item></plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-item")
      const item = container.querySelector(
        "plank-pagination-item"
      ) as PlankPaginationItem
      await item.updateComplete
      expect(item.dataset.slot).toBe("pagination-item")
    })
  })

  describe("PlankPaginationLink", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-link href="#">1</plank-pagination-link>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-link")
      const link = container.querySelector(
        "plank-pagination-link"
      ) as PlankPaginationLink
      await link.updateComplete
      expect(link.dataset.slot).toBe("pagination-link")
    })

    it("renders an anchor element", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-link href="#">1</plank-pagination-link>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-link")
      const link = container.querySelector(
        "plank-pagination-link"
      ) as PlankPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor).toBeTruthy()
    })

    it("has aria-current=page when active", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-link href="#" active>1</plank-pagination-link>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-link")
      const link = container.querySelector(
        "plank-pagination-link"
      ) as PlankPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.getAttribute("aria-current")).toBe("page")
    })

    it("does not have aria-current when not active", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-link href="#">1</plank-pagination-link>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-link")
      const link = container.querySelector(
        "plank-pagination-link"
      ) as PlankPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.hasAttribute("aria-current")).toBe(false)
    })

    it("uses outline variant when active", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-link href="#" active>1</plank-pagination-link>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-link")
      const link = container.querySelector(
        "plank-pagination-link"
      ) as PlankPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.classList.contains("border")).toBe(true)
    })

    it("uses ghost variant when not active", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-link href="#">1</plank-pagination-link>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-link")
      const link = container.querySelector(
        "plank-pagination-link"
      ) as PlankPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.classList.contains("hover:bg-accent")).toBe(true)
    })

    it("defaults to icon size", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-link href="#">1</plank-pagination-link>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-link")
      const link = container.querySelector(
        "plank-pagination-link"
      ) as PlankPaginationLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.classList.contains("size-9")).toBe(true)
    })
  })

  describe("PlankPaginationPrevious", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-previous href="#"></plank-pagination-previous>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-previous")
      const prev = container.querySelector(
        "plank-pagination-previous"
      ) as PlankPaginationPrevious
      await prev.updateComplete
      expect(prev.dataset.slot).toBe("pagination-previous")
    })

    it("has aria-label for accessibility", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-previous href="#"></plank-pagination-previous>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-previous")
      const prev = container.querySelector(
        "plank-pagination-previous"
      ) as PlankPaginationPrevious
      await prev.updateComplete
      const anchor = prev.querySelector("a")
      expect(anchor?.getAttribute("aria-label")).toBe("Go to previous page")
    })

    it("shows Previous text", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-previous href="#"></plank-pagination-previous>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-previous")
      const prev = container.querySelector(
        "plank-pagination-previous"
      ) as PlankPaginationPrevious
      await prev.updateComplete
      expect(prev.textContent).toContain("Previous")
    })

    it("contains chevron icon", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-previous href="#"></plank-pagination-previous>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-previous")
      const prev = container.querySelector(
        "plank-pagination-previous"
      ) as PlankPaginationPrevious
      await prev.updateComplete
      const svg = prev.querySelector("svg")
      expect(svg).toBeTruthy()
    })
  })

  describe("PlankPaginationNext", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-next href="#"></plank-pagination-next>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-next")
      const next = container.querySelector(
        "plank-pagination-next"
      ) as PlankPaginationNext
      await next.updateComplete
      expect(next.dataset.slot).toBe("pagination-next")
    })

    it("has aria-label for accessibility", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-next href="#"></plank-pagination-next>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-next")
      const next = container.querySelector(
        "plank-pagination-next"
      ) as PlankPaginationNext
      await next.updateComplete
      const anchor = next.querySelector("a")
      expect(anchor?.getAttribute("aria-label")).toBe("Go to next page")
    })

    it("shows Next text", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-next href="#"></plank-pagination-next>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-next")
      const next = container.querySelector(
        "plank-pagination-next"
      ) as PlankPaginationNext
      await next.updateComplete
      expect(next.textContent).toContain("Next")
    })
  })

  describe("PlankPaginationEllipsis", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-ellipsis></plank-pagination-ellipsis>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-ellipsis")
      const ellipsis = container.querySelector(
        "plank-pagination-ellipsis"
      ) as PlankPaginationEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.dataset.slot).toBe("pagination-ellipsis")
    })

    it("has aria-hidden", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-ellipsis></plank-pagination-ellipsis>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-ellipsis")
      const ellipsis = container.querySelector(
        "plank-pagination-ellipsis"
      ) as PlankPaginationEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.getAttribute("aria-hidden")).toBe("true")
    })

    it("has sr-only text for accessibility", async () => {
      container.innerHTML = `
        <plank-pagination>
          <plank-pagination-content>
            <plank-pagination-item>
              <plank-pagination-ellipsis></plank-pagination-ellipsis>
            </plank-pagination-item>
          </plank-pagination-content>
        </plank-pagination>
      `
      await customElements.whenDefined("plank-pagination-ellipsis")
      const ellipsis = container.querySelector(
        "plank-pagination-ellipsis"
      ) as PlankPaginationEllipsis
      await ellipsis.updateComplete
      const srOnly = ellipsis.querySelector(".sr-only")
      expect(srOnly?.textContent).toBe("More pages")
    })
  })
})
