import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-kbd"
import type { PlankKbd } from "@/web-components/plank-kbd"

describe("PlankKbd (Web Component)", () => {
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
    await customElements.whenDefined("plank-kbd")
    const elements = container.querySelectorAll("[data-slot]")
    await Promise.all(
      Array.from(elements).map((el) => (el as PlankKbd).updateComplete)
    )
  }

  describe("PlankKbd", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(`<plank-kbd>K</plank-kbd>`)
      const kbd = container.querySelector("plank-kbd")
      expect(kbd?.dataset.slot).toBe("kbd")
    })

    it("contains native <kbd> element for semantics", async () => {
      await renderAndWait(`<plank-kbd>Enter</plank-kbd>`)
      const kbd = container.querySelector("plank-kbd")
      const nativeKbd = kbd?.querySelector("kbd")
      expect(nativeKbd).toBeTruthy()
      expect(nativeKbd?.textContent).toContain("Enter")
    })

    it("preserves children content", async () => {
      await renderAndWait(`<plank-kbd>Ctrl</plank-kbd>`)
      const kbd = container.querySelector("plank-kbd")
      expect(kbd?.textContent).toContain("Ctrl")
    })

    it("renders with default styling classes", async () => {
      await renderAndWait(`<plank-kbd>K</plank-kbd>`)
      const kbd = container.querySelector("plank-kbd")
      const nativeKbd = kbd?.querySelector("kbd")
      expect(nativeKbd?.classList.contains("bg-muted")).toBe(true)
      expect(nativeKbd?.classList.contains("text-muted-foreground")).toBe(true)
    })

    it("renders symbol keys correctly", async () => {
      await renderAndWait(`<plank-kbd>⌘</plank-kbd>`)
      const kbd = container.querySelector("plank-kbd")
      expect(kbd?.textContent).toContain("⌘")
    })

    it("supports SVG icons inside kbd", async () => {
      await renderAndWait(
        `<plank-kbd><svg data-testid="icon">icon</svg></plank-kbd>`
      )
      const kbd = container.querySelector("plank-kbd")
      expect(kbd?.querySelector("svg")).toBeTruthy()
    })
  })

  describe("PlankKbdGroup", () => {
    it("renders with data-slot attribute", async () => {
      await renderAndWait(
        `<plank-kbd-group><plank-kbd>K</plank-kbd></plank-kbd-group>`
      )
      const group = container.querySelector("plank-kbd-group")
      expect(group?.dataset.slot).toBe("kbd-group")
    })

    it("preserves children content", async () => {
      await renderAndWait(`
        <plank-kbd-group>
          <plank-kbd>Ctrl</plank-kbd>
          <plank-kbd>B</plank-kbd>
        </plank-kbd-group>
      `)
      const group = container.querySelector("plank-kbd-group")
      expect(group?.textContent).toContain("Ctrl")
      expect(group?.textContent).toContain("B")
    })

    it("renders with flex styling", async () => {
      await renderAndWait(
        `<plank-kbd-group><plank-kbd>K</plank-kbd></plank-kbd-group>`
      )
      const group = container.querySelector("plank-kbd-group")
      const nativeKbd = group?.querySelector("kbd")
      expect(nativeKbd?.classList.contains("inline-flex")).toBe(true)
    })
  })

  describe("Full composition", () => {
    it("renders keyboard shortcut combinations", async () => {
      await renderAndWait(`
        <plank-kbd-group>
          <plank-kbd>⌘</plank-kbd>
          <plank-kbd>⇧</plank-kbd>
          <plank-kbd>⌥</plank-kbd>
        </plank-kbd-group>
      `)
      const group = container.querySelector("plank-kbd-group")
      expect(group?.textContent).toContain("⌘")
      expect(group?.textContent).toContain("⇧")
      expect(group?.textContent).toContain("⌥")
      expect(group?.querySelectorAll("plank-kbd").length).toBe(3)
    })

    it("renders Ctrl+Key combinations", async () => {
      await renderAndWait(`
        <plank-kbd-group>
          <plank-kbd>Ctrl</plank-kbd>
          <span>+</span>
          <plank-kbd>B</plank-kbd>
        </plank-kbd-group>
      `)
      const group = container.querySelector("plank-kbd-group")
      expect(group?.textContent).toContain("Ctrl")
      expect(group?.textContent).toContain("+")
      expect(group?.textContent).toContain("B")
    })
  })
})
