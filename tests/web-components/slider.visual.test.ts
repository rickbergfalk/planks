import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-slider"
import type { PlankSlider } from "@/web-components/plank-slider"

describe("plank-slider - Visual", () => {
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
    container.innerHTML = `<plank-slider value="50"></plank-slider>`
    await customElements.whenDefined("plank-slider")
    const slider = container.querySelector("plank-slider") as PlankSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-default-50"
    )
  })

  it("at 0%", async () => {
    container.innerHTML = `<plank-slider value="0"></plank-slider>`
    await customElements.whenDefined("plank-slider")
    const slider = container.querySelector("plank-slider") as PlankSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot("slider-at-0")
  })

  it("at 100%", async () => {
    container.innerHTML = `<plank-slider value="100"></plank-slider>`
    await customElements.whenDefined("plank-slider")
    const slider = container.querySelector("plank-slider") as PlankSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-at-100",
      { comparatorOptions: { allowedMismatchedPixelRatio: 0.02 } }
    )
  })

  it("disabled", async () => {
    container.innerHTML = `<plank-slider value="50" disabled></plank-slider>`
    await customElements.whenDefined("plank-slider")
    const slider = container.querySelector("plank-slider") as PlankSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-disabled",
      { comparatorOptions: { allowedMismatchedPixelRatio: 0.02 } }
    )
  })

  it("custom min/max", async () => {
    container.innerHTML = `<plank-slider value="25" min="0" max="50"></plank-slider>`
    await customElements.whenDefined("plank-slider")
    const slider = container.querySelector("plank-slider") as PlankSlider
    await slider.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "slider-custom-range"
    )
  })
})
