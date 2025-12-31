import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-combobox"

describe("Combobox (Web Component) - Visual", () => {
  let container: HTMLElement

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

  it("combobox closed state", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-combobox placeholder="Select framework..." class="w-[200px]">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      </div>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "combobox-closed"
    )
  })

  it("combobox open state", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; min-height: 300px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-combobox placeholder="Select framework..." class="w-[200px]">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      </div>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 150))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "combobox-open"
    )
  })

  it("combobox with selected value", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-combobox value="svelte" placeholder="Select framework..." class="w-[200px]">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      </div>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "combobox-selected"
    )
  })

  it("combobox open with selected value", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; min-height: 300px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-combobox value="svelte" placeholder="Select framework..." class="w-[200px]">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      </div>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 150))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "combobox-open-selected"
    )
  })

  it("combobox with filtered results", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; min-height: 300px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-combobox placeholder="Select framework..." class="w-[200px]">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
          <plank-combobox-item value="remix">Remix</plank-combobox-item>
        </plank-combobox>
      </div>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 100))

    // Type to filter
    const input = document.querySelector(
      '[data-slot="combobox-content"] input'
    ) as HTMLInputElement
    input.value = "svelte"
    input.dispatchEvent(new Event("input", { bubbles: true }))
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "combobox-filtered"
    )
  })

  it("combobox empty state", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; min-height: 200px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-combobox placeholder="Select framework..." emptyText="No frameworks found." class="w-[200px]">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
        </plank-combobox>
      </div>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 100))

    // Type something that doesn't match
    const input = document.querySelector(
      '[data-slot="combobox-content"] input'
    ) as HTMLInputElement
    input.value = "xyz"
    input.dispatchEvent(new Event("input", { bubbles: true }))
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "combobox-empty"
    )
  })

  it("combobox with disabled item", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; min-height: 300px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-combobox placeholder="Select framework..." class="w-[200px]">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte" disabled>SvelteKit (disabled)</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      </div>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 150))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "combobox-disabled-item"
    )
  })

  it("combobox with keyboard highlight", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; min-height: 300px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-combobox placeholder="Select framework..." class="w-[200px]">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
          <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
          <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
        </plank-combobox>
      </div>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete

    // Open the combobox
    const trigger = container.querySelector('[role="combobox"]') as HTMLElement
    trigger.click()
    await new Promise((r) => setTimeout(r, 100))

    // Press ArrowDown to highlight first item
    const input = document.querySelector(
      '[data-slot="combobox-content"] input'
    ) as HTMLInputElement
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    )
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "combobox-keyboard-highlight"
    )
  })

  it("disabled combobox", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <plank-combobox disabled placeholder="Select framework..." class="w-[200px]">
          <plank-combobox-item value="next">Next.js</plank-combobox-item>
        </plank-combobox>
      </div>
    `

    await customElements.whenDefined("plank-combobox")
    const combobox = container.querySelector("plank-combobox")!
    await (combobox as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "combobox-disabled"
    )
  })
})
