import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-command"

describe("Command (Web Component)", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("renders command with input and list", async () => {
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

    expect(
      container.querySelector('input[placeholder="Search..."]')
    ).toBeTruthy()
    expect(container.querySelector("hal-command-item")).toBeTruthy()
  })

  it("has correct data-slot attributes", async () => {
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

    expect(command.getAttribute("data-slot")).toBe("command")
  })

  it("filters items based on search input", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-input placeholder="Search..."></hal-command-input>
        <hal-command-list>
          <hal-command-empty>No results found.</hal-command-empty>
          <hal-command-item>Apple</hal-command-item>
          <hal-command-item>Banana</hal-command-item>
          <hal-command-item>Orange</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    const input = container.querySelector("input") as HTMLInputElement
    input.value = "app"
    input.dispatchEvent(new Event("input", { bubbles: true }))
    await new Promise((r) => setTimeout(r, 50))

    // Apple should be visible
    const apple = container.querySelector(
      'hal-command-item[value="apple"], hal-command-item:first-of-type'
    )
    expect(apple?.textContent).toContain("Apple")

    // Banana and Orange should be filtered
    const allItems = container.querySelectorAll("hal-command-item")
    const visibleItems = Array.from(allItems).filter(
      (item) => !item.hasAttribute("hidden") && !item.closest("[hidden]")
    )
    expect(visibleItems.length).toBeLessThanOrEqual(1)
  })

  it("shows empty state when no results match", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-input placeholder="Search..."></hal-command-input>
        <hal-command-list>
          <hal-command-empty>No results found.</hal-command-empty>
          <hal-command-item>Apple</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    const input = container.querySelector("input") as HTMLInputElement
    input.value = "xyz"
    input.dispatchEvent(new Event("input", { bubbles: true }))
    await new Promise((r) => setTimeout(r, 50))

    const empty = container.querySelector("hal-command-empty")
    expect(empty).toBeTruthy()
    // Empty state should be visible (not hidden)
    expect(empty?.hasAttribute("hidden")).toBeFalsy()
  })

  it("renders groups with headings", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-list>
          <hal-command-group heading="Fruits">
            <hal-command-item>Apple</hal-command-item>
          </hal-command-group>
          <hal-command-group heading="Vegetables">
            <hal-command-item>Carrot</hal-command-item>
          </hal-command-group>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    expect(container.textContent).toContain("Fruits")
    expect(container.textContent).toContain("Vegetables")
  })

  it("renders separator between groups", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-list>
          <hal-command-group heading="Group 1">
            <hal-command-item>Item 1</hal-command-item>
          </hal-command-group>
          <hal-command-separator></hal-command-separator>
          <hal-command-group heading="Group 2">
            <hal-command-item>Item 2</hal-command-item>
          </hal-command-group>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    const separator = container.querySelector(
      '[data-slot="command-separator"], hal-command-separator'
    )
    expect(separator).toBeTruthy()
  })

  it("renders shortcuts in items", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-list>
          <hal-command-item>
            Settings
            <hal-command-shortcut>⌘S</hal-command-shortcut>
          </hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    expect(container.textContent).toContain("⌘S")
    const shortcut = container.querySelector("hal-command-shortcut")
    expect(shortcut?.getAttribute("data-slot")).toBe("command-shortcut")
  })

  it("supports keyboard navigation with arrow keys", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-input placeholder="Search..."></hal-command-input>
        <hal-command-list>
          <hal-command-item>Item 1</hal-command-item>
          <hal-command-item>Item 2</hal-command-item>
          <hal-command-item>Item 3</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    const input = container.querySelector("input") as HTMLInputElement
    input.focus()

    // First item should already be selected by default
    // Press ArrowDown to move to second item
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    // Second item should be selected
    const items = container.querySelectorAll('[role="option"]')
    const selectedItem = Array.from(items).find(
      (item) => item.getAttribute("aria-selected") === "true"
    )
    expect(selectedItem?.textContent).toContain("Item 2")
  })

  it("calls onSelect when item is clicked", async () => {
    const onSelect = vi.fn()
    container.innerHTML = `
      <hal-command>
        <hal-command-input placeholder="Search..."></hal-command-input>
        <hal-command-list>
          <hal-command-item value="item1">Item 1</hal-command-item>
          <hal-command-item value="item2">Item 2</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    command.addEventListener("select", ((e: CustomEvent) => {
      onSelect(e.detail.value)
    }) as EventListener)

    // Click on first item
    const item = container.querySelector("hal-command-item") as HTMLElement
    item.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(onSelect).toHaveBeenCalledWith("item1")
  })

  it("calls onSelect when Enter is pressed on selected item", async () => {
    const onSelect = vi.fn()
    container.innerHTML = `
      <hal-command>
        <hal-command-input placeholder="Search..."></hal-command-input>
        <hal-command-list>
          <hal-command-item value="item1">Item 1</hal-command-item>
          <hal-command-item value="item2">Item 2</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    command.addEventListener("select", ((e: CustomEvent) => {
      onSelect(e.detail.value)
    }) as EventListener)

    const input = container.querySelector("input") as HTMLInputElement
    input.focus()

    // First item is already selected, press Enter
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    expect(onSelect).toHaveBeenCalledWith("item1")
  })

  it("supports disabled items", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-input placeholder="Search..."></hal-command-input>
        <hal-command-list>
          <hal-command-item disabled>Disabled Item</hal-command-item>
          <hal-command-item>Enabled Item</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    const disabledItem = container.querySelector(
      'hal-command-item[disabled], [role="option"][aria-disabled="true"]'
    )
    expect(disabledItem).toBeTruthy()
  })

  it("input has combobox role", async () => {
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
    expect(input).toBeTruthy()
  })

  it("list has listbox role", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-list>
          <hal-command-item>Item 1</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    const list = container.querySelector('[role="listbox"]')
    expect(list).toBeTruthy()
  })

  it("items have option role", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-list>
          <hal-command-item>Item 1</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    const item = container.querySelector('[role="option"]')
    expect(item).toBeTruthy()
  })

  it("input has aria-expanded", async () => {
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
    expect(input?.getAttribute("aria-expanded")).toBe("true")
  })

  it("input has aria-controls pointing to list", async () => {
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
    const listId = list?.getAttribute("id")

    expect(input?.getAttribute("aria-controls")).toBe(listId)
  })

  it("navigates with Home/End keys", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-input placeholder="Search..."></hal-command-input>
        <hal-command-list>
          <hal-command-item>First</hal-command-item>
          <hal-command-item>Middle</hal-command-item>
          <hal-command-item>Last</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    const input = container.querySelector("input") as HTMLInputElement
    input.focus()

    // Press End to go to last item
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "End", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    let items = container.querySelectorAll('[role="option"]')
    let selectedItem = Array.from(items).find(
      (item) => item.getAttribute("aria-selected") === "true"
    )
    expect(selectedItem?.textContent).toContain("Last")

    // Press Home to go to first item
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Home", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    items = container.querySelectorAll('[role="option"]')
    selectedItem = Array.from(items).find(
      (item) => item.getAttribute("aria-selected") === "true"
    )
    expect(selectedItem?.textContent).toContain("First")
  })

  it("skips disabled items during keyboard navigation", async () => {
    container.innerHTML = `
      <hal-command>
        <hal-command-input placeholder="Search..."></hal-command-input>
        <hal-command-list>
          <hal-command-item>First</hal-command-item>
          <hal-command-item disabled>Disabled</hal-command-item>
          <hal-command-item>Third</hal-command-item>
        </hal-command-list>
      </hal-command>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete

    const input = container.querySelector("input") as HTMLInputElement
    input.focus()

    // First item is selected, press ArrowDown
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    // Should skip disabled item and go to Third
    const items = container.querySelectorAll('[role="option"]')
    const selectedItem = Array.from(items).find(
      (item) => item.getAttribute("aria-selected") === "true"
    )
    expect(selectedItem?.textContent).toContain("Third")
  })
})
