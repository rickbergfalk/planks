import { describe, it, expect, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import { page } from "vitest/browser"
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from "@/components/context-menu"

describe("ContextMenu (React) - Visual", () => {
  afterEach(() => {
    cleanup()
    // Clean up portaled content
    document
      .querySelectorAll('[data-slot="context-menu-content"]')
      .forEach((el) => el.remove())
    document.querySelectorAll('[role="menu"]').forEach((el) => el.remove())
  })

  it("context menu basic", async () => {
    const { container } = render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              data-testid="trigger"
              style={{
                width: "300px",
                height: "150px",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              Right click here
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel>My Account</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem>
                Profile
                <ContextMenuShortcut>⇧⌘P</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Billing
                <ContextMenuShortcut>⌘B</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                Settings
                <ContextMenuShortcut>⌘S</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuItem>Log out</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    )

    // Trigger the context menu with right-click
    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-basic"
    )
  })

  it("context menu with checkboxes", async () => {
    const { container } = render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              data-testid="trigger"
              style={{
                width: "300px",
                height: "150px",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              Right click here
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuLabel>Appearance</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked={true}>
              Status Bar
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem checked={false}>
              Activity Bar
            </ContextMenuCheckboxItem>
            <ContextMenuCheckboxItem checked={true}>
              Panel
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    )

    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-checkboxes"
    )
  })

  it("context menu with radio group", async () => {
    const { container } = render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              data-testid="trigger"
              style={{
                width: "300px",
                height: "150px",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              Right click here
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuLabel>Panel Position</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuRadioGroup value="bottom">
              <ContextMenuRadioItem value="top">Top</ContextMenuRadioItem>
              <ContextMenuRadioItem value="bottom">Bottom</ContextMenuRadioItem>
              <ContextMenuRadioItem value="right">Right</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    )

    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-radio"
    )
  })

  it("context menu with disabled item", async () => {
    const { container } = render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              data-testid="trigger"
              style={{
                width: "300px",
                height: "150px",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              Right click here
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Enabled Item</ContextMenuItem>
            <ContextMenuItem disabled>Disabled Item</ContextMenuItem>
            <ContextMenuItem>Another Enabled</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    )

    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-disabled"
    )
  })

  it("context menu with destructive item", async () => {
    const { container } = render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              data-testid="trigger"
              style={{
                width: "300px",
                height: "150px",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              Right click here
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>Edit</ContextMenuItem>
            <ContextMenuItem>Duplicate</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    )

    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-destructive"
    )
  })

  it("context menu with inset items", async () => {
    const { container } = render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              data-testid="trigger"
              style={{
                width: "300px",
                height: "150px",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              Right click here
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuLabel inset>Settings</ContextMenuLabel>
            <ContextMenuSeparator />
            <ContextMenuItem inset>Profile</ContextMenuItem>
            <ContextMenuItem inset>Account</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    )

    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-inset"
    )
  })

  it("context menu with submenu", async () => {
    const { container } = render(
      <div
        data-testid="container"
        style={{
          padding: "100px",
          width: "500px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <ContextMenu>
          <ContextMenuTrigger>
            <div
              data-testid="trigger"
              style={{
                width: "200px",
                height: "150px",
                border: "2px dashed #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
              }}
            >
              Right click here
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>New Tab</ContextMenuItem>
            <ContextMenuItem>New Window</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub open={true}>
              <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>Save Page As...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuItem>Quit</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </div>
    )

    const trigger = container.querySelector('[data-testid="trigger"]')!
    const rect = trigger.getBoundingClientRect()
    trigger.dispatchEvent(
      new MouseEvent("contextmenu", {
        bubbles: true,
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2,
      })
    )

    await new Promise((r) => setTimeout(r, 200))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "context-menu-submenu"
    )
  })
})
