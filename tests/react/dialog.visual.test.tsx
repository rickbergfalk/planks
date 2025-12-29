import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { page } from "vitest/browser"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/dialog"
import { Button } from "@/components/button"

describe("Dialog (React) - Visual", () => {
  it("dialog open with header and description", async () => {
    render(
      <div
        data-testid="container"
        style={{
          width: "800px",
          height: "600px",
          position: "relative",
        }}
      >
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm">Dialog content goes here.</p>
            </div>
            <DialogFooter>
              <Button variant="outline">Cancel</Button>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot("dialog-open")
  })

  it("dialog with only title", async () => {
    render(
      <div
        data-testid="container"
        style={{
          width: "800px",
          height: "400px",
          position: "relative",
        }}
      >
        <Dialog open={true}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Simple Dialog</DialogTitle>
            </DialogHeader>
            <p className="text-sm">
              This is a simple dialog with just a title.
            </p>
          </DialogContent>
        </Dialog>
      </div>
    )
    await new Promise((r) => setTimeout(r, 100))
    await expect(page.getByTestId("container")).toMatchScreenshot(
      "dialog-simple"
    )
  })
})
