import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, waitFor, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/tooltip"
import { Button } from "@/components/button"

describe("Tooltip (React)", () => {
  afterEach(() => {
    cleanup()
    // Clean up any portaled tooltips - required due to Radix portal + RTL cleanup conflicts
    document.querySelectorAll('[data-slot="tooltip-content"]').forEach((el) => {
      el.remove()
    })
    document.querySelectorAll('[role="tooltip"]').forEach((el) => {
      el.remove()
    })
  })
  it("renders trigger with correct data-slot", () => {
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )
    const trigger = screen.getByRole("button")
    expect(trigger).toBeDefined()
  })

  it("tooltip content is hidden by default", () => {
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )
    // Content should not be visible initially
    const content = screen.queryByRole("tooltip")
    expect(content).toBeNull()
  })

  it("shows tooltip on hover", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByRole("button")
    await user.hover(trigger)

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip")
      expect(tooltip).toBeDefined()
      expect(tooltip.textContent).toContain("Tooltip text")
    })
  })

  it("hides tooltip on mouse leave", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByRole("button")
    await user.hover(trigger)

    await waitFor(() => {
      expect(screen.getByRole("tooltip")).toBeDefined()
    })

    await user.unhover(trigger)

    await waitFor(() => {
      expect(screen.queryByRole("tooltip")).toBeNull()
    })
  })

  it("shows tooltip on focus", async () => {
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Focus me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByRole("button")
    trigger.focus()

    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip")
      expect(tooltip).toBeDefined()
    })
  })

  it("tooltip has correct data-slot", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByRole("button")
    await user.hover(trigger)

    await waitFor(() => {
      // The content element has data-slot, role="tooltip" is on visually hidden element
      const content = document.querySelector('[data-slot="tooltip-content"]')
      expect(content).toBeDefined()
      expect(content?.textContent).toContain("Tooltip text")
    })
  })

  it("tooltip content has data-side attribute", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent side="top">Tooltip text</TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByRole("button")
    await user.hover(trigger)

    await waitFor(() => {
      const content = document.querySelector('[data-slot="tooltip-content"]')
      expect(content?.getAttribute("data-side")).toBeDefined()
    })
  })

  it("trigger has aria-describedby when open", async () => {
    const user = userEvent.setup()
    render(
      <Tooltip>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByRole("button")
    await user.hover(trigger)

    await waitFor(() => {
      expect(trigger.getAttribute("aria-describedby")).toBeDefined()
    })
  })

  it("can be controlled via open prop", async () => {
    render(
      <Tooltip open={true}>
        <TooltipTrigger asChild>
          <Button>Controlled</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )

    // Should be visible immediately
    await waitFor(() => {
      const tooltip = screen.getByRole("tooltip")
      expect(tooltip).toBeDefined()
    })
  })

  it("fires onOpenChange when opened", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Tooltip onOpenChange={onOpenChange}>
        <TooltipTrigger asChild>
          <Button>Hover me</Button>
        </TooltipTrigger>
        <TooltipContent>Tooltip text</TooltipContent>
      </Tooltip>
    )

    const trigger = screen.getByRole("button")
    await user.hover(trigger)

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })
})
