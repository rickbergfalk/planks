import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Progress } from "@/components/progress"

describe("Progress (React) - Visual", () => {
  it("progress at 0%", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <Progress value={0} />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("progress-0")
  })

  it("progress at 33%", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <Progress value={33} />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("progress-33")
  })

  it("progress at 66%", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <Progress value={66} />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("progress-66")
  })

  it("progress at 100%", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "300px" }}>
        <Progress value={100} />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "progress-100"
    )
  })
})
