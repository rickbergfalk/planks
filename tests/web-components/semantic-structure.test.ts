import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-button"
import "@/web-components/hal-badge"
import "@/web-components/hal-label"
import "@/web-components/hal-input"
import "@/web-components/hal-textarea"
import "@/web-components/hal-separator"
import "@/web-components/hal-switch"
import "@/web-components/hal-tooltip"
import "@/web-components/hal-popover"
import "@/web-components/hal-dialog"
import "@/web-components/hal-dropdown-menu"
import "@/web-components/hal-context-menu"
import "@/web-components/hal-sheet"
import "@/web-components/hal-drawer"
import "@/web-components/hal-hover-card"
import "@/web-components/hal-select"
import "@/web-components/hal-command"
import "@/web-components/hal-combobox"
import "@/web-components/hal-table"
import "@/web-components/hal-calendar"
import "@/web-components/hal-native-select"
import "@/web-components/hal-spinner"
import "@/web-components/hal-button-group"

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

  describe("hal-button", () => {
    it("must have button role and accessible text", async () => {
      const testContent = "Click Me"
      container.innerHTML = `<hal-button>${testContent}</hal-button>`

      await customElements.whenDefined("hal-button")
      const element = container.querySelector("hal-button")!
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

  describe("hal-badge", () => {
    it("text must be accessible", async () => {
      const testContent = "New"
      container.innerHTML = `<hal-badge>${testContent}</hal-badge>`

      await customElements.whenDefined("hal-badge")
      const element = container.querySelector("hal-badge")!
      await (element as any).updateComplete

      // Badge is presentational - just verify text is accessible
      expect(element.textContent).toContain(testContent)
    })
  })

  describe("hal-label", () => {
    it("text must be inside native <label> element", async () => {
      const testContent = "Username"
      container.innerHTML = `<hal-label for="test">${testContent}</hal-label>`

      await customElements.whenDefined("hal-label")
      const element = container.querySelector("hal-label")!
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
        <hal-label for="test-input">Label</hal-label>
        <input id="test-input" />
      `

      await customElements.whenDefined("hal-label")
      const element = container.querySelector("hal-label")!
      await (element as any).updateComplete

      const labelElement = element.querySelector("label")
      expect(labelElement?.getAttribute("for")).toBe("test-input")
    })
  })

  describe("hal-input", () => {
    it("must contain native <input> element", async () => {
      container.innerHTML = `<hal-input placeholder="Enter text"></hal-input>`

      await customElements.whenDefined("hal-input")
      const element = container.querySelector("hal-input")!
      await (element as any).updateComplete

      const inputElement = element.querySelector("input")
      expect(inputElement, "Must contain a native <input> element").toBeTruthy()
      expect(inputElement?.placeholder).toBe("Enter text")
    })

    it("disabled state must be on native input", async () => {
      container.innerHTML = `<hal-input disabled></hal-input>`

      await customElements.whenDefined("hal-input")
      const element = container.querySelector("hal-input")!
      await (element as any).updateComplete

      const inputElement = element.querySelector("input")
      expect(inputElement?.disabled, "Native input must be disabled").toBe(true)
    })
  })

  describe("hal-textarea", () => {
    it("must contain native <textarea> element", async () => {
      container.innerHTML = `<hal-textarea placeholder="Enter message"></hal-textarea>`

      await customElements.whenDefined("hal-textarea")
      const element = container.querySelector("hal-textarea")!
      await (element as any).updateComplete

      const textareaElement = element.querySelector("textarea")
      expect(
        textareaElement,
        "Must contain a native <textarea> element"
      ).toBeTruthy()
      expect(textareaElement?.placeholder).toBe("Enter message")
    })

    it("disabled state must be on native textarea", async () => {
      container.innerHTML = `<hal-textarea disabled></hal-textarea>`

      await customElements.whenDefined("hal-textarea")
      const element = container.querySelector("hal-textarea")!
      await (element as any).updateComplete

      const textareaElement = element.querySelector("textarea")
      expect(
        textareaElement?.disabled,
        "Native textarea must be disabled"
      ).toBe(true)
    })
  })

  describe("hal-separator", () => {
    it("decorative separator must have role=none", async () => {
      container.innerHTML = `<hal-separator></hal-separator>`

      await customElements.whenDefined("hal-separator")
      const element = container.querySelector("hal-separator")!
      await (element as any).updateComplete

      expect(element.getAttribute("role")).toBe("none")
    })

    it("non-decorative separator must have role=separator", async () => {
      container.innerHTML = `<hal-separator decorative="false"></hal-separator>`

      await customElements.whenDefined("hal-separator")
      const element = container.querySelector("hal-separator")!
      // Need to set the property, not just attribute
      ;(element as any).decorative = false
      await (element as any).updateComplete

      expect(element.getAttribute("role")).toBe("separator")
    })
  })

  describe("hal-switch", () => {
    it("must have role=switch and aria-checked", async () => {
      container.innerHTML = `<hal-switch></hal-switch>`

      await customElements.whenDefined("hal-switch")
      const element = container.querySelector("hal-switch")!
      await (element as any).updateComplete

      expect(element.getAttribute("role")).toBe("switch")
      expect(element.getAttribute("aria-checked")).toBe("false")
    })

    it("must have thumb element with correct data-state", async () => {
      container.innerHTML = `<hal-switch></hal-switch>`

      await customElements.whenDefined("hal-switch")
      const element = container.querySelector("hal-switch")!
      await (element as any).updateComplete

      const thumb = element.querySelector('[data-slot="switch-thumb"]')
      expect(thumb, "Must contain a thumb element").toBeTruthy()
      expect(thumb?.getAttribute("data-state")).toBe("unchecked")
    })

    it("checked state updates aria-checked and data-state", async () => {
      container.innerHTML = `<hal-switch checked></hal-switch>`

      await customElements.whenDefined("hal-switch")
      const element = container.querySelector("hal-switch")!
      await (element as any).updateComplete

      expect(element.getAttribute("aria-checked")).toBe("true")
      expect(element.getAttribute("data-state")).toBe("checked")

      const thumb = element.querySelector('[data-slot="switch-thumb"]')
      expect(thumb?.getAttribute("data-state")).toBe("checked")
    })
  })

  describe("hal-tooltip", () => {
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
        <hal-tooltip open>
          <hal-tooltip-trigger>
            <button>Trigger</button>
          </hal-tooltip-trigger>
          <hal-tooltip-content>Tooltip text</hal-tooltip-content>
        </hal-tooltip>
      `

      await customElements.whenDefined("hal-tooltip")
      const tooltip = container.querySelector("hal-tooltip")!
      await (tooltip as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="tooltip"]')
      expect(content, "Must have role='tooltip' on content").toBeTruthy()
      expect(content?.textContent).toContain("Tooltip text")
    })

    it("trigger element must have aria-describedby when open", async () => {
      container.innerHTML = `
        <hal-tooltip open>
          <hal-tooltip-trigger>
            <button>Trigger</button>
          </hal-tooltip-trigger>
          <hal-tooltip-content>Tooltip text</hal-tooltip-content>
        </hal-tooltip>
      `

      await customElements.whenDefined("hal-tooltip")
      const tooltip = container.querySelector("hal-tooltip")!
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
        <hal-tooltip open>
          <hal-tooltip-trigger>
            <button>Trigger</button>
          </hal-tooltip-trigger>
          <hal-tooltip-content>Tooltip text</hal-tooltip-content>
        </hal-tooltip>
      `

      await customElements.whenDefined("hal-tooltip")
      const tooltip = container.querySelector("hal-tooltip")!
      await (tooltip as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="tooltip-content"]')
      expect(content, "Must have data-slot='tooltip-content'").toBeTruthy()
    })
  })

  describe("hal-popover", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('body > div[style*="position: fixed"]')
        .forEach((el) => {
          el.remove()
        })
    })

    it("popover content must have role=dialog when open", async () => {
      container.innerHTML = `
        <hal-popover open>
          <hal-popover-trigger>
            <button>Trigger</button>
          </hal-popover-trigger>
          <hal-popover-content>Popover text</hal-popover-content>
        </hal-popover>
      `

      await customElements.whenDefined("hal-popover")
      const popover = container.querySelector("hal-popover")!
      await (popover as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content, "Must have role='dialog' on content").toBeTruthy()
      expect(content?.textContent).toContain("Popover text")
    })

    it("trigger element must have aria-haspopup=dialog", async () => {
      container.innerHTML = `
        <hal-popover>
          <hal-popover-trigger>
            <button>Trigger</button>
          </hal-popover-trigger>
          <hal-popover-content>Popover text</hal-popover-content>
        </hal-popover>
      `

      await customElements.whenDefined("hal-popover")
      const popover = container.querySelector("hal-popover")!
      await (popover as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='dialog'"
      ).toBe("dialog")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <hal-popover>
          <hal-popover-trigger>
            <button>Trigger</button>
          </hal-popover-trigger>
          <hal-popover-content>Popover text</hal-popover-content>
        </hal-popover>
      `

      await customElements.whenDefined("hal-popover")
      const popover = container.querySelector("hal-popover")!
      await (popover as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='false' when closed"
      ).toBe("false")

      // Open the popover
      ;(popover as any).open = true
      await (popover as any).updateComplete

      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='true' when open"
      ).toBe("true")
    })

    it("trigger element must have aria-controls when open", async () => {
      container.innerHTML = `
        <hal-popover open>
          <hal-popover-trigger>
            <button>Trigger</button>
          </hal-popover-trigger>
          <hal-popover-content>Popover text</hal-popover-content>
        </hal-popover>
      `

      await customElements.whenDefined("hal-popover")
      const popover = container.querySelector("hal-popover")!
      await (popover as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const button = container.querySelector("button")
      const controlsId = button?.getAttribute("aria-controls")
      expect(
        controlsId,
        "Trigger must have aria-controls when open"
      ).toBeTruthy()

      // The aria-controls should reference the popover content
      const content = document.getElementById(controlsId!)
      expect(content, "aria-controls must reference valid element").toBeTruthy()
      expect(content?.getAttribute("role")).toBe("dialog")
    })

    it("popover content must have correct data-slot", async () => {
      container.innerHTML = `
        <hal-popover open>
          <hal-popover-trigger>
            <button>Trigger</button>
          </hal-popover-trigger>
          <hal-popover-content>Popover text</hal-popover-content>
        </hal-popover>
      `

      await customElements.whenDefined("hal-popover")
      const popover = container.querySelector("hal-popover")!
      await (popover as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="popover-content"]')
      expect(content, "Must have data-slot='popover-content'").toBeTruthy()
    })
  })

  describe("hal-dialog", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('[data-slot="dialog-overlay"]')
        .forEach((el) => el.remove())
      document
        .querySelectorAll('[data-slot="dialog-content"]')
        .forEach((el) => el.remove())
      document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove())
    })

    it("dialog content must have role=dialog when open", async () => {
      container.innerHTML = `
        <hal-dialog open>
          <hal-dialog-trigger>
            <button>Open</button>
          </hal-dialog-trigger>
          <hal-dialog-content>
            <hal-dialog-title>Dialog Title</hal-dialog-title>
            Dialog content
          </hal-dialog-content>
        </hal-dialog>
      `

      await customElements.whenDefined("hal-dialog")
      const dialog = container.querySelector("hal-dialog")!
      await (dialog as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content, "Must have role='dialog' on content").toBeTruthy()
      expect(content?.textContent).toContain("Dialog content")
    })

    it("trigger element must have aria-haspopup=dialog", async () => {
      container.innerHTML = `
        <hal-dialog>
          <hal-dialog-trigger>
            <button>Open</button>
          </hal-dialog-trigger>
          <hal-dialog-content>
            <hal-dialog-title>Title</hal-dialog-title>
          </hal-dialog-content>
        </hal-dialog>
      `

      await customElements.whenDefined("hal-dialog")
      const dialog = container.querySelector("hal-dialog")!
      await (dialog as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='dialog'"
      ).toBe("dialog")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <hal-dialog>
          <hal-dialog-trigger>
            <button>Open</button>
          </hal-dialog-trigger>
          <hal-dialog-content>
            <hal-dialog-title>Title</hal-dialog-title>
          </hal-dialog-content>
        </hal-dialog>
      `

      await customElements.whenDefined("hal-dialog")
      const dialog = container.querySelector("hal-dialog")!
      await (dialog as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='false' when closed"
      ).toBe("false")

      // Open the dialog
      ;(dialog as any).open = true
      await (dialog as any).updateComplete

      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='true' when open"
      ).toBe("true")
    })

    it("dialog must have aria-labelledby pointing to title", async () => {
      container.innerHTML = `
        <hal-dialog open>
          <hal-dialog-trigger>
            <button>Open</button>
          </hal-dialog-trigger>
          <hal-dialog-content>
            <hal-dialog-title>My Dialog Title</hal-dialog-title>
          </hal-dialog-content>
        </hal-dialog>
      `

      await customElements.whenDefined("hal-dialog")
      const dialog = container.querySelector("hal-dialog")!
      await (dialog as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const dialogContent = document.querySelector('[role="dialog"]')
      const labelledBy = dialogContent?.getAttribute("aria-labelledby")
      expect(labelledBy, "Dialog must have aria-labelledby").toBeTruthy()

      const title = document.getElementById(labelledBy!)
      expect(title, "aria-labelledby must reference valid element").toBeTruthy()
      expect(title?.textContent).toContain("My Dialog Title")
    })

    it("dialog must have aria-describedby pointing to description", async () => {
      container.innerHTML = `
        <hal-dialog open>
          <hal-dialog-trigger>
            <button>Open</button>
          </hal-dialog-trigger>
          <hal-dialog-content>
            <hal-dialog-title>Title</hal-dialog-title>
            <hal-dialog-description>My Description</hal-dialog-description>
          </hal-dialog-content>
        </hal-dialog>
      `

      await customElements.whenDefined("hal-dialog")
      const dialog = container.querySelector("hal-dialog")!
      await (dialog as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const dialogContent = document.querySelector('[role="dialog"]')
      const describedBy = dialogContent?.getAttribute("aria-describedby")
      expect(describedBy, "Dialog must have aria-describedby").toBeTruthy()

      const description = document.getElementById(describedBy!)
      expect(
        description,
        "aria-describedby must reference valid element"
      ).toBeTruthy()
      expect(description?.textContent).toContain("My Description")
    })

    it("trigger element must have aria-controls when open", async () => {
      container.innerHTML = `
        <hal-dialog open>
          <hal-dialog-trigger>
            <button>Open</button>
          </hal-dialog-trigger>
          <hal-dialog-content>
            <hal-dialog-title>Title</hal-dialog-title>
          </hal-dialog-content>
        </hal-dialog>
      `

      await customElements.whenDefined("hal-dialog")
      const dialog = container.querySelector("hal-dialog")!
      await (dialog as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const button = container.querySelector("button")
      const controlsId = button?.getAttribute("aria-controls")
      expect(
        controlsId,
        "Trigger must have aria-controls when open"
      ).toBeTruthy()

      // The aria-controls should reference the dialog content
      const content = document.getElementById(controlsId!)
      expect(content, "aria-controls must reference valid element").toBeTruthy()
      expect(content?.getAttribute("role")).toBe("dialog")
    })

    it("dialog overlay must have correct data-slot", async () => {
      container.innerHTML = `
        <hal-dialog open>
          <hal-dialog-trigger>
            <button>Open</button>
          </hal-dialog-trigger>
          <hal-dialog-content>
            <hal-dialog-title>Title</hal-dialog-title>
          </hal-dialog-content>
        </hal-dialog>
      `

      await customElements.whenDefined("hal-dialog")
      const dialog = container.querySelector("hal-dialog")!
      await (dialog as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const overlay = document.querySelector('[data-slot="dialog-overlay"]')
      expect(overlay, "Must have data-slot='dialog-overlay'").toBeTruthy()
    })

    it("dialog content must have correct data-slot", async () => {
      container.innerHTML = `
        <hal-dialog open>
          <hal-dialog-trigger>
            <button>Open</button>
          </hal-dialog-trigger>
          <hal-dialog-content>
            <hal-dialog-title>Title</hal-dialog-title>
          </hal-dialog-content>
        </hal-dialog>
      `

      await customElements.whenDefined("hal-dialog")
      const dialog = container.querySelector("hal-dialog")!
      await (dialog as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="dialog-content"]')
      expect(content, "Must have data-slot='dialog-content'").toBeTruthy()
    })
  })

  describe("hal-dropdown-menu", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('body > div[style*="position: fixed"]')
        .forEach((el) => el.remove())
    })

    it("dropdown menu content must have role=menu when open", async () => {
      container.innerHTML = `
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <button>Open</button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-item>Item</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `

      await customElements.whenDefined("hal-dropdown-menu")
      const menu = container.querySelector("hal-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="menu"]')
      expect(content, "Must have role='menu' on content").toBeTruthy()
    })

    it("trigger element must have aria-haspopup=menu", async () => {
      container.innerHTML = `
        <hal-dropdown-menu>
          <hal-dropdown-menu-trigger>
            <button>Open</button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-item>Item</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `

      await customElements.whenDefined("hal-dropdown-menu")
      const menu = container.querySelector("hal-dropdown-menu")!
      await (menu as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='menu'"
      ).toBe("menu")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <hal-dropdown-menu>
          <hal-dropdown-menu-trigger>
            <button>Open</button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-item>Item</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `

      await customElements.whenDefined("hal-dropdown-menu")
      const menu = container.querySelector("hal-dropdown-menu")!
      await (menu as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='false' when closed"
      ).toBe("false")

      // Open the menu
      ;(menu as any).open = true
      await (menu as any).updateComplete

      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='true' when open"
      ).toBe("true")
    })

    it("menu items must have role=menuitem", async () => {
      container.innerHTML = `
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <button>Open</button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-item>Profile</hal-dropdown-menu-item>
            <hal-dropdown-menu-item>Settings</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `

      await customElements.whenDefined("hal-dropdown-menu")
      const menu = container.querySelector("hal-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const items = document.querySelectorAll('[role="menuitem"]')
      expect(items.length, "Must have menuitem roles").toBe(2)
      expect(items[0].textContent).toContain("Profile")
      expect(items[1].textContent).toContain("Settings")
    })

    it("checkbox items must have role=menuitemcheckbox", async () => {
      container.innerHTML = `
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <button>Open</button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-checkbox-item checked>Enabled</hal-dropdown-menu-checkbox-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `

      await customElements.whenDefined("hal-dropdown-menu")
      const menu = container.querySelector("hal-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const item = document.querySelector('[role="menuitemcheckbox"]')
      expect(item, "Must have role='menuitemcheckbox'").toBeTruthy()
      expect(item?.getAttribute("aria-checked")).toBe("true")
    })

    it("radio items must have role=menuitemradio", async () => {
      container.innerHTML = `
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <button>Open</button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-radio-group value="top">
              <hal-dropdown-menu-radio-item value="top">Top</hal-dropdown-menu-radio-item>
              <hal-dropdown-menu-radio-item value="bottom">Bottom</hal-dropdown-menu-radio-item>
            </hal-dropdown-menu-radio-group>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `

      await customElements.whenDefined("hal-dropdown-menu")
      const menu = container.querySelector("hal-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const items = document.querySelectorAll('[role="menuitemradio"]')
      expect(items.length, "Must have menuitemradio roles").toBe(2)
      expect(items[0].getAttribute("aria-checked")).toBe("true")
      expect(items[1].getAttribute("aria-checked")).toBe("false")
    })

    it("separators must have role=separator", async () => {
      container.innerHTML = `
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <button>Open</button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-item>Item 1</hal-dropdown-menu-item>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-item>Item 2</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `

      await customElements.whenDefined("hal-dropdown-menu")
      const menu = container.querySelector("hal-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const separator = document.querySelector('[role="separator"]')
      expect(separator, "Must have role='separator'").toBeTruthy()
    })

    it("disabled items must have aria-disabled", async () => {
      container.innerHTML = `
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <button>Open</button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-item disabled>Disabled Item</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `

      await customElements.whenDefined("hal-dropdown-menu")
      const menu = container.querySelector("hal-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const item = document.querySelector('[role="menuitem"]')
      expect(
        item?.getAttribute("aria-disabled"),
        "Disabled items must have aria-disabled='true'"
      ).toBe("true")
    })

    it("dropdown menu content must have correct data-slot", async () => {
      container.innerHTML = `
        <hal-dropdown-menu open>
          <hal-dropdown-menu-trigger>
            <button>Open</button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-item>Item</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `

      await customElements.whenDefined("hal-dropdown-menu")
      const menu = container.querySelector("hal-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector(
        '[data-slot="dropdown-menu-content"]'
      )
      expect(
        content,
        "Must have data-slot='dropdown-menu-content'"
      ).toBeTruthy()
    })
  })

  describe("hal-context-menu", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('body > div[style*="position: fixed"]')
        .forEach((el) => el.remove())
    })

    it("context menu content must have role=menu when open", async () => {
      container.innerHTML = `
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-item>Item</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      `

      await customElements.whenDefined("hal-context-menu")
      const menu = container.querySelector("hal-context-menu")!
      await (menu as any).updateComplete

      // Trigger via contextmenu event
      const trigger = container.querySelector('[data-testid="trigger"]')!
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 50,
          clientY: 50,
        })
      )
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="menu"]')
      expect(content, "Must have role='menu' on content").toBeTruthy()
    })

    it("menu items must have role=menuitem", async () => {
      container.innerHTML = `
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-item>Profile</hal-context-menu-item>
            <hal-context-menu-item>Settings</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      `

      await customElements.whenDefined("hal-context-menu")
      const menu = container.querySelector("hal-context-menu")!
      await (menu as any).updateComplete

      // Trigger via contextmenu event
      const trigger = container.querySelector('[data-testid="trigger"]')!
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 50,
          clientY: 50,
        })
      )
      await new Promise((r) => setTimeout(r, 50))

      const items = document.querySelectorAll('[role="menuitem"]')
      expect(items.length, "Must have menuitem roles").toBe(2)
      expect(items[0].textContent).toContain("Profile")
      expect(items[1].textContent).toContain("Settings")
    })

    it("checkbox items must have role=menuitemcheckbox", async () => {
      container.innerHTML = `
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-checkbox-item checked>Enabled</hal-context-menu-checkbox-item>
          </hal-context-menu-content>
        </hal-context-menu>
      `

      await customElements.whenDefined("hal-context-menu")
      const menu = container.querySelector("hal-context-menu")!
      await (menu as any).updateComplete

      // Trigger via contextmenu event
      const trigger = container.querySelector('[data-testid="trigger"]')!
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 50,
          clientY: 50,
        })
      )
      await new Promise((r) => setTimeout(r, 50))

      const item = document.querySelector('[role="menuitemcheckbox"]')
      expect(item, "Must have role='menuitemcheckbox'").toBeTruthy()
      expect(item?.getAttribute("aria-checked")).toBe("true")
    })

    it("radio items must have role=menuitemradio", async () => {
      container.innerHTML = `
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-radio-group value="top">
              <hal-context-menu-radio-item value="top">Top</hal-context-menu-radio-item>
              <hal-context-menu-radio-item value="bottom">Bottom</hal-context-menu-radio-item>
            </hal-context-menu-radio-group>
          </hal-context-menu-content>
        </hal-context-menu>
      `

      await customElements.whenDefined("hal-context-menu")
      const menu = container.querySelector("hal-context-menu")!
      await (menu as any).updateComplete

      // Trigger via contextmenu event
      const trigger = container.querySelector('[data-testid="trigger"]')!
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 50,
          clientY: 50,
        })
      )
      await new Promise((r) => setTimeout(r, 50))

      const items = document.querySelectorAll('[role="menuitemradio"]')
      expect(items.length, "Must have menuitemradio roles").toBe(2)
      expect(items[0].getAttribute("aria-checked")).toBe("true")
      expect(items[1].getAttribute("aria-checked")).toBe("false")
    })

    it("separators must have role=separator", async () => {
      container.innerHTML = `
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-item>Item 1</hal-context-menu-item>
            <hal-context-menu-separator></hal-context-menu-separator>
            <hal-context-menu-item>Item 2</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      `

      await customElements.whenDefined("hal-context-menu")
      const menu = container.querySelector("hal-context-menu")!
      await (menu as any).updateComplete

      // Trigger via contextmenu event
      const trigger = container.querySelector('[data-testid="trigger"]')!
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 50,
          clientY: 50,
        })
      )
      await new Promise((r) => setTimeout(r, 50))

      const separator = document.querySelector('[role="separator"]')
      expect(separator, "Must have role='separator'").toBeTruthy()
    })

    it("disabled items must have aria-disabled", async () => {
      container.innerHTML = `
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-item disabled>Disabled Item</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      `

      await customElements.whenDefined("hal-context-menu")
      const menu = container.querySelector("hal-context-menu")!
      await (menu as any).updateComplete

      // Trigger via contextmenu event
      const trigger = container.querySelector('[data-testid="trigger"]')!
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 50,
          clientY: 50,
        })
      )
      await new Promise((r) => setTimeout(r, 50))

      const item = document.querySelector('[role="menuitem"]')
      expect(
        item?.getAttribute("aria-disabled"),
        "Disabled items must have aria-disabled='true'"
      ).toBe("true")
    })

    it("context menu content must have correct data-slot", async () => {
      container.innerHTML = `
        <hal-context-menu>
          <hal-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </hal-context-menu-trigger>
          <hal-context-menu-content>
            <hal-context-menu-item>Item</hal-context-menu-item>
          </hal-context-menu-content>
        </hal-context-menu>
      `

      await customElements.whenDefined("hal-context-menu")
      const menu = container.querySelector("hal-context-menu")!
      await (menu as any).updateComplete

      // Trigger via contextmenu event
      const trigger = container.querySelector('[data-testid="trigger"]')!
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 50,
          clientY: 50,
        })
      )
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector(
        '[data-slot="context-menu-content"]'
      )
      expect(content, "Must have data-slot='context-menu-content'").toBeTruthy()
    })
  })

  describe("hal-sheet", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('[data-slot="sheet-overlay"]')
        .forEach((el) => el.remove())
      document
        .querySelectorAll('[data-slot="sheet-content"]')
        .forEach((el) => el.remove())
      document.querySelectorAll('[role="dialog"]').forEach((el) => el.remove())
    })

    it("sheet content must have role=dialog when open", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <button>Open</button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Sheet Title</hal-sheet-title>
            Sheet content
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content, "Must have role='dialog' on content").toBeTruthy()
      expect(content?.textContent).toContain("Sheet content")
    })

    it("trigger element must have aria-haspopup=dialog", async () => {
      container.innerHTML = `
        <hal-sheet>
          <hal-sheet-trigger>
            <button>Open</button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='dialog'"
      ).toBe("dialog")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <hal-sheet>
          <hal-sheet-trigger>
            <button>Open</button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='false' when closed"
      ).toBe("false")

      // Open the sheet
      ;(sheet as any).open = true
      await (sheet as any).updateComplete

      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='true' when open"
      ).toBe("true")
    })

    it("sheet must have aria-labelledby pointing to title", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <button>Open</button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>My Sheet Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const sheetContent = document.querySelector('[role="dialog"]')
      const labelledBy = sheetContent?.getAttribute("aria-labelledby")
      expect(labelledBy, "Sheet must have aria-labelledby").toBeTruthy()

      const title = document.getElementById(labelledBy!)
      expect(title, "aria-labelledby must reference valid element").toBeTruthy()
      expect(title?.textContent).toContain("My Sheet Title")
    })

    it("sheet must have aria-describedby pointing to description", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <button>Open</button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Title</hal-sheet-title>
            <hal-sheet-description>My Description</hal-sheet-description>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const sheetContent = document.querySelector('[role="dialog"]')
      const describedBy = sheetContent?.getAttribute("aria-describedby")
      expect(describedBy, "Sheet must have aria-describedby").toBeTruthy()

      const description = document.getElementById(describedBy!)
      expect(
        description,
        "aria-describedby must reference valid element"
      ).toBeTruthy()
      expect(description?.textContent).toContain("My Description")
    })

    it("trigger element must have aria-controls when open", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <button>Open</button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const button = container.querySelector("button")
      const controlsId = button?.getAttribute("aria-controls")
      expect(
        controlsId,
        "Trigger must have aria-controls when open"
      ).toBeTruthy()

      // The aria-controls should reference the sheet content
      const content = document.getElementById(controlsId!)
      expect(content, "aria-controls must reference valid element").toBeTruthy()
      expect(content?.getAttribute("role")).toBe("dialog")
    })

    it("sheet overlay must have correct data-slot", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <button>Open</button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const overlay = document.querySelector('[data-slot="sheet-overlay"]')
      expect(overlay, "Must have data-slot='sheet-overlay'").toBeTruthy()
    })

    it("sheet content must have correct data-slot", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <button>Open</button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="sheet-content"]')
      expect(content, "Must have data-slot='sheet-content'").toBeTruthy()
    })

    it("sheet must support side attribute for positioning", async () => {
      container.innerHTML = `
        <hal-sheet open>
          <hal-sheet-trigger>
            <button>Open</button>
          </hal-sheet-trigger>
          <hal-sheet-content side="left">
            <hal-sheet-title>Title</hal-sheet-title>
          </hal-sheet-content>
        </hal-sheet>
      `

      await customElements.whenDefined("hal-sheet")
      const sheet = container.querySelector("hal-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      // Verify it has the left-side positioning class
      expect(content?.className).toContain("left-0")
    })
  })

  describe("hal-drawer", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('[data-slot="drawer-overlay"]')
        .forEach((el) => el.remove())
      document
        .querySelectorAll('[data-slot="drawer-content"]')
        .forEach((el) => el.remove())
      document.querySelectorAll('[role="dialog"]').forEach((el) => {
        el.closest("[data-vaul-drawer]")?.remove()
        el.parentElement?.remove()
      })
    })

    it("drawer content must have role=dialog when open", async () => {
      container.innerHTML = `
        <hal-drawer open>
          <hal-drawer-trigger>
            <button>Open</button>
          </hal-drawer-trigger>
          <hal-drawer-content>
            <hal-drawer-title>Drawer Title</hal-drawer-title>
            Drawer content
          </hal-drawer-content>
        </hal-drawer>
      `

      await customElements.whenDefined("hal-drawer")
      const drawer = container.querySelector("hal-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content, "Must have role='dialog' on content").toBeTruthy()
      expect(content?.textContent).toContain("Drawer content")
    })

    it("trigger element must have aria-haspopup=dialog", async () => {
      container.innerHTML = `
        <hal-drawer>
          <hal-drawer-trigger>
            <button>Open</button>
          </hal-drawer-trigger>
          <hal-drawer-content>
            <hal-drawer-title>Title</hal-drawer-title>
          </hal-drawer-content>
        </hal-drawer>
      `

      await customElements.whenDefined("hal-drawer")
      const drawer = container.querySelector("hal-drawer")!
      await (drawer as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='dialog'"
      ).toBe("dialog")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <hal-drawer>
          <hal-drawer-trigger>
            <button>Open</button>
          </hal-drawer-trigger>
          <hal-drawer-content>
            <hal-drawer-title>Title</hal-drawer-title>
          </hal-drawer-content>
        </hal-drawer>
      `

      await customElements.whenDefined("hal-drawer")
      const drawer = container.querySelector("hal-drawer")!
      await (drawer as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='false' when closed"
      ).toBe("false")

      // Open the drawer
      ;(drawer as any).open = true
      await (drawer as any).updateComplete

      expect(
        button?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='true' when open"
      ).toBe("true")
    })

    it("drawer must have aria-labelledby pointing to title", async () => {
      container.innerHTML = `
        <hal-drawer open>
          <hal-drawer-trigger>
            <button>Open</button>
          </hal-drawer-trigger>
          <hal-drawer-content>
            <hal-drawer-title>My Drawer Title</hal-drawer-title>
          </hal-drawer-content>
        </hal-drawer>
      `

      await customElements.whenDefined("hal-drawer")
      const drawer = container.querySelector("hal-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const drawerContent = document.querySelector('[role="dialog"]')
      const labelledBy = drawerContent?.getAttribute("aria-labelledby")
      expect(labelledBy, "Drawer must have aria-labelledby").toBeTruthy()

      const title = document.getElementById(labelledBy!)
      expect(title, "aria-labelledby must reference valid element").toBeTruthy()
      expect(title?.textContent).toContain("My Drawer Title")
    })

    it("drawer must have aria-describedby pointing to description", async () => {
      container.innerHTML = `
        <hal-drawer open>
          <hal-drawer-trigger>
            <button>Open</button>
          </hal-drawer-trigger>
          <hal-drawer-content>
            <hal-drawer-title>Title</hal-drawer-title>
            <hal-drawer-description>My Description</hal-drawer-description>
          </hal-drawer-content>
        </hal-drawer>
      `

      await customElements.whenDefined("hal-drawer")
      const drawer = container.querySelector("hal-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const drawerContent = document.querySelector('[role="dialog"]')
      const describedBy = drawerContent?.getAttribute("aria-describedby")
      expect(describedBy, "Drawer must have aria-describedby").toBeTruthy()

      const description = document.getElementById(describedBy!)
      expect(
        description,
        "aria-describedby must reference valid element"
      ).toBeTruthy()
      expect(description?.textContent).toContain("My Description")
    })

    it("trigger element must have aria-controls when open", async () => {
      container.innerHTML = `
        <hal-drawer open>
          <hal-drawer-trigger>
            <button>Open</button>
          </hal-drawer-trigger>
          <hal-drawer-content>
            <hal-drawer-title>Title</hal-drawer-title>
          </hal-drawer-content>
        </hal-drawer>
      `

      await customElements.whenDefined("hal-drawer")
      const drawer = container.querySelector("hal-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const button = container.querySelector("button")
      const controlsId = button?.getAttribute("aria-controls")
      expect(
        controlsId,
        "Trigger must have aria-controls when open"
      ).toBeTruthy()

      // The aria-controls should reference the drawer content
      const content = document.getElementById(controlsId!)
      expect(content, "aria-controls must reference valid element").toBeTruthy()
      expect(content?.getAttribute("role")).toBe("dialog")
    })

    it("drawer overlay must have correct data-slot", async () => {
      container.innerHTML = `
        <hal-drawer open>
          <hal-drawer-trigger>
            <button>Open</button>
          </hal-drawer-trigger>
          <hal-drawer-content>
            <hal-drawer-title>Title</hal-drawer-title>
          </hal-drawer-content>
        </hal-drawer>
      `

      await customElements.whenDefined("hal-drawer")
      const drawer = container.querySelector("hal-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const overlay = document.querySelector('[data-slot="drawer-overlay"]')
      expect(overlay, "Must have data-slot='drawer-overlay'").toBeTruthy()
    })

    it("drawer content must have correct data-slot", async () => {
      container.innerHTML = `
        <hal-drawer open>
          <hal-drawer-trigger>
            <button>Open</button>
          </hal-drawer-trigger>
          <hal-drawer-content>
            <hal-drawer-title>Title</hal-drawer-title>
          </hal-drawer-content>
        </hal-drawer>
      `

      await customElements.whenDefined("hal-drawer")
      const drawer = container.querySelector("hal-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="drawer-content"]')
      expect(content, "Must have data-slot='drawer-content'").toBeTruthy()
    })

    it("drawer must support direction attribute for positioning", async () => {
      container.innerHTML = `
        <hal-drawer open>
          <hal-drawer-trigger>
            <button>Open</button>
          </hal-drawer-trigger>
          <hal-drawer-content direction="left">
            <hal-drawer-title>Title</hal-drawer-title>
          </hal-drawer-content>
        </hal-drawer>
      `

      await customElements.whenDefined("hal-drawer")
      const drawer = container.querySelector("hal-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      // Verify it has the left-side positioning class
      expect(content?.className).toContain("left-0")
    })
  })

  describe("hal-hover-card", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('body > div[style*="position: fixed"]')
        .forEach((el) => {
          el.remove()
        })
    })

    it("hover card content must have correct data-slot when open", async () => {
      container.innerHTML = `
        <hal-hover-card open>
          <hal-hover-card-trigger>
            <button>Trigger</button>
          </hal-hover-card-trigger>
          <hal-hover-card-content>Hover card text</hal-hover-card-content>
        </hal-hover-card>
      `

      await customElements.whenDefined("hal-hover-card")
      const hoverCard = container.querySelector("hal-hover-card")!
      await (hoverCard as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      // Look for the portaled content
      const content = document.querySelector(
        'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
      )
      expect(content, "Must have data-slot='hover-card-content'").toBeTruthy()
      expect(content?.textContent).toContain("Hover card text")
    })

    it("hover card content must have data-state attribute", async () => {
      container.innerHTML = `
        <hal-hover-card open>
          <hal-hover-card-trigger>
            <button>Trigger</button>
          </hal-hover-card-trigger>
          <hal-hover-card-content>Content</hal-hover-card-content>
        </hal-hover-card>
      `

      await customElements.whenDefined("hal-hover-card")
      const hoverCard = container.querySelector("hal-hover-card")!
      await (hoverCard as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      // Look for the portaled content
      const content = document.querySelector(
        'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
      )
      expect(
        content?.getAttribute("data-state"),
        "Content must have data-state='open'"
      ).toBe("open")
    })

    it("hover card content must have data-side attribute", async () => {
      container.innerHTML = `
        <hal-hover-card open>
          <hal-hover-card-trigger>
            <button>Trigger</button>
          </hal-hover-card-trigger>
          <hal-hover-card-content>Content</hal-hover-card-content>
        </hal-hover-card>
      `

      await customElements.whenDefined("hal-hover-card")
      const hoverCard = container.querySelector("hal-hover-card")!
      await (hoverCard as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      // Look for the portaled content
      const content = document.querySelector(
        'body > div[style*="position: fixed"] [data-slot="hover-card-content"]'
      )
      expect(
        content?.getAttribute("data-side"),
        "Content must have data-side attribute"
      ).toBeTruthy()
    })

    it("trigger element must have data-state attribute", async () => {
      container.innerHTML = `
        <hal-hover-card open>
          <hal-hover-card-trigger>
            <button>Trigger</button>
          </hal-hover-card-trigger>
          <hal-hover-card-content>Content</hal-hover-card-content>
        </hal-hover-card>
      `

      await customElements.whenDefined("hal-hover-card")
      const hoverCard = container.querySelector("hal-hover-card")!
      await (hoverCard as any).updateComplete

      // Radix HoverCard uses data-state on the trigger (unlike tooltip which uses aria-describedby)
      const button = container.querySelector("button")
      expect(
        button?.getAttribute("data-state"),
        "Trigger must have data-state='open'"
      ).toBe("open")
    })
  })

  describe("hal-select", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('body > div[style*="position: fixed"]')
        .forEach((el) => {
          el.remove()
        })
    })

    it("trigger must have role='combobox'", async () => {
      container.innerHTML = `
        <hal-select>
          <hal-select-trigger>
            <hal-select-value placeholder="Select"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
          </hal-select-content>
        </hal-select>
      `

      await customElements.whenDefined("hal-select")
      const select = container.querySelector("hal-select")!
      await (select as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(trigger, "Must have trigger with role='combobox'").toBeTruthy()
    })

    it("trigger must have aria-expanded attribute", async () => {
      container.innerHTML = `
        <hal-select>
          <hal-select-trigger>
            <hal-select-value placeholder="Select"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
          </hal-select-content>
        </hal-select>
      `

      await customElements.whenDefined("hal-select")
      const select = container.querySelector("hal-select")!
      await (select as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(
        trigger?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded"
      ).toBe("false")
    })

    it("content must have role='listbox' when open", async () => {
      container.innerHTML = `
        <hal-select open>
          <hal-select-trigger>
            <hal-select-value placeholder="Select"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
          </hal-select-content>
        </hal-select>
      `

      await customElements.whenDefined("hal-select")
      const select = container.querySelector("hal-select")!
      await (select as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      // Look for the portaled content
      const content = document.querySelector('[role="listbox"]')
      expect(content, "Must have content with role='listbox'").toBeTruthy()
    })

    it("items must have role='option'", async () => {
      container.innerHTML = `
        <hal-select open>
          <hal-select-trigger>
            <hal-select-value placeholder="Select"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
            <hal-select-item value="banana">Banana</hal-select-item>
          </hal-select-content>
        </hal-select>
      `

      await customElements.whenDefined("hal-select")
      const select = container.querySelector("hal-select")!
      await (select as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const options = document.querySelectorAll('[role="option"]')
      expect(options.length, "Must have options with role='option'").toBe(2)
    })

    it("selected item must have aria-selected='true'", async () => {
      container.innerHTML = `
        <hal-select value="banana" open>
          <hal-select-trigger>
            <hal-select-value placeholder="Select"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
            <hal-select-item value="banana">Banana</hal-select-item>
          </hal-select-content>
        </hal-select>
      `

      await customElements.whenDefined("hal-select")
      const select = container.querySelector("hal-select")!
      await (select as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const selectedOption = document.querySelector(
        '[role="option"][aria-selected="true"]'
      )
      expect(
        selectedOption,
        "Selected item must have aria-selected='true'"
      ).toBeTruthy()
      expect(selectedOption?.textContent).toContain("Banana")
    })

    it("disabled item must have aria-disabled='true'", async () => {
      container.innerHTML = `
        <hal-select open>
          <hal-select-trigger>
            <hal-select-value placeholder="Select"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple" disabled>Apple</hal-select-item>
          </hal-select-content>
        </hal-select>
      `

      await customElements.whenDefined("hal-select")
      const select = container.querySelector("hal-select")!
      await (select as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const disabledOption = document.querySelector(
        '[role="option"][aria-disabled="true"]'
      )
      expect(
        disabledOption,
        "Disabled item must have aria-disabled='true'"
      ).toBeTruthy()
    })

    it("select content must have correct data-slot when open", async () => {
      container.innerHTML = `
        <hal-select open>
          <hal-select-trigger>
            <hal-select-value placeholder="Select"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
          </hal-select-content>
        </hal-select>
      `

      await customElements.whenDefined("hal-select")
      const select = container.querySelector("hal-select")!
      await (select as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      // Look for the portaled content
      const content = document.querySelector(
        'body > div[style*="position: fixed"] [data-slot="select-content"]'
      )
      expect(content, "Must have data-slot='select-content'").toBeTruthy()
    })

    it("trigger must show placeholder when no value", async () => {
      container.innerHTML = `
        <hal-select>
          <hal-select-trigger>
            <hal-select-value placeholder="Select a fruit"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
          </hal-select-content>
        </hal-select>
      `

      await customElements.whenDefined("hal-select")
      const select = container.querySelector("hal-select")!
      await (select as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(trigger?.textContent, "Trigger must show placeholder").toContain(
        "Select a fruit"
      )
    })
  })

  describe("hal-command", () => {
    it("input must have role='combobox'", async () => {
      container.innerHTML = `
        <hal-command>
          <hal-command-input placeholder="Search..."></hal-command-input>
          <hal-command-list>
            <hal-command-item>Item 1</hal-command-item>
          </hal-command-list>
        </hal-command>
      `

      await customElements.whenDefined("hal-command")
      const command = container.querySelector("hal-command")!
      await (command as any).updateComplete

      const input = container.querySelector('[role="combobox"]')
      expect(input, "Must have input with role='combobox'").toBeTruthy()
    })

    it("input must have aria-expanded attribute", async () => {
      container.innerHTML = `
        <hal-command>
          <hal-command-input placeholder="Search..."></hal-command-input>
          <hal-command-list>
            <hal-command-item>Item 1</hal-command-item>
          </hal-command-list>
        </hal-command>
      `

      await customElements.whenDefined("hal-command")
      const command = container.querySelector("hal-command")!
      await (command as any).updateComplete

      const input = container.querySelector('[role="combobox"]')
      expect(
        input?.getAttribute("aria-expanded"),
        "Input must have aria-expanded"
      ).toBe("true")
    })

    it("list must have role='listbox'", async () => {
      container.innerHTML = `
        <hal-command>
          <hal-command-input placeholder="Search..."></hal-command-input>
          <hal-command-list>
            <hal-command-item>Item 1</hal-command-item>
          </hal-command-list>
        </hal-command>
      `

      await customElements.whenDefined("hal-command")
      const command = container.querySelector("hal-command")!
      await (command as any).updateComplete

      const list = container.querySelector('[role="listbox"]')
      expect(list, "Must have list with role='listbox'").toBeTruthy()
    })

    it("items must have role='option'", async () => {
      container.innerHTML = `
        <hal-command>
          <hal-command-input placeholder="Search..."></hal-command-input>
          <hal-command-list>
            <hal-command-item>Item 1</hal-command-item>
          </hal-command-list>
        </hal-command>
      `

      await customElements.whenDefined("hal-command")
      const command = container.querySelector("hal-command")!
      await (command as any).updateComplete

      const item = container.querySelector('[role="option"]')
      expect(item, "Must have item with role='option'").toBeTruthy()
      expect(item?.textContent).toContain("Item 1")
    })

    it("input must have aria-controls pointing to list", async () => {
      container.innerHTML = `
        <hal-command>
          <hal-command-input placeholder="Search..."></hal-command-input>
          <hal-command-list>
            <hal-command-item>Item 1</hal-command-item>
          </hal-command-list>
        </hal-command>
      `

      await customElements.whenDefined("hal-command")
      const command = container.querySelector("hal-command")!
      await (command as any).updateComplete

      const input = container.querySelector('[role="combobox"]')
      const list = container.querySelector('[role="listbox"]')
      expect(
        input?.getAttribute("aria-controls"),
        "Input must have aria-controls"
      ).toBe(list?.getAttribute("id"))
    })

    it("group must have role='group'", async () => {
      container.innerHTML = `
        <hal-command>
          <hal-command-list>
            <hal-command-group heading="Suggestions">
              <hal-command-item>Item 1</hal-command-item>
            </hal-command-group>
          </hal-command-list>
        </hal-command>
      `

      await customElements.whenDefined("hal-command")
      const command = container.querySelector("hal-command")!
      await (command as any).updateComplete

      const group = container.querySelector('[role="group"]')
      expect(group, "Must have group with role='group'").toBeTruthy()
    })

    it("separator must have role='separator'", async () => {
      container.innerHTML = `
        <hal-command>
          <hal-command-list>
            <hal-command-item>Item 1</hal-command-item>
            <hal-command-separator></hal-command-separator>
            <hal-command-item>Item 2</hal-command-item>
          </hal-command-list>
        </hal-command>
      `

      await customElements.whenDefined("hal-command")
      const command = container.querySelector("hal-command")!
      await (command as any).updateComplete

      const separator = container.querySelector('[role="separator"]')
      expect(
        separator,
        "Must have separator with role='separator'"
      ).toBeTruthy()
    })

    it("disabled items must have aria-disabled", async () => {
      container.innerHTML = `
        <hal-command>
          <hal-command-list>
            <hal-command-item disabled>Disabled Item</hal-command-item>
          </hal-command-list>
        </hal-command>
      `

      await customElements.whenDefined("hal-command")
      const command = container.querySelector("hal-command")!
      await (command as any).updateComplete

      const item = container.querySelector('[role="option"]')
      expect(
        item?.getAttribute("aria-disabled"),
        "Disabled item must have aria-disabled"
      ).toBe("true")
    })
  })

  describe("hal-combobox", () => {
    afterEach(() => {
      // Clean up any portaled content
      document
        .querySelectorAll('body > div[style*="position: fixed"]')
        .forEach((el) => {
          el.remove()
        })
    })

    it("trigger must have role='combobox'", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="test">Test</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(trigger, "Must have trigger with role='combobox'").toBeTruthy()
    })

    it("trigger must have aria-haspopup='listbox'", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="test">Test</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(
        trigger?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='listbox'"
      ).toBe("listbox")
    })

    it("trigger must have aria-expanded when closed", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="test">Test</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(
        trigger?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='false' when closed"
      ).toBe("false")
    })

    it("listbox must have role='listbox' when open", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="test">Test</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox by focusing the input (combobox opens on focus)
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      trigger.focus()
      await new Promise((r) => setTimeout(r, 50))

      const listbox = document.querySelector('[role="listbox"]')
      expect(listbox, "Must have listbox with role='listbox'").toBeTruthy()
    })

    it("trigger must have aria-controls pointing to listbox", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="test">Test</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox by focusing the input (combobox opens on focus)
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      trigger.focus()
      await new Promise((r) => setTimeout(r, 50))

      const listboxId = trigger.getAttribute("aria-controls")
      const listbox = document.getElementById(listboxId!)
      expect(
        listbox?.getAttribute("role"),
        "aria-controls must point to listbox"
      ).toBe("listbox")
    })

    it("items must have role='option'", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="test">Test</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox by focusing the input (combobox opens on focus)
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      trigger.focus()
      await new Promise((r) => setTimeout(r, 50))

      const option = document.querySelector('[role="option"]')
      expect(option, "Items must have role='option'").toBeTruthy()
    })

    it("selected item must have aria-selected='true'", async () => {
      container.innerHTML = `
        <hal-combobox value="test">
          <hal-combobox-item value="test">Test</hal-combobox-item>
          <hal-combobox-item value="other">Other</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox by focusing the input (combobox opens on focus)
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      trigger.focus()
      await new Promise((r) => setTimeout(r, 50))

      const selectedOption = document.querySelector('[aria-selected="true"]')
      expect(
        selectedOption,
        "Selected item must have aria-selected='true'"
      ).toBeTruthy()
      expect(selectedOption?.textContent).toContain("Test")
    })

    it("disabled items must have aria-disabled='true'", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="test" disabled>Disabled</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox by focusing the input (combobox opens on focus)
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      trigger.focus()
      await new Promise((r) => setTimeout(r, 50))

      const disabledOption = document.querySelector('[aria-disabled="true"]')
      expect(
        disabledOption,
        "Disabled item must have aria-disabled='true'"
      ).toBeTruthy()
    })
  })

  describe("hal-table", () => {
    it("must contain native <table> element", async () => {
      container.innerHTML = `
        <hal-table>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell>Content</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      `

      await customElements.whenDefined("hal-table")
      const tableElements = [
        "hal-table",
        "hal-table-body",
        "hal-table-row",
        "hal-table-cell",
      ]
      await Promise.all(
        tableElements.map((el) =>
          customElements.whenDefined(el).catch(() => {})
        )
      )
      const elements = container.querySelectorAll(tableElements.join(", "))
      await Promise.all(
        Array.from(elements).map((el) => (el as any).updateComplete)
      )

      const table = container.querySelector("hal-table")
      const nativeTable = table?.querySelector("table")
      expect(nativeTable, "Must contain native <table> element").toBeTruthy()
    })

    it("must contain native <thead> element", async () => {
      container.innerHTML = `
        <hal-table>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head>Header</hal-table-head>
            </hal-table-row>
          </hal-table-header>
        </hal-table>
      `

      await customElements.whenDefined("hal-table")
      const tableElements = [
        "hal-table",
        "hal-table-header",
        "hal-table-row",
        "hal-table-head",
      ]
      await Promise.all(
        tableElements.map((el) =>
          customElements.whenDefined(el).catch(() => {})
        )
      )
      const elements = container.querySelectorAll(tableElements.join(", "))
      await Promise.all(
        Array.from(elements).map((el) => (el as any).updateComplete)
      )

      const header = container.querySelector("hal-table-header")
      const thead = header?.querySelector("thead")
      expect(thead, "Must contain native <thead> element").toBeTruthy()
    })

    it("must contain native <tbody> element", async () => {
      container.innerHTML = `
        <hal-table>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell>Content</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      `

      await customElements.whenDefined("hal-table")
      const tableElements = [
        "hal-table",
        "hal-table-body",
        "hal-table-row",
        "hal-table-cell",
      ]
      await Promise.all(
        tableElements.map((el) =>
          customElements.whenDefined(el).catch(() => {})
        )
      )
      const elements = container.querySelectorAll(tableElements.join(", "))
      await Promise.all(
        Array.from(elements).map((el) => (el as any).updateComplete)
      )

      const body = container.querySelector("hal-table-body")
      const tbody = body?.querySelector("tbody")
      expect(tbody, "Must contain native <tbody> element").toBeTruthy()
    })

    it("must contain native <tfoot> element", async () => {
      container.innerHTML = `
        <hal-table>
          <hal-table-footer>
            <hal-table-row>
              <hal-table-cell>Footer</hal-table-cell>
            </hal-table-row>
          </hal-table-footer>
        </hal-table>
      `

      await customElements.whenDefined("hal-table")
      const tableElements = [
        "hal-table",
        "hal-table-footer",
        "hal-table-row",
        "hal-table-cell",
      ]
      await Promise.all(
        tableElements.map((el) =>
          customElements.whenDefined(el).catch(() => {})
        )
      )
      const elements = container.querySelectorAll(tableElements.join(", "))
      await Promise.all(
        Array.from(elements).map((el) => (el as any).updateComplete)
      )

      const footer = container.querySelector("hal-table-footer")
      const tfoot = footer?.querySelector("tfoot")
      expect(tfoot, "Must contain native <tfoot> element").toBeTruthy()
    })

    it("must contain native <tr> element", async () => {
      container.innerHTML = `
        <hal-table>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell>Content</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      `

      await customElements.whenDefined("hal-table")
      const tableElements = [
        "hal-table",
        "hal-table-body",
        "hal-table-row",
        "hal-table-cell",
      ]
      await Promise.all(
        tableElements.map((el) =>
          customElements.whenDefined(el).catch(() => {})
        )
      )
      const elements = container.querySelectorAll(tableElements.join(", "))
      await Promise.all(
        Array.from(elements).map((el) => (el as any).updateComplete)
      )

      const row = container.querySelector("hal-table-row")
      const tr = row?.querySelector("tr")
      expect(tr, "Must contain native <tr> element").toBeTruthy()
    })

    it("must contain native <th> element with content inside", async () => {
      container.innerHTML = `
        <hal-table>
          <hal-table-header>
            <hal-table-row>
              <hal-table-head>Header Text</hal-table-head>
            </hal-table-row>
          </hal-table-header>
        </hal-table>
      `

      await customElements.whenDefined("hal-table")
      const tableElements = [
        "hal-table",
        "hal-table-header",
        "hal-table-row",
        "hal-table-head",
      ]
      await Promise.all(
        tableElements.map((el) =>
          customElements.whenDefined(el).catch(() => {})
        )
      )
      const elements = container.querySelectorAll(tableElements.join(", "))
      await Promise.all(
        Array.from(elements).map((el) => (el as any).updateComplete)
      )

      const th = container.querySelector("th")
      expect(th, "Must contain native <th> element").toBeTruthy()
      expect(th?.textContent, "Text must be inside <th>").toContain(
        "Header Text"
      )
    })

    it("must contain native <td> element with content inside", async () => {
      container.innerHTML = `
        <hal-table>
          <hal-table-body>
            <hal-table-row>
              <hal-table-cell>Cell Content</hal-table-cell>
            </hal-table-row>
          </hal-table-body>
        </hal-table>
      `

      await customElements.whenDefined("hal-table")
      const tableElements = [
        "hal-table",
        "hal-table-body",
        "hal-table-row",
        "hal-table-cell",
      ]
      await Promise.all(
        tableElements.map((el) =>
          customElements.whenDefined(el).catch(() => {})
        )
      )
      const elements = container.querySelectorAll(tableElements.join(", "))
      await Promise.all(
        Array.from(elements).map((el) => (el as any).updateComplete)
      )

      const td = container.querySelector("td")
      expect(td, "Must contain native <td> element").toBeTruthy()
      expect(td?.textContent, "Text must be inside <td>").toContain(
        "Cell Content"
      )
    })

    it("must contain native <caption> element with content inside", async () => {
      container.innerHTML = `
        <hal-table>
          <hal-table-caption>Table Caption</hal-table-caption>
        </hal-table>
      `

      await customElements.whenDefined("hal-table")
      const tableElements = ["hal-table", "hal-table-caption"]
      await Promise.all(
        tableElements.map((el) =>
          customElements.whenDefined(el).catch(() => {})
        )
      )
      const elements = container.querySelectorAll(tableElements.join(", "))
      await Promise.all(
        Array.from(elements).map((el) => (el as any).updateComplete)
      )

      const caption = container.querySelector("caption")
      expect(caption, "Must contain native <caption> element").toBeTruthy()
      expect(caption?.textContent, "Text must be inside <caption>").toContain(
        "Table Caption"
      )
    })
  })

  describe("hal-calendar", () => {
    it("must have role='application' with aria-label", async () => {
      container.innerHTML = `<hal-calendar default-month="2025-01-01"></hal-calendar>`

      await customElements.whenDefined("hal-calendar")
      const calendar = container.querySelector("hal-calendar")!
      await (calendar as any).updateComplete

      const calendarEl = calendar.querySelector('[role="application"]')
      expect(calendarEl, "Must have role='application'").toBeTruthy()
      expect(
        calendarEl?.getAttribute("aria-label"),
        "Must have aria-label"
      ).toBe("Calendar")
    })

    it("must have native button elements for navigation", async () => {
      container.innerHTML = `<hal-calendar default-month="2025-01-01"></hal-calendar>`

      await customElements.whenDefined("hal-calendar")
      const calendar = container.querySelector("hal-calendar")!
      await (calendar as any).updateComplete

      const prevButton = calendar.querySelector(
        'button[aria-label="Previous month"]'
      )
      const nextButton = calendar.querySelector(
        'button[aria-label="Next month"]'
      )
      expect(prevButton, "Must have previous month button").toBeTruthy()
      expect(nextButton, "Must have next month button").toBeTruthy()
    })

    it("must have native button elements for day selection", async () => {
      container.innerHTML = `<hal-calendar default-month="2025-01-01"></hal-calendar>`

      await customElements.whenDefined("hal-calendar")
      const calendar = container.querySelector("hal-calendar")!
      await (calendar as any).updateComplete

      const dayButtons = calendar.querySelectorAll('[data-slot="day"] button')
      expect(dayButtons.length, "Must have day buttons").toBeGreaterThan(0)

      // Day buttons should have date information
      const firstDayButton = dayButtons[0]
      expect(
        firstDayButton?.hasAttribute("data-date"),
        "Day buttons must have data-date attribute"
      ).toBeTruthy()
    })

    it("selected date must have aria-pressed='true'", async () => {
      container.innerHTML = `
        <hal-calendar
          mode="single"
          default-month="2025-01-01"
          selected="2025-01-15"
        ></hal-calendar>
      `

      await customElements.whenDefined("hal-calendar")
      const calendar = container.querySelector("hal-calendar")!
      await (calendar as any).updateComplete

      const selectedButton = calendar.querySelector(
        'button[data-date="2025-01-15"]'
      )
      expect(selectedButton, "Must have button for selected date").toBeTruthy()
      expect(
        selectedButton?.getAttribute("aria-pressed"),
        "Selected button must have aria-pressed='true'"
      ).toBe("true")
    })

    it("disabled dates must have disabled attribute", async () => {
      container.innerHTML = `
        <hal-calendar
          default-month="2025-01-01"
          min-date="2025-01-10"
        ></hal-calendar>
      `

      await customElements.whenDefined("hal-calendar")
      const calendar = container.querySelector("hal-calendar")!
      await (calendar as any).updateComplete

      // Jan 5 should be disabled (before min-date)
      const disabledButton = calendar.querySelector(
        'button[data-date="2025-01-05"]'
      )
      expect(disabledButton, "Must have button for disabled date").toBeTruthy()
      expect(
        disabledButton?.hasAttribute("disabled"),
        "Disabled date must have disabled attribute"
      ).toBeTruthy()
    })

    it("weekday headers must have proper structure", async () => {
      container.innerHTML = `<hal-calendar default-month="2025-01-01"></hal-calendar>`

      await customElements.whenDefined("hal-calendar")
      const calendar = container.querySelector("hal-calendar")!
      await (calendar as any).updateComplete

      const weekdays = calendar.querySelectorAll('[data-slot="weekday"]')
      expect(weekdays.length, "Must have 7 weekday headers").toBe(7)
    })
  })

  describe("hal-native-select", () => {
    it("must contain native <select> element", async () => {
      container.innerHTML = `
        <hal-native-select>
          <hal-native-select-option value="a">Option A</hal-native-select-option>
        </hal-native-select>
      `

      await customElements.whenDefined("hal-native-select")
      const element = container.querySelector("hal-native-select")!
      await (element as any).updateComplete

      const select = element.querySelector("select")
      expect(select, "Must contain native <select>").toBeTruthy()
      expect(select!.dataset.slot).toBe("native-select")
    })

    it("options must be inside native <select>", async () => {
      container.innerHTML = `
        <hal-native-select>
          <hal-native-select-option value="apple">Apple</hal-native-select-option>
          <hal-native-select-option value="banana">Banana</hal-native-select-option>
        </hal-native-select>
      `

      await customElements.whenDefined("hal-native-select")
      const element = container.querySelector("hal-native-select")!
      await (element as any).updateComplete

      const select = element.querySelector("select")!
      const options = select.querySelectorAll("option")
      expect(options.length, "Options must be inside <select>").toBe(2)
      expect(options[0].textContent).toBe("Apple")
      expect(options[1].textContent).toBe("Banana")
    })

    it("optgroup must be inside native <select> with options inside", async () => {
      container.innerHTML = `
        <hal-native-select>
          <hal-native-select-optgroup label="Fruits">
            <hal-native-select-option value="apple">Apple</hal-native-select-option>
          </hal-native-select-optgroup>
        </hal-native-select>
      `

      await customElements.whenDefined("hal-native-select")
      const element = container.querySelector("hal-native-select")!
      await (element as any).updateComplete

      const select = element.querySelector("select")!
      const optgroup = select.querySelector("optgroup")
      expect(optgroup, "Optgroup must be inside <select>").toBeTruthy()
      expect(optgroup!.label).toBe("Fruits")

      const options = optgroup!.querySelectorAll("option")
      expect(options.length, "Options must be inside optgroup").toBe(1)
      expect(options[0].textContent).toBe("Apple")
    })

    it("must have chevron icon", async () => {
      container.innerHTML = `<hal-native-select></hal-native-select>`

      await customElements.whenDefined("hal-native-select")
      const element = container.querySelector("hal-native-select")!
      await (element as any).updateComplete

      const icon = element.querySelector("svg")
      expect(icon, "Must have chevron SVG icon").toBeTruthy()
      expect(icon!.dataset.slot).toBe("native-select-icon")
    })
  })

  describe("hal-spinner", () => {
    it("must contain SVG with role=status", async () => {
      container.innerHTML = `<hal-spinner></hal-spinner>`

      await customElements.whenDefined("hal-spinner")
      const element = container.querySelector("hal-spinner")!
      await (element as any).updateComplete

      const svg = element.querySelector("svg")
      expect(svg, "Must contain SVG element").toBeTruthy()
      expect(svg!.getAttribute("role"), "SVG must have role=status").toBe(
        "status"
      )
    })

    it("must have aria-label for accessibility", async () => {
      container.innerHTML = `<hal-spinner></hal-spinner>`

      await customElements.whenDefined("hal-spinner")
      const element = container.querySelector("hal-spinner")!
      await (element as any).updateComplete

      const svg = element.querySelector("svg")
      expect(svg!.getAttribute("aria-label"), "SVG must have aria-label").toBe(
        "Loading"
      )
    })
  })

  describe("hal-button-group", () => {
    it("must have role=group for accessibility", async () => {
      container.innerHTML = `
        <hal-button-group>
          <hal-button>Test</hal-button>
        </hal-button-group>
      `

      await customElements.whenDefined("hal-button-group")
      const element = container.querySelector("hal-button-group")!
      await (element as any).updateComplete

      expect(
        element.getAttribute("role"),
        "Must have role=group for grouping buttons"
      ).toBe("group")
    })

    it("must have data-slot=button-group", async () => {
      container.innerHTML = `
        <hal-button-group>
          <hal-button>Test</hal-button>
        </hal-button-group>
      `

      await customElements.whenDefined("hal-button-group")
      const element = container.querySelector("hal-button-group")!
      await (element as any).updateComplete

      expect(element.dataset.slot).toBe("button-group")
    })

    it("children must be preserved inside button-group", async () => {
      container.innerHTML = `
        <hal-button-group>
          <hal-button>First</hal-button>
          <hal-button>Second</hal-button>
        </hal-button-group>
      `

      await customElements.whenDefined("hal-button-group")
      const element = container.querySelector("hal-button-group")!
      await (element as any).updateComplete

      const buttons = element.querySelectorAll("hal-button")
      expect(buttons.length, "Must preserve all button children").toBe(2)
      expect(buttons[0].textContent).toContain("First")
      expect(buttons[1].textContent).toContain("Second")
    })
  })
})
