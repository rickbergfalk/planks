import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/plank-breadcrumb"
import type {
  PlankBreadcrumb,
  PlankBreadcrumbList,
  PlankBreadcrumbItem,
  PlankBreadcrumbLink,
  PlankBreadcrumbPage,
  PlankBreadcrumbSeparator,
  PlankBreadcrumbEllipsis,
} from "../../src/web-components/plank-breadcrumb"

describe("plank-breadcrumb", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("PlankBreadcrumb", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `<plank-breadcrumb></plank-breadcrumb>`
      await customElements.whenDefined("plank-breadcrumb")
      const el = container.querySelector("plank-breadcrumb")!
      await (el as PlankBreadcrumb).updateComplete
      expect(el.dataset.slot).toBe("breadcrumb")
    })

    it("has aria-label=breadcrumb", async () => {
      container.innerHTML = `<plank-breadcrumb></plank-breadcrumb>`
      await customElements.whenDefined("plank-breadcrumb")
      const el = container.querySelector("plank-breadcrumb") as PlankBreadcrumb
      await el.updateComplete
      expect(el.getAttribute("aria-label")).toBe("breadcrumb")
    })

    it("applies custom class", async () => {
      container.innerHTML = `<plank-breadcrumb class="custom-class"></plank-breadcrumb>`
      await customElements.whenDefined("plank-breadcrumb")
      const el = container.querySelector("plank-breadcrumb") as PlankBreadcrumb
      await el.updateComplete
      expect(el.classList.contains("custom-class")).toBe(true)
    })
  })

  describe("PlankBreadcrumbList", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list></plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-list")
      const list = container.querySelector(
        "plank-breadcrumb-list"
      ) as PlankBreadcrumbList
      await list.updateComplete
      expect(list.dataset.slot).toBe("breadcrumb-list")
    })

    it("applies flex and gap classes", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list></plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-list")
      const list = container.querySelector(
        "plank-breadcrumb-list"
      ) as PlankBreadcrumbList
      await list.updateComplete
      expect(list.classList.contains("flex")).toBe(true)
      expect(list.classList.contains("flex-wrap")).toBe(true)
      expect(list.classList.contains("items-center")).toBe(true)
    })
  })

  describe("PlankBreadcrumbItem", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item></plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-item")
      const item = container.querySelector(
        "plank-breadcrumb-item"
      ) as PlankBreadcrumbItem
      await item.updateComplete
      expect(item.dataset.slot).toBe("breadcrumb-item")
    })

    it("applies inline-flex and gap classes", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item></plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-item")
      const item = container.querySelector(
        "plank-breadcrumb-item"
      ) as PlankBreadcrumbItem
      await item.updateComplete
      expect(item.classList.contains("inline-flex")).toBe(true)
      expect(item.classList.contains("items-center")).toBe(true)
    })
  })

  describe("PlankBreadcrumbLink", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-link href="#">Home</plank-breadcrumb-link>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-link")
      const link = container.querySelector(
        "plank-breadcrumb-link"
      ) as PlankBreadcrumbLink
      await link.updateComplete
      expect(link.dataset.slot).toBe("breadcrumb-link")
    })

    it("renders an anchor element", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-link href="#">Home</plank-breadcrumb-link>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-link")
      const link = container.querySelector(
        "plank-breadcrumb-link"
      ) as PlankBreadcrumbLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor).toBeTruthy()
      expect(anchor?.getAttribute("href")).toBe("#")
    })

    it("applies hover transition classes", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-link href="#">Home</plank-breadcrumb-link>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-link")
      const link = container.querySelector(
        "plank-breadcrumb-link"
      ) as PlankBreadcrumbLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.classList.contains("hover:text-foreground")).toBe(true)
      expect(anchor?.classList.contains("transition-colors")).toBe(true)
    })
  })

  describe("PlankBreadcrumbPage", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-page>Current</plank-breadcrumb-page>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-page")
      const page = container.querySelector(
        "plank-breadcrumb-page"
      ) as PlankBreadcrumbPage
      await page.updateComplete
      expect(page.dataset.slot).toBe("breadcrumb-page")
    })

    it("has role=link", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-page>Current</plank-breadcrumb-page>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-page")
      const page = container.querySelector(
        "plank-breadcrumb-page"
      ) as PlankBreadcrumbPage
      await page.updateComplete
      expect(page.getAttribute("role")).toBe("link")
    })

    it("has aria-disabled=true", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-page>Current</plank-breadcrumb-page>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-page")
      const page = container.querySelector(
        "plank-breadcrumb-page"
      ) as PlankBreadcrumbPage
      await page.updateComplete
      expect(page.getAttribute("aria-disabled")).toBe("true")
    })

    it("has aria-current=page", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-page>Current</plank-breadcrumb-page>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-page")
      const page = container.querySelector(
        "plank-breadcrumb-page"
      ) as PlankBreadcrumbPage
      await page.updateComplete
      expect(page.getAttribute("aria-current")).toBe("page")
    })

    it("applies foreground text color", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-page>Current</plank-breadcrumb-page>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-page")
      const page = container.querySelector(
        "plank-breadcrumb-page"
      ) as PlankBreadcrumbPage
      await page.updateComplete
      expect(page.classList.contains("text-foreground")).toBe(true)
    })
  })

  describe("PlankBreadcrumbSeparator", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-link href="#">Home</plank-breadcrumb-link>
            </plank-breadcrumb-item>
            <plank-breadcrumb-separator></plank-breadcrumb-separator>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-separator")
      const sep = container.querySelector(
        "plank-breadcrumb-separator"
      ) as PlankBreadcrumbSeparator
      await sep.updateComplete
      expect(sep.dataset.slot).toBe("breadcrumb-separator")
    })

    it("has role=presentation", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-separator></plank-breadcrumb-separator>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-separator")
      const sep = container.querySelector(
        "plank-breadcrumb-separator"
      ) as PlankBreadcrumbSeparator
      await sep.updateComplete
      expect(sep.getAttribute("role")).toBe("presentation")
    })

    it("has aria-hidden=true", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-separator></plank-breadcrumb-separator>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-separator")
      const sep = container.querySelector(
        "plank-breadcrumb-separator"
      ) as PlankBreadcrumbSeparator
      await sep.updateComplete
      expect(sep.getAttribute("aria-hidden")).toBe("true")
    })

    it("renders chevron icon by default", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-separator></plank-breadcrumb-separator>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-separator")
      const sep = container.querySelector(
        "plank-breadcrumb-separator"
      ) as PlankBreadcrumbSeparator
      await sep.updateComplete
      const svg = sep.querySelector("svg")
      expect(svg).toBeTruthy()
    })
  })

  describe("PlankBreadcrumbEllipsis", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-ellipsis></plank-breadcrumb-ellipsis>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-ellipsis")
      const ellipsis = container.querySelector(
        "plank-breadcrumb-ellipsis"
      ) as PlankBreadcrumbEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.dataset.slot).toBe("breadcrumb-ellipsis")
    })

    it("has role=presentation", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-ellipsis></plank-breadcrumb-ellipsis>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-ellipsis")
      const ellipsis = container.querySelector(
        "plank-breadcrumb-ellipsis"
      ) as PlankBreadcrumbEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.getAttribute("role")).toBe("presentation")
    })

    it("has aria-hidden=true", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-ellipsis></plank-breadcrumb-ellipsis>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-ellipsis")
      const ellipsis = container.querySelector(
        "plank-breadcrumb-ellipsis"
      ) as PlankBreadcrumbEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.getAttribute("aria-hidden")).toBe("true")
    })

    it("has sr-only text for accessibility", async () => {
      container.innerHTML = `
        <plank-breadcrumb>
          <plank-breadcrumb-list>
            <plank-breadcrumb-item>
              <plank-breadcrumb-ellipsis></plank-breadcrumb-ellipsis>
            </plank-breadcrumb-item>
          </plank-breadcrumb-list>
        </plank-breadcrumb>
      `
      await customElements.whenDefined("plank-breadcrumb-ellipsis")
      const ellipsis = container.querySelector(
        "plank-breadcrumb-ellipsis"
      ) as PlankBreadcrumbEllipsis
      await ellipsis.updateComplete
      const srOnly = ellipsis.querySelector(".sr-only")
      expect(srOnly?.textContent).toBe("More")
    })
  })
})
