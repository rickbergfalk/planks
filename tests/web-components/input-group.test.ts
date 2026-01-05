import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-input-group"
import type {
  HalInputGroup,
  HalInputGroupAddon,
  HalInputGroupButton,
  HalInputGroupText,
  HalInputGroupInput,
  HalInputGroupTextarea,
} from "@/web-components/hal-input-group"

describe("hal-input-group", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("basic rendering", () => {
    it("renders with default classes", async () => {
      container.innerHTML = `<hal-input-group></hal-input-group>`
      await customElements.whenDefined("hal-input-group")
      const group = container.querySelector("hal-input-group")! as HalInputGroup
      await group.updateComplete

      expect(group.className).toContain("flex")
      expect(group.className).toContain("border")
      expect(group.className).toContain("rounded-md")
      expect(group.getAttribute("role")).toBe("group")
      expect(group.dataset.slot).toBe("input-group")
    })

    it("applies disabled state", async () => {
      container.innerHTML = `<hal-input-group disabled></hal-input-group>`
      await customElements.whenDefined("hal-input-group")
      const group = container.querySelector("hal-input-group")! as HalInputGroup
      await group.updateComplete

      expect(group.className).toContain("opacity-50")
      expect(group.className).toContain("pointer-events-none")
      expect(group.dataset.disabled).toBe("true")
    })
  })

  describe("with input", () => {
    it("renders input inside group", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-input placeholder="Search..."></hal-input-group-input>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group")
      await customElements.whenDefined("hal-input-group-input")
      const input = container.querySelector(
        "hal-input-group-input"
      )! as HalInputGroupInput
      await input.updateComplete

      const nativeInput = input.querySelector("input")
      expect(nativeInput).toBeTruthy()
      expect(nativeInput?.placeholder).toBe("Search...")
    })

    it("handles input value changes", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-input></hal-input-group-input>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group-input")
      const input = container.querySelector(
        "hal-input-group-input"
      )! as HalInputGroupInput
      await input.updateComplete

      const nativeInput = input.querySelector("input")!
      nativeInput.value = "test value"
      nativeInput.dispatchEvent(new Event("input", { bubbles: true }))

      expect(input.value).toBe("test value")
    })

    it("dispatches input event", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-input></hal-input-group-input>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group-input")
      const input = container.querySelector(
        "hal-input-group-input"
      )! as HalInputGroupInput
      await input.updateComplete

      let eventFired = false
      let eventValue = ""
      input.addEventListener("input", ((e: CustomEvent) => {
        // Only capture our custom event with detail
        if (e.detail && e.detail.value !== undefined) {
          eventFired = true
          eventValue = e.detail.value
        }
      }) as EventListener)

      const nativeInput = input.querySelector("input")!
      nativeInput.value = "test"
      nativeInput.dispatchEvent(new Event("input", { bubbles: true }))

      expect(eventFired).toBe(true)
      expect(eventValue).toBe("test")
    })

    it("supports disabled state on input", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-input disabled></hal-input-group-input>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group-input")
      const input = container.querySelector(
        "hal-input-group-input"
      )! as HalInputGroupInput
      await input.updateComplete

      const nativeInput = input.querySelector("input")!
      expect(nativeInput.disabled).toBe(true)
    })

    it("supports readonly state", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-input readonly></hal-input-group-input>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group-input")
      const input = container.querySelector(
        "hal-input-group-input"
      )! as HalInputGroupInput
      await input.updateComplete

      const nativeInput = input.querySelector("input")!
      expect(nativeInput.readOnly).toBe(true)
    })

    it("supports invalid state", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-input invalid></hal-input-group-input>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group-input")
      const input = container.querySelector(
        "hal-input-group-input"
      )! as HalInputGroupInput
      await input.updateComplete

      const nativeInput = input.querySelector("input")!
      expect(nativeInput.getAttribute("aria-invalid")).toBe("true")
    })

    it("supports different input types", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-input type="email"></hal-input-group-input>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group-input")
      const input = container.querySelector(
        "hal-input-group-input"
      )! as HalInputGroupInput
      await input.updateComplete

      const nativeInput = input.querySelector("input")!
      expect(nativeInput.type).toBe("email")
    })
  })

  describe("with textarea", () => {
    it("renders textarea inside group", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-textarea placeholder="Enter message..."></hal-input-group-textarea>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group")
      await customElements.whenDefined("hal-input-group-textarea")
      const textarea = container.querySelector(
        "hal-input-group-textarea"
      )! as HalInputGroupTextarea
      await textarea.updateComplete

      const nativeTextarea = textarea.querySelector("textarea")
      expect(nativeTextarea).toBeTruthy()
      expect(nativeTextarea?.placeholder).toBe("Enter message...")
    })

    it("handles textarea value changes", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-textarea></hal-input-group-textarea>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group-textarea")
      const textarea = container.querySelector(
        "hal-input-group-textarea"
      )! as HalInputGroupTextarea
      await textarea.updateComplete

      const nativeTextarea = textarea.querySelector("textarea")!
      nativeTextarea.value = "test message"
      nativeTextarea.dispatchEvent(new Event("input", { bubbles: true }))

      expect(textarea.value).toBe("test message")
    })

    it("supports rows attribute", async () => {
      container.innerHTML = `
        <hal-input-group>
          <hal-input-group-textarea rows="5"></hal-input-group-textarea>
        </hal-input-group>
      `
      await customElements.whenDefined("hal-input-group-textarea")
      const textarea = container.querySelector(
        "hal-input-group-textarea"
      )! as HalInputGroupTextarea
      await textarea.updateComplete

      const nativeTextarea = textarea.querySelector("textarea")!
      expect(nativeTextarea.rows).toBe(5)
    })
  })
})

