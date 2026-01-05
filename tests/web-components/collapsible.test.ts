import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/hal-collapsible"
import type {
  HalCollapsible,
  HalCollapsibleTrigger,
  HalCollapsibleContent,
} from "../../src/web-components/hal-collapsible"

describe("hal-collapsible", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("HalCollapsible", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `<hal-collapsible></hal-collapsible>`
      await customElements.whenDefined("hal-collapsible")
      const el = container.querySelector("hal-collapsible")!
      await (el as HalCollapsible).updateComplete
      expect(el.dataset.slot).toBe("collapsible")
    })

    it("defaults to closed state (open=false)", async () => {
      container.innerHTML = `<hal-collapsible></hal-collapsible>`
      await customElements.whenDefined("hal-collapsible")
      const el = container.querySelector("hal-collapsible") as HalCollapsible
      await el.updateComplete
      expect(el.open).toBe(false)
      expect(el.dataset.state).toBe("closed")
    })

    it("can be initialized with open attribute", async () => {
      container.innerHTML = `<hal-collapsible open></hal-collapsible>`
      await customElements.whenDefined("hal-collapsible")
      const el = container.querySelector("hal-collapsible") as HalCollapsible
      await el.updateComplete
      expect(el.open).toBe(true)
      expect(el.dataset.state).toBe("open")
    })

    it("applies custom class", async () => {
      container.innerHTML = `<hal-collapsible class="custom-class"></hal-collapsible>`
      await customElements.whenDefined("hal-collapsible")
      const el = container.querySelector("hal-collapsible") as HalCollapsible
      await el.updateComplete
      expect(el.classList.contains("custom-class")).toBe(true)
    })
  })

  describe("HalCollapsibleTrigger", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible-trigger")
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete
      expect(trigger.dataset.slot).toBe("collapsible-trigger")
    })

    it("has button role", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible-trigger")
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("role")).toBe("button")
    })

    it("has tabindex=0 for keyboard focus", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible-trigger")
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("tabindex")).toBe("0")
    })

    it("has aria-expanded=false when closed", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("aria-expanded")).toBe("false")
    })

    it("has aria-expanded=true when open", async () => {
      container.innerHTML = `
        <hal-collapsible open>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("aria-expanded")).toBe("true")
    })

    it("has aria-controls pointing to content id", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      const content = container.querySelector(
        "hal-collapsible-content"
      ) as HalCollapsibleContent
      await trigger.updateComplete
      await content.updateComplete
      expect(trigger.getAttribute("aria-controls")).toBe(content.id)
    })

    it("toggles collapsible on click", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete

      expect(collapsible.open).toBe(false)
      trigger.click()
      await collapsible.updateComplete
      expect(collapsible.open).toBe(true)
      trigger.click()
      await collapsible.updateComplete
      expect(collapsible.open).toBe(false)
    })

    it("toggles collapsible on Enter key", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete

      expect(collapsible.open).toBe(false)
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
      await collapsible.updateComplete
      expect(collapsible.open).toBe(true)
    })

    it("toggles collapsible on Space key", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete

      expect(collapsible.open).toBe(false)
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: " " }))
      await collapsible.updateComplete
      expect(collapsible.open).toBe(true)
    })

    it("does not toggle when disabled", async () => {
      container.innerHTML = `
        <hal-collapsible disabled>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete

      expect(collapsible.open).toBe(false)
      trigger.click()
      await collapsible.updateComplete
      expect(collapsible.open).toBe(false)
    })
  })

  describe("HalCollapsibleContent", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible-content")
      const content = container.querySelector(
        "hal-collapsible-content"
      ) as HalCollapsibleContent
      await content.updateComplete
      expect(content.dataset.slot).toBe("collapsible-content")
    })

    it("has auto-generated id for aria-controls", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible-content")
      const content = container.querySelector(
        "hal-collapsible-content"
      ) as HalCollapsibleContent
      await content.updateComplete
      expect(content.id).toMatch(/^hal-collapsible-content-/)
    })

    it("is hidden when closed", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const content = container.querySelector(
        "hal-collapsible-content"
      ) as HalCollapsibleContent
      await content.updateComplete
      expect(content.hasAttribute("hidden")).toBe(true)
    })

    it("is visible when open", async () => {
      container.innerHTML = `
        <hal-collapsible open>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const content = container.querySelector(
        "hal-collapsible-content"
      ) as HalCollapsibleContent
      await content.updateComplete
      expect(content.hasAttribute("hidden")).toBe(false)
    })

    it("has data-state reflecting open state", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const content = container.querySelector(
        "hal-collapsible-content"
      ) as HalCollapsibleContent
      await content.updateComplete
      expect(content.dataset.state).toBe("closed")

      collapsible.open = true
      await collapsible.updateComplete
      await content.updateComplete
      expect(content.dataset.state).toBe("open")
    })
  })

  describe("Events", () => {
    it("fires open-change event when toggled", async () => {
      container.innerHTML = `
        <hal-collapsible>
          <hal-collapsible-trigger>Toggle</hal-collapsible-trigger>
          <hal-collapsible-content>Content</hal-collapsible-content>
        </hal-collapsible>
      `
      await customElements.whenDefined("hal-collapsible")
      const collapsible = container.querySelector(
        "hal-collapsible"
      ) as HalCollapsible
      await collapsible.updateComplete
      const trigger = container.querySelector(
        "hal-collapsible-trigger"
      ) as HalCollapsibleTrigger
      await trigger.updateComplete

      const events: CustomEvent[] = []
      collapsible.addEventListener("open-change", (e) =>
        events.push(e as CustomEvent)
      )

      trigger.click()
      await collapsible.updateComplete
      expect(events.length).toBe(1)
      expect(events[0].detail.open).toBe(true)

      trigger.click()
      await collapsible.updateComplete
      expect(events.length).toBe(2)
      expect(events[1].detail.open).toBe(false)
    })
  })
})
