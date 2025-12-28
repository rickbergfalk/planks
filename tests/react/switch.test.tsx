import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Switch } from "@/components/switch"

describe("Switch (React)", () => {
  it("renders with default unchecked state", () => {
    render(<Switch />)
    const switchEl = screen.getByRole("switch")
    expect(switchEl).toBeDefined()
    expect(switchEl.dataset.slot).toBe("switch")
    expect(switchEl.dataset.state).toBe("unchecked")
  })

  it("renders in checked state when defaultChecked", () => {
    render(<Switch defaultChecked />)
    const switchEl = screen.getByRole("switch")
    expect(switchEl.dataset.state).toBe("checked")
  })

  it("renders in checked state when checked prop is true", () => {
    render(<Switch checked />)
    const switchEl = screen.getByRole("switch")
    expect(switchEl.dataset.state).toBe("checked")
  })

  it("has correct aria-checked attribute", () => {
    const { rerender } = render(<Switch />)
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe(
      "false"
    )

    rerender(<Switch checked />)
    expect(screen.getByRole("switch").getAttribute("aria-checked")).toBe("true")
  })

  it("can be disabled", () => {
    render(<Switch disabled />)
    const switchEl = screen.getByRole("switch")
    expect(switchEl.hasAttribute("disabled")).toBe(true)
    expect(switchEl.dataset.disabled).toBeDefined()
  })

  it("toggles state on click", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch onCheckedChange={onCheckedChange} />)

    const switchEl = screen.getByRole("switch")
    expect(switchEl.dataset.state).toBe("unchecked")

    await user.click(switchEl)
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it("toggles state on Space key", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch onCheckedChange={onCheckedChange} />)

    const switchEl = screen.getByRole("switch")
    switchEl.focus()
    await user.keyboard(" ")

    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup()
    const onCheckedChange = vi.fn()
    render(<Switch disabled onCheckedChange={onCheckedChange} />)

    const switchEl = screen.getByRole("switch")
    await user.click(switchEl)

    expect(onCheckedChange).not.toHaveBeenCalled()
  })

  it("applies custom className", () => {
    render(<Switch className="custom-class" />)
    const switchEl = screen.getByRole("switch")
    expect(switchEl.classList.contains("custom-class")).toBe(true)
  })

  it("forwards id attribute", () => {
    render(<Switch id="my-switch" />)
    const switchEl = screen.getByRole("switch")
    expect(switchEl.id).toBe("my-switch")
  })

  it("has a thumb element", () => {
    render(<Switch />)
    const switchEl = screen.getByRole("switch")
    const thumb = switchEl.querySelector('[data-slot="switch-thumb"]')
    expect(thumb).toBeDefined()
  })

  it("thumb has correct data-state", () => {
    const { rerender } = render(<Switch />)
    let thumb = screen
      .getByRole("switch")
      .querySelector('[data-slot="switch-thumb"]')
    expect(thumb?.getAttribute("data-state")).toBe("unchecked")

    rerender(<Switch checked />)
    thumb = screen
      .getByRole("switch")
      .querySelector('[data-slot="switch-thumb"]')
    expect(thumb?.getAttribute("data-state")).toBe("checked")
  })
})
