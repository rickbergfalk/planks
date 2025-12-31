import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/command"

describe("Command (React) - Visual", () => {
  it("command basic with items", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Command className="w-[350px] rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
              <CommandItem>Calculator</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-basic"
    )
  })

  it("command with groups and separator", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Command className="w-[350px] rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search Emoji</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Settings">
              <CommandItem>Profile</CommandItem>
              <CommandItem>Billing</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-with-groups"
    )
  })

  it("command with shortcuts", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Command className="w-[350px] rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandGroup heading="Actions">
              <CommandItem>
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-with-shortcuts"
    )
  })

  it("command with disabled item", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Command className="w-[350px] rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandGroup heading="Actions">
              <CommandItem>Enabled Item</CommandItem>
              <CommandItem disabled>Disabled Item</CommandItem>
              <CommandItem>Another Item</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-disabled-item"
    )
  })

  it("command empty state", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <Command className="w-[350px] rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." value="xyz" />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem>Calendar</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "command-empty"
    )
  })
})
