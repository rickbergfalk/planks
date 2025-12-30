import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-button"
import "@/web-components/plank-badge"
import "@/web-components/plank-label"
import "@/web-components/plank-input"
import "@/web-components/plank-textarea"
import "@/web-components/plank-separator"
import "@/web-components/plank-switch"
import "@/web-components/plank-tooltip"
import "@/web-components/plank-popover"
import "@/web-components/plank-dialog"
import "@/web-components/plank-dropdown-menu"
import "@/web-components/plank-context-menu"

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

  describe("plank-popover", () => {
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
        <plank-popover open>
          <plank-popover-trigger>
            <button>Trigger</button>
          </plank-popover-trigger>
          <plank-popover-content>Popover text</plank-popover-content>
        </plank-popover>
      `

      await customElements.whenDefined("plank-popover")
      const popover = container.querySelector("plank-popover")!
      await (popover as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content, "Must have role='dialog' on content").toBeTruthy()
      expect(content?.textContent).toContain("Popover text")
    })

    it("trigger element must have aria-haspopup=dialog", async () => {
      container.innerHTML = `
        <plank-popover>
          <plank-popover-trigger>
            <button>Trigger</button>
          </plank-popover-trigger>
          <plank-popover-content>Popover text</plank-popover-content>
        </plank-popover>
      `

      await customElements.whenDefined("plank-popover")
      const popover = container.querySelector("plank-popover")!
      await (popover as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='dialog'"
      ).toBe("dialog")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <plank-popover>
          <plank-popover-trigger>
            <button>Trigger</button>
          </plank-popover-trigger>
          <plank-popover-content>Popover text</plank-popover-content>
        </plank-popover>
      `

      await customElements.whenDefined("plank-popover")
      const popover = container.querySelector("plank-popover")!
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
        <plank-popover open>
          <plank-popover-trigger>
            <button>Trigger</button>
          </plank-popover-trigger>
          <plank-popover-content>Popover text</plank-popover-content>
        </plank-popover>
      `

      await customElements.whenDefined("plank-popover")
      const popover = container.querySelector("plank-popover")!
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
        <plank-popover open>
          <plank-popover-trigger>
            <button>Trigger</button>
          </plank-popover-trigger>
          <plank-popover-content>Popover text</plank-popover-content>
        </plank-popover>
      `

      await customElements.whenDefined("plank-popover")
      const popover = container.querySelector("plank-popover")!
      await (popover as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="popover-content"]')
      expect(content, "Must have data-slot='popover-content'").toBeTruthy()
    })
  })

  describe("plank-dialog", () => {
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
        <plank-dialog open>
          <plank-dialog-trigger>
            <button>Open</button>
          </plank-dialog-trigger>
          <plank-dialog-content>
            <plank-dialog-title>Dialog Title</plank-dialog-title>
            Dialog content
          </plank-dialog-content>
        </plank-dialog>
      `

      await customElements.whenDefined("plank-dialog")
      const dialog = container.querySelector("plank-dialog")!
      await (dialog as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content, "Must have role='dialog' on content").toBeTruthy()
      expect(content?.textContent).toContain("Dialog content")
    })

    it("trigger element must have aria-haspopup=dialog", async () => {
      container.innerHTML = `
        <plank-dialog>
          <plank-dialog-trigger>
            <button>Open</button>
          </plank-dialog-trigger>
          <plank-dialog-content>
            <plank-dialog-title>Title</plank-dialog-title>
          </plank-dialog-content>
        </plank-dialog>
      `

      await customElements.whenDefined("plank-dialog")
      const dialog = container.querySelector("plank-dialog")!
      await (dialog as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='dialog'"
      ).toBe("dialog")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <plank-dialog>
          <plank-dialog-trigger>
            <button>Open</button>
          </plank-dialog-trigger>
          <plank-dialog-content>
            <plank-dialog-title>Title</plank-dialog-title>
          </plank-dialog-content>
        </plank-dialog>
      `

      await customElements.whenDefined("plank-dialog")
      const dialog = container.querySelector("plank-dialog")!
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
        <plank-dialog open>
          <plank-dialog-trigger>
            <button>Open</button>
          </plank-dialog-trigger>
          <plank-dialog-content>
            <plank-dialog-title>My Dialog Title</plank-dialog-title>
          </plank-dialog-content>
        </plank-dialog>
      `

      await customElements.whenDefined("plank-dialog")
      const dialog = container.querySelector("plank-dialog")!
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
        <plank-dialog open>
          <plank-dialog-trigger>
            <button>Open</button>
          </plank-dialog-trigger>
          <plank-dialog-content>
            <plank-dialog-title>Title</plank-dialog-title>
            <plank-dialog-description>My Description</plank-dialog-description>
          </plank-dialog-content>
        </plank-dialog>
      `

      await customElements.whenDefined("plank-dialog")
      const dialog = container.querySelector("plank-dialog")!
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
        <plank-dialog open>
          <plank-dialog-trigger>
            <button>Open</button>
          </plank-dialog-trigger>
          <plank-dialog-content>
            <plank-dialog-title>Title</plank-dialog-title>
          </plank-dialog-content>
        </plank-dialog>
      `

      await customElements.whenDefined("plank-dialog")
      const dialog = container.querySelector("plank-dialog")!
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
        <plank-dialog open>
          <plank-dialog-trigger>
            <button>Open</button>
          </plank-dialog-trigger>
          <plank-dialog-content>
            <plank-dialog-title>Title</plank-dialog-title>
          </plank-dialog-content>
        </plank-dialog>
      `

      await customElements.whenDefined("plank-dialog")
      const dialog = container.querySelector("plank-dialog")!
      await (dialog as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const overlay = document.querySelector('[data-slot="dialog-overlay"]')
      expect(overlay, "Must have data-slot='dialog-overlay'").toBeTruthy()
    })

    it("dialog content must have correct data-slot", async () => {
      container.innerHTML = `
        <plank-dialog open>
          <plank-dialog-trigger>
            <button>Open</button>
          </plank-dialog-trigger>
          <plank-dialog-content>
            <plank-dialog-title>Title</plank-dialog-title>
          </plank-dialog-content>
        </plank-dialog>
      `

      await customElements.whenDefined("plank-dialog")
      const dialog = container.querySelector("plank-dialog")!
      await (dialog as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="dialog-content"]')
      expect(content, "Must have data-slot='dialog-content'").toBeTruthy()
    })
  })

  describe("plank-dropdown-menu", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('body > div[style*="position: fixed"]')
        .forEach((el) => el.remove())
    })

    it("dropdown menu content must have role=menu when open", async () => {
      container.innerHTML = `
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <button>Open</button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="menu"]')
      expect(content, "Must have role='menu' on content").toBeTruthy()
    })

    it("trigger element must have aria-haspopup=menu", async () => {
      container.innerHTML = `
        <plank-dropdown-menu>
          <plank-dropdown-menu-trigger>
            <button>Open</button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
      await (menu as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='menu'"
      ).toBe("menu")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <plank-dropdown-menu>
          <plank-dropdown-menu-trigger>
            <button>Open</button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
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
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <button>Open</button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-item>Profile</plank-dropdown-menu-item>
            <plank-dropdown-menu-item>Settings</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const items = document.querySelectorAll('[role="menuitem"]')
      expect(items.length, "Must have menuitem roles").toBe(2)
      expect(items[0].textContent).toContain("Profile")
      expect(items[1].textContent).toContain("Settings")
    })

    it("checkbox items must have role=menuitemcheckbox", async () => {
      container.innerHTML = `
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <button>Open</button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-checkbox-item checked>Enabled</plank-dropdown-menu-checkbox-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const item = document.querySelector('[role="menuitemcheckbox"]')
      expect(item, "Must have role='menuitemcheckbox'").toBeTruthy()
      expect(item?.getAttribute("aria-checked")).toBe("true")
    })

    it("radio items must have role=menuitemradio", async () => {
      container.innerHTML = `
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <button>Open</button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-radio-group value="top">
              <plank-dropdown-menu-radio-item value="top">Top</plank-dropdown-menu-radio-item>
              <plank-dropdown-menu-radio-item value="bottom">Bottom</plank-dropdown-menu-radio-item>
            </plank-dropdown-menu-radio-group>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const items = document.querySelectorAll('[role="menuitemradio"]')
      expect(items.length, "Must have menuitemradio roles").toBe(2)
      expect(items[0].getAttribute("aria-checked")).toBe("true")
      expect(items[1].getAttribute("aria-checked")).toBe("false")
    })

    it("separators must have role=separator", async () => {
      container.innerHTML = `
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <button>Open</button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-item>Item 1</plank-dropdown-menu-item>
            <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
            <plank-dropdown-menu-item>Item 2</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const separator = document.querySelector('[role="separator"]')
      expect(separator, "Must have role='separator'").toBeTruthy()
    })

    it("disabled items must have aria-disabled", async () => {
      container.innerHTML = `
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <button>Open</button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-item disabled>Disabled Item</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
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
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <button>Open</button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
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

  describe("plank-context-menu", () => {
    afterEach(() => {
      // Clean up portaled content
      document
        .querySelectorAll('body > div[style*="position: fixed"]')
        .forEach((el) => el.remove())
    })

    it("context menu content must have role=menu when open", async () => {
      container.innerHTML = `
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-item>Item</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-item>Profile</plank-context-menu-item>
            <plank-context-menu-item>Settings</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-checkbox-item checked>Enabled</plank-context-menu-checkbox-item>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-radio-group value="top">
              <plank-context-menu-radio-item value="top">Top</plank-context-menu-radio-item>
              <plank-context-menu-radio-item value="bottom">Bottom</plank-context-menu-radio-item>
            </plank-context-menu-radio-group>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-item>Item 1</plank-context-menu-item>
            <plank-context-menu-separator></plank-context-menu-separator>
            <plank-context-menu-item>Item 2</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-item disabled>Disabled Item</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
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
        <plank-context-menu>
          <plank-context-menu-trigger>
            <div data-testid="trigger" style="width: 100px; height: 100px;">Right click</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-item>Item</plank-context-menu-item>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
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
})
