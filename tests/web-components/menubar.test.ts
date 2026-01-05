import { describe, it, expect, beforeEach, vi } from "vitest"
import "../../src/web-components/hal-menubar"

describe("hal-menubar", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("HalMenubar", () => {
    it("renders with correct role", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      await (menubar as any).updateComplete

      expect(menubar.getAttribute("role")).toBe("menubar")
    })

    it("has correct styling classes", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      await (menubar as any).updateComplete

      expect(menubar.className).toContain("flex")
      expect(menubar.className).toContain("h-9")
      expect(menubar.className).toContain("rounded-md")
      expect(menubar.className).toContain("border")
    })
  })

  describe("HalMenubarMenu", () => {
    it("renders trigger and content", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menu = container.querySelector("hal-menubar-menu")!
      await (menu as any).updateComplete

      const trigger = container.querySelector("hal-menubar-trigger")
      const content = container.querySelector("hal-menubar-content")

      expect(trigger).toBeTruthy()
      expect(content).toBeTruthy()
    })
  })

  describe("HalMenubarTrigger", () => {
    it("has correct accessibility attributes", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const trigger = container.querySelector("hal-menubar-trigger")!
      await (trigger as any).updateComplete

      expect(trigger.getAttribute("role")).toBe("menuitem")
      expect(trigger.getAttribute("aria-haspopup")).toBe("menu")
      expect(trigger.getAttribute("tabindex")).toBe("0")
    })

    it("opens menu on click", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      const trigger = container.querySelector("hal-menubar-trigger")!
      const content = container.querySelector("hal-menubar-content")!
      await (menubar as any).updateComplete
      await (trigger as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      expect(content.style.display).toBe("none")

      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      expect(content.style.display).toBe("block")
    })

    it("closes menu on second click", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      const trigger = container.querySelector("hal-menubar-trigger")!
      const content = container.querySelector("hal-menubar-content")!
      await (menubar as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      trigger.click()
      await new Promise((r) => setTimeout(r, 50))
      expect(content.style.display).toBe("block")

      trigger.click()
      await new Promise((r) => setTimeout(r, 50))
      expect(content.style.display).toBe("none")
    })
  })

  describe("HalMenubarContent", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const content = container.querySelector("hal-menubar-content")!
      await (content as any).updateComplete

      expect(content.getAttribute("role")).toBe("menu")
    })
  })

  describe("HalMenubarItem", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const item = container.querySelector("hal-menubar-item")!
      await (item as any).updateComplete

      expect(item.getAttribute("role")).toBe("menuitem")
    })

    it("fires select event when clicked", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      const trigger = container.querySelector("hal-menubar-trigger")!
      const item = container.querySelector("hal-menubar-item")!
      await (menubar as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      const selectHandler = vi.fn()
      menubar.addEventListener("select", selectHandler)

      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      item.click()
      await new Promise((r) => setTimeout(r, 50))

      expect(selectHandler).toHaveBeenCalled()
    })

    it("closes menu after selection", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      const trigger = container.querySelector("hal-menubar-trigger")!
      const content = container.querySelector("hal-menubar-content")!
      const item = container.querySelector("hal-menubar-item")!
      await (menubar as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      trigger.click()
      await new Promise((r) => setTimeout(r, 50))
      expect(content.style.display).toBe("block")

      item.click()
      await new Promise((r) => setTimeout(r, 50))
      expect(content.style.display).toBe("none")
    })

    it("supports disabled state", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item disabled>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const item = container.querySelector("hal-menubar-item")!
      await (item as any).updateComplete

      expect(item.getAttribute("aria-disabled")).toBe("true")
    })

    it("supports inset variant", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item inset>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const item = container.querySelector("hal-menubar-item")!
      await (item as any).updateComplete

      expect(item.dataset.inset).toBe("true")
    })

    it("supports destructive variant", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item variant="destructive">Delete</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const item = container.querySelector("hal-menubar-item")!
      await (item as any).updateComplete

      expect(item.dataset.variant).toBe("destructive")
    })
  })

  describe("HalMenubarCheckboxItem", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>View</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-checkbox-item>Show Toolbar</hal-menubar-checkbox-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const item = container.querySelector("hal-menubar-checkbox-item")!
      await (item as any).updateComplete

      expect(item.getAttribute("role")).toBe("menuitemcheckbox")
    })

    it("toggles checked state on click", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>View</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-checkbox-item>Show Toolbar</hal-menubar-checkbox-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const item = container.querySelector("hal-menubar-checkbox-item") as any
      await item.updateComplete

      expect(item.checked).toBe(false)

      item.click()
      await item.updateComplete

      expect(item.checked).toBe(true)
    })

    it("fires checked-change event", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>View</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-checkbox-item>Show Toolbar</hal-menubar-checkbox-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      const item = container.querySelector("hal-menubar-checkbox-item") as any
      await item.updateComplete

      const handler = vi.fn()
      menubar.addEventListener("checked-change", handler)

      item.click()
      await item.updateComplete

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ checked: true }),
        })
      )
    })
  })

  describe("HalMenubarRadioGroup", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>Options</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-radio-group value="a">
                <hal-menubar-radio-item value="a">Option A</hal-menubar-radio-item>
                <hal-menubar-radio-item value="b">Option B</hal-menubar-radio-item>
              </hal-menubar-radio-group>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const group = container.querySelector("hal-menubar-radio-group")!
      await (group as any).updateComplete

      expect(group.getAttribute("role")).toBe("group")
    })

    it("manages radio selection", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>Options</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-radio-group value="a">
                <hal-menubar-radio-item value="a">Option A</hal-menubar-radio-item>
                <hal-menubar-radio-item value="b">Option B</hal-menubar-radio-item>
              </hal-menubar-radio-group>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const group = container.querySelector("hal-menubar-radio-group") as any
      const items = container.querySelectorAll("hal-menubar-radio-item")
      await group.updateComplete
      await new Promise((r) => setTimeout(r, 0))

      expect(items[0].getAttribute("aria-checked")).toBe("true")
      expect(items[1].getAttribute("aria-checked")).toBe("false")
    })

    it("fires value-change event", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>Options</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-radio-group value="a">
                <hal-menubar-radio-item value="a">Option A</hal-menubar-radio-item>
                <hal-menubar-radio-item value="b">Option B</hal-menubar-radio-item>
              </hal-menubar-radio-group>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      const items = container.querySelectorAll("hal-menubar-radio-item")
      await (menubar as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      const handler = vi.fn()
      menubar.addEventListener("value-change", handler)

      items[1].click()
      await new Promise((r) => setTimeout(r, 0))

      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({ value: "b" }),
        })
      )
    })
  })

  describe("HalMenubarLabel", () => {
    it("renders with correct styling", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-label>Actions</hal-menubar-label>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const label = container.querySelector("hal-menubar-label")!
      await (label as any).updateComplete

      expect(label.className).toContain("font-medium")
    })
  })

  describe("HalMenubarSeparator", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
              <hal-menubar-separator></hal-menubar-separator>
              <hal-menubar-item>Open</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const separator = container.querySelector("hal-menubar-separator")!
      await (separator as any).updateComplete

      expect(separator.getAttribute("role")).toBe("separator")
    })
  })

  describe("HalMenubarShortcut", () => {
    it("renders with correct styling", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>
                New
                <hal-menubar-shortcut>⌘N</hal-menubar-shortcut>
              </hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const shortcut = container.querySelector("hal-menubar-shortcut")!
      await (shortcut as any).updateComplete

      expect(shortcut.className).toContain("ml-auto")
      expect(shortcut.className).toContain("text-xs")
    })
  })

  describe("Keyboard Navigation", () => {
    it("opens menu on Enter key", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      const trigger = container.querySelector("hal-menubar-trigger")!
      const content = container.querySelector("hal-menubar-content")!
      await (menubar as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
      await new Promise((r) => setTimeout(r, 50))

      expect(content.style.display).toBe("block")
    })

    it("opens menu on ArrowDown key", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      const trigger = container.querySelector("hal-menubar-trigger")!
      const content = container.querySelector("hal-menubar-content")!
      await (menubar as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }))
      await new Promise((r) => setTimeout(r, 50))

      expect(content.style.display).toBe("block")
    })

    it("closes menu on Escape key", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const menubar = container.querySelector("hal-menubar")!
      const trigger = container.querySelector("hal-menubar-trigger")!
      const content = container.querySelector("hal-menubar-content")!
      await (menubar as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      trigger.click()
      await new Promise((r) => setTimeout(r, 50))
      expect(content.style.display).toBe("block")

      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
      await new Promise((r) => setTimeout(r, 50))

      expect(content.style.display).toBe("none")
    })
  })

  describe("Submenus", () => {
    it("renders submenu trigger with chevron", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-sub>
                <hal-menubar-sub-trigger>More</hal-menubar-sub-trigger>
                <hal-menubar-sub-content>
                  <hal-menubar-item>Item 1</hal-menubar-item>
                </hal-menubar-sub-content>
              </hal-menubar-sub>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const subTrigger = container.querySelector("hal-menubar-sub-trigger")!
      await (subTrigger as any).updateComplete

      const svg = subTrigger.querySelector("svg")
      expect(svg).toBeTruthy()
    })

    it("has correct accessibility attributes on sub-trigger", async () => {
      container.innerHTML = `
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-sub>
                <hal-menubar-sub-trigger>More</hal-menubar-sub-trigger>
                <hal-menubar-sub-content>
                  <hal-menubar-item>Item 1</hal-menubar-item>
                </hal-menubar-sub-content>
              </hal-menubar-sub>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `
      await customElements.whenDefined("hal-menubar")
      const subTrigger = container.querySelector("hal-menubar-sub-trigger")!
      await (subTrigger as any).updateComplete

      expect(subTrigger.getAttribute("role")).toBe("menuitem")
      expect(subTrigger.getAttribute("aria-haspopup")).toBe("menu")
    })
  })
})
