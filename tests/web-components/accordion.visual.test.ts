import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/hal-accordion"
import type { HalAccordion } from "../../src/web-components/hal-accordion"

describe("hal-accordion - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "8px"
    container.style.width = "350px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("all closed state", async () => {
    container.innerHTML = `
      <hal-accordion collapsible class="w-full">
        <hal-accordion-item value="item-1">
          <hal-accordion-trigger>Is it accessible?</hal-accordion-trigger>
          <hal-accordion-content>
            Yes. It adheres to the WAI-ARIA design pattern.
          </hal-accordion-content>
        </hal-accordion-item>
        <hal-accordion-item value="item-2">
          <hal-accordion-trigger>Is it styled?</hal-accordion-trigger>
          <hal-accordion-content>
            Yes. It comes with default styles that matches the other components.
          </hal-accordion-content>
        </hal-accordion-item>
        <hal-accordion-item value="item-3">
          <hal-accordion-trigger>Is it animated?</hal-accordion-trigger>
          <hal-accordion-content>
            Yes. It's animated by default.
          </hal-accordion-content>
        </hal-accordion-item>
      </hal-accordion>
    `
    await customElements.whenDefined("hal-accordion")
    const accordion = container.querySelector("hal-accordion") as HalAccordion
    await accordion.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "accordion-closed"
    )
  })

  it("first item open state", async () => {
    container.innerHTML = `
      <hal-accordion collapsible value="item-1" class="w-full">
        <hal-accordion-item value="item-1">
          <hal-accordion-trigger>Is it accessible?</hal-accordion-trigger>
          <hal-accordion-content>
            Yes. It adheres to the WAI-ARIA design pattern.
          </hal-accordion-content>
        </hal-accordion-item>
        <hal-accordion-item value="item-2">
          <hal-accordion-trigger>Is it styled?</hal-accordion-trigger>
          <hal-accordion-content>
            Yes. It comes with default styles that matches the other components.
          </hal-accordion-content>
        </hal-accordion-item>
        <hal-accordion-item value="item-3">
          <hal-accordion-trigger>Is it animated?</hal-accordion-trigger>
          <hal-accordion-content>
            Yes. It's animated by default.
          </hal-accordion-content>
        </hal-accordion-item>
      </hal-accordion>
    `
    await customElements.whenDefined("hal-accordion")
    const accordion = container.querySelector("hal-accordion") as HalAccordion
    await accordion.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "accordion-open"
    )
  })
})
