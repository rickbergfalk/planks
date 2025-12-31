import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/plank-pagination"
import type { PlankPagination } from "../../src/web-components/plank-pagination"

describe("plank-pagination - Visual", () => {
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

  it("default pagination", async () => {
    container.innerHTML = `
      <plank-pagination>
        <plank-pagination-content>
          <plank-pagination-item>
            <plank-pagination-previous href="#"></plank-pagination-previous>
          </plank-pagination-item>
          <plank-pagination-item>
            <plank-pagination-link href="#">1</plank-pagination-link>
          </plank-pagination-item>
          <plank-pagination-item>
            <plank-pagination-link href="#" active>2</plank-pagination-link>
          </plank-pagination-item>
          <plank-pagination-item>
            <plank-pagination-link href="#">3</plank-pagination-link>
          </plank-pagination-item>
          <plank-pagination-item>
            <plank-pagination-ellipsis></plank-pagination-ellipsis>
          </plank-pagination-item>
          <plank-pagination-item>
            <plank-pagination-next href="#"></plank-pagination-next>
          </plank-pagination-item>
        </plank-pagination-content>
      </plank-pagination>
    `
    await customElements.whenDefined("plank-pagination")
    const pagination = container.querySelector(
      "plank-pagination"
    ) as PlankPagination
    await pagination.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "pagination-default"
    )
  })

  it("first page active", async () => {
    container.innerHTML = `
      <plank-pagination>
        <plank-pagination-content>
          <plank-pagination-item>
            <plank-pagination-previous href="#"></plank-pagination-previous>
          </plank-pagination-item>
          <plank-pagination-item>
            <plank-pagination-link href="#" active>1</plank-pagination-link>
          </plank-pagination-item>
          <plank-pagination-item>
            <plank-pagination-link href="#">2</plank-pagination-link>
          </plank-pagination-item>
          <plank-pagination-item>
            <plank-pagination-link href="#">3</plank-pagination-link>
          </plank-pagination-item>
          <plank-pagination-item>
            <plank-pagination-next href="#"></plank-pagination-next>
          </plank-pagination-item>
        </plank-pagination-content>
      </plank-pagination>
    `
    await customElements.whenDefined("plank-pagination")
    const pagination = container.querySelector(
      "plank-pagination"
    ) as PlankPagination
    await pagination.updateComplete
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "pagination-first-active"
    )
  })
})
