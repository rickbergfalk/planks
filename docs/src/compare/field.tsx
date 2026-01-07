import { createRoot } from "react-dom/client"
import { Field, FieldLabel, FieldDescription } from "@/components/field"
import { Input } from "@/components/input"
import { ComparisonRow } from "./comparison-row"

function FieldComparison() {
  return (
    <ComparisonRow
      reactContent={
        <div className="max-w-sm">
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input type="email" placeholder="email@example.com" />
            <FieldDescription>We'll never share your email.</FieldDescription>
          </Field>
        </div>
      }
      hallucnHtml={`
        <div class="max-w-sm">
          <hal-field>
            <hal-field-label>Email</hal-field-label>
            <hal-input type="email" placeholder="email@example.com"></hal-input>
            <hal-field-description>We'll never share your email.</hal-field-description>
          </hal-field>
        </div>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<FieldComparison />)
}
