import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { Textarea } from "@/components/textarea"

describe("Textarea (React)", () => {
  it("renders with data-slot attribute", () => {
    render(<Textarea data-testid="textarea" />)
    const textarea = screen.getByTestId("textarea")
    expect(textarea.dataset.slot).toBe("textarea")
  })

  it("renders as a native textarea element", () => {
    render(<Textarea data-testid="textarea" />)
    const textarea = screen.getByTestId("textarea")
    expect(textarea.tagName.toLowerCase()).toBe("textarea")
  })

  it("supports placeholder", () => {
    render(<Textarea placeholder="Enter message" data-testid="textarea" />)
    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement
    expect(textarea.placeholder).toBe("Enter message")
  })

  it("can be disabled", () => {
    render(<Textarea disabled data-testid="textarea" />)
    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement
    expect(textarea.disabled).toBe(true)
  })

  it("supports rows attribute", () => {
    render(<Textarea rows={5} data-testid="textarea" />)
    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement
    expect(textarea.rows).toBe(5)
  })

  it("supports value", () => {
    render(<Textarea defaultValue="Hello world" data-testid="textarea" />)
    const textarea = screen.getByTestId("textarea") as HTMLTextAreaElement
    expect(textarea.value).toBe("Hello world")
  })

  it("applies custom className", () => {
    render(<Textarea className="custom-class" data-testid="textarea" />)
    const textarea = screen.getByTestId("textarea")
    expect(textarea.classList.contains("custom-class")).toBe(true)
  })
})
