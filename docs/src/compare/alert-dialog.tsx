import { createRoot } from "react-dom/client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function AlertDialogComparison() {
  return (
    <ComparisonRow
      reactContent={
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
      hallucnHtml={`
        <hal-alert-dialog>
          <hal-alert-dialog-trigger>
            <hal-button variant="destructive">Delete</hal-button>
          </hal-alert-dialog-trigger>
          <hal-alert-dialog-content>
            <hal-alert-dialog-header>
              <hal-alert-dialog-title>Are you absolutely sure?</hal-alert-dialog-title>
              <hal-alert-dialog-description>This action cannot be undone.</hal-alert-dialog-description>
            </hal-alert-dialog-header>
            <hal-alert-dialog-footer>
              <hal-alert-dialog-cancel>Cancel</hal-alert-dialog-cancel>
              <hal-alert-dialog-action>Continue</hal-alert-dialog-action>
            </hal-alert-dialog-footer>
          </hal-alert-dialog-content>
        </hal-alert-dialog>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<AlertDialogComparison />)
}
