import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, waitFor, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/dialog"
import { Button } from "@/components/button"

describe("Dialog (React)", () => {
  afterEach(() => {
    cleanup()
    // Clean up any portaled dialogs
    document.querySelectorAll('[data-slot="dialog-overlay"]').forEach((el) => {
      el.remove()
    })
    document.querySelectorAll('[data-slot="dialog-content"]').forEach((el) => {
      el.remove()
    })
    document.querySelectorAll('[role="dialog"]').forEach((el) => {
      el.remove()
    })
  })

  it("renders trigger with correct data-slot", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    const trigger = screen.getByRole("button")
    expect(trigger).toBeDefined()
    expect(trigger.dataset.slot).toBe("dialog-trigger")
  })

  it("dialog content is hidden by default", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )
    const dialog = screen.queryByRole("dialog")
    expect(dialog).toBeNull()
  })

  it("opens dialog on trigger click", async () => {
    const user = userEvent.setup()
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>Dialog description</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      const dialog = screen.getByRole("dialog")
      expect(dialog).toBeDefined()
      expect(dialog.textContent).toContain("Dialog Title")
    })
  })

  it("dialog content has correct data-slot when open", async () => {
    render(
      <Dialog open={true}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await waitFor(() => {
      const dialog = screen.getByRole("dialog")
      expect(dialog.dataset.slot).toBe("dialog-content")
    })
  })

  it("trigger has aria-haspopup attribute", () => {
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    const trigger = screen.getByRole("button")
    expect(trigger.getAttribute("aria-haspopup")).toBe("dialog")
  })

  it("can be controlled via open prop", async () => {
    render(
      <Dialog open={true}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeDefined()
    })
  })

  it("fires onOpenChange when opened", async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()
    render(
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await user.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })
  })

  it("dialog has aria-labelledby pointing to title", async () => {
    render(
      <Dialog open={true}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>My Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await waitFor(() => {
      const dialog = screen.getByRole("dialog")
      const labelledBy = dialog.getAttribute("aria-labelledby")
      expect(labelledBy).toBeTruthy()
      const title = document.getElementById(labelledBy!)
      expect(title?.textContent).toBe("My Title")
    })
  })

  it("dialog has aria-describedby pointing to description", async () => {
    render(
      <Dialog open={true}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
          <DialogDescription>My Description</DialogDescription>
        </DialogContent>
      </Dialog>
    )

    await waitFor(() => {
      const dialog = screen.getByRole("dialog")
      const describedBy = dialog.getAttribute("aria-describedby")
      expect(describedBy).toBeTruthy()
      const description = document.getElementById(describedBy!)
      expect(description?.textContent).toBe("My Description")
    })
  })

  it("renders header and footer with correct data-slots", async () => {
    render(
      <Dialog open={true}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )

    await waitFor(() => {
      const header = document.querySelector('[data-slot="dialog-header"]')
      const footer = document.querySelector('[data-slot="dialog-footer"]')
      expect(header).toBeTruthy()
      expect(footer).toBeTruthy()
    })
  })

  it("has data-state attribute on content when open", async () => {
    render(
      <Dialog open={true}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await waitFor(() => {
      const dialog = screen.getByRole("dialog")
      expect(dialog.dataset.state).toBe("open")
    })
  })

  it("has overlay with correct data-slot", async () => {
    render(
      <Dialog open={true}>
        <DialogTrigger asChild>
          <Button>Open</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Title</DialogTitle>
        </DialogContent>
      </Dialog>
    )

    await waitFor(() => {
      const overlay = document.querySelector('[data-slot="dialog-overlay"]')
      expect(overlay).toBeTruthy()
    })
  })
})