describe("hal-input-group-addon", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("renders with default inline-start alignment", async () => {
    container.innerHTML = `<hal-input-group-addon>Icon</hal-input-group-addon>`
    await customElements.whenDefined("hal-input-group-addon")
    const addon = container.querySelector(
      "hal-input-group-addon"
    )! as HalInputGroupAddon
    await addon.updateComplete

    expect(addon.dataset.align).toBe("inline-start")
    expect(addon.className).toContain("order-first")
  })

  it("supports inline-end alignment", async () => {
    container.innerHTML = `<hal-input-group-addon align="inline-end">USD</hal-input-group-addon>`
    await customElements.whenDefined("hal-input-group-addon")
    const addon = container.querySelector(
      "hal-input-group-addon"
    )! as HalInputGroupAddon
    await addon.updateComplete

    expect(addon.dataset.align).toBe("inline-end")
    expect(addon.className).toContain("order-last")
  })

  it("supports block-start alignment", async () => {
    container.innerHTML = `<hal-input-group-addon align="block-start">Header</hal-input-group-addon>`
    await customElements.whenDefined("hal-input-group-addon")
    const addon = container.querySelector(
      "hal-input-group-addon"
    )! as HalInputGroupAddon
    await addon.updateComplete

    expect(addon.dataset.align).toBe("block-start")
    expect(addon.className).toContain("order-first")
    expect(addon.className).toContain("w-full")
  })

  it("supports block-end alignment", async () => {
    container.innerHTML = `<hal-input-group-addon align="block-end">Footer</hal-input-group-addon>`
    await customElements.whenDefined("hal-input-group-addon")
    const addon = container.querySelector(
      "hal-input-group-addon"
    )! as HalInputGroupAddon
    await addon.updateComplete

    expect(addon.dataset.align).toBe("block-end")
    expect(addon.className).toContain("order-last")
    expect(addon.className).toContain("w-full")
  })

  it("focuses input when clicked", async () => {
    container.innerHTML = `
      <hal-input-group>
        <hal-input-group-addon>$</hal-input-group-addon>
        <hal-input-group-input></hal-input-group-input>
      </hal-input-group>
    `
    await customElements.whenDefined("hal-input-group")
    await customElements.whenDefined("hal-input-group-addon")
    await customElements.whenDefined("hal-input-group-input")
    const addon = container.querySelector(
      "hal-input-group-addon"
    )! as HalInputGroupAddon
    const inputEl = container.querySelector(
      "hal-input-group-input"
    )! as HalInputGroupInput
    await inputEl.updateComplete

    const nativeInput = inputEl.querySelector("input")!

    addon.click()
    await new Promise((r) => setTimeout(r, 50))

    expect(document.activeElement).toBe(nativeInput)
  })
})

describe("hal-input-group-button", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("renders with default ghost variant", async () => {
    container.innerHTML = `<hal-input-group-button>Click</hal-input-group-button>`
    await customElements.whenDefined("hal-input-group-button")
    const button = container.querySelector(
      "hal-input-group-button"
    )! as HalInputGroupButton
    await button.updateComplete

    const nativeButton = button.querySelector("button")!
    expect(nativeButton.className).toContain("hover:bg-accent")
  })

  it("supports different variants", async () => {
    container.innerHTML = `<hal-input-group-button variant="secondary">Click</hal-input-group-button>`
    await customElements.whenDefined("hal-input-group-button")
    const button = container.querySelector(
      "hal-input-group-button"
    )! as HalInputGroupButton
    await button.updateComplete

    const nativeButton = button.querySelector("button")!
    expect(nativeButton.className).toContain("bg-secondary")
  })

  it("supports different sizes", async () => {
    container.innerHTML = `<hal-input-group-button size="sm">Click</hal-input-group-button>`
    await customElements.whenDefined("hal-input-group-button")
    const button = container.querySelector(
      "hal-input-group-button"
    )! as HalInputGroupButton
    await button.updateComplete

    const nativeButton = button.querySelector("button")!
    expect(nativeButton.className).toContain("h-8")
  })

  it("supports icon sizes", async () => {
    container.innerHTML = `<hal-input-group-button size="icon-xs">X</hal-input-group-button>`
    await customElements.whenDefined("hal-input-group-button")
    const button = container.querySelector(
      "hal-input-group-button"
    )! as HalInputGroupButton
    await button.updateComplete

    const nativeButton = button.querySelector("button")!
    expect(nativeButton.className).toContain("size-6")
  })

  it("supports disabled state", async () => {
    container.innerHTML = `<hal-input-group-button disabled>Click</hal-input-group-button>`
    await customElements.whenDefined("hal-input-group-button")
    const button = container.querySelector(
      "hal-input-group-button"
    )! as HalInputGroupButton
    await button.updateComplete

    const nativeButton = button.querySelector("button")!
    expect(nativeButton.disabled).toBe(true)
    expect(nativeButton.className).toContain("opacity-50")
  })

  it("renders native button element", async () => {
    container.innerHTML = `<hal-input-group-button>Click</hal-input-group-button>`
    await customElements.whenDefined("hal-input-group-button")
    const button = container.querySelector(
      "hal-input-group-button"
    )! as HalInputGroupButton
    await button.updateComplete

    const nativeButton = button.querySelector("button")
    expect(nativeButton).toBeTruthy()
    expect(nativeButton?.type).toBe("button")
  })
})

