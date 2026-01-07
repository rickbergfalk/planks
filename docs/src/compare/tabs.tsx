import { createRoot } from "react-dom/client"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs"
import { ComparisonRow } from "./comparison-row"

function TabsComparison() {
  return (
    <ComparisonRow
      reactContent={
        <Tabs defaultValue="tab1" className="w-full max-w-xs">
          <TabsList>
            <TabsTrigger value="tab1">Account</TabsTrigger>
            <TabsTrigger value="tab2">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="tab1">
            <p className="text-sm text-muted-foreground">
              Account settings here
            </p>
          </TabsContent>
          <TabsContent value="tab2">
            <p className="text-sm text-muted-foreground">
              Password settings here
            </p>
          </TabsContent>
        </Tabs>
      }
      hallucnHtml={`
        <hal-tabs value="tab1" class="w-full max-w-xs">
          <hal-tabs-list>
            <hal-tabs-trigger value="tab1">Account</hal-tabs-trigger>
            <hal-tabs-trigger value="tab2">Password</hal-tabs-trigger>
          </hal-tabs-list>
          <hal-tabs-content value="tab1">
            <p class="text-sm text-muted-foreground">Account settings here</p>
          </hal-tabs-content>
          <hal-tabs-content value="tab2">
            <p class="text-sm text-muted-foreground">Password settings here</p>
          </hal-tabs-content>
        </hal-tabs>
      `}
    />
  )
}

const container = document.getElementById("comparison-root")
if (container) {
  createRoot(container).render(<TabsComparison />)
}
