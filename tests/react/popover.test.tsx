import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, waitFor, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/popover"
import { Button } from "@/components/button"

describe("Popover (React)", () => {
  afterEach(() => {
    cleanup()
    // Clean up any portaled popovers - required due to Radix portal + RTL cleanup conflicts
    document.querySelectorAll('[data-slot="popover-content"]').forEach((el) => {
      el.remove()
    })
    document.querySelectorAll('[role="dialog"]').forEach((el) => {
      el.remove()
    })
  })
  it("renders trigger with correct data-slot", () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )
    const trigger = screen.getByRole("button")
    expect(trigger).toBeDefined()
    expect(trigger.dataset.slot).toBe("popover-trigger")
  })

  it("popover content is hidden by default", () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )
    const dialog = screen.queryByRole("dialog")
    expect(dialog).toBeNull()
  })

  it("opens popover on click", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Popover content</PopoverContent>
      </Popover>
    )

    const trigger = screen.getByRole("button")
    await user.click(trigger)

    await waitFor(() => {
      const dialog = screen.getByRole("dialog")
      expect(dialog).toBeDefined()
      expect(dialog.textContent).toContain("Popover content")
    })
  })

  it("closes popover on second click", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )

    const trigger = screen.getByRole("button")
    await user.click(trigger)

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeDefined()
    })

    await user.click(trigger)

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull()
    })
  })

  it("popover content has correct data-slot", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const content = screen.getByRole("dialog")
      expect(content.dataset.slot).toBe("popover-content")
    })
  })

  it("trigger has aria-haspopup and aria-expanded", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )

    const trigger = screen.getByRole("button")
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog")
    expect(trigger.getAttribute("aria-expanded")).toBe("false")

    await user.click(trigger)

    await waitFor(() => {
      expect(trigger.getAttribute("aria-expanded")).toBe("true")
    })
  })

  it("can be controlled via open prop", async () => {
    render(
      <Popover open={true}>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeDefined()
    })
  })

  it("fires onOpenChange when opened", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Popover onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  it("closes on Escape key", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeDefined()
    })

    await user.keyboard("{Escape}")

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull()
    })
  })

  it("has data-side attribute on content", async () => {
    const user = userEvent.setup()
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Open</Button>
        </PopoverTrigger>
        <PopoverContent>Content</PopoverContent>
      </Popover>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const content = screen.getByRole("dialog")
      expect(content.dataset.side).toBeDefined()
    })
  })
})
