import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/plank-command"

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
        <plank-command class="w-[350px] rounded-lg border shadow-md">
          <plank-command-input placeholder="Type a command or search..."></plank-command-input>
          <plank-command-list>
            <plank-command-empty>No results found.</plank-command-empty>
            <plank-command-group heading="Suggestions">
              <plank-command-item>Calendar</plank-command-item>
              <plank-command-item>Search Emoji</plank-command-item>
              <plank-command-item>Calculator</plank-command-item>
            </plank-command-group>
          </plank-command-list>
        </plank-command>
      </div>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
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
        <plank-command class="w-[350px] rounded-lg border shadow-md">
          <plank-command-input placeholder="Type a command or search..."></plank-command-input>
          <plank-command-list>
            <plank-command-empty>No results found.</plank-command-empty>
            <plank-command-group heading="Suggestions">
              <plank-command-item>Calendar</plank-command-item>
              <plank-command-item>Search Emoji</plank-command-item>
            </plank-command-group>
            <plank-command-separator></plank-command-separator>
            <plank-command-group heading="Settings">
              <plank-command-item>Profile</plank-command-item>
              <plank-command-item>Billing</plank-command-item>
              <plank-command-item>Settings</plank-command-item>
            </plank-command-group>
          </plank-command-list>
        </plank-command>
      </div>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
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
        <plank-command class="w-[350px] rounded-lg border shadow-md">
          <plank-command-input placeholder="Type a command or search..."></plank-command-input>
          <plank-command-list>
            <plank-command-group heading="Actions">
              <plank-command-item>
                <span>Profile</span>
                <plank-command-shortcut>⌘P</plank-command-shortcut>
              </plank-command-item>
              <plank-command-item>
                <span>Billing</span>
                <plank-command-shortcut>⌘B</plank-command-shortcut>
              </plank-command-item>
              <plank-command-item>
                <span>Settings</span>
                <plank-command-shortcut>⌘S</plank-command-shortcut>
              </plank-command-item>
            </plank-command-group>
          </plank-command-list>
        </plank-command>
      </div>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
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
        <plank-command class="w-[350px] rounded-lg border shadow-md">
          <plank-command-input placeholder="Type a command or search..."></plank-command-input>
          <plank-command-list>
            <plank-command-group heading="Actions">
              <plank-command-item>Enabled Item</plank-command-item>
              <plank-command-item disabled>Disabled Item</plank-command-item>
              <plank-command-item>Another Item</plank-command-item>
            </plank-command-group>
          </plank-command-list>
        </plank-command>
      </div>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
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
        <plank-command class="w-[350px] rounded-lg border shadow-md">
          <plank-command-input placeholder="Type a command or search..."></plank-command-input>
          <plank-command-list>
            <plank-command-empty>No results found.</plank-command-empty>
            <plank-command-group heading="Actions">
              <plank-command-item>Calendar</plank-command-item>
            </plank-command-group>
          </plank-command-list>
        </plank-command>
      </div>
    `

    await customElements.whenDefined("plank-command")
    const command = container.querySelector("plank-command")!
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
