import { describe, it, expect, beforeEach, vi } from "vitest"
import "../../src/web-components/plank-menubar"

describe("plank-menubar", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("PlankMenubar", () => {
    it("renders with correct role", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      await (menubar as any).updateComplete

      expect(menubar.getAttribute("role")).toBe("menubar")
    })

    it("has correct styling classes", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      await (menubar as any).updateComplete

      expect(menubar.className).toContain("flex")
      expect(menubar.className).toContain("h-9")
      expect(menubar.className).toContain("rounded-md")
      expect(menubar.className).toContain("border")
    })
  })

  describe("PlankMenubarMenu", () => {
    it("renders trigger and content", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menu = container.querySelector("plank-menubar-menu")!
      await (menu as any).updateComplete

      const trigger = container.querySelector("plank-menubar-trigger")
      const content = container.querySelector("plank-menubar-content")

      expect(trigger).toBeTruthy()
      expect(content).toBeTruthy()
    })
  })

  describe("PlankMenubarTrigger", () => {
    it("has correct accessibility attributes", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const trigger = container.querySelector("plank-menubar-trigger")!
      await (trigger as any).updateComplete

      expect(trigger.getAttribute("role")).toBe("menuitem")
      expect(trigger.getAttribute("aria-haspopup")).toBe("menu")
      expect(trigger.getAttribute("tabindex")).toBe("0")
    })

    it("opens menu on click", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      const trigger = container.querySelector("plank-menubar-trigger")!
      const content = container.querySelector("plank-menubar-content")!
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
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      const trigger = container.querySelector("plank-menubar-trigger")!
      const content = container.querySelector("plank-menubar-content")!
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

  describe("PlankMenubarContent", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const content = container.querySelector("plank-menubar-content")!
      await (content as any).updateComplete

      expect(content.getAttribute("role")).toBe("menu")
    })
  })

  describe("PlankMenubarItem", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const item = container.querySelector("plank-menubar-item")!
      await (item as any).updateComplete

      expect(item.getAttribute("role")).toBe("menuitem")
    })

    it("fires select event when clicked", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      const trigger = container.querySelector("plank-menubar-trigger")!
      const item = container.querySelector("plank-menubar-item")!
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
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      const trigger = container.querySelector("plank-menubar-trigger")!
      const content = container.querySelector("plank-menubar-content")!
      const item = container.querySelector("plank-menubar-item")!
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
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item disabled>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const item = container.querySelector("plank-menubar-item")!
      await (item as any).updateComplete

      expect(item.getAttribute("aria-disabled")).toBe("true")
    })

    it("supports inset variant", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item inset>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const item = container.querySelector("plank-menubar-item")!
      await (item as any).updateComplete

      expect(item.dataset.inset).toBe("true")
    })

    it("supports destructive variant", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item variant="destructive">Delete</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const item = container.querySelector("plank-menubar-item")!
      await (item as any).updateComplete

      expect(item.dataset.variant).toBe("destructive")
    })
  })

  describe("PlankMenubarCheckboxItem", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>View</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-checkbox-item>Show Toolbar</plank-menubar-checkbox-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const item = container.querySelector("plank-menubar-checkbox-item")!
      await (item as any).updateComplete

      expect(item.getAttribute("role")).toBe("menuitemcheckbox")
    })

    it("toggles checked state on click", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>View</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-checkbox-item>Show Toolbar</plank-menubar-checkbox-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const item = container.querySelector("plank-menubar-checkbox-item") as any
      await item.updateComplete

      expect(item.checked).toBe(false)

      item.click()
      await item.updateComplete

      expect(item.checked).toBe(true)
    })

    it("fires checked-change event", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>View</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-checkbox-item>Show Toolbar</plank-menubar-checkbox-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      const item = container.querySelector("plank-menubar-checkbox-item") as any
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

  describe("PlankMenubarRadioGroup", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>Options</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-radio-group value="a">
                <plank-menubar-radio-item value="a">Option A</plank-menubar-radio-item>
                <plank-menubar-radio-item value="b">Option B</plank-menubar-radio-item>
              </plank-menubar-radio-group>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const group = container.querySelector("plank-menubar-radio-group")!
      await (group as any).updateComplete

      expect(group.getAttribute("role")).toBe("group")
    })

    it("manages radio selection", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>Options</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-radio-group value="a">
                <plank-menubar-radio-item value="a">Option A</plank-menubar-radio-item>
                <plank-menubar-radio-item value="b">Option B</plank-menubar-radio-item>
              </plank-menubar-radio-group>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const group = container.querySelector("plank-menubar-radio-group") as any
      const items = container.querySelectorAll("plank-menubar-radio-item")
      await group.updateComplete
      await new Promise((r) => setTimeout(r, 0))

      expect(items[0].getAttribute("aria-checked")).toBe("true")
      expect(items[1].getAttribute("aria-checked")).toBe("false")
    })

    it("fires value-change event", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>Options</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-radio-group value="a">
                <plank-menubar-radio-item value="a">Option A</plank-menubar-radio-item>
                <plank-menubar-radio-item value="b">Option B</plank-menubar-radio-item>
              </plank-menubar-radio-group>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      const items = container.querySelectorAll("plank-menubar-radio-item")
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

  describe("PlankMenubarLabel", () => {
    it("renders with correct styling", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-label>Actions</plank-menubar-label>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const label = container.querySelector("plank-menubar-label")!
      await (label as any).updateComplete

      expect(label.className).toContain("font-medium")
    })
  })

  describe("PlankMenubarSeparator", () => {
    it("has correct role", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
              <plank-menubar-separator></plank-menubar-separator>
              <plank-menubar-item>Open</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const separator = container.querySelector("plank-menubar-separator")!
      await (separator as any).updateComplete

      expect(separator.getAttribute("role")).toBe("separator")
    })
  })

  describe("PlankMenubarShortcut", () => {
    it("renders with correct styling", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>
                New
                <plank-menubar-shortcut>⌘N</plank-menubar-shortcut>
              </plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const shortcut = container.querySelector("plank-menubar-shortcut")!
      await (shortcut as any).updateComplete

      expect(shortcut.className).toContain("ml-auto")
      expect(shortcut.className).toContain("text-xs")
    })
  })

  describe("Keyboard Navigation", () => {
    it("opens menu on Enter key", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      const trigger = container.querySelector("plank-menubar-trigger")!
      const content = container.querySelector("plank-menubar-content")!
      await (menubar as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))
      await new Promise((r) => setTimeout(r, 50))

      expect(content.style.display).toBe("block")
    })

    it("opens menu on ArrowDown key", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      const trigger = container.querySelector("plank-menubar-trigger")!
      const content = container.querySelector("plank-menubar-content")!
      await (menubar as any).updateComplete
      await new Promise((r) => setTimeout(r, 0))

      trigger.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }))
      await new Promise((r) => setTimeout(r, 50))

      expect(content.style.display).toBe("block")
    })

    it("closes menu on Escape key", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-item>New</plank-menubar-item>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const menubar = container.querySelector("plank-menubar")!
      const trigger = container.querySelector("plank-menubar-trigger")!
      const content = container.querySelector("plank-menubar-content")!
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
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-sub>
                <plank-menubar-sub-trigger>More</plank-menubar-sub-trigger>
                <plank-menubar-sub-content>
                  <plank-menubar-item>Item 1</plank-menubar-item>
                </plank-menubar-sub-content>
              </plank-menubar-sub>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const subTrigger = container.querySelector("plank-menubar-sub-trigger")!
      await (subTrigger as any).updateComplete

      const svg = subTrigger.querySelector("svg")
      expect(svg).toBeTruthy()
    })

    it("has correct accessibility attributes on sub-trigger", async () => {
      container.innerHTML = `
        <plank-menubar>
          <plank-menubar-menu>
            <plank-menubar-trigger>File</plank-menubar-trigger>
            <plank-menubar-content>
              <plank-menubar-sub>
                <plank-menubar-sub-trigger>More</plank-menubar-sub-trigger>
                <plank-menubar-sub-content>
                  <plank-menubar-item>Item 1</plank-menubar-item>
                </plank-menubar-sub-content>
              </plank-menubar-sub>
            </plank-menubar-content>
          </plank-menubar-menu>
        </plank-menubar>
      `
      await customElements.whenDefined("plank-menubar")
      const subTrigger = container.querySelector("plank-menubar-sub-trigger")!
      await (subTrigger as any).updateComplete

      expect(subTrigger.getAttribute("role")).toBe("menuitem")
      expect(subTrigger.getAttribute("aria-haspopup")).toBe("menu")
    })
  })
})
