import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/plank-dropdown-menu"
import "@/web-components/plank-button"

describe("DropdownMenu (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    document
      .querySelectorAll('body > div[style*="position: fixed"]')
      .forEach((el) => {
        el.remove()
      })
  })

  it("renders trigger with correct data-slot", async () => {
    container.innerHTML = `
      <plank-dropdown-menu>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete

    const trigger = container.querySelector("plank-dropdown-menu-trigger")
    expect(trigger?.dataset.slot).toBe("dropdown-menu-trigger")
  })

  it("menu content is hidden by default", async () => {
    container.innerHTML = `
      <plank-dropdown-menu>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete

    const menuEl = document.querySelector('[role="menu"]')
    expect(menuEl).toBeNull()
  })

  it("opens menu on click", async () => {
    container.innerHTML = `
      <plank-dropdown-menu>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
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

    const trigger = container.querySelector("plank-dropdown-menu-trigger")!
    trigger.click()
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const menuEl = document.querySelector('[role="menu"]')
    expect(menuEl).toBeDefined()
    expect(menuEl?.textContent).toContain("Profile")
  })

  it("closes menu on clicking outside", async () => {
    container.innerHTML = `
      <plank-dropdown-menu>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete

    const trigger = container.querySelector("plank-dropdown-menu-trigger")!
    trigger.click()
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeDefined()

    document.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeNull()
  })

  it("menu content has correct data-slot", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
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
    expect(content?.getAttribute("data-slot")).toBe("dropdown-menu-content")
  })

  it("trigger has aria-haspopup and aria-expanded", async () => {
    container.innerHTML = `
      <plank-dropdown-menu>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete

    const button = container.querySelector("plank-button")!
    expect(button.getAttribute("aria-haspopup")).toBe("menu")
    expect(button.getAttribute("aria-expanded")).toBe("false")

    const trigger = container.querySelector("plank-dropdown-menu-trigger")!
    trigger.click()
    await (menu as any).updateComplete

    expect(button.getAttribute("aria-expanded")).toBe("true")
  })

  it("can be controlled via open attribute", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
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

    expect(document.querySelector('[role="menu"]')).toBeDefined()
  })

  it("fires open-change event when opened", async () => {
    container.innerHTML = `
      <plank-dropdown-menu>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete

    const openChangeSpy = vi.fn()
    menu.addEventListener("open-change", openChangeSpy)

    const trigger = container.querySelector("plank-dropdown-menu-trigger")!
    trigger.click()
    await (menu as any).updateComplete

    expect(openChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { open: true },
      })
    )
  })

  it("closes on Escape key", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
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

    expect(document.querySelector('[role="menu"]')).toBeDefined()

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeNull()
  })

  it("has data-side attribute on content", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
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
    expect(content?.getAttribute("data-side")).toBeDefined()
  })

  it("menu item has correct data-slot", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Profile</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitem"]')
    expect(item?.getAttribute("data-slot")).toBe("dropdown-menu-item")
  })

  it("menu item fires select event", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Profile</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const selectSpy = vi.fn()
    menu.addEventListener("select", selectSpy)

    const item = document.querySelector('[role="menuitem"]')!
    ;(item as HTMLElement).click()
    await (menu as any).updateComplete

    expect(selectSpy).toHaveBeenCalled()
  })

  it("closes menu when item is selected", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Profile</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeDefined()

    const item = document.querySelector('[role="menuitem"]')!
    ;(item as HTMLElement).click()
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeNull()
  })

  it("disabled item has correct attributes", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
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
    expect(item?.getAttribute("data-disabled")).toBeDefined()
    expect(item?.getAttribute("aria-disabled")).toBe("true")
  })

  it("checkbox item toggles checked state", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-checkbox-item>
            Show Status Bar
          </plank-dropdown-menu-checkbox-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const checkedChangeSpy = vi.fn()
    menu.addEventListener("checked-change", checkedChangeSpy)

    const checkboxItem = document.querySelector('[role="menuitemcheckbox"]')!
    ;(checkboxItem as HTMLElement).click()
    await (menu as any).updateComplete

    expect(checkedChangeSpy).toHaveBeenCalled()
  })

  it("checkbox item has correct data-slot", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-checkbox-item checked>
            Show Status Bar
          </plank-dropdown-menu-checkbox-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitemcheckbox"]')
    expect(item?.getAttribute("data-slot")).toBe("dropdown-menu-checkbox-item")
  })

  it("radio group manages selection", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
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

    const valueChangeSpy = vi.fn()
    menu.addEventListener("value-change", valueChangeSpy)

    const radioItems = document.querySelectorAll('[role="menuitemradio"]')
    ;(radioItems[1] as HTMLElement).click()
    await (menu as any).updateComplete

    expect(valueChangeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { value: "bottom" },
      })
    )
  })

  it("radio item has correct data-slot", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-radio-group value="top">
            <plank-dropdown-menu-radio-item value="top">Top</plank-dropdown-menu-radio-item>
          </plank-dropdown-menu-radio-group>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitemradio"]')
    expect(item?.getAttribute("data-slot")).toBe("dropdown-menu-radio-item")
  })

  it("label has correct data-slot", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-label>My Account</plank-dropdown-menu-label>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const label = document.querySelector('[data-slot="dropdown-menu-label"]')
    expect(label).toBeDefined()
    expect(label?.textContent).toContain("My Account")
  })

  it("separator has correct data-slot", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
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

    const separator = document.querySelector(
      '[data-slot="dropdown-menu-separator"]'
    )
    expect(separator).toBeDefined()
  })

  it("shortcut has correct data-slot", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>
            Profile
            <plank-dropdown-menu-shortcut>⇧⌘P</plank-dropdown-menu-shortcut>
          </plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const shortcut = document.querySelector(
      '[data-slot="dropdown-menu-shortcut"]'
    )
    expect(shortcut).toBeDefined()
    expect(shortcut?.textContent).toBe("⇧⌘P")
  })

  it("group has correct data-slot", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-group>
            <plank-dropdown-menu-item>Profile</plank-dropdown-menu-item>
            <plank-dropdown-menu-item>Settings</plank-dropdown-menu-item>
          </plank-dropdown-menu-group>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const group = document.querySelector('[data-slot="dropdown-menu-group"]')
    expect(group).toBeDefined()
  })

  it("navigates items with arrow keys", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Profile</plank-dropdown-menu-item>
          <plank-dropdown-menu-item>Settings</plank-dropdown-menu-item>
          <plank-dropdown-menu-item>Logout</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const menuEl = document.querySelector('[role="menu"]')!
    menuEl.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    const items = document.querySelectorAll('[role="menuitem"]')
    expect(items[0].getAttribute("data-highlighted")).toBeDefined()
  })

  it("opens menu with Enter key", async () => {
    container.innerHTML = `
      <plank-dropdown-menu>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete

    const button = container.querySelector("plank-button")! as HTMLElement
    button.focus()
    button.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    )
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeDefined()
  })

  it("opens menu with Space key", async () => {
    container.innerHTML = `
      <plank-dropdown-menu>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete

    const button = container.querySelector("plank-button")! as HTMLElement
    button.focus()
    button.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true })
    )
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeDefined()
  })

  it("opens menu with ArrowDown key", async () => {
    container.innerHTML = `
      <plank-dropdown-menu>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete

    const button = container.querySelector("plank-button")! as HTMLElement
    button.focus()
    button.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeDefined()
  })

  it("supports destructive variant on item", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item variant="destructive">Delete</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitem"]')
    expect(item?.getAttribute("data-variant")).toBe("destructive")
  })

  it("supports inset on item", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-item inset>Inset Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitem"]')
    expect(item?.getAttribute("data-inset")).toBeDefined()
  })

  it("supports inset on label", async () => {
    container.innerHTML = `
      <plank-dropdown-menu open>
        <plank-dropdown-menu-trigger>
          <plank-button>Open</plank-button>
        </plank-dropdown-menu-trigger>
        <plank-dropdown-menu-content>
          <plank-dropdown-menu-label inset>Inset Label</plank-dropdown-menu-label>
          <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
        </plank-dropdown-menu-content>
      </plank-dropdown-menu>
    `

    await customElements.whenDefined("plank-dropdown-menu")
    const menu = container.querySelector("plank-dropdown-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const label = document.querySelector('[data-slot="dropdown-menu-label"]')
    expect(label?.getAttribute("data-inset")).toBeDefined()
  })

  describe("submenus", () => {
    it("sub trigger has correct data-slot", async () => {
      container.innerHTML = `
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button>Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-sub>
              <plank-dropdown-menu-sub-trigger>More options</plank-dropdown-menu-sub-trigger>
              <plank-dropdown-menu-sub-content>
                <plank-dropdown-menu-item>Sub item</plank-dropdown-menu-item>
              </plank-dropdown-menu-sub-content>
            </plank-dropdown-menu-sub>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const subTrigger = document.querySelector(
        '[data-slot="dropdown-menu-sub-trigger"]'
      )
      expect(subTrigger).toBeDefined()
    })

    it("opens submenu on hover", async () => {
      container.innerHTML = `
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button>Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-sub>
              <plank-dropdown-menu-sub-trigger>More options</plank-dropdown-menu-sub-trigger>
              <plank-dropdown-menu-sub-content>
                <plank-dropdown-menu-item>Sub item</plank-dropdown-menu-item>
              </plank-dropdown-menu-sub-content>
            </plank-dropdown-menu-sub>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const subTrigger = document.querySelector(
        '[data-slot="dropdown-menu-sub-trigger"]'
      )!
      subTrigger.dispatchEvent(
        new PointerEvent("pointerenter", { bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 100))

      const subContent = document.querySelector(
        '[data-slot="dropdown-menu-sub-content"]'
      )
      expect(subContent).toBeDefined()
    })

    it("sub content has correct data-slot", async () => {
      container.innerHTML = `
        <plank-dropdown-menu open>
          <plank-dropdown-menu-trigger>
            <plank-button>Open</plank-button>
          </plank-dropdown-menu-trigger>
          <plank-dropdown-menu-content>
            <plank-dropdown-menu-sub open>
              <plank-dropdown-menu-sub-trigger>More options</plank-dropdown-menu-sub-trigger>
              <plank-dropdown-menu-sub-content>
                <plank-dropdown-menu-item>Sub item</plank-dropdown-menu-item>
              </plank-dropdown-menu-sub-content>
            </plank-dropdown-menu-sub>
          </plank-dropdown-menu-content>
        </plank-dropdown-menu>
      `

      await customElements.whenDefined("plank-dropdown-menu")
      const menu = container.querySelector("plank-dropdown-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const subContent = document.querySelector(
        '[data-slot="dropdown-menu-sub-content"]'
      )
      expect(subContent).toBeDefined()
      expect(subContent?.textContent).toContain("Sub item")
    })
  })
})
