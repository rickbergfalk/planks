import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import "@/web-components/plank-combobox"

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

  it("renders trigger with correct data-slot", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[data-slot="combobox-trigger"]')
    expect(trigger).toBeTruthy()
  })

  it("trigger has role combobox", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]')
    expect(trigger).toBeTruthy()
  })

  it("combobox content is hidden by default", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  it("shows combobox content on click", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeTruthy()
  })

  it("shows placeholder when no value selected", async () => {
    container.innerHTML = `
      <plank-combobox placeholder="Select framework...">
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]')
    expect(trigger?.textContent).toContain("Select framework...")
  })

  it("shows selected value in trigger", async () => {
    container.innerHTML = `
      <plank-combobox placeholder="Select...">
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
        <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    // Click on Next.js option
    const nextOption = document.querySelector('[role="option"]') as HTMLElement
    nextOption.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(trigger.textContent).toContain("Next.js")
  })

  it("closes on item selection", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    // Click on option
    const option = document.querySelector('[role="option"]') as HTMLElement
    option.click()
    await new Promise((r) => setTimeout(r, 50))

    // Should be closed
    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  it("can be controlled via value attribute", async () => {
    container.innerHTML = `
      <plank-combobox value="svelte">
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
        <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]')
    expect(trigger?.textContent).toContain("SvelteKit")
  })

  it("fires value-change when selection changes", async () => {
    const onValueChange = vi.fn()
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    combobox.addEventListener("value-change", (e: Event) => {
      onValueChange((e as CustomEvent).detail.value)
    })
    await (combobox as any).updateComplete

    // Open and select
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    const option = document.querySelector('[role="option"]') as HTMLElement
    option.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(onValueChange).toHaveBeenCalledWith("next")
  })

  it("fires open-change when opened", async () => {
    const onOpenChange = vi.fn()
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    combobox.addEventListener("open-change", (e: Event) => {
      onOpenChange((e as CustomEvent).detail.open)
    })
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("trigger has correct ARIA attributes when open", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    expect(trigger.getAttribute("aria-expanded")).toBe("false")

    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(trigger.getAttribute("aria-expanded")).toBe("true")
  })

  it("disabled combobox cannot be opened", async () => {
    container.innerHTML = `
      <plank-combobox disabled>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 100))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  it("disabled item cannot be selected", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next" disabled>Next.js</plank-combobox-item>
        <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 50))

    const disabledOption = document.querySelector(
      '[role="option"][aria-disabled="true"]'
    )
    expect(disabledOption).toBeTruthy()
  })

  it("trigger has data-placeholder when no value", async () => {
    container.innerHTML = `
      <plank-combobox placeholder="Select...">
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]')
    expect(trigger?.hasAttribute("data-placeholder")).toBe(true)
  })

  it("opens on keyboard Enter", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

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
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

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
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 50))

    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeTruthy()
  })

  it("closes on Escape key", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
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
    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  it("closes on outside click", async () => {
    container.innerHTML = `
      <plank-combobox>
        <plank-combobox-item value="next">Next.js</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
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
    const content = document.querySelector('[role="listbox"]')
    expect(content).toBeNull()
  })

  // Search/filtering tests
  describe("search functionality", () => {
    it("has a search input when open", async () => {
      container.innerHTML = `
        <plank-combobox>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      )
      expect(input).toBeTruthy()
    })

    it("filters items based on search input", async () => {
      container.innerHTML = `
        <plank-combobox>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement
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
        <plank-combobox emptyText="No frameworks found.">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement
      input.value = "xyz"
      input.dispatchEvent(new Event("input", { bubbles: true }))
      await new Promise((r) => setTimeout(r, 50))

      const empty = document.querySelector('[data-slot="combobox-empty"]')
      expect(empty?.textContent).toContain("No frameworks found.")
      expect(window.getComputedStyle(empty as HTMLElement).display).not.toBe(
        "none"
      )
    })

    it("uses custom search placeholder", async () => {
      container.innerHTML = `
        <plank-combobox searchPlaceholder="Filter frameworks...">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement
      expect(input.placeholder).toBe("Filter frameworks...")
    })
  })

  // Keyboard navigation tests
  describe("keyboard navigation", () => {
    it("ArrowDown moves to next item", async () => {
      container.innerHTML = `
        <plank-combobox open>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      const highlighted = document.querySelector("[data-highlighted]")
      expect(highlighted).toBeTruthy()
    })

    it("ArrowUp moves to previous item", async () => {
      container.innerHTML = `
        <plank-combobox>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      // Open the combobox by clicking the trigger
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement

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
        <plank-combobox open>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement

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

      const trigger = container.querySelector('[role="combobox"]')
      expect(trigger?.textContent).toContain("Next.js")
    })

    it("Home moves to first item", async () => {
      container.innerHTML = `
        <plank-combobox open>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement

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
        <plank-combobox open>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement

      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "End", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      const highlighted = document.querySelector("[data-highlighted]")
      expect(highlighted?.textContent).toContain("Nuxt.js")
    })

    it("Escape closes dropdown from search input", async () => {
      container.innerHTML = `
        <plank-combobox open>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement
      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
      )
      await new Promise((r) => setTimeout(r, 50))

      const content = document.querySelector('[role="listbox"]')
      expect(content).toBeNull()
    })

    it("skips disabled items during navigation", async () => {
      container.innerHTML = `
        <plank-combobox open>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte" disabled>SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const input = document.querySelector(
        '[data-slot="combobox-content"] input'
      ) as HTMLInputElement

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
        <plank-combobox value="next">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      // Open and click on already selected item
      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const option = document.querySelector('[role="option"]') as HTMLElement
      option.click()
      await new Promise((r) => setTimeout(r, 50))

      // Value should be cleared
      expect((combobox as any).value).toBe("")
    })

    it("selected item shows checkmark", async () => {
      container.innerHTML = `
        <plank-combobox value="next">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
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
    it("trigger has aria-haspopup listbox", async () => {
      container.innerHTML = `
        <plank-combobox>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector('[role="combobox"]')
      expect(trigger?.getAttribute("aria-haspopup")).toBe("listbox")
    })

    it("trigger has aria-controls when open", async () => {
      container.innerHTML = `
        <plank-combobox>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete

      const trigger = container.querySelector(
        '[role="combobox"]'
      ) as HTMLElement
      trigger.click()
      await new Promise((r) => setTimeout(r, 50))

      const ariaControls = trigger.getAttribute("aria-controls")
      const listbox = document.getElementById(ariaControls!)
      expect(listbox).toBeTruthy()
      expect(listbox?.getAttribute("role")).toBe("listbox")
    })

    it("items have role option", async () => {
      container.innerHTML = `
        <plank-combobox open>
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
        </plank-combobox>
      `

      await customElements.whenDefined("plank-combobox")
      const combobox = container.querySelector("plank-combobox")!
      await (combobox as any).updateComplete
      await new Promise((r) => setTimeout(r, 50))

      const options = document.querySelectorAll('[role="option"]')
      expect(options.length).toBeGreaterThan(0)
    })
  })

  // getDisplayText method test
  it("getDisplayText returns display text for current value", async () => {
    container.innerHTML = `
      <plank-combobox value="next">
        <plank-combobox-item value="next">Next.js Framework</plank-combobox-item>
      </plank-combobox>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")! as any
    await combobox.updateComplete

    expect(combobox.getDisplayText()).toBe("Next.js Framework")
  })
})
