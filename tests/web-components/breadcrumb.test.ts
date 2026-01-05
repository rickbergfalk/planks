import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/hal-breadcrumb"
import type {
  HalBreadcrumb,
  HalBreadcrumbList,
  HalBreadcrumbItem,
  HalBreadcrumbLink,
  HalBreadcrumbPage,
  HalBreadcrumbSeparator,
  HalBreadcrumbEllipsis,
} from "../../src/web-components/hal-breadcrumb"

describe("hal-breadcrumb", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("HalBreadcrumb", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `<hal-breadcrumb></hal-breadcrumb>`
      await customElements.whenDefined("hal-breadcrumb")
      const el = container.querySelector("hal-breadcrumb")!
      await (el as HalBreadcrumb).updateComplete
      expect(el.dataset.slot).toBe("breadcrumb")
    })

    it("has aria-label=breadcrumb", async () => {
      container.innerHTML = `<hal-breadcrumb></hal-breadcrumb>`
      await customElements.whenDefined("hal-breadcrumb")
      const el = container.querySelector("hal-breadcrumb") as HalBreadcrumb
      await el.updateComplete
      expect(el.getAttribute("aria-label")).toBe("breadcrumb")
    })

    it("applies custom class", async () => {
      container.innerHTML = `<hal-breadcrumb class="custom-class"></hal-breadcrumb>`
      await customElements.whenDefined("hal-breadcrumb")
      const el = container.querySelector("hal-breadcrumb") as HalBreadcrumb
      await el.updateComplete
      expect(el.classList.contains("custom-class")).toBe(true)
    })
  })

  describe("HalBreadcrumbList", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list></hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-list")
      const list = container.querySelector(
        "hal-breadcrumb-list"
      ) as HalBreadcrumbList
      await list.updateComplete
      expect(list.dataset.slot).toBe("breadcrumb-list")
    })

    it("applies flex and gap classes", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list></hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-list")
      const list = container.querySelector(
        "hal-breadcrumb-list"
      ) as HalBreadcrumbList
      await list.updateComplete
      expect(list.classList.contains("flex")).toBe(true)
      expect(list.classList.contains("flex-wrap")).toBe(true)
      expect(list.classList.contains("items-center")).toBe(true)
    })
  })

  describe("HalBreadcrumbItem", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item></hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-item")
      const item = container.querySelector(
        "hal-breadcrumb-item"
      ) as HalBreadcrumbItem
      await item.updateComplete
      expect(item.dataset.slot).toBe("breadcrumb-item")
    })

    it("applies inline-flex and gap classes", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item></hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-item")
      const item = container.querySelector(
        "hal-breadcrumb-item"
      ) as HalBreadcrumbItem
      await item.updateComplete
      expect(item.classList.contains("inline-flex")).toBe(true)
      expect(item.classList.contains("items-center")).toBe(true)
    })
  })

  describe("HalBreadcrumbLink", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-link href="#">Home</hal-breadcrumb-link>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-link")
      const link = container.querySelector(
        "hal-breadcrumb-link"
      ) as HalBreadcrumbLink
      await link.updateComplete
      expect(link.dataset.slot).toBe("breadcrumb-link")
    })

    it("renders an anchor element", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-link href="#">Home</hal-breadcrumb-link>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-link")
      const link = container.querySelector(
        "hal-breadcrumb-link"
      ) as HalBreadcrumbLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor).toBeTruthy()
      expect(anchor?.getAttribute("href")).toBe("#")
    })

    it("applies hover transition classes", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-link href="#">Home</hal-breadcrumb-link>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-link")
      const link = container.querySelector(
        "hal-breadcrumb-link"
      ) as HalBreadcrumbLink
      await link.updateComplete
      const anchor = link.querySelector("a")
      expect(anchor?.classList.contains("hover:text-foreground")).toBe(true)
      expect(anchor?.classList.contains("transition-colors")).toBe(true)
    })
  })

  describe("HalBreadcrumbPage", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-page>Current</hal-breadcrumb-page>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-page")
      const page = container.querySelector(
        "hal-breadcrumb-page"
      ) as HalBreadcrumbPage
      await page.updateComplete
      expect(page.dataset.slot).toBe("breadcrumb-page")
    })

    it("has role=link", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-page>Current</hal-breadcrumb-page>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-page")
      const page = container.querySelector(
        "hal-breadcrumb-page"
      ) as HalBreadcrumbPage
      await page.updateComplete
      expect(page.getAttribute("role")).toBe("link")
    })

    it("has aria-disabled=true", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-page>Current</hal-breadcrumb-page>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-page")
      const page = container.querySelector(
        "hal-breadcrumb-page"
      ) as HalBreadcrumbPage
      await page.updateComplete
      expect(page.getAttribute("aria-disabled")).toBe("true")
    })

    it("has aria-current=page", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-page>Current</hal-breadcrumb-page>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-page")
      const page = container.querySelector(
        "hal-breadcrumb-page"
      ) as HalBreadcrumbPage
      await page.updateComplete
      expect(page.getAttribute("aria-current")).toBe("page")
    })

    it("applies foreground text color", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-page>Current</hal-breadcrumb-page>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-page")
      const page = container.querySelector(
        "hal-breadcrumb-page"
      ) as HalBreadcrumbPage
      await page.updateComplete
      expect(page.classList.contains("text-foreground")).toBe(true)
    })
  })

  describe("HalBreadcrumbSeparator", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-link href="#">Home</hal-breadcrumb-link>
            </hal-breadcrumb-item>
            <hal-breadcrumb-separator></hal-breadcrumb-separator>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-separator")
      const sep = container.querySelector(
        "hal-breadcrumb-separator"
      ) as HalBreadcrumbSeparator
      await sep.updateComplete
      expect(sep.dataset.slot).toBe("breadcrumb-separator")
    })

    it("has role=presentation", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-separator></hal-breadcrumb-separator>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-separator")
      const sep = container.querySelector(
        "hal-breadcrumb-separator"
      ) as HalBreadcrumbSeparator
      await sep.updateComplete
      expect(sep.getAttribute("role")).toBe("presentation")
    })

    it("has aria-hidden=true", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-separator></hal-breadcrumb-separator>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-separator")
      const sep = container.querySelector(
        "hal-breadcrumb-separator"
      ) as HalBreadcrumbSeparator
      await sep.updateComplete
      expect(sep.getAttribute("aria-hidden")).toBe("true")
    })

    it("renders chevron icon by default", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-separator></hal-breadcrumb-separator>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-separator")
      const sep = container.querySelector(
        "hal-breadcrumb-separator"
      ) as HalBreadcrumbSeparator
      await sep.updateComplete
      const svg = sep.querySelector("svg")
      expect(svg).toBeTruthy()
    })
  })

  describe("HalBreadcrumbEllipsis", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-ellipsis></hal-breadcrumb-ellipsis>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-ellipsis")
      const ellipsis = container.querySelector(
        "hal-breadcrumb-ellipsis"
      ) as HalBreadcrumbEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.dataset.slot).toBe("breadcrumb-ellipsis")
    })

    it("has role=presentation", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-ellipsis></hal-breadcrumb-ellipsis>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-ellipsis")
      const ellipsis = container.querySelector(
        "hal-breadcrumb-ellipsis"
      ) as HalBreadcrumbEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.getAttribute("role")).toBe("presentation")
    })

    it("has aria-hidden=true", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-ellipsis></hal-breadcrumb-ellipsis>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-ellipsis")
      const ellipsis = container.querySelector(
        "hal-breadcrumb-ellipsis"
      ) as HalBreadcrumbEllipsis
      await ellipsis.updateComplete
      expect(ellipsis.getAttribute("aria-hidden")).toBe("true")
    })

    it("has sr-only text for accessibility", async () => {
      container.innerHTML = `
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-ellipsis></hal-breadcrumb-ellipsis>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `
      await customElements.whenDefined("hal-breadcrumb-ellipsis")
      const ellipsis = container.querySelector(
        "hal-breadcrumb-ellipsis"
      ) as HalBreadcrumbEllipsis
      await ellipsis.updateComplete
      const srOnly = ellipsis.querySelector(".sr-only")
      expect(srOnly?.textContent).toBe("More")
    })
  })
})
