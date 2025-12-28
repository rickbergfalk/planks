import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/plank-radio-group"
import type {
  PlankRadioGroup,
  PlankRadioGroupItem,
} from "../../src/web-components/plank-radio-group"

describe("plank-radio-group", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  describe("PlankRadioGroup", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `<plank-radio-group></plank-radio-group>`
      await customElements.whenDefined("plank-radio-group")
      const el = container.querySelector("plank-radio-group")!
      await (el as PlankRadioGroup).updateComplete
      expect(el.dataset.slot).toBe("radio-group")
    })

    it("defaults to no value", async () => {
      container.innerHTML = `<plank-radio-group></plank-radio-group>`
      await customElements.whenDefined("plank-radio-group")
      const el = container.querySelector("plank-radio-group") as PlankRadioGroup
      await el.updateComplete
      expect(el.value).toBe("")
    })

    it("can be initialized with value attribute", async () => {
      container.innerHTML = `<plank-radio-group value="option1"></plank-radio-group>`
      await customElements.whenDefined("plank-radio-group")
      const el = container.querySelector("plank-radio-group") as PlankRadioGroup
      await el.updateComplete
      expect(el.value).toBe("option1")
    })

    it("has radiogroup role", async () => {
      container.innerHTML = `<plank-radio-group></plank-radio-group>`
      await customElements.whenDefined("plank-radio-group")
      const el = container.querySelector("plank-radio-group") as PlankRadioGroup
      await el.updateComplete
      expect(el.getAttribute("role")).toBe("radiogroup")
    })

    it("applies grid gap-3 styling by default", async () => {
      container.innerHTML = `<plank-radio-group></plank-radio-group>`
      await customElements.whenDefined("plank-radio-group")
      const el = container.querySelector("plank-radio-group") as PlankRadioGroup
      await el.updateComplete
      expect(el.classList.contains("grid")).toBe(true)
      expect(el.classList.contains("gap-3")).toBe(true)
    })

    it("applies custom class", async () => {
      container.innerHTML = `<plank-radio-group class="custom-class"></plank-radio-group>`
      await customElements.whenDefined("plank-radio-group")
      const el = container.querySelector("plank-radio-group") as PlankRadioGroup
      await el.updateComplete
      expect(el.classList.contains("custom-class")).toBe(true)
    })
  })

  describe("PlankRadioGroupItem", () => {
    it("renders with data-slot attribute", async () => {
      container.innerHTML = `
        <plank-radio-group>
          <plank-radio-group-item value="option1"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-radio-group-item"
      ) as PlankRadioGroupItem
      await item.updateComplete
      expect(item.dataset.slot).toBe("radio-group-item")
    })

    it("has radio role", async () => {
      container.innerHTML = `
        <plank-radio-group>
          <plank-radio-group-item value="option1"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-radio-group-item"
      ) as PlankRadioGroupItem
      await item.updateComplete
      expect(item.getAttribute("role")).toBe("radio")
    })

    it("has tabindex=0 when checked", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-radio-group-item"
      ) as PlankRadioGroupItem
      await item.updateComplete
      expect(item.getAttribute("tabindex")).toBe("0")
    })

    it("has tabindex=-1 when not checked (and not first)", async () => {
      container.innerHTML = `
        <plank-radio-group value="option2">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      await (items[0] as PlankRadioGroupItem).updateComplete
      expect(items[0].getAttribute("tabindex")).toBe("-1")
      expect(items[1].getAttribute("tabindex")).toBe("0")
    })

    it("has tabindex=0 on first item when none selected", async () => {
      container.innerHTML = `
        <plank-radio-group>
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      await (items[0] as PlankRadioGroupItem).updateComplete
      expect(items[0].getAttribute("tabindex")).toBe("0")
      expect(items[1].getAttribute("tabindex")).toBe("-1")
    })

    it("has aria-checked=true when selected", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-radio-group-item"
      ) as PlankRadioGroupItem
      await item.updateComplete
      expect(item.getAttribute("aria-checked")).toBe("true")
    })

    it("has aria-checked=false when not selected", async () => {
      container.innerHTML = `
        <plank-radio-group value="option2">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      await (items[0] as PlankRadioGroupItem).updateComplete
      expect(items[0].getAttribute("aria-checked")).toBe("false")
      expect(items[1].getAttribute("aria-checked")).toBe("true")
    })

    it("has data-state=checked when selected", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-radio-group-item"
      ) as PlankRadioGroupItem
      await item.updateComplete
      expect(item.dataset.state).toBe("checked")
    })

    it("has data-state=unchecked when not selected", async () => {
      container.innerHTML = `
        <plank-radio-group value="option2">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      await (items[0] as PlankRadioGroupItem).updateComplete
      expect(items[0].getAttribute("data-state")).toBe("unchecked")
      expect(items[1].getAttribute("data-state")).toBe("checked")
    })

    it("shows indicator circle when checked", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const item = container.querySelector(
        "plank-radio-group-item"
      ) as PlankRadioGroupItem
      await item.updateComplete
      const indicator = item.querySelector(
        "[data-slot='radio-group-indicator']"
      )
      expect(indicator).toBeTruthy()
    })

    it("selects on click", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")

      expect(group.value).toBe("option1")
      ;(items[1] as PlankRadioGroupItem).click()
      await group.updateComplete
      expect(group.value).toBe("option2")
    })

    it("selects on Space key", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")

      items[1].dispatchEvent(new KeyboardEvent("keydown", { key: " " }))
      await group.updateComplete
      expect(group.value).toBe("option2")
    })

    it("navigates and selects with ArrowDown key", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      ;(items[0] as HTMLElement).focus()

      items[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await group.updateComplete
      expect(group.value).toBe("option2")
      expect(document.activeElement).toBe(items[1])
    })

    it("navigates and selects with ArrowUp key", async () => {
      container.innerHTML = `
        <plank-radio-group value="option2">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      ;(items[1] as HTMLElement).focus()

      items[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      )
      await group.updateComplete
      expect(group.value).toBe("option1")
      expect(document.activeElement).toBe(items[0])
    })

    it("navigates and selects with ArrowRight key", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      ;(items[0] as HTMLElement).focus()

      items[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true })
      )
      await group.updateComplete
      expect(group.value).toBe("option2")
      expect(document.activeElement).toBe(items[1])
    })

    it("navigates and selects with ArrowLeft key", async () => {
      container.innerHTML = `
        <plank-radio-group value="option2">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      ;(items[1] as HTMLElement).focus()

      items[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true })
      )
      await group.updateComplete
      expect(group.value).toBe("option1")
      expect(document.activeElement).toBe(items[0])
    })

    it("wraps from last to first with ArrowDown", async () => {
      container.innerHTML = `
        <plank-radio-group value="option2">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      ;(items[1] as HTMLElement).focus()

      items[1].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await group.updateComplete
      expect(group.value).toBe("option1")
      expect(document.activeElement).toBe(items[0])
    })

    it("wraps from first to last with ArrowUp", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      ;(items[0] as HTMLElement).focus()

      items[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true })
      )
      await group.updateComplete
      expect(group.value).toBe("option2")
      expect(document.activeElement).toBe(items[1])
    })

    it("does not select when disabled", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2" disabled></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")

      expect(group.value).toBe("option1")
      ;(items[1] as PlankRadioGroupItem).click()
      await group.updateComplete
      expect(group.value).toBe("option1")
    })

    it("skips disabled items when navigating with arrow keys", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2" disabled></plank-radio-group-item>
          <plank-radio-group-item value="option3"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")
      ;(items[0] as HTMLElement).focus()

      items[0].dispatchEvent(
        new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
      )
      await group.updateComplete
      expect(group.value).toBe("option3")
      expect(document.activeElement).toBe(items[2])
    })
  })

  describe("Events", () => {
    it("fires value-change event when selection changes", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")

      const events: CustomEvent[] = []
      group.addEventListener("value-change", (e) =>
        events.push(e as CustomEvent)
      )
      ;(items[1] as PlankRadioGroupItem).click()
      await group.updateComplete
      expect(events.length).toBe(1)
      expect(events[0].detail.value).toBe("option2")
    })

    it("does not fire event when clicking already selected item", async () => {
      container.innerHTML = `
        <plank-radio-group value="option1">
          <plank-radio-group-item value="option1"></plank-radio-group-item>
          <plank-radio-group-item value="option2"></plank-radio-group-item>
        </plank-radio-group>
      `
      await customElements.whenDefined("plank-radio-group")
      const group = container.querySelector(
        "plank-radio-group"
      ) as PlankRadioGroup
      await group.updateComplete
      const items = container.querySelectorAll("plank-radio-group-item")

      const events: CustomEvent[] = []
      group.addEventListener("value-change", (e) =>
        events.push(e as CustomEvent)
      )
      ;(items[0] as PlankRadioGroupItem).click()
      await group.updateComplete
      expect(events.length).toBe(0)
    })
  })
})
