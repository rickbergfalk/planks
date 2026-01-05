import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-button-group"
import "@/web-components/hal-button"
import "@/web-components/hal-separator"
import type { HalButtonGroup } from "@/web-components/hal-button-group"

describe("HalButtonGroup", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<HalButtonGroup> {
    container.innerHTML = html
    await customElements.whenDefined("hal-button-group")
    const element = container.querySelector(
      "hal-button-group"
    ) as HalButtonGroup
    await element.updateComplete
    return element
  }

  describe("attributes", () => {
    it("should have default horizontal orientation", async () => {
      const element = await renderAndWait(`
        <hal-button-group>
          <hal-button>Test</hal-button>
        </hal-button-group>
      `)
      expect(element.orientation).toBe("horizontal")
      expect(element.getAttribute("data-orientation")).toBe("horizontal")
    })

    it("should support vertical orientation", async () => {
      const element = await renderAndWait(`
        <hal-button-group orientation="vertical">
          <hal-button>Test</hal-button>
        </hal-button-group>
      `)
      expect(element.orientation).toBe("vertical")
      expect(element.getAttribute("data-orientation")).toBe("vertical")
    })

    it("should have role=group", async () => {
      const element = await renderAndWait(`
        <hal-button-group>
          <hal-button>Test</hal-button>
        </hal-button-group>
      `)
      expect(element.getAttribute("role")).toBe("group")
    })

    it("should have data-slot=button-group", async () => {
      const element = await renderAndWait(`
        <hal-button-group>
          <hal-button>Test</hal-button>
        </hal-button-group>
      `)
      expect(element.dataset.slot).toBe("button-group")
    })

    it("should apply appropriate classes for horizontal orientation", async () => {
      const element = await renderAndWait(`
        <hal-button-group>
          <hal-button>Test</hal-button>
        </hal-button-group>
      `)
      expect(element.className).toContain("flex")
      expect(element.className).toContain("items-stretch")
    })

    it("should apply flex-col for vertical orientation", async () => {
      const element = await renderAndWait(`
        <hal-button-group orientation="vertical">
          <hal-button>Test</hal-button>
        </hal-button-group>
      `)
      expect(element.className).toContain("flex-col")
    })
  })

  describe("children preservation", () => {
    it("should preserve button children", async () => {
      await renderAndWait(`
        <hal-button-group>
          <hal-button>First</hal-button>
          <hal-button>Second</hal-button>
          <hal-button>Third</hal-button>
        </hal-button-group>
      `)
      const buttons = container.querySelectorAll("hal-button")
      expect(buttons.length).toBe(3)
      expect(buttons[0].textContent).toBe("First")
      expect(buttons[1].textContent).toBe("Second")
      expect(buttons[2].textContent).toBe("Third")
    })
  })
})

describe("HalButtonGroupText", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("should render text content", async () => {
    container.innerHTML = `
      <hal-button-group-text>Label Text</hal-button-group-text>
    `
    await customElements.whenDefined("hal-button-group-text")
    const element = container.querySelector("hal-button-group-text")!
    expect(element.textContent).toContain("Label Text")
  })

  it("should have muted background styling", async () => {
    container.innerHTML = `
      <hal-button-group-text>Label</hal-button-group-text>
    `
    await customElements.whenDefined("hal-button-group-text")
    const element = container.querySelector(
      "hal-button-group-text"
    ) as HTMLElement
    await (element as any).updateComplete
    expect(element.className).toContain("bg-muted")
  })
})

describe("HalButtonGroupSeparator", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("should have default vertical orientation", async () => {
    container.innerHTML = `
      <hal-button-group-separator></hal-button-group-separator>
    `
    await customElements.whenDefined("hal-button-group-separator")
    const element = container.querySelector(
      "hal-button-group-separator"
    ) as HTMLElement
    await (element as any).updateComplete
    expect(element.getAttribute("data-orientation")).toBe("vertical")
  })

  it("should have data-slot=button-group-separator", async () => {
    container.innerHTML = `
      <hal-button-group-separator></hal-button-group-separator>
    `
    await customElements.whenDefined("hal-button-group-separator")
    const element = container.querySelector(
      "hal-button-group-separator"
    ) as HTMLElement
    await (element as any).updateComplete
    expect(element.dataset.slot).toBe("button-group-separator")
  })

  it("should have bg-input class", async () => {
    container.innerHTML = `
      <hal-button-group-separator></hal-button-group-separator>
    `
    await customElements.whenDefined("hal-button-group-separator")
    const element = container.querySelector(
      "hal-button-group-separator"
    ) as HTMLElement
    await (element as any).updateComplete
    expect(element.className).toContain("bg-input")
  })
})
