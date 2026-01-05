import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-alert"
import type { HalAlert } from "@/web-components/hal-alert"

describe("HalAlert (Web Component)", () => {
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
    await customElements.whenDefined("hal-alert")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalAlert).updateComplete)
    )
  }

  describe("HalAlert", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-alert>Content</hal-alert>`)
      const alert = container.querySelector("hal-alert")
      expect(alert?.dataset.slot).toBe("alert")
    })

    it("has role='alert' for accessibility", async () => {
      await renderAndWait(`<hal-alert>Content</hal-alert>`)
      const alert = container.querySelector("hal-alert")
      expect(alert?.getAttribute("role")).toBe("alert")
    })

    it("should not have tabindex (alerts are passive, not focusable)", async () => {
      await renderAndWait(`<hal-alert>Content</hal-alert>`)
      const alert = container.querySelector("hal-alert")
      // Alerts should NOT receive focus - they are live regions that announce passively
      expect(alert?.hasAttribute("tabindex")).toBe(false)
    })

    it("renders with default variant classes", async () => {
      await renderAndWait(`<hal-alert>Content</hal-alert>`)
      const alert = container.querySelector("hal-alert")
      expect(alert?.classList.contains("bg-card")).toBe(true)
      expect(alert?.classList.contains("text-card-foreground")).toBe(true)
    })

    it("renders with destructive variant classes", async () => {
      await renderAndWait(
        `<hal-alert variant="destructive">Content</hal-alert>`
      )
      const alert = container.querySelector("hal-alert")
      expect(alert?.classList.contains("text-destructive")).toBe(true)
    })

    it("preserves children content", async () => {
      await renderAndWait(`<hal-alert>Test Content</hal-alert>`)
      const alert = container.querySelector("hal-alert")
      expect(alert?.textContent).toContain("Test Content")
    })
  })

  describe("HalAlertTitle", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-alert-title>Title Content</hal-alert-title>`)
      const title = container.querySelector("hal-alert-title")
      expect(title?.dataset.slot).toBe("alert-title")
    })

    it("preserves children content", async () => {
      await renderAndWait(`<hal-alert-title>Title Content</hal-alert-title>`)
      const title = container.querySelector("hal-alert-title")
      expect(title?.textContent).toContain("Title Content")
    })
  })

  describe("HalAlertDescription", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(
        `<hal-alert-description>Description Content</hal-alert-description>`
      )
      const desc = container.querySelector("hal-alert-description")
      expect(desc?.dataset.slot).toBe("alert-description")
    })

    it("preserves children content", async () => {
      await renderAndWait(
        `<hal-alert-description>Description Content</hal-alert-description>`
      )
      const desc = container.querySelector("hal-alert-description")
      expect(desc?.textContent).toContain("Description Content")
    })
  })

  describe("Full composition", () => {
    it("renders complete alert with icon, title, and description", async () => {
      await renderAndWait(`
        <hal-alert>
          <svg>icon</svg>
          <hal-alert-title>Success!</hal-alert-title>
          <hal-alert-description>Your changes have been saved.</hal-alert-description>
        </hal-alert>
      `)
      const alert = container.querySelector("hal-alert")
      expect(alert?.textContent).toContain("Success!")
      expect(alert?.textContent).toContain("Your changes have been saved.")
      expect(alert?.querySelector("svg")).toBeTruthy()
    })

    it("renders destructive alert composition", async () => {
      await renderAndWait(`
        <hal-alert variant="destructive">
          <svg>icon</svg>
          <hal-alert-title>Error</hal-alert-title>
          <hal-alert-description>Something went wrong.</hal-alert-description>
        </hal-alert>
      `)
      const alert = container.querySelector("hal-alert")
      expect(alert?.classList.contains("text-destructive")).toBe(true)
      expect(alert?.textContent).toContain("Error")
      expect(alert?.textContent).toContain("Something went wrong.")
    })
  })
})
