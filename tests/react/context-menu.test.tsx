import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, waitFor, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/context-menu"

describe("ContextMenu (React)", () => {
  afterEach(() => {
    cleanup()
    document
      .querySelectorAll('[data-slot="context-menu-content"]')
      .forEach((el) => {
        el.remove()
      })
    document.querySelectorAll('[role="menu"]').forEach((el) => {
      el.remove()
    })
  })

  it("renders trigger with correct data-slot", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    const trigger = document.querySelector('[data-slot="context-menu-trigger"]')
    expect(trigger).toBeDefined()
  })

  it("menu content is hidden by default", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div>Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )
    const menu = screen.queryByRole("menu")
    expect(menu).toBeNull()
  })

  it("opens menu on right click (contextmenu event)", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Settings</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    // Simulate right-click via contextmenu event
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const menu = screen.getByRole("menu")
      expect(menu).toBeDefined()
      expect(menu.textContent).toContain("Profile")
    })
  })

  it("closes menu on clicking outside", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    // Simulate pointer down outside the menu
    document.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))

    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull()
    })
  })

  it("menu content has correct data-slot", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const content = screen.getByRole("menu")
      expect(content.dataset.slot).toBe("context-menu-content")
    })
  })

  it("fires onOpenChange when opened", async () => {
    const onOpenChange = vi.fn()
    render(
      <ContextMenu onOpenChange={onOpenChange}>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  it("closes on Escape key", async () => {
    const user = userEvent.setup()
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull()
    })
  })

  it("has data-side attribute on content", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const content = screen.getByRole("menu")
      expect(content.dataset.side).toBeDefined()
    })
  })

  it("menu item has correct data-slot", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const item = screen.getByRole("menuitem")
      expect(item.dataset.slot).toBe("context-menu-item")
    })
  })

  it("menu item fires onSelect", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onSelect={onSelect}>Profile</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    await user.click(screen.getByRole("menuitem"))

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalled()
    })
  })

  it("closes menu when item is selected", async () => {
    const user = userEvent.setup()
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    await user.click(screen.getByRole("menuitem"))

    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull()
    })
  })

  it("disabled item has correct attributes", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled>Disabled Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const item = screen.getByRole("menuitem")
      expect(item.dataset.disabled).toBeDefined()
    })
  })

  it("checkbox item toggles checked state", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Show Status Bar
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    const checkboxItem = screen.getByRole("menuitemcheckbox")
    await user.click(checkboxItem)

    await waitFor(() => {
      expect(onCheckedChange).toHaveBeenCalledWith(true)
    })
  })

  it("checkbox item has correct data-slot", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked={true}>
            Show Status Bar
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const item = screen.getByRole("menuitemcheckbox")
      expect(item.dataset.slot).toBe("context-menu-checkbox-item")
    })
  })

  it("radio group manages selection", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuRadioGroup value="top" onValueChange={onValueChange}>
            <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
            <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    const radioItems = screen.getAllByRole("menuitemradio")
    await user.click(radioItems[1])

    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("bottom")
    })
  })

  it("radio item has correct data-slot", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuRadioGroup value="top">
            <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const item = screen.getByRole("menuitemradio")
      expect(item.dataset.slot).toBe("context-menu-radio-item")
    })
  })

  it("label has correct data-slot", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel>My Account</ContextMenuLabel>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const label = document.querySelector('[data-slot="context-menu-label"]')
      expect(label).toBeDefined()
      expect(label?.textContent).toBe("My Account")
    })
  })

  it("separator has correct data-slot", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Item 1</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Item 2</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const separator = document.querySelector(
        '[data-slot="context-menu-separator"]'
      )
      expect(separator).toBeDefined()
    })
  })

  it("shortcut has correct data-slot", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Profile
            <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const shortcut = document.querySelector(
        '[data-slot="context-menu-shortcut"]'
      )
      expect(shortcut).toBeDefined()
      expect(shortcut?.textContent).toBe("⇧⌘P")
    })
  })

  it("group has correct data-slot", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuGroup>
            <ContextMenuItem>Profile</ContextMenuItem>
            <ContextMenuItem>Settings</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const group = document.querySelector('[data-slot="context-menu-group"]')
      expect(group).toBeDefined()
    })
  })

  it("navigates items with arrow keys", async () => {
    const user = userEvent.setup()
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Profile</ContextMenuItem>
          <ContextMenuItem>Settings</ContextMenuItem>
          <ContextMenuItem>Logout</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    await user.keyboard("{ArrowDown}")
    await user.keyboard("{ArrowDown}")

    await waitFor(() => {
      const items = screen.getAllByRole("menuitem")
      expect(items[1].getAttribute("data-highlighted")).toBeDefined()
    })
  })

  it("supports destructive variant on item", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const item = screen.getByRole("menuitem")
      expect(item.dataset.variant).toBe("destructive")
    })
  })

  it("supports inset on item", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem inset>Inset Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const item = screen.getByRole("menuitem")
      expect(item.dataset.inset).toBeDefined()
    })
  })

  it("supports inset on label", async () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>
          <div data-testid="trigger-area">Right click here</div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuLabel inset>Inset Label</ContextMenuLabel>
          <ContextMenuItem>Item</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    )

    const trigger = screen.getByTestId("trigger-area")
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: 100,
        clientY: 100,
      })
    )

    await waitFor(() => {
      const label = document.querySelector('[data-slot="context-menu-label"]')
      expect(label?.getAttribute("data-inset")).toBeDefined()
    })
  })

  describe("submenus", () => {
    it("sub trigger has correct data-slot", async () => {
      render(
        <ContextMenu>
          <ContextMenuTrigger>
            <div data-testid="trigger-area">Right click here</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuSub>
              <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Sub item</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      )

      const trigger = screen.getByTestId("trigger-area")
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 100,
          clientY: 100,
        })
      )

      await waitFor(() => {
        const subTrigger = document.querySelector(
          '[data-slot="context-menu-sub-trigger"]'
        )
        expect(subTrigger).toBeDefined()
      })
    })

    it("opens submenu on hover", async () => {
      const user = userEvent.setup()
      render(
        <ContextMenu>
          <ContextMenuTrigger>
            <div data-testid="trigger-area">Right click here</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuSub>
              <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Sub item</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      )

      const trigger = screen.getByTestId("trigger-area")
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 100,
          clientY: 100,
        })
      )

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeDefined()
      })

      const subTrigger = document.querySelector(
        '[data-slot="context-menu-sub-trigger"]'
      )!
      await user.hover(subTrigger)

      await waitFor(() => {
        const subContent = document.querySelector(
          '[data-slot="context-menu-sub-content"]'
        )
        expect(subContent).toBeDefined()
      })
    })

    it("sub content has correct data-slot", async () => {
      const user = userEvent.setup()
      render(
        <ContextMenu>
          <ContextMenuTrigger>
            <div data-testid="trigger-area">Right click here</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuSub>
              <ContextMenuSubTrigger>More options</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Sub item</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
          </ContextMenuContent>
        </ContextMenu>
      )

      const trigger = screen.getByTestId("trigger-area")
      trigger.dispatchEvent(
        new MouseEvent("contextmenu", {
          bubbles: true,
          clientX: 100,
          clientY: 100,
        })
      )

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeDefined()
      })

      const subTrigger = document.querySelector(
        '[data-slot="context-menu-sub-trigger"]'
      )!
      await user.hover(subTrigger)

      await waitFor(() => {
        const subContent = document.querySelector(
          '[data-slot="context-menu-sub-content"]'
        )
        expect(subContent).toBeDefined()
        expect(subContent?.textContent).toContain("Sub item")
      })
    })
  })
})
