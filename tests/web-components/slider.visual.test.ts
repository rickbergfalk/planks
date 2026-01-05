import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-slider"
import type { HalSlider } from "@/web-components/hal-slider"

describe("hal-slider - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "16px"
    container.style.width = "300px"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("default at 50%", async () => {
    container.innerHTML = `<hal-slider value="50"></hal-slider>`
    await customElements.whenDefined("hal-slider")
    const slider = container.querySelector("hal-slider") as HalSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-default-50"
    )
  })

  it("at 0%", async () => {
    container.innerHTML = `<hal-slider value="0"></hal-slider>`
    await customElements.whenDefined("hal-slider")
    const slider = container.querySelector("hal-slider") as HalSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot("slider-at-0")
  })

  it("at 100%", async () => {
    container.innerHTML = `<hal-slider value="100"></hal-slider>`
    await customElements.whenDefined("hal-slider")
    const slider = container.querySelector("hal-slider") as HalSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-at-100"
    )
  })

  it("disabled", async () => {
    container.innerHTML = `<hal-slider value="50" disabled></hal-slider>`
    await customElements.whenDefined("hal-slider")
    const slider = container.querySelector("hal-slider") as HalSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-disabled"
    )
  })

  it("custom min/max", async () => {
    container.innerHTML = `<hal-slider value="25" min="0" max="50"></hal-slider>`
    await customElements.whenDefined("hal-slider")
    const slider = container.querySelector("hal-slider") as HalSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-custom-range"
    )
  })
})
