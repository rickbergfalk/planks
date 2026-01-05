import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/hal-breadcrumb"
import type { HalBreadcrumb } from "../../src/web-components/hal-breadcrumb"

describe("hal-breadcrumb - Visual", () => {
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

  it("default breadcrumb", async () => {
    container.innerHTML = `
      <hal-breadcrumb>
        <hal-breadcrumb-list>
          <hal-breadcrumb-item>
            <hal-breadcrumb-link href="#">Home</hal-breadcrumb-link>
          </hal-breadcrumb-item>
          <hal-breadcrumb-separator></hal-breadcrumb-separator>
          <hal-breadcrumb-item>
            <hal-breadcrumb-link href="#">Components</hal-breadcrumb-link>
          </hal-breadcrumb-item>
          <hal-breadcrumb-separator></hal-breadcrumb-separator>
          <hal-breadcrumb-item>
            <hal-breadcrumb-page>Breadcrumb</hal-breadcrumb-page>
          </hal-breadcrumb-item>
        </hal-breadcrumb-list>
      </hal-breadcrumb>
    `
    await customElements.whenDefined("hal-breadcrumb")
    const breadcrumb = container.querySelector(
      "hal-breadcrumb"
    ) as HalBreadcrumb
    await breadcrumb.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "breadcrumb-default"
    )
  })

  it("breadcrumb with ellipsis", async () => {
    container.innerHTML = `
      <hal-breadcrumb>
        <hal-breadcrumb-list>
          <hal-breadcrumb-item>
            <hal-breadcrumb-link href="#">Home</hal-breadcrumb-link>
          </hal-breadcrumb-item>
          <hal-breadcrumb-separator></hal-breadcrumb-separator>
          <hal-breadcrumb-item>
            <hal-breadcrumb-ellipsis></hal-breadcrumb-ellipsis>
          </hal-breadcrumb-item>
          <hal-breadcrumb-separator></hal-breadcrumb-separator>
          <hal-breadcrumb-item>
            <hal-breadcrumb-link href="#">Components</hal-breadcrumb-link>
          </hal-breadcrumb-item>
          <hal-breadcrumb-separator></hal-breadcrumb-separator>
          <hal-breadcrumb-item>
            <hal-breadcrumb-page>Breadcrumb</hal-breadcrumb-page>
          </hal-breadcrumb-item>
        </hal-breadcrumb-list>
      </hal-breadcrumb>
    `
    await customElements.whenDefined("hal-breadcrumb")
    const breadcrumb = container.querySelector(
      "hal-breadcrumb"
    ) as HalBreadcrumb
    await breadcrumb.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "breadcrumb-ellipsis"
    )
  })
})
