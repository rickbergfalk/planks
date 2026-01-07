import { createRoot } from "react-dom/client"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb"
import { ComparisonRow } from "./comparison-row"

function BreadcrumbComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      }
      hallucnHtml={`
        <hal-breadcrumb>
          <hal-breadcrumb-list>
            <hal-breadcrumb-item>
              <hal-breadcrumb-link href="#">Home</hal-breadcrumb-link>
            </hal-breadcrumb-item>
            <hal-breadcrumb-separator></hal-breadcrumb-separator>
            <hal-breadcrumb-item>
              <hal-breadcrumb-link href="#">Components</hal-breadcrumb-link>
            </hal-breadcrumb-item>
            <hal-breadcrumb-separator></hal-breadcrumb-separator>
            <hal-breadcrumb-item>
              <hal-breadcrumb-page>Breadcrumb</hal-breadcrumb-page>
            </hal-breadcrumb-item>
          </hal-breadcrumb-list>
        </hal-breadcrumb>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<BreadcrumbComparison />)
}
