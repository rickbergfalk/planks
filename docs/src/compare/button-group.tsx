import { createRoot } from "react-dom/client"
import { Button } from "@/components/button"
import { ButtonGroup, ButtonGroupText } from "@/components/button-group"
import { ComparisonRow } from "./comparison-row"

function ButtonGroupComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="flex flex-col gap-4">
          <ButtonGroup>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Center</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
          <ButtonGroup>
            <ButtonGroupText>Label</ButtonGroupText>
            <Button variant="outline">Action</Button>
          </ButtonGroup>
        </div>
      }
      hallucnHtml={`
        <div class="flex flex-col gap-4">
          <hal-button-group>
            <hal-button variant="outline">Left</hal-button>
            <hal-button variant="outline">Center</hal-button>
            <hal-button variant="outline">Right</hal-button>
          </hal-button-group>
          <hal-button-group>
            <hal-button-group-text>Label</hal-button-group-text>
            <hal-button variant="outline">Action</hal-button>
          </hal-button-group>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<ButtonGroupComparison />)
}
