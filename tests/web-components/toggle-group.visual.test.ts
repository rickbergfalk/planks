import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-toggle-group"
import type { HalToggleGroup } from "@/web-components/hal-toggle-group"

describe("hal-toggle-group - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "8px"
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("multiple with selection", async () => {
    container.innerHTML = `
      <hal-toggle-group type="multiple" value="bold,italic">
        <hal-toggle-group-item value="bold" aria-label="Bold">B</hal-toggle-group-item>
        <hal-toggle-group-item value="italic" aria-label="Italic">I</hal-toggle-group-item>
        <hal-toggle-group-item value="underline" aria-label="Underline">U</hal-toggle-group-item>
      </hal-toggle-group>
    `
    await customElements.whenDefined("hal-toggle-group")
    const group = container.querySelector("hal-toggle-group") as HalToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-multiple-selected"
    )
  })

  it("single with selection", async () => {
    container.innerHTML = `
      <hal-toggle-group type="single" value="center">
        <hal-toggle-group-item value="left" aria-label="Left">L</hal-toggle-group-item>
        <hal-toggle-group-item value="center" aria-label="Center">C</hal-toggle-group-item>
        <hal-toggle-group-item value="right" aria-label="Right">R</hal-toggle-group-item>
      </hal-toggle-group>
    `
    await customElements.whenDefined("hal-toggle-group")
    const group = container.querySelector("hal-toggle-group") as HalToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-single-selected"
    )
  })

  it("outline variant", async () => {
    container.innerHTML = `
      <hal-toggle-group type="multiple" variant="outline" value="bold">
        <hal-toggle-group-item value="bold" aria-label="Bold">B</hal-toggle-group-item>
        <hal-toggle-group-item value="italic" aria-label="Italic">I</hal-toggle-group-item>
        <hal-toggle-group-item value="underline" aria-label="Underline">U</hal-toggle-group-item>
      </hal-toggle-group>
    `
    await customElements.whenDefined("hal-toggle-group")
    const group = container.querySelector("hal-toggle-group") as HalToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-outline"
    )
  })

  it("small size", async () => {
    container.innerHTML = `
      <hal-toggle-group type="multiple" size="sm" value="bold">
        <hal-toggle-group-item value="bold" aria-label="Bold">B</hal-toggle-group-item>
        <hal-toggle-group-item value="italic" aria-label="Italic">I</hal-toggle-group-item>
        <hal-toggle-group-item value="underline" aria-label="Underline">U</hal-toggle-group-item>
      </hal-toggle-group>
    `
    await customElements.whenDefined("hal-toggle-group")
    const group = container.querySelector("hal-toggle-group") as HalToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-sm"
    )
  })

  it("large size", async () => {
    container.innerHTML = `
      <hal-toggle-group type="multiple" size="lg" value="bold">
        <hal-toggle-group-item value="bold" aria-label="Bold">B</hal-toggle-group-item>
        <hal-toggle-group-item value="italic" aria-label="Italic">I</hal-toggle-group-item>
        <hal-toggle-group-item value="underline" aria-label="Underline">U</hal-toggle-group-item>
      </hal-toggle-group>
    `
    await customElements.whenDefined("hal-toggle-group")
    const group = container.querySelector("hal-toggle-group") as HalToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-lg"
    )
  })

  it("with disabled item", async () => {
    container.innerHTML = `
      <hal-toggle-group type="multiple" value="bold">
        <hal-toggle-group-item value="bold" aria-label="Bold">B</hal-toggle-group-item>
        <hal-toggle-group-item value="italic" aria-label="Italic" disabled>I</hal-toggle-group-item>
        <hal-toggle-group-item value="underline" aria-label="Underline">U</hal-toggle-group-item>
      </hal-toggle-group>
    `
    await customElements.whenDefined("hal-toggle-group")
    const group = container.querySelector("hal-toggle-group") as HalToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-disabled-item"
    )
  })
})
