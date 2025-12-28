import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import { Slider } from "@/components/slider"

describe("Slider (React) - Visual", () => {
  it("default at 50%", async () => {
    render(
      <div data-testid="container" style={{ padding: "16px", width: "300px" }}>
        <Slider defaultValue={[50]} />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-default-50"
    )
  })

  it("at 0%", async () => {
    render(
      <div data-testid="container" style={{ padding: "16px", width: "300px" }}>
        <Slider defaultValue={[0]} />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("slider-at-0")
  })

  it("at 100%", async () => {
    render(
      <div data-testid="container" style={{ padding: "16px", width: "300px" }}>
        <Slider defaultValue={[100]} />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-at-100"
    )
  })

  it("disabled", async () => {
    render(
      <div data-testid="container" style={{ padding: "16px", width: "300px" }}>
        <Slider defaultValue={[50]} disabled />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-disabled"
    )
  })

  it("custom min/max", async () => {
    render(
      <div data-testid="container" style={{ padding: "16px", width: "300px" }}>
        <Slider defaultValue={[25]} min={0} max={50} />
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-custom-range"
    )
  })
})
