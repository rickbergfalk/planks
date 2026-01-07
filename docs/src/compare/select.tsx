import { createRoot } from "react-dom/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select"
import { ComparisonRow } from "./comparison-row"

function SelectComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
          </SelectContent>
        </Select>
      }
      hallucnHtml={`
        <hal-select class="w-48">
          <hal-select-trigger>
            <hal-select-value placeholder="Select a fruit"></hal-select-value>
          </hal-select-trigger>
          <hal-select-content>
            <hal-select-item value="apple">Apple</hal-select-item>
            <hal-select-item value="banana">Banana</hal-select-item>
            <hal-select-item value="orange">Orange</hal-select-item>
          </hal-select-content>
        </hal-select>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<SelectComparison />)
}
