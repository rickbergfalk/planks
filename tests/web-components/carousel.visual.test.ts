import { describe, it, expect, beforeEach } from "vitest"
import { page } from "vitest/browser"
import "../../src/web-components/plank-carousel"
import "../../src/web-components/plank-card"
import type { PlankCarousel } from "../../src/web-components/plank-carousel"

describe("plank-carousel - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.setAttribute("data-testid", "container")
    container.style.padding = "48px" // Extra padding for absolute positioned buttons
    container.style.width = "350px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("horizontal carousel", async () => {
    container.innerHTML = `
      <plank-carousel class="w-full max-w-xs">
        <plank-carousel-content>
          <plank-carousel-item>
            <div class="p-1">
              <plank-card>
                <plank-card-content class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">1</span>
                </plank-card-content>
              </plank-card>
            </div>
          </plank-carousel-item>
          <plank-carousel-item>
            <div class="p-1">
              <plank-card>
                <plank-card-content class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">2</span>
                </plank-card-content>
              </plank-card>
            </div>
          </plank-carousel-item>
          <plank-carousel-item>
            <div class="p-1">
              <plank-card>
                <plank-card-content class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">3</span>
                </plank-card-content>
              </plank-card>
            </div>
          </plank-carousel-item>
        </plank-carousel-content>
        <plank-carousel-previous></plank-carousel-previous>
        <plank-carousel-next></plank-carousel-next>
      </plank-carousel>
    `
    await customElements.whenDefined("plank-carousel")
    const carousel = container.querySelector("plank-carousel") as PlankCarousel
    await carousel.updateComplete
    // Allow time for embla to initialize
    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "carousel-horizontal"
    )
  })

  it("vertical carousel", async () => {
    container.innerHTML = `
      <plank-carousel orientation="vertical" class="w-full max-w-xs">
        <plank-carousel-content class="h-[200px]">
          <plank-carousel-item>
            <div class="p-1">
              <plank-card>
                <plank-card-content class="flex items-center justify-center p-6">
                  <span class="text-3xl font-semibold">1</span>
                </plank-card-content>
              </plank-card>
            </div>
          </plank-carousel-item>
          <plank-carousel-item>
            <div class="p-1">
              <plank-card>
                <plank-card-content class="flex items-center justify-center p-6">
                  <span class="text-3xl font-semibold">2</span>
                </plank-card-content>
              </plank-card>
            </div>
          </plank-carousel-item>
          <plank-carousel-item>
            <div class="p-1">
              <plank-card>
                <plank-card-content class="flex items-center justify-center p-6">
                  <span class="text-3xl font-semibold">3</span>
                </plank-card-content>
              </plank-card>
            </div>
          </plank-carousel-item>
        </plank-carousel-content>
        <plank-carousel-previous></plank-carousel-previous>
        <plank-carousel-next></plank-carousel-next>
      </plank-carousel>
    `
    await customElements.whenDefined("plank-carousel")
    const carousel = container.querySelector("plank-carousel") as PlankCarousel
    await carousel.updateComplete
    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "carousel-vertical"
    )
  })

  it("carousel with disabled button", async () => {
    container.innerHTML = `
      <plank-carousel class="w-full max-w-xs">
        <plank-carousel-content>
          <plank-carousel-item>
            <div class="p-1">
              <plank-card>
                <plank-card-content class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">1</span>
                </plank-card-content>
              </plank-card>
            </div>
          </plank-carousel-item>
          <plank-carousel-item>
            <div class="p-1">
              <plank-card>
                <plank-card-content class="flex aspect-square items-center justify-center p-6">
                  <span class="text-4xl font-semibold">2</span>
                </plank-card-content>
              </plank-card>
            </div>
          </plank-carousel-item>
        </plank-carousel-content>
        <plank-carousel-previous></plank-carousel-previous>
        <plank-carousel-next></plank-carousel-next>
      </plank-carousel>
    `
    await customElements.whenDefined("plank-carousel")
    const carousel = container.querySelector("plank-carousel") as PlankCarousel
    await carousel.updateComplete
    // Allow time for embla to initialize and update button states
    await new Promise((r) => setTimeout(r, 200))
    // Previous button should be disabled when on first slide
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "carousel-disabled-prev"
    )
  })
})
