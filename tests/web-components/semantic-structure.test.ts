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
import "@/web-components/plank-sheet"
import "@/web-components/plank-drawer"
import "@/web-components/plank-hover-card"
import "@/web-components/plank-select"
import "@/web-components/plank-command"
import "@/web-components/plank-combobox"
import "@/web-components/plank-table"
import "@/web-components/plank-calendar"
import "@/web-components/plank-native-select"

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

  describe("plank-sheet", () => {
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
        <plank-sheet open>
          <plank-sheet-trigger>
            <button>Open</button>
          </plank-sheet-trigger>
          <plank-sheet-content>
            <plank-sheet-title>Sheet Title</plank-sheet-title>
            Sheet content
          </plank-sheet-content>
        </plank-sheet>
      `

      await customElements.whenDefined("plank-sheet")
      const sheet = container.querySelector("plank-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content, "Must have role='dialog' on content").toBeTruthy()
      expect(content?.textContent).toContain("Sheet content")
    })

    it("trigger element must have aria-haspopup=dialog", async () => {
      container.innerHTML = `
        <plank-sheet>
          <plank-sheet-trigger>
            <button>Open</button>
          </plank-sheet-trigger>
          <plank-sheet-content>
            <plank-sheet-title>Title</plank-sheet-title>
          </plank-sheet-content>
        </plank-sheet>
      `

      await customElements.whenDefined("plank-sheet")
      const sheet = container.querySelector("plank-sheet")!
      await (sheet as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='dialog'"
      ).toBe("dialog")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <plank-sheet>
          <plank-sheet-trigger>
            <button>Open</button>
          </plank-sheet-trigger>
          <plank-sheet-content>
            <plank-sheet-title>Title</plank-sheet-title>
          </plank-sheet-content>
        </plank-sheet>
      `

      await customElements.whenDefined("plank-sheet")
      const sheet = container.querySelector("plank-sheet")!
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
        <plank-sheet open>
          <plank-sheet-trigger>
            <button>Open</button>
          </plank-sheet-trigger>
          <plank-sheet-content>
            <plank-sheet-title>My Sheet Title</plank-sheet-title>
          </plank-sheet-content>
        </plank-sheet>
      `

      await customElements.whenDefined("plank-sheet")
      const sheet = container.querySelector("plank-sheet")!
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
        <plank-sheet open>
          <plank-sheet-trigger>
            <button>Open</button>
          </plank-sheet-trigger>
          <plank-sheet-content>
            <plank-sheet-title>Title</plank-sheet-title>
            <plank-sheet-description>My Description</plank-sheet-description>
          </plank-sheet-content>
        </plank-sheet>
      `

      await customElements.whenDefined("plank-sheet")
      const sheet = container.querySelector("plank-sheet")!
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
        <plank-sheet open>
          <plank-sheet-trigger>
            <button>Open</button>
          </plank-sheet-trigger>
          <plank-sheet-content>
            <plank-sheet-title>Title</plank-sheet-title>
          </plank-sheet-content>
        </plank-sheet>
      `

      await customElements.whenDefined("plank-sheet")
      const sheet = container.querySelector("plank-sheet")!
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
        <plank-sheet open>
          <plank-sheet-trigger>
            <button>Open</button>
          </plank-sheet-trigger>
          <plank-sheet-content>
            <plank-sheet-title>Title</plank-sheet-title>
          </plank-sheet-content>
        </plank-sheet>
      `

      await customElements.whenDefined("plank-sheet")
      const sheet = container.querySelector("plank-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const overlay = document.querySelector('[data-slot="sheet-overlay"]')
      expect(overlay, "Must have data-slot='sheet-overlay'").toBeTruthy()
    })

    it("sheet content must have correct data-slot", async () => {
      container.innerHTML = `
        <plank-sheet open>
          <plank-sheet-trigger>
            <button>Open</button>
          </plank-sheet-trigger>
          <plank-sheet-content>
            <plank-sheet-title>Title</plank-sheet-title>
          </plank-sheet-content>
        </plank-sheet>
      `

      await customElements.whenDefined("plank-sheet")
      const sheet = container.querySelector("plank-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="sheet-content"]')
      expect(content, "Must have data-slot='sheet-content'").toBeTruthy()
    })

    it("sheet must support side attribute for positioning", async () => {
      container.innerHTML = `
        <plank-sheet open>
          <plank-sheet-trigger>
            <button>Open</button>
          </plank-sheet-trigger>
          <plank-sheet-content side="left">
            <plank-sheet-title>Title</plank-sheet-title>
          </plank-sheet-content>
        </plank-sheet>
      `

      await customElements.whenDefined("plank-sheet")
      const sheet = container.querySelector("plank-sheet")!
      await (sheet as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      // Verify it has the left-side positioning class
      expect(content?.className).toContain("left-0")
    })
  })

  describe("plank-drawer", () => {
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
        <plank-drawer open>
          <plank-drawer-trigger>
            <button>Open</button>
          </plank-drawer-trigger>
          <plank-drawer-content>
            <plank-drawer-title>Drawer Title</plank-drawer-title>
            Drawer content
          </plank-drawer-content>
        </plank-drawer>
      `

      await customElements.whenDefined("plank-drawer")
      const drawer = container.querySelector("plank-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      expect(content, "Must have role='dialog' on content").toBeTruthy()
      expect(content?.textContent).toContain("Drawer content")
    })

    it("trigger element must have aria-haspopup=dialog", async () => {
      container.innerHTML = `
        <plank-drawer>
          <plank-drawer-trigger>
            <button>Open</button>
          </plank-drawer-trigger>
          <plank-drawer-content>
            <plank-drawer-title>Title</plank-drawer-title>
          </plank-drawer-content>
        </plank-drawer>
      `

      await customElements.whenDefined("plank-drawer")
      const drawer = container.querySelector("plank-drawer")!
      await (drawer as any).updateComplete

      const button = container.querySelector("button")
      expect(
        button?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='dialog'"
      ).toBe("dialog")
    })

    it("trigger element must have aria-expanded", async () => {
      container.innerHTML = `
        <plank-drawer>
          <plank-drawer-trigger>
            <button>Open</button>
          </plank-drawer-trigger>
          <plank-drawer-content>
            <plank-drawer-title>Title</plank-drawer-title>
          </plank-drawer-content>
        </plank-drawer>
      `

      await customElements.whenDefined("plank-drawer")
      const drawer = container.querySelector("plank-drawer")!
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
        <plank-drawer open>
          <plank-drawer-trigger>
            <button>Open</button>
          </plank-drawer-trigger>
          <plank-drawer-content>
            <plank-drawer-title>My Drawer Title</plank-drawer-title>
          </plank-drawer-content>
        </plank-drawer>
      `

      await customElements.whenDefined("plank-drawer")
      const drawer = container.querySelector("plank-drawer")!
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
        <plank-drawer open>
          <plank-drawer-trigger>
            <button>Open</button>
          </plank-drawer-trigger>
          <plank-drawer-content>
            <plank-drawer-title>Title</plank-drawer-title>
            <plank-drawer-description>My Description</plank-drawer-description>
          </plank-drawer-content>
        </plank-drawer>
      `

      await customElements.whenDefined("plank-drawer")
      const drawer = container.querySelector("plank-drawer")!
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
        <plank-drawer open>
          <plank-drawer-trigger>
            <button>Open</button>
          </plank-drawer-trigger>
          <plank-drawer-content>
            <plank-drawer-title>Title</plank-drawer-title>
          </plank-drawer-content>
        </plank-drawer>
      `

      await customElements.whenDefined("plank-drawer")
      const drawer = container.querySelector("plank-drawer")!
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
        <plank-drawer open>
          <plank-drawer-trigger>
            <button>Open</button>
          </plank-drawer-trigger>
          <plank-drawer-content>
            <plank-drawer-title>Title</plank-drawer-title>
          </plank-drawer-content>
        </plank-drawer>
      `

      await customElements.whenDefined("plank-drawer")
      const drawer = container.querySelector("plank-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const overlay = document.querySelector('[data-slot="drawer-overlay"]')
      expect(overlay, "Must have data-slot='drawer-overlay'").toBeTruthy()
    })

    it("drawer content must have correct data-slot", async () => {
      container.innerHTML = `
        <plank-drawer open>
          <plank-drawer-trigger>
            <button>Open</button>
          </plank-drawer-trigger>
          <plank-drawer-content>
            <plank-drawer-title>Title</plank-drawer-title>
          </plank-drawer-content>
        </plank-drawer>
      `

      await customElements.whenDefined("plank-drawer")
      const drawer = container.querySelector("plank-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[data-slot="drawer-content"]')
      expect(content, "Must have data-slot='drawer-content'").toBeTruthy()
    })

    it("drawer must support direction attribute for positioning", async () => {
      container.innerHTML = `
        <plank-drawer open>
          <plank-drawer-trigger>
            <button>Open</button>
          </plank-drawer-trigger>
          <plank-drawer-content direction="left">
            <plank-drawer-title>Title</plank-drawer-title>
          </plank-drawer-content>
        </plank-drawer>
      `

      await customElements.whenDefined("plank-drawer")
      const drawer = container.querySelector("plank-drawer")!
      await (drawer as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="dialog"]')
      // Verify it has the left-side positioning class
      expect(content?.className).toContain("left-0")
    })
  })

  describe("plank-hover-card", () => {
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
        <plank-hover-card open>
          <plank-hover-card-trigger>
            <button>Trigger</button>
          </plank-hover-card-trigger>
          <plank-hover-card-content>Hover card text</plank-hover-card-content>
        </plank-hover-card>
      `

      await customElements.whenDefined("plank-hover-card")
      const hoverCard = container.querySelector("plank-hover-card")!
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
        <plank-hover-card open>
          <plank-hover-card-trigger>
            <button>Trigger</button>
          </plank-hover-card-trigger>
          <plank-hover-card-content>Content</plank-hover-card-content>
        </plank-hover-card>
      `

      await customElements.whenDefined("plank-hover-card")
      const hoverCard = container.querySelector("plank-hover-card")!
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
        <plank-hover-card open>
          <plank-hover-card-trigger>
            <button>Trigger</button>
          </plank-hover-card-trigger>
          <plank-hover-card-content>Content</plank-hover-card-content>
        </plank-hover-card>
      `

      await customElements.whenDefined("plank-hover-card")
      const hoverCard = container.querySelector("plank-hover-card")!
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
        <plank-hover-card open>
          <plank-hover-card-trigger>
            <button>Trigger</button>
          </plank-hover-card-trigger>
          <plank-hover-card-content>Content</plank-hover-card-content>
        </plank-hover-card>
      `

      await customElements.whenDefined("plank-hover-card")
      const hoverCard = container.querySelector("plank-hover-card")!
      await (hoverCard as any).updateComplete

      // Radix HoverCard uses data-state on the trigger (unlike tooltip which uses aria-describedby)
      const button = container.querySelector("button")
      expect(
        button?.getAttribute("data-state"),
        "Trigger must have data-state='open'"
      ).toBe("open")
    })
  })

  describe("plank-select", () => {
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
        <plank-select>
          <plank-select-trigger>
            <plank-select-value placeholder="Select"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
          </plank-select-content>
        </plank-select>
      `

      await customElements.whenDefined("plank-select")
      const select = container.querySelector("plank-select")!
      await (select as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(trigger, "Must have trigger with role='combobox'").toBeTruthy()
    })

    it("trigger must have aria-expanded attribute", async () => {
      container.innerHTML = `
        <plank-select>
          <plank-select-trigger>
            <plank-select-value placeholder="Select"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
          </plank-select-content>
        </plank-select>
      `

      await customElements.whenDefined("plank-select")
      const select = container.querySelector("plank-select")!
      await (select as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(
        trigger?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded"
      ).toBe("false")
    })

    it("content must have role='listbox' when open", async () => {
      container.innerHTML = `
        <plank-select open>
          <plank-select-trigger>
            <plank-select-value placeholder="Select"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
          </plank-select-content>
        </plank-select>
      `

      await customElements.whenDefined("plank-select")
      const select = container.querySelector("plank-select")!
      await (select as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      // Look for the portaled content
      const content = document.querySelector('[role="listbox"]')
      expect(content, "Must have content with role='listbox'").toBeTruthy()
    })

    it("items must have role='option'", async () => {
      container.innerHTML = `
        <plank-select open>
          <plank-select-trigger>
            <plank-select-value placeholder="Select"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
            <plank-select-item value="banana">Banana</plank-select-item>
          </plank-select-content>
        </plank-select>
      `

      await customElements.whenDefined("plank-select")
      const select = container.querySelector("plank-select")!
      await (select as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const options = document.querySelectorAll('[role="option"]')
      expect(options.length, "Must have options with role='option'").toBe(2)
    })

    it("selected item must have aria-selected='true'", async () => {
      container.innerHTML = `
        <plank-select value="banana" open>
          <plank-select-trigger>
            <plank-select-value placeholder="Select"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
            <plank-select-item value="banana">Banana</plank-select-item>
          </plank-select-content>
        </plank-select>
      `

      await customElements.whenDefined("plank-select")
      const select = container.querySelector("plank-select")!
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
        <plank-select open>
          <plank-select-trigger>
            <plank-select-value placeholder="Select"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple" disabled>Apple</plank-select-item>
          </plank-select-content>
        </plank-select>
      `

      await customElements.whenDefined("plank-select")
      const select = container.querySelector("plank-select")!
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
        <plank-select open>
          <plank-select-trigger>
            <plank-select-value placeholder="Select"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
          </plank-select-content>
        </plank-select>
      `

      await customElements.whenDefined("plank-select")
      const select = container.querySelector("plank-select")!
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
        <plank-select>
          <plank-select-trigger>
            <plank-select-value placeholder="Select a fruit"></plank-select-value>
          </plank-select-trigger>
          <plank-select-content>
            <plank-select-item value="apple">Apple</plank-select-item>
          </plank-select-content>
        </plank-select>
      `

      await customElements.whenDefined("plank-select")
      const select = container.querySelector("plank-select")!
      await (select as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(trigger?.textContent, "Trigger must show placeholder").toContain(
        "Select a fruit"
      )
    })
  })

  describe("plank-command", () => {
    it("input must have role='combobox'", async () => {
      container.innerHTML = `
        <plank-command>
          <plank-command-input placeholder="Search..."></plank-command-input>
          <plank-command-list>
            <plank-command-item>Item 1</plank-command-item>
          </plank-command-list>
        </plank-command>
      `

      await customElements.whenDefined("plank-command")
      const command = container.querySelector("plank-command")!
      await (command as any).updateComplete

      const input = container.querySelector('[role="combobox"]')
      expect(input, "Must have input with role='combobox'").toBeTruthy()
    })

    it("input must have aria-expanded attribute", async () => {
      container.innerHTML = `
        <plank-command>
          <plank-command-input placeholder="Search..."></plank-command-input>
          <plank-command-list>
            <plank-command-item>Item 1</plank-command-item>
          </plank-command-list>
        </plank-command>
      `

      await customElements.whenDefined("plank-command")
      const command = container.querySelector("plank-command")!
      await (command as any).updateComplete

      const input = container.querySelector('[role="combobox"]')
      expect(
        input?.getAttribute("aria-expanded"),
        "Input must have aria-expanded"
      ).toBe("true")
    })

    it("list must have role='listbox'", async () => {
      container.innerHTML = `
        <plank-command>
          <plank-command-input placeholder="Search..."></plank-command-input>
          <plank-command-list>
            <plank-command-item>Item 1</plank-command-item>
          </plank-command-list>
        </plank-command>
      `

      await customElements.whenDefined("plank-command")
      const command = container.querySelector("plank-command")!
      await (command as any).updateComplete

      const list = container.querySelector('[role="listbox"]')
      expect(list, "Must have list with role='listbox'").toBeTruthy()
    })

    it("items must have role='option'", async () => {
      container.innerHTML = `
        <plank-command>
          <plank-command-input placeholder="Search..."></plank-command-input>
          <plank-command-list>
            <plank-command-item>Item 1</plank-command-item>
          </plank-command-list>
        </plank-command>
      `

      await customElements.whenDefined("plank-command")
      const command = container.querySelector("plank-command")!
      await (command as any).updateComplete

      const item = container.querySelector('[role="option"]')
      expect(item, "Must have item with role='option'").toBeTruthy()
      expect(item?.textContent).toContain("Item 1")
    })

    it("input must have aria-controls pointing to list", async () => {
      container.innerHTML = `
        <plank-command>
          <plank-command-input placeholder="Search..."></plank-command-input>
          <plank-command-list>
            <plank-command-item>Item 1</plank-command-item>
          </plank-command-list>
        </plank-command>
      `

      await customElements.whenDefined("plank-command")
      const command = container.querySelector("plank-command")!
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
        <plank-command>
          <plank-command-list>
            <plank-command-group heading="Suggestions">
              <plank-command-item>Item 1</plank-command-item>
            </plank-command-group>
          </plank-command-list>
        </plank-command>
      `

      await customElements.whenDefined("plank-command")
      const command = container.querySelector("plank-command")!
      await (command as any).updateComplete

      const group = container.querySelector('[role="group"]')
      expect(group, "Must have group with role='group'").toBeTruthy()
    })

    it("separator must have role='separator'", async () => {
      container.innerHTML = `
        <plank-command>
          <plank-command-list>
            <plank-command-item>Item 1</plank-command-item>
            <plank-command-separator></plank-command-separator>
            <plank-command-item>Item 2</plank-command-item>
          </plank-command-list>
        </plank-command>
      `

      await customElements.whenDefined("plank-command")
      const command = container.querySelector("plank-command")!
      await (command as any).updateComplete

      const separator = container.querySelector('[role="separator"]')
      expect(
        separator,
        "Must have separator with role='separator'"
      ).toBeTruthy()
    })

    it("disabled items must have aria-disabled", async () => {
      container.innerHTML = `
        <plank-command>
          <plank-command-list>
            <plank-command-item disabled>Disabled Item</plank-command-item>
          </plank-command-list>
        </plank-command>
      `

      await customElements.whenDefined("plank-command")
      const command = container.querySelector("plank-command")!
      await (command as any).updateComplete

      const item = container.querySelector('[role="option"]')
      expect(
        item?.getAttribute("aria-disabled"),
        "Disabled item must have aria-disabled"
      ).toBe("true")
    })
  })

  describe("plank-combobox", () => {
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
        <plank-combobox>
          <plank-combobox-item value="test">Test</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(trigger, "Must have trigger with role='combobox'").toBeTruthy()
    })

    it("trigger must have aria-haspopup='listbox'", async () => {
      container.innerHTML = `
        <plank-combobox>
          <plank-combobox-item value="test">Test</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(
        trigger?.getAttribute("aria-haspopup"),
        "Trigger must have aria-haspopup='listbox'"
      ).toBe("listbox")
    })

    it("trigger must have aria-expanded when closed", async () => {
      container.innerHTML = `
        <plank-combobox>
          <plank-combobox-item value="test">Test</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(
        trigger?.getAttribute("aria-expanded"),
        "Trigger must have aria-expanded='false' when closed"
      ).toBe("false")
    })

    it("listbox must have role='listbox' when open", async () => {
      container.innerHTML = `
        <plank-combobox>
          <plank-combobox-item value="test">Test</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const listbox = document.querySelector('[role="listbox"]')
      expect(listbox, "Must have listbox with role='listbox'").toBeTruthy()
    })

    it("trigger must have aria-controls pointing to listbox", async () => {
      container.innerHTML = `
        <plank-combobox>
          <plank-combobox-item value="test">Test</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
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
        <plank-combobox>
          <plank-combobox-item value="test">Test</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const option = document.querySelector('[role="option"]')
      expect(option, "Items must have role='option'").toBeTruthy()
    })

    it("selected item must have aria-selected='true'", async () => {
      container.innerHTML = `
        <plank-combobox value="test">
          <plank-combobox-item value="test">Test</plank-combobox-item>
          <plank-combobox-item value="other">Other</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
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
        <plank-combobox>
          <plank-combobox-item value="test" disabled>Disabled</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const disabledOption = document.querySelector('[aria-disabled="true"]')
      expect(
        disabledOption,
        "Disabled item must have aria-disabled='true'"
      ).toBeTruthy()
    })
  })

  describe("plank-table", () => {
    it("must contain native <table> element", async () => {
      container.innerHTML = `
        <plank-table>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell>Content</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
        </plank-table>
      `

      await customElements.whenDefined("plank-table")
      const tableElements = [
        "plank-table",
        "plank-table-body",
        "plank-table-row",
        "plank-table-cell",
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

      const table = container.querySelector("plank-table")
      const nativeTable = table?.querySelector("table")
      expect(nativeTable, "Must contain native <table> element").toBeTruthy()
    })

    it("must contain native <thead> element", async () => {
      container.innerHTML = `
        <plank-table>
          <plank-table-header>
            <plank-table-row>
              <plank-table-head>Header</plank-table-head>
            </plank-table-row>
          </plank-table-header>
        </plank-table>
      `

      await customElements.whenDefined("plank-table")
      const tableElements = [
        "plank-table",
        "plank-table-header",
        "plank-table-row",
        "plank-table-head",
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

      const header = container.querySelector("plank-table-header")
      const thead = header?.querySelector("thead")
      expect(thead, "Must contain native <thead> element").toBeTruthy()
    })

    it("must contain native <tbody> element", async () => {
      container.innerHTML = `
        <plank-table>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell>Content</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
        </plank-table>
      `

      await customElements.whenDefined("plank-table")
      const tableElements = [
        "plank-table",
        "plank-table-body",
        "plank-table-row",
        "plank-table-cell",
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

      const body = container.querySelector("plank-table-body")
      const tbody = body?.querySelector("tbody")
      expect(tbody, "Must contain native <tbody> element").toBeTruthy()
    })

    it("must contain native <tfoot> element", async () => {
      container.innerHTML = `
        <plank-table>
          <plank-table-footer>
            <plank-table-row>
              <plank-table-cell>Footer</plank-table-cell>
            </plank-table-row>
          </plank-table-footer>
        </plank-table>
      `

      await customElements.whenDefined("plank-table")
      const tableElements = [
        "plank-table",
        "plank-table-footer",
        "plank-table-row",
        "plank-table-cell",
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

      const footer = container.querySelector("plank-table-footer")
      const tfoot = footer?.querySelector("tfoot")
      expect(tfoot, "Must contain native <tfoot> element").toBeTruthy()
    })

    it("must contain native <tr> element", async () => {
      container.innerHTML = `
        <plank-table>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell>Content</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
        </plank-table>
      `

      await customElements.whenDefined("plank-table")
      const tableElements = [
        "plank-table",
        "plank-table-body",
        "plank-table-row",
        "plank-table-cell",
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

      const row = container.querySelector("plank-table-row")
      const tr = row?.querySelector("tr")
      expect(tr, "Must contain native <tr> element").toBeTruthy()
    })

    it("must contain native <th> element with content inside", async () => {
      container.innerHTML = `
        <plank-table>
          <plank-table-header>
            <plank-table-row>
              <plank-table-head>Header Text</plank-table-head>
            </plank-table-row>
          </plank-table-header>
        </plank-table>
      `

      await customElements.whenDefined("plank-table")
      const tableElements = [
        "plank-table",
        "plank-table-header",
        "plank-table-row",
        "plank-table-head",
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
        <plank-table>
          <plank-table-body>
            <plank-table-row>
              <plank-table-cell>Cell Content</plank-table-cell>
            </plank-table-row>
          </plank-table-body>
        </plank-table>
      `

      await customElements.whenDefined("plank-table")
      const tableElements = [
        "plank-table",
        "plank-table-body",
        "plank-table-row",
        "plank-table-cell",
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
        <plank-table>
          <plank-table-caption>Table Caption</plank-table-caption>
        </plank-table>
      `

      await customElements.whenDefined("plank-table")
      const tableElements = ["plank-table", "plank-table-caption"]
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

  describe("plank-calendar", () => {
    it("must have role='application' with aria-label", async () => {
      container.innerHTML = `<plank-calendar default-month="2025-01-01"></plank-calendar>`

      await customElements.whenDefined("plank-calendar")
      const calendar = container.querySelector("plank-calendar")!
      await (calendar as any).updateComplete

      const calendarEl = calendar.querySelector('[role="application"]')
      expect(calendarEl, "Must have role='application'").toBeTruthy()
      expect(
        calendarEl?.getAttribute("aria-label"),
        "Must have aria-label"
      ).toBe("Calendar")
    })

    it("must have native button elements for navigation", async () => {
      container.innerHTML = `<plank-calendar default-month="2025-01-01"></plank-calendar>`

      await customElements.whenDefined("plank-calendar")
      const calendar = container.querySelector("plank-calendar")!
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
      container.innerHTML = `<plank-calendar default-month="2025-01-01"></plank-calendar>`

      await customElements.whenDefined("plank-calendar")
      const calendar = container.querySelector("plank-calendar")!
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
        <plank-calendar
          mode="single"
          default-month="2025-01-01"
          selected="2025-01-15"
        ></plank-calendar>
      `

      await customElements.whenDefined("plank-calendar")
      const calendar = container.querySelector("plank-calendar")!
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
        <plank-calendar
          default-month="2025-01-01"
          min-date="2025-01-10"
        ></plank-calendar>
      `

      await customElements.whenDefined("plank-calendar")
      const calendar = container.querySelector("plank-calendar")!
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
      container.innerHTML = `<plank-calendar default-month="2025-01-01"></plank-calendar>`

      await customElements.whenDefined("plank-calendar")
      const calendar = container.querySelector("plank-calendar")!
      await (calendar as any).updateComplete

      const weekdays = calendar.querySelectorAll('[data-slot="weekday"]')
      expect(weekdays.length, "Must have 7 weekday headers").toBe(7)
    })
  })

  describe("plank-native-select", () => {
    it("must contain native <select> element", async () => {
      container.innerHTML = `
        <plank-native-select>
          <plank-native-select-option value="a">Option A</plank-native-select-option>
        </plank-native-select>
      `

      await customElements.whenDefined("plank-native-select")
      const element = container.querySelector("plank-native-select")!
      await (element as any).updateComplete

      const select = element.querySelector("select")
      expect(select, "Must contain native <select>").toBeTruthy()
      expect(select!.dataset.slot).toBe("native-select")
    })

    it("options must be inside native <select>", async () => {
      container.innerHTML = `
        <plank-native-select>
          <plank-native-select-option value="apple">Apple</plank-native-select-option>
          <plank-native-select-option value="banana">Banana</plank-native-select-option>
        </plank-native-select>
      `

      await customElements.whenDefined("plank-native-select")
      const element = container.querySelector("plank-native-select")!
      await (element as any).updateComplete

      const select = element.querySelector("select")!
      const options = select.querySelectorAll("option")
      expect(options.length, "Options must be inside <select>").toBe(2)
      expect(options[0].textContent).toBe("Apple")
      expect(options[1].textContent).toBe("Banana")
    })

    it("optgroup must be inside native <select> with options inside", async () => {
      container.innerHTML = `
        <plank-native-select>
          <plank-native-select-optgroup label="Fruits">
            <plank-native-select-option value="apple">Apple</plank-native-select-option>
          </plank-native-select-optgroup>
        </plank-native-select>
      `

      await customElements.whenDefined("plank-native-select")
      const element = container.querySelector("plank-native-select")!
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
      container.innerHTML = `<plank-native-select></plank-native-select>`

      await customElements.whenDefined("plank-native-select")
      const element = container.querySelector("plank-native-select")!
      await (element as any).updateComplete

      const icon = element.querySelector("svg")
      expect(icon, "Must have chevron SVG icon").toBeTruthy()
      expect(icon!.dataset.slot).toBe("native-select-icon")
    })
  })
})
