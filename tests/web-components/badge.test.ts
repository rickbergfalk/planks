import { describe, it, expect, beforeEach } from "vitest"
import "@/web-components/hal-badge"
import type { HalBadge } from "@/web-components/hal-badge"

describe("HalBadge (Web Component)", () => {
  let container: HTMLDivElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  async function renderAndWait(html: string): Promise<HalBadge> {
    container.innerHTML = html
    await customElements.whenDefined("hal-badge")
    const badge = container.querySelector("hal-badge") as HalBadge
    await badge.updateComplete
    return badge
  }

  it("renders with default variant", async () => {
    const badge = await renderAndWait(`<hal-badge>New</hal-badge>`)
    expect(badge).toBeDefined()
    expect(badge.textContent).toBe("New")
    expect(badge.dataset.slot).toBe("badge")
  })

  it("renders with secondary variant", async () => {
    const badge = await renderAndWait(
      `<hal-badge variant="secondary">Secondary</hal-badge>`
    )
    expect(badge).toBeDefined()
    expect(badge.textContent).toBe("Secondary")
  })

  it("renders with destructive variant", async () => {
    const badge = await renderAndWait(
      `<hal-badge variant="destructive">Error</hal-badge>`
    )
    expect(badge).toBeDefined()
    expect(badge.textContent).toBe("Error")
  })

  it("renders with outline variant", async () => {
    const badge = await renderAndWait(
      `<hal-badge variant="outline">Outline</hal-badge>`
    )
    expect(badge).toBeDefined()
    expect(badge.textContent).toBe("Outline")
  })

  it("applies variant classes", async () => {
    const badge = await renderAndWait(`<hal-badge>Tag</hal-badge>`)
    expect(badge.classList.contains("bg-primary")).toBe(true)
    expect(badge.classList.contains("text-primary-foreground")).toBe(true)
  })
})
