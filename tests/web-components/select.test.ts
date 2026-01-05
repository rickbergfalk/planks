import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-select"

describe("Select (Web Component)", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document
      .querySelectorAll('body > div[style*="position: fixed"]')
      .forEach((el) => {
        el.remove()
      })
  })

  it("renders trigger with correct data-slot", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[data-slot="select-trigger"]')
    expect(trigger).toBeTruthy()
  })

  it("select content is hidden by default", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const content = document.querySelector(
      'body > div[style*="position: fixed"] [data-slot="select-content"]'
    )
    expect(content).toBeNull()
  })

  it("shows select content on click", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeTruthy()
  })

  it("shows placeholder when no value selected", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select a fruit"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]')
    expect(trigger?.textContent).toContain("Select a fruit")
  })

  it("shows selected value in trigger", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
          <hal-select-item value="banana">Banana</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    // Open the select
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    // Click on apple option
    const appleOption = document.querySelector('[role="option"]') as HTMLElement
    appleOption.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(trigger.textContent).toContain("Apple")
  })

  it("closes on item selection", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    // Open the select
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    // Click on apple option
    const appleOption = document.querySelector('[role="option"]') as HTMLElement
    appleOption.click()
    await new Promise((r) => setTimeout(r, 50))

    // Should be closed
    const content = document.querySelector(
      'body > div[style*="position: fixed"] [role="listbox"]'
    )
    expect(content).toBeNull()
  })

  it("can be controlled via value attribute", async () => {
    container.innerHTML = `
      <hal-select value="banana">
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
          <hal-select-item value="banana">Banana</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]')
    expect(trigger?.textContent).toContain("Banana")
  })

  it("fires value-change when selection changes", async () => {
    const onValueChange = vi.fn()
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    select.addEventListener("value-change", (e: Event) => {
      onValueChange((e as CustomEvent).detail.value)
    })
    await (select as any).updateComplete

    // Open and select
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    const appleOption = document.querySelector('[role="option"]') as HTMLElement
    appleOption.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(onValueChange).toHaveBeenCalledWith("apple")
  })

  it("fires open-change when opened", async () => {
    const onOpenChange = vi.fn()
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    select.addEventListener("open-change", (e: Event) => {
      onOpenChange((e as CustomEvent).detail.open)
    })
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("trigger has correct ARIA attributes when open", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    expect(trigger.getAttribute("aria-expanded")).toBe("false")

    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })

  it("disabled select cannot be opened", async () => {
    container.innerHTML = `
      <hal-select disabled>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 100))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  it("disabled item cannot be selected", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple" disabled>Apple</hal-select-item>
          <hal-select-item value="banana">Banana</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    const appleOption = document.querySelector(
      '[role="option"][aria-disabled="true"]'
    )
    expect(appleOption).toBeTruthy()
  })

  it("renders group with label", async () => {
    container.innerHTML = `
      <hal-select open>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-group>
            <hal-select-label>Fruits</hal-select-label>
            <hal-select-item value="apple">Apple</hal-select-item>
          </hal-select-group>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const group = document.querySelector('[role="group"]')
    expect(group).toBeTruthy()
  })

  it("renders separator between groups", async () => {
    container.innerHTML = `
      <hal-select open>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-group>
            <hal-select-item value="apple">Apple</hal-select-item>
          </hal-select-group>
          <hal-select-separator></hal-select-separator>
          <hal-select-group>
            <hal-select-item value="carrot">Carrot</hal-select-item>
          </hal-select-group>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const separator = document.querySelector('[data-slot="select-separator"]')
    expect(separator).toBeTruthy()
  })

  it("select content has correct data-state", async () => {
    container.innerHTML = `
      <hal-select open>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    // The content is portaled to body, query the listbox which has data-state
    const content = document.querySelector('[role="listbox"]')
    expect(content?.getAttribute("data-state")).toBe("open")
  })

  it("trigger has data-placeholder when no value", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]')
    expect(trigger?.hasAttribute("data-placeholder")).toBe(true)
  })

  it("opens on keyboard Enter", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeTruthy()
  })

  it("opens on keyboard Space", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: " ", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeTruthy()
  })

  it("opens on ArrowDown", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeTruthy()
  })

  it("supports small size trigger", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger size="sm">
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    await customElements.whenDefined("hal-select-trigger")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    const triggerComponent = container.querySelector("hal-select-trigger")!
    await (triggerComponent as any).updateComplete

    // The button element inside the trigger has the data-size attribute
    const trigger = container.querySelector('[role="combobox"]')
    expect(trigger?.getAttribute("data-size")).toBe("sm")
  })

  it("closes on Escape key", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    // Open the select
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    // Verify it's open
    expect(document.querySelector('[role="listbox"]')).toBeTruthy()

    // Press Escape
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    // Should be closed
    const content = document.querySelector(
      'body > div[style*="position: fixed"] [role="listbox"]'
    )
    expect(content).toBeNull()
  })

  it("closes on outside click", async () => {
    container.innerHTML = `
      <hal-select>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete

    // Open the select
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    // Verify it's open
    expect(document.querySelector('[role="listbox"]')).toBeTruthy()

    // Click outside
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    // Should be closed
    const content = document.querySelector(
      'body > div[style*="position: fixed"] [role="listbox"]'
    )
    expect(content).toBeNull()
  })

  it("keyboard navigation with ArrowDown moves to next item", async () => {
    container.innerHTML = `
      <hal-select open>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
          <hal-select-item value="banana">Banana</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]') as HTMLElement

    // Press ArrowDown to highlight first item
    content.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    const highlightedItem = document.querySelector("[data-highlighted]")
    expect(highlightedItem).toBeTruthy()
  })

  it("keyboard selection with Enter selects highlighted item", async () => {
    container.innerHTML = `
      <hal-select open>
        <hal-select-trigger>
          <hal-select-value placeholder="Select"></hal-select-value>
        </hal-select-trigger>
        <hal-select-content>
          <hal-select-item value="apple">Apple</hal-select-item>
          <hal-select-item value="banana">Banana</hal-select-item>
        </hal-select-content>
      </hal-select>
    `

    await customElements.whenDefined("hal-select")
    const select = container.querySelector("hal-select")!
    await (select as any).updateComplete
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]') as HTMLElement

    // The first item (Apple) is already highlighted when opened
    // Press Enter to select the currently highlighted item
    content.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    const trigger = container.querySelector('[role="combobox"]')
    expect(trigger?.textContent).toContain("Apple")
  })
})
