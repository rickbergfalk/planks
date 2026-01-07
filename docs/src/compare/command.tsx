import { createRoot } from "react-dom/client"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/command"
import { ComparisonRow } from "./comparison-row"

function CommandComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Command className="rounded-lg border shadow-md max-w-xs">
          <CommandInput placeholder="Type a command..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem>Calendar</CommandItem>
              <CommandItem>Search</CommandItem>
              <CommandItem>Settings</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      }
      hallucnHtml={`
        <hal-command class="rounded-lg border shadow-md max-w-xs">
          <hal-command-input placeholder="Type a command..."></hal-command-input>
          <hal-command-list>
            <hal-command-empty>No results found.</hal-command-empty>
            <hal-command-group heading="Suggestions">
              <hal-command-item>Calendar</hal-command-item>
              <hal-command-item>Search</hal-command-item>
              <hal-command-item>Settings</hal-command-item>
            </hal-command-group>
          </hal-command-list>
        </hal-command>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<CommandComparison />)
}
