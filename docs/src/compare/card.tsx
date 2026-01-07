import { createRoot } from "react-dom/client"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/card"
import { ComparisonRow } from "./comparison-row"

function CardComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Card className="max-w-xs">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description text</CardDescription>
          </CardHeader>
          <CardContent>Card content goes here</CardContent>
        </Card>
      }
      hallucnHtml={`
        <hal-card class="max-w-xs">
          <hal-card-header>
            <hal-card-title>Card Title</hal-card-title>
            <hal-card-description>Card description text</hal-card-description>
          </hal-card-header>
          <hal-card-content>Card content goes here</hal-card-content>
        </hal-card>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<CardComparison />)
}
