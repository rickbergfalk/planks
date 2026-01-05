import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/hal-pagination"
import type { HalPagination } from "../../src/web-components/hal-pagination"

describe("hal-pagination - Visual", () => {
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
      <hal-pagination>
        <hal-pagination-content>
          <hal-pagination-item>
            <hal-pagination-previous href="#"></hal-pagination-previous>
          </hal-pagination-item>
          <hal-pagination-item>
            <hal-pagination-link href="#">1</hal-pagination-link>
          </hal-pagination-item>
          <hal-pagination-item>
            <hal-pagination-link href="#" active>2</hal-pagination-link>
          </hal-pagination-item>
          <hal-pagination-item>
            <hal-pagination-link href="#">3</hal-pagination-link>
          </hal-pagination-item>
          <hal-pagination-item>
            <hal-pagination-ellipsis></hal-pagination-ellipsis>
          </hal-pagination-item>
          <hal-pagination-item>
            <hal-pagination-next href="#"></hal-pagination-next>
          </hal-pagination-item>
        </hal-pagination-content>
      </hal-pagination>
    `
    await customElements.whenDefined("hal-pagination")
    await customElements.whenDefined("hal-pagination-link")
    const pagination = container.querySelector(
      "hal-pagination"
    ) as HalPagination
    await pagination.updateComplete

    // Wait for all nested link elements to complete their updates
    const links = container.querySelectorAll("hal-pagination-link")
    await Promise.all([...links].map((el: any) => el.updateComplete))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "pagination-default"
    )
  })

  // TODO: Fix 10px height difference - same issue as navigation-menu active link
  it.skip("first page active", async () => {
    container.innerHTML = `
      <hal-pagination>
        <hal-pagination-content>
          <hal-pagination-item>
            <hal-pagination-previous href="#"></hal-pagination-previous>
          </hal-pagination-item>
          <hal-pagination-item>
            <hal-pagination-link href="#" active>1</hal-pagination-link>
          </hal-pagination-item>
          <hal-pagination-item>
            <hal-pagination-link href="#">2</hal-pagination-link>
          </hal-pagination-item>
          <hal-pagination-item>
            <hal-pagination-link href="#">3</hal-pagination-link>
          </hal-pagination-item>
          <hal-pagination-item>
            <hal-pagination-next href="#"></hal-pagination-next>
          </hal-pagination-item>
        </hal-pagination-content>
      </hal-pagination>
    `
    await customElements.whenDefined("hal-pagination")
    await customElements.whenDefined("hal-pagination-link")
    const pagination = container.querySelector(
      "hal-pagination"
    ) as HalPagination
    await pagination.updateComplete

    // Wait for all nested link elements to complete their updates
    const links = container.querySelectorAll("hal-pagination-link")
    await Promise.all([...links].map((el: any) => el.updateComplete))

    // Wait for paint to complete
    await new Promise((resolve) => requestAnimationFrame(resolve))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "pagination-first-active"
    )
  })
})
