import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/hal-kbd"
import type { HalKbd } from "@/web-components/hal-kbd"

describe("HalKbd (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-kbd")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalKbd).updateComplete)
    )
  }

  describe("HalKbd", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-kbd>K</hal-kbd>`)
      const kbd = container.querySelector("hal-kbd")
      expect(kbd?.dataset.slot).toBe("kbd")
    })

    it("contains native <kbd> element for semantics", async () => {
      await renderAndWait(`<hal-kbd>Enter</hal-kbd>`)
      const kbd = container.querySelector("hal-kbd")
      const nativeKbd = kbd?.querySelector("kbd")
      expect(nativeKbd).toBeTruthy()
      expect(nativeKbd?.textContent).toContain("Enter")
    })

    it("preserves children content", async () => {
      await renderAndWait(`<hal-kbd>Ctrl</hal-kbd>`)
      const kbd = container.querySelector("hal-kbd")
      expect(kbd?.textContent).toContain("Ctrl")
    })

    it("renders with default styling classes", async () => {
      await renderAndWait(`<hal-kbd>K</hal-kbd>`)
      const kbd = container.querySelector("hal-kbd")
      const nativeKbd = kbd?.querySelector("kbd")
      expect(nativeKbd?.classList.contains("bg-muted")).toBe(true)
      expect(nativeKbd?.classList.contains("text-muted-foreground")).toBe(true)
    })

    it("renders symbol keys correctly", async () => {
      await renderAndWait(`<hal-kbd>⌘</hal-kbd>`)
      const kbd = container.querySelector("hal-kbd")
      expect(kbd?.textContent).toContain("⌘")
    })

    it("supports SVG icons inside kbd", async () => {
      await renderAndWait(
        `<hal-kbd><svg data-testid="icon">icon</svg></hal-kbd>`
      )
      const kbd = container.querySelector("hal-kbd")
      expect(kbd?.querySelector("svg")).toBeTruthy()
    })
  })

  describe("HalKbdGroup", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<hal-kbd-group><hal-kbd>K</hal-kbd></hal-kbd-group>`)
      const group = container.querySelector("hal-kbd-group")
      expect(group?.dataset.slot).toBe("kbd-group")
    })

    it("preserves children content", async () => {
      await renderAndWait(`
        <hal-kbd-group>
          <hal-kbd>Ctrl</hal-kbd>
          <hal-kbd>B</hal-kbd>
        </hal-kbd-group>
      `)
      const group = container.querySelector("hal-kbd-group")
      expect(group?.textContent).toContain("Ctrl")
      expect(group?.textContent).toContain("B")
    })

    it("renders with flex styling", async () => {
      await renderAndWait(`<hal-kbd-group><hal-kbd>K</hal-kbd></hal-kbd-group>`)
      const group = container.querySelector("hal-kbd-group")
      const nativeKbd = group?.querySelector("kbd")
      expect(nativeKbd?.classList.contains("inline-flex")).toBe(true)
    })
  })

  describe("Full composition", () => {
    it("renders keyboard shortcut combinations", async () => {
      await renderAndWait(`
        <hal-kbd-group>
          <hal-kbd>⌘</hal-kbd>
          <hal-kbd>⇧</hal-kbd>
          <hal-kbd>⌥</hal-kbd>
        </hal-kbd-group>
      `)
      const group = container.querySelector("hal-kbd-group")
      expect(group?.textContent).toContain("⌘")
      expect(group?.textContent).toContain("⇧")
      expect(group?.textContent).toContain("⌥")
      expect(group?.querySelectorAll("hal-kbd").length).toBe(3)
    })

    it("renders Ctrl+Key combinations", async () => {
      await renderAndWait(`
        <hal-kbd-group>
          <hal-kbd>Ctrl</hal-kbd>
          <span>+</span>
          <hal-kbd>B</hal-kbd>
        </hal-kbd-group>
      `)
      const group = container.querySelector("hal-kbd-group")
      expect(group?.textContent).toContain("Ctrl")
      expect(group?.textContent).toContain("+")
      expect(group?.textContent).toContain("B")
    })
  })
})
