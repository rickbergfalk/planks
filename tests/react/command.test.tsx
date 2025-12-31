import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/command"

describe("Command (React)", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("renders command with input and list", () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByPlaceholderText("Search...")).toBeTruthy()
    expect(screen.getByText("Item 1")).toBeTruthy()
  })

  it("has correct data-slot attributes", () => {
    render(
      <Command data-testid="command">
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
        </CommandList>
      </Command>
    )

    const command = screen.getByTestId("command")
    expect(command.getAttribute("data-slot")).toBe("command")
  })

  it("filters items based on search input", async () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Apple</CommandItem>
          <CommandItem>Banana</CommandItem>
          <CommandItem>Orange</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search...")
    fireEvent.change(input, { target: { value: "app" } })

    // Apple should be visible, others filtered out
    await new Promise((r) => setTimeout(r, 50))
    expect(screen.getByText("Apple")).toBeTruthy()
    // Banana and Orange should be filtered (aria-hidden or not rendered)
    const banana = screen.queryByText("Banana")
    const orange = screen.queryByText("Orange")
    // cmdk filters items by hiding them with aria-hidden
    expect(
      !banana ||
        banana.closest('[aria-hidden="true"]') ||
        banana.closest("[hidden]")
    ).toBeTruthy()
    expect(
      !orange ||
        orange.closest('[aria-hidden="true"]') ||
        orange.closest("[hidden]")
    ).toBeTruthy()
  })

  it("shows empty state when no results match", async () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandItem>Apple</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search...")
    fireEvent.change(input, { target: { value: "xyz" } })

    await new Promise((r) => setTimeout(r, 50))
    expect(screen.getByText("No results found.")).toBeTruthy()
  })

  it("renders groups with headings", () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Fruits">
            <CommandItem>Apple</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Vegetables">
            <CommandItem>Carrot</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    expect(screen.getByText("Fruits")).toBeTruthy()
    expect(screen.getByText("Vegetables")).toBeTruthy()
  })

  it("renders separator between groups", () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandGroup heading="Group 1">
            <CommandItem>Item 1</CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Group 2">
            <CommandItem>Item 2</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    )

    const separator = container.querySelector('[data-slot="command-separator"]')
    expect(separator).toBeTruthy()
  })

  it("renders shortcuts in items", () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>
            Settings
            <CommandShortcut>⌘S</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    )

    expect(screen.getByText("⌘S")).toBeTruthy()
    const shortcut = screen.getByText("⌘S")
    expect(shortcut.getAttribute("data-slot")).toBe("command-shortcut")
  })

  it("supports keyboard navigation with arrow keys", async () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
          <CommandItem>Item 2</CommandItem>
          <CommandItem>Item 3</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search...")
    input.focus()

    // First item is already selected by default in cmdk
    // Press ArrowDown to move to second item
    fireEvent.keyDown(input, { key: "ArrowDown" })
    await new Promise((r) => setTimeout(r, 50))

    // Second item should now be selected
    const item2 = screen.getByText("Item 2").closest('[cmdk-item=""]')
    expect(item2?.getAttribute("aria-selected")).toBe("true")
  })

  it("calls onSelect when item is selected with Enter", async () => {
    const onSelect = vi.fn()
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem onSelect={() => onSelect("item1")}>Item 1</CommandItem>
          <CommandItem onSelect={() => onSelect("item2")}>Item 2</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search...")
    input.focus()

    // First item is already selected by default in cmdk
    // Just press Enter to select the currently selected item
    fireEvent.keyDown(input, { key: "Enter" })
    await new Promise((r) => setTimeout(r, 50))

    expect(onSelect).toHaveBeenCalledWith("item1")
  })

  it("supports disabled items", async () => {
    const onSelect = vi.fn()
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem disabled onSelect={() => onSelect("disabled")}>
            Disabled Item
          </CommandItem>
          <CommandItem onSelect={() => onSelect("enabled")}>
            Enabled Item
          </CommandItem>
        </CommandList>
      </Command>
    )

    const disabledItem = screen
      .getByText("Disabled Item")
      .closest('[cmdk-item=""]')
    expect(disabledItem?.getAttribute("aria-disabled")).toBe("true")
  })

  it("input has combobox role", () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search...")
    expect(input.getAttribute("role")).toBe("combobox")
  })

  it("list has listbox role", () => {
    const { container } = render(
      <Command>
        <CommandList>
          <CommandItem>Item 1</CommandItem>
        </CommandList>
      </Command>
    )

    const list = container.querySelector('[cmdk-list=""]')
    expect(list?.getAttribute("role")).toBe("listbox")
  })

  it("items have option role", () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>Item 1</CommandItem>
        </CommandList>
      </Command>
    )

    const item = screen.getByText("Item 1").closest('[cmdk-item=""]')
    expect(item?.getAttribute("role")).toBe("option")
  })

  it("input has aria-expanded", () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search...")
    expect(input.getAttribute("aria-expanded")).toBe("true")
  })

  it("input has aria-controls pointing to list", () => {
    const { container } = render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>Item 1</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search...")
    const list = container.querySelector('[cmdk-list=""]')
    const listId = list?.getAttribute("id")

    expect(input.getAttribute("aria-controls")).toBe(listId)
  })

  it("navigates with Home/End keys", async () => {
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandItem>First</CommandItem>
          <CommandItem>Middle</CommandItem>
          <CommandItem>Last</CommandItem>
        </CommandList>
      </Command>
    )

    const input = screen.getByPlaceholderText("Search...")
    input.focus()

    // Press End to go to last item
    fireEvent.keyDown(input, { key: "End" })
    await new Promise((r) => setTimeout(r, 50))

    const lastItem = screen.getByText("Last").closest('[cmdk-item=""]')
    expect(lastItem?.getAttribute("aria-selected")).toBe("true")

    // Press Home to go to first item
    fireEvent.keyDown(input, { key: "Home" })
    await new Promise((r) => setTimeout(r, 50))

    const firstItem = screen.getByText("First").closest('[cmdk-item=""]')
    expect(firstItem?.getAttribute("aria-selected")).toBe("true")
  })

  describe("CommandDialog", () => {
    it("renders dialog when open", () => {
      render(
        <CommandDialog open={true}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </CommandDialog>
      )

      expect(screen.getByPlaceholderText("Search...")).toBeTruthy()
    })

    it("does not render content when closed", () => {
      render(
        <CommandDialog open={false}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </CommandDialog>
      )

      expect(screen.queryByPlaceholderText("Search...")).toBeNull()
    })

    it("calls onOpenChange when dialog is closed", async () => {
      const onOpenChange = vi.fn()
      render(
        <CommandDialog open={true} onOpenChange={onOpenChange}>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandItem>Item 1</CommandItem>
          </CommandList>
        </CommandDialog>
      )

      // Press Escape to close
      fireEvent.keyDown(document, { key: "Escape" })
      await new Promise((r) => setTimeout(r, 50))

      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })
})
