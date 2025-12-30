import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/dropdown-menu"
import { Button } from "@/components/button"

describe("DropdownMenu (React) - Visual", () => {
  it("dropdown menu basic", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <DropdownMenu open={true}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-basic"
    )
  })

  it("dropdown menu with checkboxes", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <DropdownMenu open={true}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={true}>
              Status Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={false}>
              Activity Bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={true}>
              Panel
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-checkboxes"
    )
  })

  it("dropdown menu with radio group", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <DropdownMenu open={true}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value="bottom">
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">
                Bottom
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-radio"
    )
  })

  it("dropdown menu with disabled item", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <DropdownMenu open={true}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Enabled Item</DropdownMenuItem>
            <DropdownMenuItem disabled>Disabled Item</DropdownMenuItem>
            <DropdownMenuItem>Another Enabled</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-disabled"
    )
  })

  it("dropdown menu with destructive item", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <DropdownMenu open={true}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-destructive"
    )
  })

  it("dropdown menu with inset items", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <DropdownMenu open={true}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel inset>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem inset>Profile</DropdownMenuItem>
            <DropdownMenuItem inset>Account</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-inset"
    )
  })

  it("dropdown menu with submenu", async () => {
    render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          width: "400px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <DropdownMenu open={true}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem>New Tab</DropdownMenuItem>
            <DropdownMenuItem>New Window</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuSub open={true}>
              <DropdownMenuSubTrigger>More Tools</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Save Page As...</DropdownMenuItem>
                <DropdownMenuItem>Create Shortcut...</DropdownMenuItem>
                <DropdownMenuItem>Name Window...</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Developer Tools</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Quit</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dropdown-menu-submenu"
    )
  })
})
