import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-toggle-group"
import type { PlankToggleGroup } from "@/web-components/plank-toggle-group"
import type { PlankToggleGroupItem } from "@/web-components/plank-toggle-group"

describe("plank-toggle-group", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  describe("PlankToggleGroup", () => {
    it("has data-slot attribute", async () => {
      container.innerHTML = `<plank-toggle-group></plank-toggle-group>`
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      expect(group.dataset.slot).toBe("toggle-group")
    })

    it("has role=group", async () => {
      container.innerHTML = `<plank-toggle-group></plank-toggle-group>`
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      expect(group.getAttribute("role")).toBe("group")
    })

    it("defaults to type=multiple", async () => {
      container.innerHTML = `<plank-toggle-group></plank-toggle-group>`
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      expect(group.type).toBe("multiple")
    })

    it("accepts type=single", async () => {
      container.innerHTML = `<plank-toggle-group type="single"></plank-toggle-group>`
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      expect(group.type).toBe("single")
    })

    it("has flex styling", async () => {
      container.innerHTML = `<plank-toggle-group></plank-toggle-group>`
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      expect(group.className).toContain("flex")
      expect(group.className).toContain("items-center")
    })

    it("applies variant to items via context", async () => {
      container.innerHTML = `
        <plank-toggle-group variant="outline">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      await customElements.whenDefined("plank-toggle-group-item")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.className).toContain("border")
    })

    it("applies size to items via context", async () => {
      container.innerHTML = `
        <plank-toggle-group size="sm">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      await customElements.whenDefined("plank-toggle-group-item")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.className).toContain("h-8")
    })
  })

  describe("PlankToggleGroupItem", () => {
    it("has data-slot attribute", async () => {
      container.innerHTML = `
        <plank-toggle-group>
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group-item")
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.dataset.slot).toBe("toggle-group-item")
    })

    it("has role=button", async () => {
      container.innerHTML = `
        <plank-toggle-group>
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group-item")
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.getAttribute("role")).toBe("button")
    })

    it("has tabindex=0 when enabled", async () => {
      container.innerHTML = `
        <plank-toggle-group>
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group-item")
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.getAttribute("tabindex")).toBe("0")
    })

    it("has tabindex=-1 when disabled", async () => {
      container.innerHTML = `
        <plank-toggle-group>
          <plank-toggle-group-item value="a" disabled>A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group-item")
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.getAttribute("tabindex")).toBe("-1")
    })

    it("has aria-pressed=false when not selected", async () => {
      container.innerHTML = `
        <plank-toggle-group>
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group-item")
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.getAttribute("aria-pressed")).toBe("false")
    })

    it("has aria-pressed=true when selected", async () => {
      container.innerHTML = `
        <plank-toggle-group value="a">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      await customElements.whenDefined("plank-toggle-group-item")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.getAttribute("aria-pressed")).toBe("true")
    })

    it("has data-state=off when not selected", async () => {
      container.innerHTML = `
        <plank-toggle-group>
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group-item")
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.dataset.state).toBe("off")
    })

    it("has data-state=on when selected", async () => {
      container.innerHTML = `
        <plank-toggle-group value="a">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      await customElements.whenDefined("plank-toggle-group-item")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete
      expect(item.dataset.state).toBe("on")
    })
  })

  describe("type=multiple selection", () => {
    it("allows multiple items to be selected", async () => {
      container.innerHTML = `
        <plank-toggle-group type="multiple" value="a,b">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
          <plank-toggle-group-item value="c">C</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-toggle-group-item")
      expect((items[0] as PlankToggleGroupItem).dataset.state).toBe("on")
      expect((items[1] as PlankToggleGroupItem).dataset.state).toBe("on")
      expect((items[2] as PlankToggleGroupItem).dataset.state).toBe("off")
    })

    it("toggles item on click", async () => {
      container.innerHTML = `
        <plank-toggle-group type="multiple">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-toggle-group-item")
      ;(items[0] as PlankToggleGroupItem).click()
      await group.updateComplete
      expect((items[0] as PlankToggleGroupItem).dataset.state).toBe("on")
      expect(group.value).toBe("a")
    })

    it("can deselect item in multiple mode", async () => {
      container.innerHTML = `
        <plank-toggle-group type="multiple" value="a">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-toggle-group-item")
      ;(items[0] as PlankToggleGroupItem).click()
      await group.updateComplete
      expect((items[0] as PlankToggleGroupItem).dataset.state).toBe("off")
      expect(group.value).toBe("")
    })
  })

  describe("type=single selection", () => {
    it("only allows one item to be selected", async () => {
      container.innerHTML = `
        <plank-toggle-group type="single" value="a">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-toggle-group-item")
      expect((items[0] as PlankToggleGroupItem).dataset.state).toBe("on")
      expect((items[1] as PlankToggleGroupItem).dataset.state).toBe("off")
    })

    it("clicking another item selects it and deselects current", async () => {
      container.innerHTML = `
        <plank-toggle-group type="single" value="a">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-toggle-group-item")
      ;(items[1] as PlankToggleGroupItem).click()
      await group.updateComplete
      expect((items[0] as PlankToggleGroupItem).dataset.state).toBe("off")
      expect((items[1] as PlankToggleGroupItem).dataset.state).toBe("on")
      expect(group.value).toBe("b")
    })

    it("can deselect in single mode by clicking same item", async () => {
      container.innerHTML = `
        <plank-toggle-group type="single" value="a">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-toggle-group-item")
      ;(items[0] as PlankToggleGroupItem).click()
      await group.updateComplete
      expect((items[0] as PlankToggleGroupItem).dataset.state).toBe("off")
      expect(group.value).toBe("")
    })
  })

  describe("keyboard interactions", () => {
    it("toggles on Space key", async () => {
      container.innerHTML = `
        <plank-toggle-group type="multiple">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete

      const event = new KeyboardEvent("keydown", {
        key: " ",
        bubbles: true,
      })
      item.dispatchEvent(event)
      await group.updateComplete
      expect(item.dataset.state).toBe("on")
    })

    it("toggles on Enter key", async () => {
      container.innerHTML = `
        <plank-toggle-group type="multiple">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete

      const event = new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
      })
      item.dispatchEvent(event)
      await group.updateComplete
      expect(item.dataset.state).toBe("on")
    })

    it("does not toggle when disabled", async () => {
      container.innerHTML = `
        <plank-toggle-group type="multiple">
          <plank-toggle-group-item value="a" disabled>A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete

      item.click()
      await group.updateComplete
      expect(item.dataset.state).toBe("off")
    })
  })

  describe("disabled state", () => {
    it("disabled group prevents all selections", async () => {
      container.innerHTML = `
        <plank-toggle-group disabled>
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-toggle-group-item"
      ) as PlankToggleGroupItem
      await item.updateComplete

      item.click()
      await group.updateComplete
      expect(item.dataset.state).toBe("off")
    })

    it("individual item can be disabled", async () => {
      container.innerHTML = `
        <plank-toggle-group>
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b" disabled>B</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-toggle-group-item")

      ;(items[0] as PlankToggleGroupItem).click()
      await group.updateComplete
      expect((items[0] as PlankToggleGroupItem).dataset.state).toBe("on")
      ;(items[1] as PlankToggleGroupItem).click()
      await group.updateComplete
      expect((items[1] as PlankToggleGroupItem).dataset.state).toBe("off")
    })
  })

  describe("events", () => {
    it("fires value-change event on selection", async () => {
      container.innerHTML = `
        <plank-toggle-group type="multiple">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete

      const events: CustomEvent[] = []
      group.addEventListener("value-change", (e) =>
        events.push(e as CustomEvent)
      )

      const items = container.querySelectorAll("plank-toggle-group-item")
      ;(items[0] as PlankToggleGroupItem).click()
      await group.updateComplete

      expect(events.length).toBe(1)
      expect(events[0].detail.value).toBe("a")
    })

    it("fires value-change with multiple values", async () => {
      container.innerHTML = `
        <plank-toggle-group type="multiple" value="a">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete

      const events: CustomEvent[] = []
      group.addEventListener("value-change", (e) =>
        events.push(e as CustomEvent)
      )

      const items = container.querySelectorAll("plank-toggle-group-item")
      ;(items[1] as PlankToggleGroupItem).click()
      await group.updateComplete

      expect(events.length).toBe(1)
      expect(events[0].detail.value).toBe("a,b")
    })
  })

  describe("styling variants", () => {
    it("items have rounded ends by default (spacing=0)", async () => {
      container.innerHTML = `
        <plank-toggle-group>
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
          <plank-toggle-group-item value="c">C</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-toggle-group-item")

      // First item should have left rounding
      expect((items[0] as PlankToggleGroupItem).className).toContain(
        "rounded-l-md"
      )
      // Last item should have right rounding
      expect((items[2] as PlankToggleGroupItem).className).toContain(
        "rounded-r-md"
      )
      // Middle item should have no rounding
      expect(
        (items[1] as PlankToggleGroupItem).className.includes("rounded-l-md")
      ).toBe(false)
      expect(
        (items[1] as PlankToggleGroupItem).className.includes("rounded-r-md")
      ).toBe(false)
    })

    it("outline variant items share border", async () => {
      container.innerHTML = `
        <plank-toggle-group variant="outline">
          <plank-toggle-group-item value="a">A</plank-toggle-group-item>
          <plank-toggle-group-item value="b">B</plank-toggle-group-item>
        </plank-toggle-group>
      `
      await customElements.whenDefined("plank-toggle-group")
      const group = container.querySelector(
        "plank-toggle-group"
      ) as PlankToggleGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-toggle-group-item")

      // First item has border (includes all sides)
      expect((items[0] as PlankToggleGroupItem).className).toContain("border")
      // First item should NOT have border-l-0
      expect(
        (items[0] as PlankToggleGroupItem).className.includes("border-l-0")
      ).toBe(false)
      // Subsequent items have border-l-0 to share border with previous
      expect((items[1] as PlankToggleGroupItem).className).toContain(
        "border-l-0"
      )
    })
  })
})
