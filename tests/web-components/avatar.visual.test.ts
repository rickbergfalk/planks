import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-avatar"
import type { HalAvatar } from "@/web-components/hal-avatar"

describe("HalAvatar (Web Component) - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  async function renderAndWait(html: string): Promise<void> {
    container.innerHTML = html
    await customElements.whenDefined("hal-avatar")
    await customElements.whenDefined("hal-avatar-fallback")
    const elements = container.querySelectorAll("hal-avatar")
    await Promise.all(
      Array.from(elements).map((el) => (el as HalAvatar).updateComplete)
    )
  }

  it("with fallback only", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-avatar>
          <hal-avatar-fallback>CN</hal-avatar-fallback>
        </hal-avatar>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "avatar-fallback"
    )
  })

  it("with custom rounded-lg", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <hal-avatar class="rounded-lg">
          <hal-avatar-fallback>ER</hal-avatar-fallback>
        </hal-avatar>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "avatar-rounded-lg"
    )
  })

  it("multiple avatars stacked", async () => {
    await renderAndWait(`
      <div data-testid="container" style="padding: 8px">
        <div class="flex -space-x-2">
          <hal-avatar>
            <hal-avatar-fallback>A</hal-avatar-fallback>
          </hal-avatar>
          <hal-avatar>
            <hal-avatar-fallback>B</hal-avatar-fallback>
          </hal-avatar>
          <hal-avatar>
            <hal-avatar-fallback>C</hal-avatar-fallback>
          </hal-avatar>
        </div>
      </div>
    `)
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "avatar-stacked"
    )
  })
})
