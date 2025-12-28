import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/plank-radio-group"
import "../../src/web-components/plank-label"
import type { PlankRadioGroup } from "../../src/web-components/plank-radio-group"

describe("plank-radio-group - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "8px"
    container.style.width = "200px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("with second option selected", async () => {
    container.innerHTML = `
      <plank-radio-group value="comfortable">
        <div class="flex items-center gap-3">
          <plank-radio-group-item value="default" id="r1"></plank-radio-group-item>
          <plank-label for="r1">Default</plank-label>
        </div>
        <div class="flex items-center gap-3">
          <plank-radio-group-item value="comfortable" id="r2"></plank-radio-group-item>
          <plank-label for="r2">Comfortable</plank-label>
        </div>
        <div class="flex items-center gap-3">
          <plank-radio-group-item value="compact" id="r3"></plank-radio-group-item>
          <plank-label for="r3">Compact</plank-label>
        </div>
      </plank-radio-group>
    `
    await customElements.whenDefined("plank-radio-group")
    const group = container.querySelector(
      "plank-radio-group"
    ) as PlankRadioGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "radio-group-selected"
    )
  })

  it("with no option selected", async () => {
    container.innerHTML = `
      <plank-radio-group>
        <div class="flex items-center gap-3">
          <plank-radio-group-item value="default" id="r1"></plank-radio-group-item>
          <plank-label for="r1">Default</plank-label>
        </div>
        <div class="flex items-center gap-3">
          <plank-radio-group-item value="comfortable" id="r2"></plank-radio-group-item>
          <plank-label for="r2">Comfortable</plank-label>
        </div>
        <div class="flex items-center gap-3">
          <plank-radio-group-item value="compact" id="r3"></plank-radio-group-item>
          <plank-label for="r3">Compact</plank-label>
        </div>
      </plank-radio-group>
    `
    await customElements.whenDefined("plank-radio-group")
    const group = container.querySelector(
      "plank-radio-group"
    ) as PlankRadioGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "radio-group-unselected"
    )
  })
})
