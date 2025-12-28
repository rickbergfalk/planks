import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-toggle-group"
import type { PlankToggleGroup } from "@/web-components/plank-toggle-group"

describe("plank-toggle-group - Visual", () => {
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
      <plank-toggle-group type="multiple" value="bold,italic">
        <plank-toggle-group-item value="bold" aria-label="Bold">B</plank-toggle-group-item>
        <plank-toggle-group-item value="italic" aria-label="Italic">I</plank-toggle-group-item>
        <plank-toggle-group-item value="underline" aria-label="Underline">U</plank-toggle-group-item>
      </plank-toggle-group>
    `
    await customElements.whenDefined("plank-toggle-group")
    const group = container.querySelector(
      "plank-toggle-group"
    ) as PlankToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-multiple-selected"
    )
  })

  it("single with selection", async () => {
    container.innerHTML = `
      <plank-toggle-group type="single" value="center">
        <plank-toggle-group-item value="left" aria-label="Left">L</plank-toggle-group-item>
        <plank-toggle-group-item value="center" aria-label="Center">C</plank-toggle-group-item>
        <plank-toggle-group-item value="right" aria-label="Right">R</plank-toggle-group-item>
      </plank-toggle-group>
    `
    await customElements.whenDefined("plank-toggle-group")
    const group = container.querySelector(
      "plank-toggle-group"
    ) as PlankToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-single-selected"
    )
  })

  it("outline variant", async () => {
    container.innerHTML = `
      <plank-toggle-group type="multiple" variant="outline" value="bold">
        <plank-toggle-group-item value="bold" aria-label="Bold">B</plank-toggle-group-item>
        <plank-toggle-group-item value="italic" aria-label="Italic">I</plank-toggle-group-item>
        <plank-toggle-group-item value="underline" aria-label="Underline">U</plank-toggle-group-item>
      </plank-toggle-group>
    `
    await customElements.whenDefined("plank-toggle-group")
    const group = container.querySelector(
      "plank-toggle-group"
    ) as PlankToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-outline"
    )
  })

  it("small size", async () => {
    container.innerHTML = `
      <plank-toggle-group type="multiple" size="sm" value="bold">
        <plank-toggle-group-item value="bold" aria-label="Bold">B</plank-toggle-group-item>
        <plank-toggle-group-item value="italic" aria-label="Italic">I</plank-toggle-group-item>
        <plank-toggle-group-item value="underline" aria-label="Underline">U</plank-toggle-group-item>
      </plank-toggle-group>
    `
    await customElements.whenDefined("plank-toggle-group")
    const group = container.querySelector(
      "plank-toggle-group"
    ) as PlankToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-sm"
    )
  })

  it("large size", async () => {
    container.innerHTML = `
      <plank-toggle-group type="multiple" size="lg" value="bold">
        <plank-toggle-group-item value="bold" aria-label="Bold">B</plank-toggle-group-item>
        <plank-toggle-group-item value="italic" aria-label="Italic">I</plank-toggle-group-item>
        <plank-toggle-group-item value="underline" aria-label="Underline">U</plank-toggle-group-item>
      </plank-toggle-group>
    `
    await customElements.whenDefined("plank-toggle-group")
    const group = container.querySelector(
      "plank-toggle-group"
    ) as PlankToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-lg"
    )
  })

  it("with disabled item", async () => {
    container.innerHTML = `
      <plank-toggle-group type="multiple" value="bold">
        <plank-toggle-group-item value="bold" aria-label="Bold">B</plank-toggle-group-item>
        <plank-toggle-group-item value="italic" aria-label="Italic" disabled>I</plank-toggle-group-item>
        <plank-toggle-group-item value="underline" aria-label="Underline">U</plank-toggle-group-item>
      </plank-toggle-group>
    `
    await customElements.whenDefined("plank-toggle-group")
    const group = container.querySelector(
      "plank-toggle-group"
    ) as PlankToggleGroup
    await group.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "toggle-group-disabled-item"
    )
  })
})
