import { createRoot } from "react-dom/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function DialogComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
      hallucnHtml={`
        <hal-dialog>
          <hal-dialog-trigger>
            <hal-button variant="outline">Open dialog</hal-button>
          </hal-dialog-trigger>
          <hal-dialog-content>
            <hal-dialog-header>
              <hal-dialog-title>Edit profile</hal-dialog-title>
              <hal-dialog-description>Make changes to your profile here.</hal-dialog-description>
            </hal-dialog-header>
            <hal-dialog-footer>
              <hal-button>Save changes</hal-button>
            </hal-dialog-footer>
          </hal-dialog-content>
        </hal-dialog>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<DialogComparison />)
}
