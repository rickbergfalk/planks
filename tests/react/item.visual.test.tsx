import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import {
  Item,
  ItemGroup,
  ItemSeparator,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemHeader,
  ItemFooter,
} from "@/components/item"

// Simple SVG icons for tests
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M20 21a8 8 0 0 0-16 0" />
  </svg>
)

const MoreIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
)

describe("Item (React) - Visual", () => {
  it("basic item with all parts", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Item>
          <ItemMedia variant="icon">
            <UserIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>John Doe</ItemTitle>
            <ItemDescription>Software Engineer at Acme Inc.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <button className="rounded p-1 hover:bg-muted">
              <MoreIcon />
            </button>
          </ItemActions>
        </Item>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("item-basic")
  })

  it("item with outline variant", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <UserIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Jane Smith</ItemTitle>
            <ItemDescription>Product Designer</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-outline"
    )
  })

  it("item with muted variant", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Item variant="muted">
          <ItemMedia variant="icon">
            <UserIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Bob Johnson</ItemTitle>
            <ItemDescription>Marketing Manager</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("item-muted")
  })

  it("item with small size", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Item size="sm">
          <ItemMedia variant="icon">
            <UserIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Compact Item</ItemTitle>
            <ItemDescription>A smaller item variant</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot("item-sm")
  })

  it("item with image media", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Item>
          <ItemMedia variant="image">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%236366f1' width='40' height='40'/%3E%3C/svg%3E"
              alt="Avatar"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>User with Avatar</ItemTitle>
            <ItemDescription>Has a custom profile picture</ItemDescription>
          </ItemContent>
        </Item>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-image-media"
    )
  })

  it("item with header and footer", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Item>
          <ItemHeader>
            <ItemTitle>Item Header</ItemTitle>
            <span className="text-xs text-muted-foreground">2 hours ago</span>
          </ItemHeader>
          <ItemContent>
            <ItemDescription>
              This item has both a header and footer section.
            </ItemDescription>
          </ItemContent>
          <ItemFooter>
            <span className="text-xs text-muted-foreground">
              3 comments • 5 likes
            </span>
          </ItemFooter>
        </Item>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-header-footer"
    )
  })

  it("item group with separators", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <ItemGroup className="border rounded-lg overflow-hidden">
          <Item>
            <ItemMedia variant="icon">
              <UserIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>First Person</ItemTitle>
              <ItemDescription>Team Lead</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator />
          <Item>
            <ItemMedia variant="icon">
              <UserIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Second Person</ItemTitle>
              <ItemDescription>Developer</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator />
          <Item>
            <ItemMedia variant="icon">
              <UserIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Third Person</ItemTitle>
              <ItemDescription>Designer</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-group-separators"
    )
  })

  it("item minimal (title only)", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Item>
          <ItemContent>
            <ItemTitle>Simple Item</ItemTitle>
          </ItemContent>
        </Item>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-minimal"
    )
  })

  it("item with default media variant", async () => {
    render(
      <div data-testid="container" style={{ padding: "8px", width: "400px" }}>
        <Item>
          <ItemMedia>
            <UserIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Default Media</ItemTitle>
            <ItemDescription>
              Uses default media variant (no background)
            </ItemDescription>
          </ItemContent>
        </Item>
      </div>
    )
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "item-media-default"
    )
  })
})
