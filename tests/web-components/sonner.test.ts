import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-sonner"
import { toast, HalToaster } from "@/web-components/hal-sonner"

describe("hal-toaster", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("basic rendering", () => {
    it("renders with default attributes", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      expect(toaster.position).toBe("bottom-right")
      expect(toaster.dataset.slot).toBe("toaster")
    })

    it("supports position attribute", async () => {
      container.innerHTML = `<hal-toaster position="top-center"></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      expect(toaster.position).toBe("top-center")
      expect(toaster.className).toContain("top-4")
    })

    it("has correct styling classes for bottom-right", async () => {
      container.innerHTML = `<hal-toaster position="bottom-right"></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      expect(toaster.className).toContain("fixed")
      expect(toaster.className).toContain("bottom-4")
      expect(toaster.className).toContain("right-4")
    })

    it("has correct styling classes for top-left", async () => {
      container.innerHTML = `<hal-toaster position="top-left"></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      expect(toaster.className).toContain("top-4")
      expect(toaster.className).toContain("left-4")
    })
  })

  describe("toast API", () => {
    it("toast() adds a default toast", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast("Test message")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const toastEl = toaster.querySelector('[role="status"]')
      expect(toastEl).toBeTruthy()
      expect(toastEl?.textContent).toContain("Test message")
    })

    it("toast.success() adds a success toast", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast.success("Success!")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const toastEl = toaster.querySelector('[role="status"]')
      expect(toastEl?.textContent).toContain("Success!")
      // Should have success icon (green)
      const icon = toastEl?.querySelector("svg.text-green-500")
      expect(icon).toBeTruthy()
    })

    it("toast.error() adds an error toast", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast.error("Error occurred")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const toastEl = toaster.querySelector('[role="status"]')
      expect(toastEl?.textContent).toContain("Error occurred")
      // Should have error icon (red)
      const icon = toastEl?.querySelector("svg.text-red-500")
      expect(icon).toBeTruthy()
    })

    it("toast.warning() adds a warning toast", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast.warning("Warning!")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const toastEl = toaster.querySelector('[role="status"]')
      expect(toastEl?.textContent).toContain("Warning!")
      // Should have warning icon (yellow)
      const icon = toastEl?.querySelector("svg.text-yellow-500")
      expect(icon).toBeTruthy()
    })

    it("toast.info() adds an info toast", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast.info("Info message")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const toastEl = toaster.querySelector('[role="status"]')
      expect(toastEl?.textContent).toContain("Info message")
      // Should have info icon (blue)
      const icon = toastEl?.querySelector("svg.text-blue-500")
      expect(icon).toBeTruthy()
    })

    it("toast.loading() adds a loading toast", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast.loading("Loading...")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const toastEl = toaster.querySelector('[role="status"]')
      expect(toastEl?.textContent).toContain("Loading...")
      // Should have spinning icon
      const icon = toastEl?.querySelector("svg.animate-spin")
      expect(icon).toBeTruthy()
    })
  })

  describe("toast options", () => {
    it("supports description option", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast("Title", { description: "Description text" })
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const toastEl = toaster.querySelector('[role="status"]')
      expect(toastEl?.textContent).toContain("Title")
      expect(toastEl?.textContent).toContain("Description text")
    })

    it("supports action option", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      const onClick = vi.fn()
      toast("Message", { action: { label: "Undo", onClick } })
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const actionBtn = toaster.querySelector(
        '[role="status"] button:not([aria-label])'
      )
      expect(actionBtn?.textContent).toContain("Undo")

      // Click the action button
      actionBtn?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      expect(onClick).toHaveBeenCalled()
    })
  })

  describe("toast dismissal", () => {
    it("dismiss button removes toast", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast("Message")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      expect(toaster.querySelectorAll('[role="status"]').length).toBe(1)

      const dismissBtn = toaster.querySelector('[aria-label="Dismiss"]')
      dismissBtn?.dispatchEvent(new MouseEvent("click", { bubbles: true }))
      await toaster.updateComplete

      expect(toaster.querySelectorAll('[role="status"]').length).toBe(0)
    })

    it("toast.dismiss() removes toast by id", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      const id = toast("Message")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      expect(toaster.querySelectorAll('[role="status"]').length).toBe(1)

      toast.dismiss(id)
      await toaster.updateComplete

      expect(toaster.querySelectorAll('[role="status"]').length).toBe(0)
    })

    it("toast.dismiss() without id clears all toasts", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast("Message 1")
      toast("Message 2")
      toast("Message 3")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      expect(toaster.querySelectorAll('[role="status"]').length).toBe(3)

      toast.dismiss()
      await toaster.updateComplete

      expect(toaster.querySelectorAll('[role="status"]').length).toBe(0)
    })
  })

  describe("visible toasts limit", () => {
    it("limits visible toasts based on visible-toasts attribute", async () => {
      container.innerHTML = `<hal-toaster visible-toasts="2"></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast("Message 1")
      toast("Message 2")
      toast("Message 3")
      toast("Message 4")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      // Only 2 should be visible
      expect(toaster.querySelectorAll('[role="status"]').length).toBe(2)
    })
  })

  describe("accessibility", () => {
    it("toasts have role=status", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast("Message")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const toastEl = toaster.querySelector('[role="status"]')
      expect(toastEl).toBeTruthy()
    })

    it("toasts have aria-live=polite", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast("Message")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const toastEl = toaster.querySelector('[aria-live="polite"]')
      expect(toastEl).toBeTruthy()
    })

    it("dismiss button has aria-label", async () => {
      container.innerHTML = `<hal-toaster></hal-toaster>`
      await customElements.whenDefined("hal-toaster")
      const toaster = container.querySelector("hal-toaster")! as HalToaster
      await toaster.updateComplete

      toast("Message")
      await toaster.updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const dismissBtn = toaster.querySelector('[aria-label="Dismiss"]')
      expect(dismissBtn).toBeTruthy()
    })
  })
})
