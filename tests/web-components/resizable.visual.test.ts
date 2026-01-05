import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/hal-resizable"

describe("hal-resizable - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "16px"
    container.style.width = "500px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("horizontal resizable panels", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group direction="horizontal" class="min-h-[200px] rounded-lg border">
        <hal-resizable-panel default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Two</span>
          </div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")
    const group = container.querySelector("hal-resizable-panel-group")!
    await (group as any).updateComplete

    // Wait for layout
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => setTimeout(resolve, 50))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "resizable-horizontal"
    )
  })

  it("vertical resizable panels", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group direction="vertical" class="min-h-[200px] rounded-lg border">
        <hal-resizable-panel default-size="25">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Header</span>
          </div>
        </hal-resizable-panel>
        <hal-resizable-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="75">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Content</span>
          </div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")
    const group = container.querySelector("hal-resizable-panel-group")!
    await (group as any).updateComplete

    // Wait for layout
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => setTimeout(resolve, 50))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "resizable-vertical"
    )
  })

  it("resizable with handle grip", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group direction="horizontal" class="min-h-[200px] rounded-lg border">
        <hal-resizable-panel default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </hal-resizable-panel>
        <hal-resizable-handle with-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Two</span>
          </div>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")
    const group = container.querySelector("hal-resizable-panel-group")!
    await (group as any).updateComplete

    // Wait for layout
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => setTimeout(resolve, 50))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "resizable-with-handle"
    )
  })

  it("nested resizable panels", async () => {
    container.innerHTML = `
      <hal-resizable-panel-group direction="horizontal" class="min-h-[200px] rounded-lg border">
        <hal-resizable-panel default-size="50">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </hal-resizable-panel>
        <hal-resizable-handle with-handle></hal-resizable-handle>
        <hal-resizable-panel default-size="50">
          <hal-resizable-panel-group direction="vertical">
            <hal-resizable-panel default-size="25">
              <div class="flex h-full items-center justify-center p-6">
                <span class="font-semibold">Two</span>
              </div>
            </hal-resizable-panel>
            <hal-resizable-handle with-handle></hal-resizable-handle>
            <hal-resizable-panel default-size="75">
              <div class="flex h-full items-center justify-center p-6">
                <span class="font-semibold">Three</span>
              </div>
            </hal-resizable-panel>
          </hal-resizable-panel-group>
        </hal-resizable-panel>
      </hal-resizable-panel-group>
    `
    await customElements.whenDefined("hal-resizable-panel-group")
    const groups = container.querySelectorAll("hal-resizable-panel-group")
    for (const group of groups) {
      await (group as any).updateComplete
    }

    // Wait for layout
    await new Promise((resolve) => requestAnimationFrame(resolve))
    await new Promise((resolve) => setTimeout(resolve, 50))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "resizable-nested"
    )
  })
})
