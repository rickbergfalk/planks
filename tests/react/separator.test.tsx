import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Separator } from "@/components/separator"

describe("Separator (React)", () => {
  it("renders with horizontal orientation by default", () => {
    render(<Separator data-testid="sep" />)
    const sep = screen.getByTestId("sep")
    expect(sep).toBeDefined()
    expect(sep.dataset.slot).toBe("separator")
    expect(sep.dataset.orientation).toBe("horizontal")
  })

  it("renders with vertical orientation", () => {
    render(<Separator orientation="vertical" data-testid="sep" />)
    const sep = screen.getByTestId("sep")
    expect(sep.dataset.orientation).toBe("vertical")
  })

  it("is decorative by default (no separator role)", () => {
    render(<Separator data-testid="sep" />)
    const sep = screen.getByTestId("sep")
    // When decorative, Radix sets role="none"
    expect(sep.getAttribute("role")).toBe("none")
  })

  it("has separator role when not decorative", () => {
    render(<Separator decorative={false} data-testid="sep" />)
    const sep = screen.getByTestId("sep")
    expect(sep.getAttribute("role")).toBe("separator")
  })

  it("applies custom className", () => {
    render(<Separator className="custom-class" data-testid="sep" />)
    const sep = screen.getByTestId("sep")
    expect(sep.classList.contains("custom-class")).toBe(true)
  })
})