describe("hal-input-group-text", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("renders with proper styling", async () => {
    container.innerHTML = `<hal-input-group-text>https://</hal-input-group-text>`
    await customElements.whenDefined("hal-input-group-text")
    const text = container.querySelector(
      "hal-input-group-text"
    )! as HalInputGroupText
    await text.updateComplete

    expect(text.className).toContain("text-muted-foreground")
    expect(text.className).toContain("text-sm")
    expect(text.dataset.slot).toBe("input-group-text")
  })

  it("renders children content", async () => {
    container.innerHTML = `<hal-input-group-text>USD</hal-input-group-text>`
    await customElements.whenDefined("hal-input-group-text")
    const text = container.querySelector(
      "hal-input-group-text"
    )! as HalInputGroupText
    await text.updateComplete

    expect(text.textContent).toContain("USD")
  })
})

describe("complete input group composition", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("renders a complete input group with icon and text", async () => {
    container.innerHTML = `
      <hal-input-group>
        <hal-input-group-addon>
          <svg width="16" height="16"></svg>
        </hal-input-group-addon>
        <hal-input-group-input placeholder="Search..."></hal-input-group-input>
        <hal-input-group-addon align="inline-end">
          <hal-input-group-text>12 results</hal-input-group-text>
        </hal-input-group-addon>
      </hal-input-group>
    `
    await customElements.whenDefined("hal-input-group")
    await customElements.whenDefined("hal-input-group-addon")
    await customElements.whenDefined("hal-input-group-input")
    await customElements.whenDefined("hal-input-group-text")

    const group = container.querySelector("hal-input-group")! as HalInputGroup
    await group.updateComplete

    const addons = container.querySelectorAll("hal-input-group-addon")
    expect(addons.length).toBe(2)

    const input = container.querySelector("hal-input-group-input")!
    expect(input).toBeTruthy()

    const text = container.querySelector("hal-input-group-text")!
    expect(text.textContent).toContain("12 results")
  })

  it("renders input group with buttons", async () => {
    container.innerHTML = `
      <hal-input-group>
        <hal-input-group-input placeholder="Search..."></hal-input-group-input>
        <hal-input-group-addon align="inline-end">
          <hal-input-group-button variant="secondary">Search</hal-input-group-button>
        </hal-input-group-addon>
      </hal-input-group>
    `
    await customElements.whenDefined("hal-input-group")
    await customElements.whenDefined("hal-input-group-addon")
    await customElements.whenDefined("hal-input-group-input")
    await customElements.whenDefined("hal-input-group-button")

    const button = container.querySelector(
      "hal-input-group-button"
    )! as HalInputGroupButton
    await button.updateComplete

    const nativeButton = button.querySelector("button")!
    expect(nativeButton).toBeTruthy()
  })

  it("renders textarea with block addons", async () => {
    container.innerHTML = `
      <hal-input-group>
        <hal-input-group-textarea placeholder="Enter message..."></hal-input-group-textarea>
        <hal-input-group-addon align="block-end">
          <hal-input-group-text>120 characters left</hal-input-group-text>
        </hal-input-group-addon>
      </hal-input-group>
    `
    await customElements.whenDefined("hal-input-group")
    await customElements.whenDefined("hal-input-group-addon")
    await customElements.whenDefined("hal-input-group-textarea")
    await customElements.whenDefined("hal-input-group-text")

    const textarea = container.querySelector(
      "hal-input-group-textarea"
    )! as HalInputGroupTextarea
    await textarea.updateComplete

    const nativeTextarea = textarea.querySelector("textarea")!
    expect(nativeTextarea).toBeTruthy()

    const addon = container.querySelector(
      "hal-input-group-addon"
    )! as HalInputGroupAddon
    expect(addon.dataset.align).toBe("block-end")
  })
})
