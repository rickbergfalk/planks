import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Textarea } from "@/components/textarea"

describe("Textarea (React) - Visual", () => {
  it("default textarea", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <Textarea placeholder="Type your message here..." />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("textarea-default")
  })

  it("disabled textarea", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <Textarea placeholder="Disabled" disabled />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("textarea-disabled")
  })

  it("textarea with value", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <Textarea defaultValue="This is some sample text in the textarea." />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("textarea-with-value")
  })

  it("textarea with rows", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <Textarea rows={6} placeholder="6 rows..." />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("textarea-rows")
  })
})
