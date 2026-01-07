import { createRoot } from "react-dom/client"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/accordion"
import { ComparisonRow } from "./comparison-row"

function AccordionComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Accordion type="single" collapsible className="w-full max-w-xs">
          <AccordionItem value="item-1">
            <AccordionTrigger>Is it accessible?</AccordionTrigger>
            <AccordionContent>
              Yes. It follows WAI-ARIA patterns.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Is it styled?</AccordionTrigger>
            <AccordionContent>
              Yes. It uses Tailwind CSS classes.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      }
      hallucnHtml={`
        <hal-accordion collapsible class="w-full max-w-xs">
          <hal-accordion-item value="item-1">
            <hal-accordion-trigger>Is it accessible?</hal-accordion-trigger>
            <hal-accordion-content>Yes. It follows WAI-ARIA patterns.</hal-accordion-content>
          </hal-accordion-item>
          <hal-accordion-item value="item-2">
            <hal-accordion-trigger>Is it styled?</hal-accordion-trigger>
            <hal-accordion-content>Yes. It uses Tailwind CSS classes.</hal-accordion-content>
          </hal-accordion-item>
        </hal-accordion>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<AccordionComparison />)
}
