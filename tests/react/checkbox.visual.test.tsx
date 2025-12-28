import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Checkbox } from "@/components/checkbox"

describe("Checkbox (React) - Visual", () => {
  it("unchecked state", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Checkbox />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-unchecked"
    )
  })

  it("checked state", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Checkbox checked />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-checked"
    )
  })

  it("disabled unchecked", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Checkbox disabled />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-disabled-unchecked"
    )
  })

  it("disabled checked", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px" }}>
        <Checkbox disabled checked />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-disabled-checked"
    )
  })
})
