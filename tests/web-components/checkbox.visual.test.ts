import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-checkbox"
import type { PlankCheckbox } from "@/web-components/plank-checkbox"

describe("PlankCheckbox (Web Component) - Visual", () => {
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
    await customElements.whenDefined("plank-checkbox")
    const elements = container.querySelectorAll("plank-checkbox")
    await Promise.all(
      Array.from(elements).map((el) => (el as PlankCheckbox).updateComplete)
    )
  }

  it("unchecked state", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <plank-checkbox></plank-checkbox>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-unchecked"
    )
  })

  it("checked state", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <plank-checkbox checked></plank-checkbox>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-checked"
    )
  })

  it("disabled unchecked", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <plank-checkbox disabled></plank-checkbox>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-disabled-unchecked"
    )
  })

  it("disabled checked", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <plank-checkbox disabled checked></plank-checkbox>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "checkbox-disabled-checked"
    )
  })
})
