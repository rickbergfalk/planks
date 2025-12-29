import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-button"
import "@/web-components/plank-badge"
import "@/web-components/plank-label"
import "@/web-components/plank-input"
import "@/web-components/plank-textarea"
import "@/web-components/plank-separator"
import "@/web-components/plank-switch"
import "@/web-components/plank-tooltip"

/**
 * Semantic Structure Tests
 *
 * These tests verify that web components produce semantically correct DOM:
 * - Text content is inside the right semantic elements
 * - Native elements are used where required for accessibility
 * - Structure matches what screen readers expect
 *
 * Rule: If React renders a semantic element (label, button, input, etc.),
 * the web component must also have that element with content inside it.
 *
 * These tests would have caught the <slot> bug where content appeared
 * outside the semantic element instead of inside it.
 */

describe("Semantic Structure", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("plank-button", () => {
    it("must have button role and accessible text", async () => {
      const testContent = "Click Me"
      container.innerHTML = `<plank-button>${testContent}</plank-button>`

      await customElements.whenDefined("plank-button")
      const element = container.querySelector("plank-button")!
      await (element as any).updateComplete

      // Must have button role or be a button element
      const hasButtonRole = element.getAttribute("role") === "button"
      const hasButtonElement = element.querySelector("button") !== null
      expect(
        hasButtonRole || hasButtonElement,
        "Must have role='button' or contain <button>"
      ).toBe(true)

      // Text must be accessible
      expect(element.textContent).toContain(testContent)
    })
  })

  describe("plank-badge", () => {
    it("text must be accessible", async () => {
      const testContent = "New"
      container.innerHTML = `<plank-badge>${testContent}</plank-badge>`

      await customElements.whenDefined("plank-badge")
      const element = container.querySelector("plank-badge")!
      await (element as any).updateComplete

      // Badge is presentational - just verify text is accessible
      expect(element.textContent).toContain(testContent)
    })
  })

  describe("plank-label", () => {
    it("text must be inside native <label> element", async () => {
      const testContent = "Username"
      container.innerHTML = `<plank-label for="test">${testContent}</plank-label>`

      await customElements.whenDefined("plank-label")
      const element = container.querySelector("plank-label")!
      await (element as any).updateComplete

      // Must have a native <label> element for accessibility
      const labelElement = element.querySelector("label")
      expect(labelElement, "Must contain a native <label> element").toBeTruthy()

      // Text must be INSIDE the label, not a sibling
      const labelText = labelElement?.textContent?.trim()
      expect(
        labelText,
        `Text "${testContent}" must be inside <label>, but found "${labelText}"`
      ).toContain(testContent)
    })

    it("for attribute must connect to input", async () => {
      container.innerHTML = `
        <plank-label for="test-input">Label</plank-label>
        <input id="test-input" />
      `

      await customElements.whenDefined("plank-label")
      const element = container.querySelector("plank-label")!
      await (element as any).updateComplete

      const labelElement = element.querySelector("label")
      expect(labelElement?.getAttribute("for")).toBe("test-input")
    })
  })

  describe("plank-input", () => {
    it("must contain native <input> element", async () => {
      container.innerHTML = `<plank-input placeholder="Enter text"></plank-input>`

      await customElements.whenDefined("plank-input")
      const element = container.querySelector("plank-input")!
      await (element as any).updateComplete

      const inputElement = element.querySelector("input")
      expect(inputElement, "Must contain a native <input> element").toBeTruthy()
      expect(inputElement?.placeholder).toBe("Enter text")
    })

    it("disabled state must be on native input", async () => {
      container.innerHTML = `<plank-input disabled></plank-input>`

      await customElements.whenDefined("plank-input")
      const element = container.querySelector("plank-input")!
      await (element as any).updateComplete

      const inputElement = element.querySelector("input")
      expect(inputElement?.disabled, "Native input must be disabled").toBe(true)
    })
  })

  describe("plank-textarea", () => {
    it("must contain native <textarea> element", async () => {
      container.innerHTML = `<plank-textarea placeholder="Enter message"></plank-textarea>`

      await customElements.whenDefined("plank-textarea")
      const element = container.querySelector("plank-textarea")!
      await (element as any).updateComplete

      const textareaElement = element.querySelector("textarea")
      expect(
        textareaElement,
        "Must contain a native <textarea> element"
      ).toBeTruthy()
      expect(textareaElement?.placeholder).toBe("Enter message")
    })

    it("disabled state must be on native textarea", async () => {
      container.innerHTML = `<plank-textarea disabled></plank-textarea>`

      await customElements.whenDefined("plank-textarea")
      const element = container.querySelector("plank-textarea")!
      await (element as any).updateComplete

      const textareaElement = element.querySelector("textarea")
      expect(
        textareaElement?.disabled,
        "Native textarea must be disabled"
      ).toBe(true)
    })
  })

  describe("plank-separator", () => {
    it("decorative separator must have role=none", async () => {
      container.innerHTML = `<plank-separator></plank-separator>`

      await customElements.whenDefined("plank-separator")
      const element = container.querySelector("plank-separator")!
      await (element as any).updateComplete

      expect(element.getAttribute("role")).toBe("none")
    })

    it("non-decorative separator must have role=separator", async () => {
      container.innerHTML = `<plank-separator decorative="false"></plank-separator>`

      await customElements.whenDefined("plank-separator")
      const element = container.querySelector("plank-separator")!
      // Need to set the property, not just attribute
      ;(element as any).decorative = false
      await (element as any).updateComplete

      expect(element.getAttribute("role")).toBe("separator")
    })
  })

  describe("plank-switch", () => {
    it("must have role=switch and aria-checked", async () => {
      container.innerHTML = `<plank-switch></plank-switch>`

      await customElements.whenDefined("plank-switch")
      const element = container.querySelector("plank-switch")!
      await (element as any).updateComplete

      expect(element.getAttribute("role")).toBe("switch")
      expect(element.getAttribute("aria-checked")).toBe("false")
    })

    it("must have thumb element with correct data-state", async () => {
      container.innerHTML = `<plank-switch></plank-switch>`

      await customElements.whenDefined("plank-switch")
      const element = container.querySelector("plank-switch")!
      await (element as any).updateComplete

      const thumb = element.querySelector('[data-slot="switch-thumb"]')
      expect(thumb, "Must contain a thumb element").toBeTruthy()
      expect(thumb?.getAttribute("data-state")).toBe("unchecked")
    })

    it("checked state updates aria-checked and data-state", async () => {
      container.innerHTML = `<plank-switch checked></plank-switch>`

      await customElements.whenDefined("plank-switch")
      const element = container.querySelector("plank-switch")!
      await (element as any).updateComplete

      expect(element.getAttribute("aria-checked")).toBe("true")
      expect(element.getAttribute("data-state")).toBe("checked")

      const thumb = element.querySelector('[data-slot="switch-thumb"]')
      expect(thumb?.getAttribute("data-state")).toBe("checked")
    })
  })

  describe("plank-tooltip", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('body > div[style*="position: fixed"]')
        .forEach((el) => {
          el.remove()
        })
    })

    it("tooltip content must have role=tooltip when open", async () => {
      container.innerHTML = `
        <plank-tooltip open>
          <plank-tooltip-trigger>
            <button>Trigger</button>
          </plank-tooltip-trigger>
          <plank-tooltip-content>Tooltip text</plank-tooltip-content>
        </plank-tooltip>
      `

      await customElements.whenDefined("plank-tooltip")
      const tooltip = container.querySelector("plank-tooltip")!
      await (tooltip as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="tooltip"]')
      expect(content, "Must have role='tooltip' on content").toBeTruthy()
      expect(content?.textContent).toContain("Tooltip text")
    })

    it("trigger element must have aria-describedby when open", async () => {
      container.innerHTML = `
        <plank-tooltip open>
          <plank-tooltip-trigger>
            <button>Trigger</button>
          </plank-tooltip-trigger>
          <plank-tooltip-content>Tooltip text</plank-tooltip-content>
        </plank-tooltip>
      `

      await customElements.whenDefined("plank-tooltip")
      const tooltip = container.querySelector("plank-tooltip")!
      await (tooltip as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-describedby"),
        "Trigger must have aria-describedby"
      ).toBeTruthy()

      // The aria-describedby should reference the tooltip content
      const contentId = button?.getAttribute("aria-describedby")
      const content = document.getElementById(contentId!)
      expect(
        content,
        "aria-describedby must reference valid element"
      ).toBeTruthy()
      expect(content?.getAttribute("role")).toBe("tooltip")
    })

    it("tooltip content must have correct data-slot", async () => {
      container.innerHTML = `
        <plank-tooltip open>
          <plank-tooltip-trigger>
            <button>Trigger</button>
          </plank-tooltip-trigger>
          <plank-tooltip-content>Tooltip text</plank-tooltip-content>
        </plank-tooltip>
      `

      await customElements.whenDefined("plank-tooltip")
      const tooltip = container.querySelector("plank-tooltip")!
      await (tooltip as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="tooltip-content"]')
      expect(content, "Must have data-slot='tooltip-content'").toBeTruthy()
    })
  })
})
