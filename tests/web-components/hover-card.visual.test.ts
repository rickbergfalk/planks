import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-hover-card"
import "@/web-components/hal-button"
import "@/web-components/hal-avatar"

describe("hal-hover-card - Visual", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
    // Clean up any portaled content
    document
      .querySelectorAll('body > div[style*="position: fixed"]')
      .forEach((el) => {
        el.remove()
      })
  })

  it("hover card open below trigger", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 60px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <hal-hover-card open>
          <hal-hover-card-trigger>
            <hal-button variant="link">@nextjs</hal-button>
          </hal-hover-card-trigger>
          <hal-hover-card-content>
            <div class="flex justify-between gap-4">
              <hal-avatar>
                <hal-avatar-fallback>VC</hal-avatar-fallback>
              </hal-avatar>
              <div class="space-y-1">
                <h4 class="text-sm font-semibold">@nextjs</h4>
                <p class="text-sm">
                  The React Framework – created and maintained by @vercel.
                </p>
                <div class="text-muted-foreground text-xs">
                  Joined December 2021
                </div>
              </div>
            </div>
          </hal-hover-card-content>
        </hal-hover-card>
      </div>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "hover-card-bottom"
    )
  })

  it("hover card with different alignments", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 80px 120px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <hal-hover-card open>
          <hal-hover-card-trigger>
            <hal-button variant="link">@nextjs</hal-button>
          </hal-hover-card-trigger>
          <hal-hover-card-content align="start">
            <div class="space-y-1">
              <h4 class="text-sm font-semibold">@nextjs</h4>
              <p class="text-sm">The React Framework</p>
            </div>
          </hal-hover-card-content>
        </hal-hover-card>
      </div>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "hover-card-align-start"
    )
  })

  it("hover card with custom width", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 60px; display: flex; justify-content: center; align-items: flex-start;"
      >
        <hal-hover-card open>
          <hal-hover-card-trigger>
            <hal-button variant="link">@nextjs</hal-button>
          </hal-hover-card-trigger>
          <hal-hover-card-content class="w-80">
            <div class="flex justify-between gap-4">
              <hal-avatar>
                <hal-avatar-fallback>VC</hal-avatar-fallback>
              </hal-avatar>
              <div class="space-y-1">
                <h4 class="text-sm font-semibold">@nextjs</h4>
                <p class="text-sm">
                  The React Framework – created and maintained by @vercel.
                </p>
                <div class="text-muted-foreground text-xs">
                  Joined December 2021
                </div>
              </div>
            </div>
          </hal-hover-card-content>
        </hal-hover-card>
      </div>
    `

    await customElements.whenDefined("hal-hover-card")
    const hoverCard = container.querySelector("hal-hover-card")!
    await (hoverCard as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "hover-card-w-80"
    )
  })
})
