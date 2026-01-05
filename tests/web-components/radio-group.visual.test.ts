import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/hal-radio-group"
import "../../src/web-components/hal-label"
import type { HalRadioGroup } from "../../src/web-components/hal-radio-group"

describe("hal-radio-group - Visual", () => {
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
      <hal-radio-group value="comfortable">
        <div class="flex items-center gap-3">
          <hal-radio-group-item value="default" id="r1"></hal-radio-group-item>
          <hal-label for="r1">Default</hal-label>
        </div>
        <div class="flex items-center gap-3">
          <hal-radio-group-item value="comfortable" id="r2"></hal-radio-group-item>
          <hal-label for="r2">Comfortable</hal-label>
        </div>
        <div class="flex items-center gap-3">
          <hal-radio-group-item value="compact" id="r3"></hal-radio-group-item>
          <hal-label for="r3">Compact</hal-label>
        </div>
      </hal-radio-group>
    `
    await customElements.whenDefined("hal-radio-group")
    const group = container.querySelector("hal-radio-group") as HalRadioGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "radio-group-selected"
    )
  })

  it("with no option selected", async () => {
    container.innerHTML = `
      <hal-radio-group>
        <div class="flex items-center gap-3">
          <hal-radio-group-item value="default" id="r1"></hal-radio-group-item>
          <hal-label for="r1">Default</hal-label>
        </div>
        <div class="flex items-center gap-3">
          <hal-radio-group-item value="comfortable" id="r2"></hal-radio-group-item>
          <hal-label for="r2">Comfortable</hal-label>
        </div>
        <div class="flex items-center gap-3">
          <hal-radio-group-item value="compact" id="r3"></hal-radio-group-item>
          <hal-label for="r3">Compact</hal-label>
        </div>
      </hal-radio-group>
    `
    await customElements.whenDefined("hal-radio-group")
    const group = container.querySelector("hal-radio-group") as HalRadioGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "radio-group-unselected"
    )
  })
})
