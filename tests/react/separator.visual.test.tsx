import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Separator } from "@/components/separator"

describe("Separator (React) - Visual", () => {
  it("horizontal separator", async () => {
    render(
      <div data-testid="container" style={{ width: "200px", padding: "8px" }}>
        <Separator />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("separator-horizontal")
  })

  it("vertical separator", async () => {
    render(
      <div data-testid="container" style={{ height: "100px", display: "flex", padding: "8px" }}>
        <Separator orientation="vertical" />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("separator-vertical")
  })
})
