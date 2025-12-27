import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/button"

describe("Button (React)", () => {
  it("renders with default variant", () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole("button", { name: "Click me" })
    expect(button).toBeDefined()
    expect(button.dataset.slot).toBe("button")
    expect(button.dataset.variant).toBe("default")
  })

  it("renders with destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole("button", { name: "Delete" })
    expect(button.dataset.variant).toBe("destructive")
  })

  it("renders with different sizes", () => {
    render(<Button size="sm">Small</Button>)
    const button = screen.getByRole("button", { name: "Small" })
    expect(button.dataset.size).toBe("sm")
  })

  it("applies custom className", () => {
    render(<Button className="custom-class">Custom</Button>)
    const button = screen.getByRole("button", { name: "Custom" })
    expect(button.classList.contains("custom-class")).toBe(true)
  })

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>)
    const button = screen.getByRole("button", { name: "Disabled" })
    expect(button.hasAttribute("disabled")).toBe(true)
  })
})
