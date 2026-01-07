import { createRoot } from "react-dom/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import { Button } from "@/components/button"
import { ComparisonRow } from "./comparison-row"

function DropdownMenuComparison() {
  return (
    <ComparisonRow
      reactContent={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
      hallucnHtml={`
        <hal-dropdown-menu>
          <hal-dropdown-menu-trigger>
            <hal-button variant="outline">Open menu</hal-button>
          </hal-dropdown-menu-trigger>
          <hal-dropdown-menu-content>
            <hal-dropdown-menu-label>My Account</hal-dropdown-menu-label>
            <hal-dropdown-menu-separator></hal-dropdown-menu-separator>
            <hal-dropdown-menu-item>Profile</hal-dropdown-menu-item>
            <hal-dropdown-menu-item>Settings</hal-dropdown-menu-item>
            <hal-dropdown-menu-item>Log out</hal-dropdown-menu-item>
          </hal-dropdown-menu-content>
        </hal-dropdown-menu>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<DropdownMenuComparison />)
}
