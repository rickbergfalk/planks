import { createRoot } from "react-dom/client"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/drawer"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function DrawerComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>
                Make changes to your profile here.
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
      }
      hallucnHtml={`
        <hal-drawer>
          <hal-drawer-trigger>
            <hal-button variant="outline">Open drawer</hal-button>
          </hal-drawer-trigger>
          <hal-drawer-content>
            <hal-drawer-header>
              <hal-drawer-title>Edit profile</hal-drawer-title>
              <hal-drawer-description>Make changes to your profile here.</hal-drawer-description>
            </hal-drawer-header>
          </hal-drawer-content>
        </hal-drawer>
      `}
      note="Up to 2% visual variance allowed due to differences between the vaul library (React) and Lit implementation."
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<DrawerComparison />)
}
