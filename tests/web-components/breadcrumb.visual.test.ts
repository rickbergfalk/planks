import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/plank-breadcrumb"
import type { PlankBreadcrumb } from "../../src/web-components/plank-breadcrumb"

describe("plank-breadcrumb - Visual", () => {
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
      <plank-breadcrumb>
        <plank-breadcrumb-list>
          <plank-breadcrumb-item>
            <plank-breadcrumb-link href="#">Home</plank-breadcrumb-link>
          </plank-breadcrumb-item>
          <plank-breadcrumb-separator></plank-breadcrumb-separator>
          <plank-breadcrumb-item>
            <plank-breadcrumb-link href="#">Components</plank-breadcrumb-link>
          </plank-breadcrumb-item>
          <plank-breadcrumb-separator></plank-breadcrumb-separator>
          <plank-breadcrumb-item>
            <plank-breadcrumb-page>Breadcrumb</plank-breadcrumb-page>
          </plank-breadcrumb-item>
        </plank-breadcrumb-list>
      </plank-breadcrumb>
    `
    await customElements.whenDefined("plank-breadcrumb")
    const breadcrumb = container.querySelector(
      "plank-breadcrumb"
    ) as PlankBreadcrumb
    await breadcrumb.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "breadcrumb-default"
    )
  })

  it("breadcrumb with ellipsis", async () => {
    container.innerHTML = `
      <plank-breadcrumb>
        <plank-breadcrumb-list>
          <plank-breadcrumb-item>
            <plank-breadcrumb-link href="#">Home</plank-breadcrumb-link>
          </plank-breadcrumb-item>
          <plank-breadcrumb-separator></plank-breadcrumb-separator>
          <plank-breadcrumb-item>
            <plank-breadcrumb-ellipsis></plank-breadcrumb-ellipsis>
          </plank-breadcrumb-item>
          <plank-breadcrumb-separator></plank-breadcrumb-separator>
          <plank-breadcrumb-item>
            <plank-breadcrumb-link href="#">Components</plank-breadcrumb-link>
          </plank-breadcrumb-item>
          <plank-breadcrumb-separator></plank-breadcrumb-separator>
          <plank-breadcrumb-item>
            <plank-breadcrumb-page>Breadcrumb</plank-breadcrumb-page>
          </plank-breadcrumb-item>
        </plank-breadcrumb-list>
      </plank-breadcrumb>
    `
    await customElements.whenDefined("plank-breadcrumb")
    const breadcrumb = container.querySelector(
      "plank-breadcrumb"
    ) as PlankBreadcrumb
    await breadcrumb.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "breadcrumb-ellipsis"
    )
  })
})
