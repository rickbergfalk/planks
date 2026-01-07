import { createRoot } from "react-dom/client"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function SheetComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">Open sheet</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      }
      hallucnHtml={`
        <hal-sheet>
          <hal-sheet-trigger>
            <hal-button variant="outline">Open sheet</hal-button>
          </hal-sheet-trigger>
          <hal-sheet-content>
            <hal-sheet-header>
              <hal-sheet-title>Edit profile</hal-sheet-title>
              <hal-sheet-description>Make changes to your profile here.</hal-sheet-description>
            </hal-sheet-header>
          </hal-sheet-content>
        </hal-sheet>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<SheetComparison />)
}
