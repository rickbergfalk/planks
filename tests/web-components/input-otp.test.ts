import { describe, it, expect, beforeEach, afterEach } from "vitest"
import "@/web-components/plank-input-otp"
import type {
  PlankInputOtp,
  PlankInputOtpSlot,
} from "@/web-components/plank-input-otp"

describe("plank-input-otp", () => {
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
    it("renders with default attributes", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
            <plank-input-otp-slot index="1"></plank-input-otp-slot>
            <plank-input-otp-slot index="2"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      expect(otp.maxLength).toBe(6)
      expect(otp.value).toBe("")
      expect(otp.dataset.slot).toBe("input-otp")
    })

    it("renders hidden input for accessibility", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="4">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      const input = otp.querySelector("input")
      expect(input).toBeTruthy()
      expect(input?.getAttribute("autocomplete")).toBe("one-time-code")
      expect(input?.getAttribute("maxlength")).toBe("4")
    })

    it("renders with correct data-slot attributes", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
          <plank-input-otp-separator></plank-input-otp-separator>
          <plank-input-otp-group>
            <plank-input-otp-slot index="1"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      expect(otp.dataset.slot).toBe("input-otp")
      expect(
        container
          .querySelector("plank-input-otp-group")
          ?.getAttribute("data-slot")
      ).toBe("input-otp-group")
      expect(
        container
          .querySelector("plank-input-otp-slot")
          ?.getAttribute("data-slot")
      ).toBe("input-otp-slot")
      expect(
        container
          .querySelector("plank-input-otp-separator")
          ?.getAttribute("data-slot")
      ).toBe("input-otp-separator")
    })
  })

  describe("plank-input-otp-group", () => {
    it("has correct styling classes", async () => {
      container.innerHTML = `
        <plank-input-otp>
          <plank-input-otp-group></plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp-group")
      const group = container.querySelector("plank-input-otp-group")!
      await (group as any).updateComplete

      expect(group.className).toContain("flex")
      expect(group.className).toContain("items-center")
    })
  })

  describe("plank-input-otp-slot", () => {
    it("has index property", async () => {
      container.innerHTML = `
        <plank-input-otp>
          <plank-input-otp-group>
            <plank-input-otp-slot index="2"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp-slot")
      const slot = container.querySelector(
        "plank-input-otp-slot"
      )! as PlankInputOtpSlot
      await slot.updateComplete

      expect(slot.index).toBe(2)
    })

    it("has correct styling classes", async () => {
      container.innerHTML = `
        <plank-input-otp>
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp-slot")
      const slot = container.querySelector("plank-input-otp-slot")!
      await (slot as any).updateComplete

      expect(slot.className).toContain("flex")
      expect(slot.className).toContain("h-9")
      expect(slot.className).toContain("w-9")
      expect(slot.className).toContain("items-center")
      expect(slot.className).toContain("justify-center")
      expect(slot.className).toContain("border-y")
      expect(slot.className).toContain("border-r")
    })

    it("displays character when value is set", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6" value="123">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
            <plank-input-otp-slot index="1"></plank-input-otp-slot>
            <plank-input-otp-slot index="2"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      // Wait for slots to update
      await new Promise((r) => setTimeout(r, 50))

      const slots = container.querySelectorAll("plank-input-otp-slot")
      expect(slots[0].textContent).toContain("1")
      expect(slots[1].textContent).toContain("2")
      expect(slots[2].textContent).toContain("3")
    })
  })

  describe("plank-input-otp-separator", () => {
    it("has separator role", async () => {
      container.innerHTML = `
        <plank-input-otp>
          <plank-input-otp-separator></plank-input-otp-separator>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp-separator")
      const separator = container.querySelector("plank-input-otp-separator")!
      await (separator as any).updateComplete

      expect(separator.getAttribute("role")).toBe("separator")
    })

    it("renders minus icon by default", async () => {
      container.innerHTML = `
        <plank-input-otp>
          <plank-input-otp-separator></plank-input-otp-separator>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp-separator")
      const separator = container.querySelector("plank-input-otp-separator")!
      await (separator as any).updateComplete

      const svg = separator.querySelector("svg")
      expect(svg).toBeTruthy()
    })
  })

  describe("value handling", () => {
    it("accepts initial value", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6" value="123456">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      expect(otp.value).toBe("123456")
    })

    it("fires change event on input", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      let changeValue = ""
      otp.addEventListener("change", ((e: CustomEvent) => {
        changeValue = e.detail.value
      }) as EventListener)

      const input = otp.querySelector("input")!
      input.value = "1"
      input.dispatchEvent(new Event("input", { bubbles: true }))

      expect(changeValue).toBe("1")
    })

    it("fires complete event when maxLength reached", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="4">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      let completed = false
      otp.addEventListener("complete", () => {
        completed = true
      })

      const input = otp.querySelector("input")!
      input.value = "1234"
      input.dispatchEvent(new Event("input", { bubbles: true }))

      expect(completed).toBe(true)
    })

    it("truncates value to maxLength", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="4">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      const input = otp.querySelector("input")!
      input.value = "123456789"
      input.dispatchEvent(new Event("input", { bubbles: true }))

      expect(otp.value).toBe("1234")
    })
  })

  describe("pattern validation", () => {
    it("accepts digits only with pattern", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6" pattern="^\\d+$">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      const input = otp.querySelector("input")!

      // First, set a valid digit
      input.value = "1"
      input.dispatchEvent(new Event("input", { bubbles: true }))
      expect(otp.value).toBe("1")

      // Try to set invalid value (letters)
      input.value = "abc"
      input.dispatchEvent(new Event("input", { bubbles: true }))
      // Should revert to previous value
      expect(otp.value).toBe("1")
    })
  })

  describe("disabled state", () => {
    it("sets disabled attribute on input", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6" disabled>
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      const input = otp.querySelector("input")!
      expect(input.disabled).toBe(true)
    })

    it("sets data-disabled on container", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6" disabled>
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      expect(otp.dataset.disabled).toBeDefined()
    })
  })

  describe("input mode", () => {
    it("defaults to numeric input mode", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      const input = otp.querySelector("input")!
      expect(input.getAttribute("inputmode")).toBe("numeric")
    })

    it("accepts text input mode", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6" input-mode="text">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      const input = otp.querySelector("input")!
      expect(input.getAttribute("inputmode")).toBe("text")
    })
  })

  describe("public methods", () => {
    it("focus() focuses the hidden input", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      otp.focus()
      await new Promise((r) => setTimeout(r, 10))

      expect(document.activeElement).toBe(otp.querySelector("input"))
    })

    it("clear() resets the value", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6" value="123">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      expect(otp.value).toBe("123")
      otp.clear()
      expect(otp.value).toBe("")
    })

    it("clear() fires change event", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6" value="123">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      let changeValue: string | null = null
      otp.addEventListener("change", ((e: CustomEvent) => {
        changeValue = e.detail.value
      }) as EventListener)

      otp.clear()
      expect(changeValue).toBe("")
    })
  })

  describe("click to focus", () => {
    it("input is not hidden from pointer events (can receive clicks)", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
            <plank-input-otp-slot index="1"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      const input = otp.querySelector("input")!

      // The input should NOT use sr-only (which hides from pointer events)
      expect(input.className).not.toContain("sr-only")

      // The input should have pointer-events: auto
      expect(input.className).toContain("pointer-events-auto")
    })

    it("input covers the full component area and receives pointer events", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      const input = otp.querySelector("input")!

      // Input should have pointer-events: auto (not be hidden from clicks)
      const inputStyles = getComputedStyle(input)
      expect(inputStyles.pointerEvents).toBe("auto")

      // Input should cover the full area (inset: 0)
      expect(input.className).toContain("inset-0")
      expect(input.className).toContain("w-full")
      expect(input.className).toContain("h-full")
    })
  })

  describe("active slot indication", () => {
    it("sets data-active on focused slot", async () => {
      container.innerHTML = `
        <plank-input-otp max-length="6">
          <plank-input-otp-group>
            <plank-input-otp-slot index="0"></plank-input-otp-slot>
            <plank-input-otp-slot index="1"></plank-input-otp-slot>
          </plank-input-otp-group>
        </plank-input-otp>
      `
      await customElements.whenDefined("plank-input-otp")
      const otp = container.querySelector("plank-input-otp")! as PlankInputOtp
      await otp.updateComplete

      const input = otp.querySelector("input")!
      input.focus()
      input.dispatchEvent(new Event("focus", { bubbles: true }))

      // Wait for state updates
      await new Promise((r) => setTimeout(r, 100))

      const slot0 = container.querySelectorAll("plank-input-otp-slot")[0]
      expect(slot0.getAttribute("data-active")).toBe("true")
    })
  })
})
