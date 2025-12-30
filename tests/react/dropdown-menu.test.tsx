import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, waitFor, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/dropdown-menu"
import { Button } from "@/components/button"

describe("DropdownMenu (React)", () => {
  afterEach(() => {
    cleanup()
    document
      .querySelectorAll('[data-slot="dropdown-menu-content"]')
      .forEach((el) => {
        el.remove()
      })
    document.querySelectorAll('[role="menu"]').forEach((el) => {
      el.remove()
    })
  })

  it("renders trigger with correct data-slot", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const trigger = screen.getByRole("button")
    expect(trigger).toBeDefined()
    expect(trigger.dataset.slot).toBe("dropdown-menu-trigger")
  })

  it("menu content is hidden by default", () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
    const menu = screen.queryByRole("menu")
    expect(menu).toBeNull()
  })

  it("opens menu on click", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByRole("button")
    await user.click(trigger)

    await waitFor(() => {
      const menu = screen.getByRole("menu")
      expect(menu).toBeDefined()
      expect(menu.textContent).toContain("Profile")
    })
  })

  it("closes menu on clicking outside", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByRole("button")
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    // Simulate pointer down outside the menu using native event
    // Radix uses pointer-events-none on overlay, so we dispatch directly
    document.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))

    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull()
    })
  })

  it("menu content has correct data-slot", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const content = screen.getByRole("menu")
      expect(content.dataset.slot).toBe("dropdown-menu-content")
    })
  })

  it("trigger has aria-haspopup and aria-expanded", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByRole("button")
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu")
    expect(trigger.getAttribute("aria-expanded")).toBe("false")

    await user.click(trigger)

    await waitFor(() => {
      expect(trigger.getAttribute("aria-expanded")).toBe("true")
    })
  })

  it("can be controlled via open prop", async () => {
    render(
      <DropdownMenu open={true}>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })
  })

  it("fires onOpenChange when opened", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <DropdownMenu onOpenChange={onOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  it("closes on Escape key", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull()
    })
  })

  it("has data-side attribute on content", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const content = screen.getByRole("menu")
      expect(content.dataset.side).toBeDefined()
    })
  })

  it("menu item has correct data-slot", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const item = screen.getByRole("menuitem")
      expect(item.dataset.slot).toBe("dropdown-menu-item")
    })
  })

  it("menu item fires onClick", async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onClick}>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    await user.click(screen.getByRole("menuitem"))

    await waitFor(() => {
      expect(onClick).toHaveBeenCalled()
    })
  })

  it("closes menu when item is selected", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })

    await user.click(screen.getByRole("menuitem"))

    await waitFor(() => {
      expect(screen.queryByRole("menu")).toBeNull()
    })
  })

  it("disabled item has correct attributes", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const item = screen.getByRole("menuitem")
      expect(item.dataset.disabled).toBeDefined()
    })
  })

  it("checkbox item toggles checked state", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem
            checked={false}
            onCheckedChange={onCheckedChange}
          >
            Show Status Bar
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

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
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked={true}>
            Show Status Bar
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const item = screen.getByRole("menuitemcheckbox")
      expect(item.dataset.slot).toBe("dropdown-menu-checkbox-item")
    })
  })

  it("radio group manages selection", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="top" onValueChange={onValueChange}>
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

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
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="top">
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const item = screen.getByRole("menuitemradio")
      expect(item.dataset.slot).toBe("dropdown-menu-radio-item")
    })
  })

  it("label has correct data-slot", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const label = document.querySelector('[data-slot="dropdown-menu-label"]')
      expect(label).toBeDefined()
      expect(label?.textContent).toBe("My Account")
    })
  })

  it("separator has correct data-slot", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Item 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const separator = document.querySelector(
        '[data-slot="dropdown-menu-separator"]'
      )
      expect(separator).toBeDefined()
    })
  })

  it("shortcut has correct data-slot", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const shortcut = document.querySelector(
        '[data-slot="dropdown-menu-shortcut"]'
      )
      expect(shortcut).toBeDefined()
      expect(shortcut?.textContent).toBe("⇧⌘P")
    })
  })

  it("group has correct data-slot", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const group = document.querySelector('[data-slot="dropdown-menu-group"]')
      expect(group).toBeDefined()
    })
  })

  it("navigates items with arrow keys", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

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

  it("opens menu with Enter key", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByRole("button")
    trigger.focus()
    await user.keyboard("{Enter}")

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })
  })

  it("opens menu with Space key", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByRole("button")
    trigger.focus()
    await user.keyboard(" ")

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })
  })

  it("opens menu with ArrowDown key", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    const trigger = screen.getByRole("button")
    trigger.focus()
    await user.keyboard("{ArrowDown}")

    await waitFor(() => {
      expect(screen.getByRole("menu")).toBeDefined()
    })
  })

  it("supports destructive variant on item", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const item = screen.getByRole("menuitem")
      expect(item.dataset.variant).toBe("destructive")
    })
  })

  it("supports inset on item", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem inset>Inset Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const item = screen.getByRole("menuitem")
      expect(item.dataset.inset).toBeDefined()
    })
  })

  it("supports inset on label", async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>Open</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel inset>Inset Label</DropdownMenuLabel>
          <DropdownMenuItem>Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const label = document.querySelector('[data-slot="dropdown-menu-label"]')
      expect(label?.getAttribute("data-inset")).toBeDefined()
    })
  })

  describe("submenus", () => {
    it("sub trigger has correct data-slot", async () => {
      const user = userEvent.setup()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole("button"))

      await waitFor(() => {
        const subTrigger = document.querySelector(
          '[data-slot="dropdown-menu-sub-trigger"]'
        )
        expect(subTrigger).toBeDefined()
      })
    })

    it("opens submenu on hover", async () => {
      const user = userEvent.setup()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole("button"))

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeDefined()
      })

      const subTrigger = document.querySelector(
        '[data-slot="dropdown-menu-sub-trigger"]'
      )!
      await user.hover(subTrigger)

      await waitFor(() => {
        const subContent = document.querySelector(
          '[data-slot="dropdown-menu-sub-content"]'
        )
        expect(subContent).toBeDefined()
      })
    })

    it("sub content has correct data-slot", async () => {
      const user = userEvent.setup()
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      )

      await user.click(screen.getByRole("button"))

      await waitFor(() => {
        expect(screen.getByRole("menu")).toBeDefined()
      })

      const subTrigger = document.querySelector(
        '[data-slot="dropdown-menu-sub-trigger"]'
      )!
      await user.hover(subTrigger)

      await waitFor(() => {
        const subContent = document.querySelector(
          '[data-slot="dropdown-menu-sub-content"]'
        )
        expect(subContent).toBeDefined()
        expect(subContent?.textContent).toContain("Sub item")
      })
    })
  })
})
