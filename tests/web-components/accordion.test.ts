import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/hal-accordion"
import type {
  HalAccordion,
  HalAccordionItem,
  HalAccordionTrigger,
  HalAccordionContent,
} from "../../src/web-components/hal-accordion"

describe("hal-accordion", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("HalAccordion", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `<hal-accordion></hal-accordion>`
      await customElements.whenDefined("hal-accordion")
      const el = container.querySelector("hal-accordion")!
      await (el as HalAccordion).updateComplete
      expect(el.dataset.slot).toBe("accordion")
    })

    it("defaults to type=single", async () => {
      container.innerHTML = `<hal-accordion></hal-accordion>`
      await customElements.whenDefined("hal-accordion")
      const el = container.querySelector("hal-accordion") as HalAccordion
      await el.updateComplete
      expect(el.type).toBe("single")
    })

    it("can be set to type=multiple", async () => {
      container.innerHTML = `<hal-accordion type="multiple"></hal-accordion>`
      await customElements.whenDefined("hal-accordion")
      const el = container.querySelector("hal-accordion") as HalAccordion
      await el.updateComplete
      expect(el.type).toBe("multiple")
    })

    it("defaults to collapsible=false", async () => {
      container.innerHTML = `<hal-accordion></hal-accordion>`
      await customElements.whenDefined("hal-accordion")
      const el = container.querySelector("hal-accordion") as HalAccordion
      await el.updateComplete
      expect(el.collapsible).toBe(false)
    })

    it("can be set to collapsible=true", async () => {
      container.innerHTML = `<hal-accordion collapsible></hal-accordion>`
      await customElements.whenDefined("hal-accordion")
      const el = container.querySelector("hal-accordion") as HalAccordion
      await el.updateComplete
      expect(el.collapsible).toBe(true)
    })

    it("applies custom class", async () => {
      container.innerHTML = `<hal-accordion class="custom-class"></hal-accordion>`
      await customElements.whenDefined("hal-accordion")
      const el = container.querySelector("hal-accordion") as HalAccordion
      await el.updateComplete
      expect(el.classList.contains("custom-class")).toBe(true)
    })
  })

  describe("HalAccordionItem", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion-item")
      const item = container.querySelector(
        "hal-accordion-item"
      ) as HalAccordionItem
      await item.updateComplete
      expect(item.dataset.slot).toBe("accordion-item")
    })

    it("has border-b class by default", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion-item")
      const item = container.querySelector(
        "hal-accordion-item"
      ) as HalAccordionItem
      await item.updateComplete
      expect(item.classList.contains("border-b")).toBe(true)
    })

    it("has data-state=closed when not open", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const item = container.querySelector(
        "hal-accordion-item"
      ) as HalAccordionItem
      await item.updateComplete
      expect(item.dataset.state).toBe("closed")
    })

    it("has data-state=open when open", async () => {
      container.innerHTML = `
        <hal-accordion value="item-1">
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const item = container.querySelector(
        "hal-accordion-item"
      ) as HalAccordionItem
      await item.updateComplete
      expect(item.dataset.state).toBe("open")
    })
  })

  describe("HalAccordionTrigger", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion-trigger")
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete
      expect(trigger.dataset.slot).toBe("accordion-trigger")
    })

    it("has button role", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion-trigger")
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("role")).toBe("button")
    })

    it("has tabindex=0 for keyboard focus", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion-trigger")
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("tabindex")).toBe("0")
    })

    it("has aria-expanded=false when closed", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("aria-expanded")).toBe("false")
    })

    it("has aria-expanded=true when open", async () => {
      container.innerHTML = `
        <hal-accordion value="item-1">
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete
      expect(trigger.getAttribute("aria-expanded")).toBe("true")
    })

    it("has aria-controls pointing to content id", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      const content = container.querySelector(
        "hal-accordion-content"
      ) as HalAccordionContent
      await trigger.updateComplete
      await content.updateComplete
      expect(trigger.getAttribute("aria-controls")).toBe(content.id)
    })

    it("has data-state reflecting open state", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete
      expect(trigger.dataset.state).toBe("closed")

      accordion.value = "item-1"
      await accordion.updateComplete
      await trigger.updateComplete
      expect(trigger.dataset.state).toBe("open")
    })

    it("toggles accordion on click", async () => {
      container.innerHTML = `
        <hal-accordion collapsible>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete

      expect(accordion.value).toBe("")
      trigger.click()
      await accordion.updateComplete
      expect(accordion.value).toBe("item-1")
      trigger.click()
      await accordion.updateComplete
      expect(accordion.value).toBe("")
    })

    it("toggles accordion on Enter key", async () => {
      container.innerHTML = `
        <hal-accordion collapsible>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete

      expect(accordion.value).toBe("")
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
      await accordion.updateComplete
      expect(accordion.value).toBe("item-1")
    })

    it("toggles accordion on Space key", async () => {
      container.innerHTML = `
        <hal-accordion collapsible>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete

      expect(accordion.value).toBe("")
      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: " " }))
      await accordion.updateComplete
      expect(accordion.value).toBe("item-1")
    })

    it("includes chevron icon", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion-trigger")
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete
      const svg = trigger.querySelector("svg")
      expect(svg).toBeTruthy()
    })
  })

  describe("HalAccordionContent", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion-content")
      const content = container.querySelector(
        "hal-accordion-content"
      ) as HalAccordionContent
      await content.updateComplete
      expect(content.dataset.slot).toBe("accordion-content")
    })

    it("has auto-generated id for aria-controls", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion-content")
      const content = container.querySelector(
        "hal-accordion-content"
      ) as HalAccordionContent
      await content.updateComplete
      expect(content.id).toMatch(/^hal-accordion-content-/)
    })

    it("is hidden when closed", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const content = container.querySelector(
        "hal-accordion-content"
      ) as HalAccordionContent
      await content.updateComplete
      // Uses display: none instead of hidden attribute for animation support
      expect(content.style.display).toBe("none")
    })

    it("is visible when open", async () => {
      container.innerHTML = `
        <hal-accordion value="item-1">
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const content = container.querySelector(
        "hal-accordion-content"
      ) as HalAccordionContent
      await content.updateComplete
      // Uses display: block for visibility
      expect(content.style.display).toBe("block")
    })

    it("has data-state reflecting open state", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const content = container.querySelector(
        "hal-accordion-content"
      ) as HalAccordionContent
      await content.updateComplete
      expect(content.dataset.state).toBe("closed")

      accordion.value = "item-1"
      await accordion.updateComplete
      await content.updateComplete
      expect(content.dataset.state).toBe("open")
    })
  })

  describe("Single mode (type=single)", () => {
    it("only allows one item open at a time", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title 1</hal-accordion-trigger>
            <hal-accordion-content>Content 1</hal-accordion-content>
          </hal-accordion-item>
          <hal-accordion-item value="item-2">
            <hal-accordion-trigger>Title 2</hal-accordion-trigger>
            <hal-accordion-content>Content 2</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const triggers = container.querySelectorAll("hal-accordion-trigger")

      triggers[0].dispatchEvent(new MouseEvent("click", { bubbles: true }))
      await accordion.updateComplete
      expect(accordion.value).toBe("item-1")

      triggers[1].dispatchEvent(new MouseEvent("click", { bubbles: true }))
      await accordion.updateComplete
      expect(accordion.value).toBe("item-2")
    })

    it("cannot close when collapsible=false (stays open)", async () => {
      container.innerHTML = `
        <hal-accordion value="item-1">
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title 1</hal-accordion-trigger>
            <hal-accordion-content>Content 1</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete

      expect(accordion.value).toBe("item-1")
      trigger.click()
      await accordion.updateComplete
      expect(accordion.value).toBe("item-1")
    })

    it("can close when collapsible=true", async () => {
      container.innerHTML = `
        <hal-accordion collapsible value="item-1">
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title 1</hal-accordion-trigger>
            <hal-accordion-content>Content 1</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete

      expect(accordion.value).toBe("item-1")
      trigger.click()
      await accordion.updateComplete
      expect(accordion.value).toBe("")
    })
  })

  describe("Multiple mode (type=multiple)", () => {
    it("allows multiple items open at a time", async () => {
      container.innerHTML = `
        <hal-accordion type="multiple">
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title 1</hal-accordion-trigger>
            <hal-accordion-content>Content 1</hal-accordion-content>
          </hal-accordion-item>
          <hal-accordion-item value="item-2">
            <hal-accordion-trigger>Title 2</hal-accordion-trigger>
            <hal-accordion-content>Content 2</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const triggers = container.querySelectorAll("hal-accordion-trigger")

      triggers[0].dispatchEvent(new MouseEvent("click", { bubbles: true }))
      await accordion.updateComplete
      expect(accordion.value).toBe("item-1")

      triggers[1].dispatchEvent(new MouseEvent("click", { bubbles: true }))
      await accordion.updateComplete
      expect(accordion.value).toContain("item-1")
      expect(accordion.value).toContain("item-2")
    })

    it("can close individual items", async () => {
      container.innerHTML = `
        <hal-accordion type="multiple" value="item-1 item-2">
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title 1</hal-accordion-trigger>
            <hal-accordion-content>Content 1</hal-accordion-content>
          </hal-accordion-item>
          <hal-accordion-item value="item-2">
            <hal-accordion-trigger>Title 2</hal-accordion-trigger>
            <hal-accordion-content>Content 2</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const triggers = container.querySelectorAll("hal-accordion-trigger")

      triggers[0].dispatchEvent(new MouseEvent("click", { bubbles: true }))
      await accordion.updateComplete
      expect(accordion.value).not.toContain("item-1")
      expect(accordion.value).toContain("item-2")
    })
  })

  describe("Events", () => {
    it("fires value-change event when toggled", async () => {
      container.innerHTML = `
        <hal-accordion collapsible>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete

      const events: CustomEvent[] = []
      accordion.addEventListener("value-change", (e) =>
        events.push(e as CustomEvent)
      )

      trigger.click()
      await accordion.updateComplete
      expect(events.length).toBe(1)
      expect(events[0].detail.value).toBe("item-1")

      trigger.click()
      await accordion.updateComplete
      expect(events.length).toBe(2)
      expect(events[0].detail.value).toBe("item-1")
    })
  })

  describe("Disabled state", () => {
    it("prevents interaction when accordion is disabled", async () => {
      container.innerHTML = `
        <hal-accordion disabled>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete

      expect(accordion.value).toBe("")
      trigger.click()
      await accordion.updateComplete
      expect(accordion.value).toBe("")
    })

    it("prevents interaction when item is disabled", async () => {
      container.innerHTML = `
        <hal-accordion>
          <hal-accordion-item value="item-1" disabled>
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      await trigger.updateComplete

      expect(accordion.value).toBe("")
      trigger.click()
      await accordion.updateComplete
      expect(accordion.value).toBe("")
    })
  })

  describe("Animation classes", () => {
    it("should only have one animation class at a time (no accumulation)", async () => {
      container.innerHTML = `
        <hal-accordion collapsible>
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Title</hal-accordion-trigger>
            <hal-accordion-content>Content</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `
      await customElements.whenDefined("hal-accordion")
      const accordion = container.querySelector("hal-accordion") as HalAccordion
      await accordion.updateComplete
      const trigger = container.querySelector(
        "hal-accordion-trigger"
      ) as HalAccordionTrigger
      const content = container.querySelector(
        "hal-accordion-content"
      ) as HalAccordionContent

      // Initially closed - no animation classes
      expect(content.classList.contains("animate-hal-accordion-down")).toBe(
        false
      )
      expect(content.classList.contains("animate-hal-accordion-up")).toBe(false)

      // Open - should have down animation only
      trigger.click()
      await accordion.updateComplete
      await content.updateComplete
      expect(content.classList.contains("animate-hal-accordion-down")).toBe(
        true
      )
      expect(content.classList.contains("animate-hal-accordion-up")).toBe(false)

      // Close - should have up animation only, NOT both
      trigger.click()
      await accordion.updateComplete
      await content.updateComplete
      expect(content.classList.contains("animate-hal-accordion-down")).toBe(
        false
      )
      expect(content.classList.contains("animate-hal-accordion-up")).toBe(true)

      // Open again - should have down animation only
      trigger.click()
      await accordion.updateComplete
      await content.updateComplete
      expect(content.classList.contains("animate-hal-accordion-down")).toBe(
        true
      )
      expect(content.classList.contains("animate-hal-accordion-up")).toBe(false)
    })
  })
})
