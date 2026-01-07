import { createRoot } from "react-dom/client"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/menubar"
import { ComparisonRow } from "./comparison-row"

function MenubarComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>New File</MenubarItem>
              <MenubarItem>Open</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Save</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Undo</MenubarItem>
              <MenubarItem>Redo</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      }
      hallucnHtml={`
        <hal-menubar>
          <hal-menubar-menu>
            <hal-menubar-trigger>File</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>New File</hal-menubar-item>
              <hal-menubar-item>Open</hal-menubar-item>
              <hal-menubar-separator></hal-menubar-separator>
              <hal-menubar-item>Save</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
          <hal-menubar-menu>
            <hal-menubar-trigger>Edit</hal-menubar-trigger>
            <hal-menubar-content>
              <hal-menubar-item>Undo</hal-menubar-item>
              <hal-menubar-item>Redo</hal-menubar-item>
            </hal-menubar-content>
          </hal-menubar-menu>
        </hal-menubar>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<MenubarComparison />)
}
