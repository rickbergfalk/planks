import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-native-select"
import type { PlankNativeSelect } from "@/web-components/plank-native-select"

/**
 * Visual tests for PlankNativeSelect web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("PlankNativeSelect (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("plank-native-select")
    const selects = container.querySelectorAll("plank-native-select")
    await Promise.all(
      Array.from(selects).map((s) => (s as PlankNativeSelect).updateComplete)
    )
  }

  it("default native-select matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <plank-native-select>
          <plank-native-select-option value="">Select an option</plank-native-select-option>
          <plank-native-select-option value="apple">Apple</plank-native-select-option>
          <plank-native-select-option value="banana">Banana</plank-native-select-option>
          <plank-native-select-option value="orange">Orange</plank-native-select-option>
        </plank-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-default"
    )
  })

  it("disabled native-select matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <plank-native-select disabled>
          <plank-native-select-option value="">Select an option</plank-native-select-option>
          <plank-native-select-option value="apple">Apple</plank-native-select-option>
        </plank-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-disabled"
    )
  })

  it("native-select with selected value matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <plank-native-select value="banana">
          <plank-native-select-option value="">Select an option</plank-native-select-option>
          <plank-native-select-option value="apple">Apple</plank-native-select-option>
          <plank-native-select-option value="banana">Banana</plank-native-select-option>
          <plank-native-select-option value="orange">Orange</plank-native-select-option>
        </plank-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-with-value"
    )
  })

  it("native-select size sm matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <plank-native-select size="sm">
          <plank-native-select-option value="">Select an option</plank-native-select-option>
          <plank-native-select-option value="apple">Apple</plank-native-select-option>
          <plank-native-select-option value="banana">Banana</plank-native-select-option>
        </plank-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-size-sm"
    )
  })

  it("native-select with optgroup matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <plank-native-select>
          <plank-native-select-option value="">Select a fruit</plank-native-select-option>
          <plank-native-select-optgroup label="Citrus">
            <plank-native-select-option value="orange">Orange</plank-native-select-option>
            <plank-native-select-option value="lemon">Lemon</plank-native-select-option>
          </plank-native-select-optgroup>
          <plank-native-select-optgroup label="Berries">
            <plank-native-select-option value="strawberry">Strawberry</plank-native-select-option>
            <plank-native-select-option value="blueberry">Blueberry</plank-native-select-option>
          </plank-native-select-optgroup>
        </plank-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-with-optgroup"
    )
  })
})
