import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Switch } from "@/components/switch"

describe("Switch (React) - Visual", () => {
  it("unchecked state", async () => {
    render(<Switch data-testid="switch" />)
    await expect(page.getByTestId("switch")).toMatchScreenshot(
      "switch-unchecked"
    )
  })

  it("checked state", async () => {
    render(<Switch checked data-testid="switch" />)
    await expect(page.getByTestId("switch")).toMatchScreenshot("switch-checked")
  })

  it("disabled unchecked", async () => {
    render(<Switch disabled data-testid="switch" />)
    await expect(page.getByTestId("switch")).toMatchScreenshot(
      "switch-disabled-unchecked"
    )
  })

  it("disabled checked", async () => {
    render(<Switch disabled checked data-testid="switch" />)
    await expect(page.getByTestId("switch")).toMatchScreenshot(
      "switch-disabled-checked"
    )
  })
})
