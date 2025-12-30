import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-context-menu"

describe("ContextMenu (Web Component)", () => {
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
      <plank-context-menu>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const trigger = container.querySelector("plank-context-menu-trigger")
    expect(trigger?.dataset.slot).toBe("context-menu-trigger")
  })

  it("menu content is hidden by default", async () => {
    container.innerHTML = `
      <plank-context-menu>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete

    const menuContent = document.querySelector('[role="menu"]')
    expect(menuContent).toBeNull()
  })

  it("opens menu on right click (contextmenu event)", async () => {
    container.innerHTML = `
      <plank-context-menu>
        <plank-context-menu-trigger>
          <div data-testid="trigger-area">Right click here</div>
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

    const trigger = container.querySelector('[data-testid="trigger-area"]')!
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const menuContent = document.querySelector('[role="menu"]')
    expect(menuContent).toBeTruthy()
    expect(menuContent?.textContent).toContain("Profile")
  })

  it("closes menu on clicking outside", async () => {
    container.innerHTML = `
      <plank-context-menu>
        <plank-context-menu-trigger>
          <div data-testid="trigger-area">Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete

    const trigger = container.querySelector('[data-testid="trigger-area"]')!
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeTruthy()

    // Simulate pointer down outside the menu
    document.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeNull()
  })

  it("menu content has correct data-slot", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="menu"]')
    expect(content?.getAttribute("data-slot")).toBe("context-menu-content")
  })

  it("fires open-change event when opened", async () => {
    container.innerHTML = `
      <plank-context-menu>
        <plank-context-menu-trigger>
          <div data-testid="trigger-area">Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete

    const onOpenChange = vi.fn()
    menu.addEventListener("open-change", (e: Event) => {
      onOpenChange((e as CustomEvent).detail.open)
    })

    const trigger = container.querySelector('[data-testid="trigger-area"]')!
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("closes on Escape key", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeTruthy()

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeNull()
  })

  it("has data-side attribute on content", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="menu"]')
    expect(content?.getAttribute("data-side")).toBeDefined()
  })

  it("menu item has correct data-slot", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Profile</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitem"]')
    expect(item?.getAttribute("data-slot")).toBe("context-menu-item")
  })

  it("menu item fires select event", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Profile</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const onSelect = vi.fn()
    menu.addEventListener("select", onSelect)

    const item = document.querySelector('[role="menuitem"]') as HTMLElement
    item.click()

    await (menu as any).updateComplete
    expect(onSelect).toHaveBeenCalled()
  })

  it("closes menu when item is selected", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Profile</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeTruthy()

    const item = document.querySelector('[role="menuitem"]') as HTMLElement
    item.click()

    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    expect(document.querySelector('[role="menu"]')).toBeNull()
  })

  it("disabled item has correct attributes", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item disabled>Disabled Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitem"]')
    expect(item?.getAttribute("aria-disabled")).toBe("true")
  })

  it("checkbox item toggles checked state", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-checkbox-item>Show Status Bar</plank-context-menu-checkbox-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const onCheckedChange = vi.fn()
    menu.addEventListener("checked-change", (e: Event) => {
      onCheckedChange((e as CustomEvent).detail.checked)
    })

    const checkboxItem = document.querySelector(
      '[role="menuitemcheckbox"]'
    ) as HTMLElement
    checkboxItem.click()

    await (menu as any).updateComplete
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it("checkbox item has correct data-slot", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-checkbox-item checked>Show Status Bar</plank-context-menu-checkbox-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitemcheckbox"]')
    expect(item?.getAttribute("data-slot")).toBe("context-menu-checkbox-item")
  })

  it("radio group manages selection", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
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
    await new Promise((r) => setTimeout(r, 50))

    const onValueChange = vi.fn()
    menu.addEventListener("value-change", (e: Event) => {
      onValueChange((e as CustomEvent).detail.value)
    })

    const radioItems = document.querySelectorAll('[role="menuitemradio"]')
    ;(radioItems[1] as HTMLElement).click()

    await (menu as any).updateComplete
    expect(onValueChange).toHaveBeenCalledWith("bottom")
  })

  it("radio item has correct data-slot", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-radio-group value="top">
            <plank-context-menu-radio-item value="top">Top</plank-context-menu-radio-item>
          </plank-context-menu-radio-group>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitemradio"]')
    expect(item?.getAttribute("data-slot")).toBe("context-menu-radio-item")
  })

  it("label has correct data-slot", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-label>My Account</plank-context-menu-label>
          <plank-context-menu-item>Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const label = document.querySelector('[data-slot="context-menu-label"]')
    expect(label).toBeTruthy()
    expect(label?.textContent).toBe("My Account")
  })

  it("separator has correct data-slot", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
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
    await new Promise((r) => setTimeout(r, 50))

    const separator = document.querySelector(
      '[data-slot="context-menu-separator"]'
    )
    expect(separator).toBeTruthy()
  })

  it("shortcut has correct data-slot", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>
            Profile
            <plank-context-menu-shortcut>⇧⌘P</plank-context-menu-shortcut>
          </plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const shortcut = document.querySelector(
      '[data-slot="context-menu-shortcut"]'
    )
    expect(shortcut).toBeTruthy()
    expect(shortcut?.textContent).toBe("⇧⌘P")
  })

  it("group has correct data-slot", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-group>
            <plank-context-menu-item>Profile</plank-context-menu-item>
            <plank-context-menu-item>Settings</plank-context-menu-item>
          </plank-context-menu-group>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const group = document.querySelector('[data-slot="context-menu-group"]')
    expect(group).toBeTruthy()
  })

  it("navigates items with arrow keys", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item>Profile</plank-context-menu-item>
          <plank-context-menu-item>Settings</plank-context-menu-item>
          <plank-context-menu-item>Logout</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }))
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }))

    await (menu as any).updateComplete

    const items = document.querySelectorAll('[role="menuitem"]')
    expect(items[1].getAttribute("data-highlighted")).toBeDefined()
  })

  it("supports destructive variant on item", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item variant="destructive">Delete</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitem"]')
    expect(item?.getAttribute("data-variant")).toBe("destructive")
  })

  it("supports inset on item", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-item inset>Inset Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const item = document.querySelector('[role="menuitem"]')
    expect(item?.getAttribute("data-inset")).toBeDefined()
  })

  it("supports inset on label", async () => {
    container.innerHTML = `
      <plank-context-menu open>
        <plank-context-menu-trigger>
          <div>Right click here</div>
        </plank-context-menu-trigger>
        <plank-context-menu-content>
          <plank-context-menu-label inset>Inset Label</plank-context-menu-label>
          <plank-context-menu-item>Item</plank-context-menu-item>
        </plank-context-menu-content>
      </plank-context-menu>
    `

    await customElements.whenDefined("plank-context-menu")
    const menu = container.querySelector("plank-context-menu")!
    await (menu as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const label = document.querySelector('[data-slot="context-menu-label"]')
    expect(label?.getAttribute("data-inset")).toBeDefined()
  })

  describe("submenus", () => {
    it("sub trigger has correct data-slot", async () => {
      container.innerHTML = `
        <plank-context-menu open>
          <plank-context-menu-trigger>
            <div>Right click here</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-sub>
              <plank-context-menu-sub-trigger>More options</plank-context-menu-sub-trigger>
              <plank-context-menu-sub-content>
                <plank-context-menu-item>Sub item</plank-context-menu-item>
              </plank-context-menu-sub-content>
            </plank-context-menu-sub>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const subTrigger = document.querySelector(
        '[data-slot="context-menu-sub-trigger"]'
      )
      expect(subTrigger).toBeTruthy()
    })

    it("opens submenu on hover", async () => {
      container.innerHTML = `
        <plank-context-menu open>
          <plank-context-menu-trigger>
            <div>Right click here</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-sub>
              <plank-context-menu-sub-trigger>More options</plank-context-menu-sub-trigger>
              <plank-context-menu-sub-content>
                <plank-context-menu-item>Sub item</plank-context-menu-item>
              </plank-context-menu-sub-content>
            </plank-context-menu-sub>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const subTrigger = document.querySelector(
        '[data-slot="context-menu-sub-trigger"]'
      )!
      subTrigger.dispatchEvent(
        new PointerEvent("pointerenter", { bubbles: true })
      )

      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const subContent = document.querySelector(
        '[data-slot="context-menu-sub-content"]'
      )
      expect(subContent).toBeTruthy()
    })

    it("sub content has correct data-slot", async () => {
      container.innerHTML = `
        <plank-context-menu open>
          <plank-context-menu-trigger>
            <div>Right click here</div>
          </plank-context-menu-trigger>
          <plank-context-menu-content>
            <plank-context-menu-sub open>
              <plank-context-menu-sub-trigger>More options</plank-context-menu-sub-trigger>
              <plank-context-menu-sub-content>
                <plank-context-menu-item>Sub item</plank-context-menu-item>
              </plank-context-menu-sub-content>
            </plank-context-menu-sub>
          </plank-context-menu-content>
        </plank-context-menu>
      `

      await customElements.whenDefined("plank-context-menu")
      const menu = container.querySelector("plank-context-menu")!
      await (menu as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const subContent = document.querySelector(
        '[data-slot="context-menu-sub-content"]'
      )
      expect(subContent).toBeTruthy()
      expect(subContent?.textContent).toContain("Sub item")
    })
  })
})
