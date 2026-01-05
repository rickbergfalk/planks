import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/hal-combobox"

describe("Combobox (Web Component)", () => {
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

  it("renders input group with correct data-slot", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const inputGroup = container.querySelector('[data-slot="input-group"]')
    expect(inputGroup).toBeTruthy()
  })

  it("input has role combobox", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const input = container.querySelector('[role="combobox"]')
    expect(input).toBeTruthy()
    expect(input?.tagName.toLowerCase()).toBe("input")
  })

  it("combobox content is hidden by default", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  it("shows combobox content on trigger button click", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeTruthy()
  })

  it("shows placeholder in input when no value selected", async () => {
    container.innerHTML = `
      <hal-combobox placeholder="Select framework...">
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const input = container.querySelector(
      '[role="combobox"]'
    ) as HTMLInputElement
    expect(input.placeholder).toBe("Select framework...")
  })

  it("shows selected value in input", async () => {
    container.innerHTML = `
      <hal-combobox placeholder="Select...">
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
        <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 50))

    // Click on Next.js option
    const nextOption = document.querySelector('[role="option"]') as HTMLElement
    nextOption.click()
    await new Promise((r) => setTimeout(r, 50))

    const input = container.querySelector(
      '[role="combobox"]'
    ) as HTMLInputElement
    expect(input.value).toBe("Next.js")
  })

  it("closes on item selection", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 50))

    // Click on option
    const option = document.querySelector('[role="option"]') as HTMLElement
    option.click()
    // Wait for Lit update cycle to complete
    await (combobox as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    // Should be closed
    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  it("can be controlled via value attribute", async () => {
    container.innerHTML = `
      <hal-combobox value="svelte">
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
        <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const input = container.querySelector(
      '[role="combobox"]'
    ) as HTMLInputElement
    expect(input.value).toBe("SvelteKit")
  })

  it("fires value-change when selection changes", async () => {
    const onValueChange = vi.fn()
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    combobox.addEventListener("value-change", (e: Event) => {
      onValueChange((e as CustomEvent).detail.value)
    })
    await (combobox as any).updateComplete

    // Open and select
    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 50))

    const option = document.querySelector('[role="option"]') as HTMLElement
    option.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(onValueChange).toHaveBeenCalledWith("next")
  })

  it("fires open-change when opened", async () => {
    const onOpenChange = vi.fn()
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    combobox.addEventListener("open-change", (e: Event) => {
      onOpenChange((e as CustomEvent).detail.open)
    })
    await (combobox as any).updateComplete

    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("input has correct ARIA attributes when open", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const input = container.querySelector('[role="combobox"]') as HTMLElement
    expect(input.getAttribute("aria-expanded")).toBe("false")

    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(input.getAttribute("aria-expanded")).toBe("true")
  })

  it("disabled combobox cannot be opened", async () => {
    container.innerHTML = `
      <hal-combobox disabled>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 100))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  it("disabled item cannot be selected", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next" disabled>Next.js</hal-combobox-item>
        <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 50))

    const disabledOption = document.querySelector(
      '[role="option"][aria-disabled="true"]'
    )
    expect(disabledOption).toBeTruthy()
  })

  it("opens on keyboard ArrowDown", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    const input = container.querySelector('[role="combobox"]') as HTMLElement
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeTruthy()
  })

  it("closes on Escape key", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 50))

    // Verify it's open
    expect(document.querySelector('[role="listbox"]')).toBeTruthy()

    // Press Escape on the input
    const input = container.querySelector('[role="combobox"]') as HTMLElement
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    // Should be closed
    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  it("closes on outside click", async () => {
    container.innerHTML = `
      <hal-combobox>
        <hal-combobox-item value="next">Next.js</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const triggerBtn = container.querySelector(
      '[data-slot="input-group-button"]'
    ) as HTMLElement
    triggerBtn.click()
    await new Promise((r) => setTimeout(r, 50))

    // Verify it's open
    expect(document.querySelector('[role="listbox"]')).toBeTruthy()

    // Click outside
    document.body.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 200))

    // Should be closed
    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  // Search/filtering tests - the main input IS the search input
  describe("search functionality", () => {
    it("main input is the search input", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const input = container.querySelector('[role="combobox"]')
      expect(input?.tagName.toLowerCase()).toBe("input")
    })

    it("filters items based on input value", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
          <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
          <hal-combobox-item value="nuxt">Nuxt.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Focus and type to open and filter
      const input = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      input.focus()
      await new Promise((r) => setTimeout(r, 50))

      input.value = "svelte"
      input.dispatchEvent(new Event("input", { bubbles: true }))
      await new Promise((r) => setTimeout(r, 50))

      // Only SvelteKit should be visible
      const visibleItems = document.querySelectorAll(
        '[role="option"]:not([style*="display: none"])'
      )
      expect(visibleItems.length).toBe(1)
      expect(visibleItems[0].textContent).toContain("SvelteKit")
    })

    it("shows empty state when no items match", async () => {
      container.innerHTML = `
        <hal-combobox emptyText="No frameworks found.">
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
          <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Focus and type to filter
      const input = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      input.focus()
      await new Promise((r) => setTimeout(r, 50))

      input.value = "xyz"
      input.dispatchEvent(new Event("input", { bubbles: true }))
      await new Promise((r) => setTimeout(r, 50))

      const empty = document.querySelector('[data-slot="combobox-empty"]')
      expect(empty?.textContent).toContain("No frameworks found.")
      expect(window.getComputedStyle(empty as HTMLElement).display).not.toBe(
        "none"
      )
    })
  })

  // Keyboard navigation tests
  describe("keyboard navigation", () => {
    it("ArrowDown moves to next item", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
          <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Open via focus
      const input = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      input.focus()
      await new Promise((r) => setTimeout(r, 50))

      // Move down
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      const highlighted = document.querySelector("[data-highlighted]")
      expect(highlighted).toBeTruthy()
    })

    it("ArrowUp moves to previous item", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
          <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
          <hal-combobox-item value="nuxt">Nuxt.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const input = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      input.focus()
      await new Promise((r) => setTimeout(r, 50))

      // Move down twice to get to SvelteKit (index 1)
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      // Verify we're on SvelteKit
      let highlighted = document.querySelector("[data-highlighted]")
      expect(highlighted?.textContent).toContain("SvelteKit")

      // Move up to go back to Next.js
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      highlighted = document.querySelector("[data-highlighted]")
      expect(highlighted?.textContent).toContain("Next.js")
    })

    it("Enter selects highlighted item", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
          <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const input = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      input.focus()
      await new Promise((r) => setTimeout(r, 50))

      // Move to first item
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      // Select with Enter
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      expect(input.value).toBe("Next.js")
    })

    it("Home moves to first item", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
          <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
          <hal-combobox-item value="nuxt">Nuxt.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const input = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      input.focus()
      await new Promise((r) => setTimeout(r, 50))

      // Move down twice then Home
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Home", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      const highlighted = document.querySelector("[data-highlighted]")
      expect(highlighted?.textContent).toContain("Next.js")
    })

    it("End moves to last item", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
          <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
          <hal-combobox-item value="nuxt">Nuxt.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const input = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      input.focus()
      await new Promise((r) => setTimeout(r, 50))

      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "End", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      const highlighted = document.querySelector("[data-highlighted]")
      expect(highlighted?.textContent).toContain("Nuxt.js")
    })

    it("skips disabled items during navigation", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
          <hal-combobox-item value="svelte" disabled>SvelteKit</hal-combobox-item>
          <hal-combobox-item value="nuxt">Nuxt.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const input = container.querySelector(
        '[role="combobox"]'
      ) as HTMLInputElement
      input.focus()
      await new Promise((r) => setTimeout(r, 50))

      // Move to first
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      // First should be Next.js
      let highlighted = document.querySelector("[data-highlighted]")
      expect(highlighted?.textContent).toContain("Next.js")

      // Move to next (should skip disabled SvelteKit)
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      highlighted = document.querySelector("[data-highlighted]")
      expect(highlighted?.textContent).toContain("Nuxt.js")
    })
  })

  // Selection behavior tests
  describe("selection behavior", () => {
    it("selecting same value again deselects it", async () => {
      container.innerHTML = `
        <hal-combobox value="next">
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Open and click on already selected item
      const triggerBtn = container.querySelector(
        '[data-slot="input-group-button"]'
      ) as HTMLElement
      triggerBtn.click()
      await new Promise((r) => setTimeout(r, 50))

      const option = document.querySelector('[role="option"]') as HTMLElement
      option.click()
      await new Promise((r) => setTimeout(r, 50))

      // Value should be cleared
      expect((combobox as any).value).toBe("")
    })

    it("selected item shows checkmark", async () => {
      container.innerHTML = `
        <hal-combobox value="next">
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
          <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const triggerBtn = container.querySelector(
        '[data-slot="input-group-button"]'
      ) as HTMLElement
      triggerBtn.click()
      await new Promise((r) => setTimeout(r, 50))

      const selectedOption = document.querySelector(
        '[role="option"][aria-selected="true"]'
      )
      expect(selectedOption).toBeTruthy()
      expect(selectedOption?.querySelector("svg")).toBeTruthy()
    })
  })

  // Accessibility tests
  describe("accessibility", () => {
    it("input has aria-haspopup listbox", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const input = container.querySelector('[role="combobox"]')
      expect(input?.getAttribute("aria-haspopup")).toBe("listbox")
    })

    it("input has aria-controls when open", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      const triggerBtn = container.querySelector(
        '[data-slot="input-group-button"]'
      ) as HTMLElement
      triggerBtn.click()
      await new Promise((r) => setTimeout(r, 50))

      const input = container.querySelector('[role="combobox"]') as HTMLElement
      const ariaControls = input.getAttribute("aria-controls")
      const listbox = document.getElementById(ariaControls!)
      expect(listbox).toBeTruthy()
      expect(listbox?.getAttribute("role")).toBe("listbox")
    })

    it("items have role option", async () => {
      container.innerHTML = `
        <hal-combobox>
          <hal-combobox-item value="next">Next.js</hal-combobox-item>
        </hal-combobox>
      `

      await customElements.whenDefined("hal-combobox")
      const combobox = container.querySelector("hal-combobox")!
      await (combobox as any).updateComplete

      // Open via trigger button
      const triggerBtn = container.querySelector(
        '[data-slot="input-group-button"]'
      ) as HTMLElement
      triggerBtn.click()
      await new Promise((r) => setTimeout(r, 50))

      const options = document.querySelectorAll('[role="option"]')
      expect(options.length).toBeGreaterThan(0)
    })
  })

  // getDisplayText method test
  it("getDisplayText returns display text for current value", async () => {
    container.innerHTML = `
      <hal-combobox value="next">
        <hal-combobox-item value="next">Next.js Framework</hal-combobox-item>
      </hal-combobox>
    `

    await customElements.whenDefined("hal-combobox")
    const combobox = container.querySelector("hal-combobox")! as any
    await combobox.updateComplete

    expect(combobox.getDisplayText()).toBe("Next.js Framework")
  })
})
