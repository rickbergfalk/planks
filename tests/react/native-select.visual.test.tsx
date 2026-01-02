import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from "@/components/native-select"

describe("NativeSelect (React) - Visual", () => {
  it("default native-select", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "250px" }}>
        <NativeSelect>
          <NativeSelectOption value="">Select an option</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="orange">Orange</NativeSelectOption>
        </NativeSelect>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-default"
    )
  })

  it("disabled native-select", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "250px" }}>
        <NativeSelect disabled>
          <NativeSelectOption value="">Select an option</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
        </NativeSelect>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-disabled"
    )
  })

  it("native-select with selected value", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "250px" }}>
        <NativeSelect defaultValue="banana">
          <NativeSelectOption value="">Select an option</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
          <NativeSelectOption value="orange">Orange</NativeSelectOption>
        </NativeSelect>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-with-value"
    )
  })

  it("native-select size sm", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "250px" }}>
        <NativeSelect size="sm">
          <NativeSelectOption value="">Select an option</NativeSelectOption>
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="banana">Banana</NativeSelectOption>
        </NativeSelect>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-size-sm"
    )
  })

  it("native-select with optgroup", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "250px" }}>
        <NativeSelect>
          <NativeSelectOption value="">Select a fruit</NativeSelectOption>
          <NativeSelectOptGroup label="Citrus">
            <NativeSelectOption value="orange">Orange</NativeSelectOption>
            <NativeSelectOption value="lemon">Lemon</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Berries">
            <NativeSelectOption value="strawberry">
              Strawberry
            </NativeSelectOption>
            <NativeSelectOption value="blueberry">Blueberry</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "native-select-with-optgroup"
    )
  })
})
