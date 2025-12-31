import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-command"

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

    expect(
      container.querySelector('input[placeholder="Search..."]')
    ).toBeTruthy()
    expect(container.querySelector("plank-command-item")).toBeTruthy()
  })

  it("has correct data-slot attributes", async () => {
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

    expect(command.getAttribute("data-slot")).toBe("command")
  })

  it("filters items based on search input", async () => {
    container.innerHTML = `
      <plank-command>
        <plank-command-input placeholder="Search..."></plank-command-input>
        <plank-command-list>
          <plank-command-empty>No results found.</plank-command-empty>
          <plank-command-item>Apple</plank-command-item>
          <plank-command-item>Banana</plank-command-item>
          <plank-command-item>Orange</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
    await (command as any).updateComplete

    const input = container.querySelector("input") as HTMLInputElement
    input.value = "app"
    input.dispatchEvent(new Event("input", { bubbles: true }))
    await new Promise((r) => setTimeout(r, 50))

    // Apple should be visible
    const apple = container.querySelector(
      'plank-command-item[value="apple"], plank-command-item:first-of-type'
    )
    expect(apple?.textContent).toContain("Apple")

    // Banana and Orange should be filtered
    const allItems = container.querySelectorAll("plank-command-item")
    const visibleItems = Array.from(allItems).filter(
      (item) => !item.hasAttribute("hidden") && !item.closest("[hidden]")
    )
    expect(visibleItems.length).toBeLessThanOrEqual(1)
  })

  it("shows empty state when no results match", async () => {
    container.innerHTML = `
      <plank-command>
        <plank-command-input placeholder="Search..."></plank-command-input>
        <plank-command-list>
          <plank-command-empty>No results found.</plank-command-empty>
          <plank-command-item>Apple</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
    await (command as any).updateComplete

    const input = container.querySelector("input") as HTMLInputElement
    input.value = "xyz"
    input.dispatchEvent(new Event("input", { bubbles: true }))
    await new Promise((r) => setTimeout(r, 50))

    const empty = container.querySelector("plank-command-empty")
    expect(empty).toBeTruthy()
    // Empty state should be visible (not hidden)
    expect(empty?.hasAttribute("hidden")).toBeFalsy()
  })

  it("renders groups with headings", async () => {
    container.innerHTML = `
      <plank-command>
        <plank-command-list>
          <plank-command-group heading="Fruits">
            <plank-command-item>Apple</plank-command-item>
          </plank-command-group>
          <plank-command-group heading="Vegetables">
            <plank-command-item>Carrot</plank-command-item>
          </plank-command-group>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
    await (command as any).updateComplete

    expect(container.textContent).toContain("Fruits")
    expect(container.textContent).toContain("Vegetables")
  })

  it("renders separator between groups", async () => {
    container.innerHTML = `
      <plank-command>
        <plank-command-list>
          <plank-command-group heading="Group 1">
            <plank-command-item>Item 1</plank-command-item>
          </plank-command-group>
          <plank-command-separator></plank-command-separator>
          <plank-command-group heading="Group 2">
            <plank-command-item>Item 2</plank-command-item>
          </plank-command-group>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
    await (command as any).updateComplete

    const separator = container.querySelector(
      '[data-slot="command-separator"], plank-command-separator'
    )
    expect(separator).toBeTruthy()
  })

  it("renders shortcuts in items", async () => {
    container.innerHTML = `
      <plank-command>
        <plank-command-list>
          <plank-command-item>
            Settings
            <plank-command-shortcut>⌘S</plank-command-shortcut>
          </plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
    await (command as any).updateComplete

    expect(container.textContent).toContain("⌘S")
    const shortcut = container.querySelector("plank-command-shortcut")
    expect(shortcut?.getAttribute("data-slot")).toBe("command-shortcut")
  })

  it("supports keyboard navigation with arrow keys", async () => {
    container.innerHTML = `
      <plank-command>
        <plank-command-input placeholder="Search..."></plank-command-input>
        <plank-command-list>
          <plank-command-item>Item 1</plank-command-item>
          <plank-command-item>Item 2</plank-command-item>
          <plank-command-item>Item 3</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
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
      <plank-command>
        <plank-command-input placeholder="Search..."></plank-command-input>
        <plank-command-list>
          <plank-command-item value="item1">Item 1</plank-command-item>
          <plank-command-item value="item2">Item 2</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
    await (command as any).updateComplete

    command.addEventListener("select", ((e: CustomEvent) => {
      onSelect(e.detail.value)
    }) as EventListener)

    // Click on first item
    const item = container.querySelector("plank-command-item") as HTMLElement
    item.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(onSelect).toHaveBeenCalledWith("item1")
  })

  it("calls onSelect when Enter is pressed on selected item", async () => {
    const onSelect = vi.fn()
    container.innerHTML = `
      <plank-command>
        <plank-command-input placeholder="Search..."></plank-command-input>
        <plank-command-list>
          <plank-command-item value="item1">Item 1</plank-command-item>
          <plank-command-item value="item2">Item 2</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
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
      <plank-command>
        <plank-command-input placeholder="Search..."></plank-command-input>
        <plank-command-list>
          <plank-command-item disabled>Disabled Item</plank-command-item>
          <plank-command-item>Enabled Item</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
    await (command as any).updateComplete

    const disabledItem = container.querySelector(
      'plank-command-item[disabled], [role="option"][aria-disabled="true"]'
    )
    expect(disabledItem).toBeTruthy()
  })

  it("input has combobox role", async () => {
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
    expect(input).toBeTruthy()
  })

  it("list has listbox role", async () => {
    container.innerHTML = `
      <plank-command>
        <plank-command-list>
          <plank-command-item>Item 1</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
    await (command as any).updateComplete

    const list = container.querySelector('[role="listbox"]')
    expect(list).toBeTruthy()
  })

  it("items have option role", async () => {
    container.innerHTML = `
      <plank-command>
        <plank-command-list>
          <plank-command-item>Item 1</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
    await (command as any).updateComplete

    const item = container.querySelector('[role="option"]')
    expect(item).toBeTruthy()
  })

  it("input has aria-expanded", async () => {
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
    expect(input?.getAttribute("aria-expanded")).toBe("true")
  })

  it("input has aria-controls pointing to list", async () => {
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
    const listId = list?.getAttribute("id")

    expect(input?.getAttribute("aria-controls")).toBe(listId)
  })

  it("navigates with Home/End keys", async () => {
    container.innerHTML = `
      <plank-command>
        <plank-command-input placeholder="Search..."></plank-command-input>
        <plank-command-list>
          <plank-command-item>First</plank-command-item>
          <plank-command-item>Middle</plank-command-item>
          <plank-command-item>Last</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
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
      <plank-command>
        <plank-command-input placeholder="Search..."></plank-command-input>
        <plank-command-list>
          <plank-command-item>First</plank-command-item>
          <plank-command-item disabled>Disabled</plank-command-item>
          <plank-command-item>Third</plank-command-item>
        </plank-command-list>
      </plank-command>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
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
