import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-checkbox"
import type { HalCheckbox } from "@/web-components/hal-checkbox"

describe("HalCheckbox (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-checkbox")
    const elements = container.querySelectorAll("hal-checkbox")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalCheckbox).updateComplete)
    )
  }

  it("unchecked state", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-checkbox></hal-checkbox>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-unchecked"
    )
  })

  it("checked state", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-checkbox checked></hal-checkbox>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-checked"
    )
  })

  it("disabled unchecked", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-checkbox disabled></hal-checkbox>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-disabled-unchecked"
    )
  })

  it("disabled checked", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-checkbox disabled checked></hal-checkbox>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-disabled-checked"
    )
  })
})
