import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-native-select"
import type { HalNativeSelect } from "@/web-components/hal-native-select"

/**
 * Visual tests for HalNativeSelect web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("HalNativeSelect (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-native-select")
    const selects = container.querySelectorAll("hal-native-select")
    await Promise.all(
      Array.from(selects).map((s) => (s as HalNativeSelect).updateComplete)
    )
  }

  it("default native-select matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <hal-native-select>
          <hal-native-select-option value="">Select an option</hal-native-select-option>
          <hal-native-select-option value="apple">Apple</hal-native-select-option>
          <hal-native-select-option value="banana">Banana</hal-native-select-option>
          <hal-native-select-option value="orange">Orange</hal-native-select-option>
        </hal-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-default"
    )
  })

  it("disabled native-select matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <hal-native-select disabled>
          <hal-native-select-option value="">Select an option</hal-native-select-option>
          <hal-native-select-option value="apple">Apple</hal-native-select-option>
        </hal-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-disabled"
    )
  })

  it("native-select with selected value matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <hal-native-select value="banana">
          <hal-native-select-option value="">Select an option</hal-native-select-option>
          <hal-native-select-option value="apple">Apple</hal-native-select-option>
          <hal-native-select-option value="banana">Banana</hal-native-select-option>
          <hal-native-select-option value="orange">Orange</hal-native-select-option>
        </hal-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-with-value"
    )
  })

  it("native-select size sm matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <hal-native-select size="sm">
          <hal-native-select-option value="">Select an option</hal-native-select-option>
          <hal-native-select-option value="apple">Apple</hal-native-select-option>
          <hal-native-select-option value="banana">Banana</hal-native-select-option>
        </hal-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-size-sm"
    )
  })

  it("native-select with optgroup matches React", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px; width: 250px;">
        <hal-native-select>
          <hal-native-select-option value="">Select a fruit</hal-native-select-option>
          <hal-native-select-optgroup label="Citrus">
            <hal-native-select-option value="orange">Orange</hal-native-select-option>
            <hal-native-select-option value="lemon">Lemon</hal-native-select-option>
          </hal-native-select-optgroup>
          <hal-native-select-optgroup label="Berries">
            <hal-native-select-option value="strawberry">Strawberry</hal-native-select-option>
            <hal-native-select-option value="blueberry">Blueberry</hal-native-select-option>
          </hal-native-select-optgroup>
        </hal-native-select>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-with-optgroup"
    )
  })
})
