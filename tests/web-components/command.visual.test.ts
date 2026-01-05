import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-command"

describe("Command (Web Component) - Visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("command basic with items", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-command class="w-[350px] rounded-lg border shadow-md">
          <hal-command-input placeholder="Type a command or search..."></hal-command-input>
          <hal-command-list>
            <hal-command-empty>No results found.</hal-command-empty>
            <hal-command-group heading="Suggestions">
              <hal-command-item>Calendar</hal-command-item>
              <hal-command-item>Search Emoji</hal-command-item>
              <hal-command-item>Calculator</hal-command-item>
            </hal-command-group>
          </hal-command-list>
        </hal-command>
      </div>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-basic"
    )
  })

  it("command with groups and separator", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-command class="w-[350px] rounded-lg border shadow-md">
          <hal-command-input placeholder="Type a command or search..."></hal-command-input>
          <hal-command-list>
            <hal-command-empty>No results found.</hal-command-empty>
            <hal-command-group heading="Suggestions">
              <hal-command-item>Calendar</hal-command-item>
              <hal-command-item>Search Emoji</hal-command-item>
            </hal-command-group>
            <hal-command-separator></hal-command-separator>
            <hal-command-group heading="Settings">
              <hal-command-item>Profile</hal-command-item>
              <hal-command-item>Billing</hal-command-item>
              <hal-command-item>Settings</hal-command-item>
            </hal-command-group>
          </hal-command-list>
        </hal-command>
      </div>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-with-groups"
    )
  })

  it("command with shortcuts", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-command class="w-[350px] rounded-lg border shadow-md">
          <hal-command-input placeholder="Type a command or search..."></hal-command-input>
          <hal-command-list>
            <hal-command-group heading="Actions">
              <hal-command-item>
                <span>Profile</span>
                <hal-command-shortcut>⌘P</hal-command-shortcut>
              </hal-command-item>
              <hal-command-item>
                <span>Billing</span>
                <hal-command-shortcut>⌘B</hal-command-shortcut>
              </hal-command-item>
              <hal-command-item>
                <span>Settings</span>
                <hal-command-shortcut>⌘S</hal-command-shortcut>
              </hal-command-item>
            </hal-command-group>
          </hal-command-list>
        </hal-command>
      </div>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-with-shortcuts"
    )
  })

  it("command with disabled item", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-command class="w-[350px] rounded-lg border shadow-md">
          <hal-command-input placeholder="Type a command or search..."></hal-command-input>
          <hal-command-list>
            <hal-command-group heading="Actions">
              <hal-command-item>Enabled Item</hal-command-item>
              <hal-command-item disabled>Disabled Item</hal-command-item>
              <hal-command-item>Another Item</hal-command-item>
            </hal-command-group>
          </hal-command-list>
        </hal-command>
      </div>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-disabled-item"
    )
  })

  it("command empty state", async () => {
    container.innerHTML = `
      <div
        data-testid="container"
        style="padding: 20px; display: flex; justify-content: flex-start; align-items: flex-start;"
      >
        <hal-command class="w-[350px] rounded-lg border shadow-md">
          <hal-command-input placeholder="Type a command or search..."></hal-command-input>
          <hal-command-list>
            <hal-command-empty>No results found.</hal-command-empty>
            <hal-command-group heading="Actions">
              <hal-command-item>Calendar</hal-command-item>
            </hal-command-group>
          </hal-command-list>
        </hal-command>
      </div>
    `

    await customElements.whenDefined("hal-command")
    const command = container.querySelector("hal-command")!
    await (command as any).updateComplete
    // Set search value to trigger empty state
    const input = container.querySelector("input") as HTMLInputElement
    input.value = "xyz"
    input.dispatchEvent(new Event("input", { bubbles: true }))
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-empty"
    )
  })
})
