import React, { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

// Import React components
import { Button } from "@/components/button"
import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { Textarea } from "@/components/textarea"
import { Label } from "@/components/label"
import { Separator } from "@/components/separator"
import { Skeleton } from "@/components/skeleton"
import { Switch } from "@/components/switch"
import { Checkbox } from "@/components/checkbox"
import { Toggle } from "@/components/toggle"
import { Progress } from "@/components/progress"
import { Slider } from "@/components/slider"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/alert"
import { Avatar, AvatarFallback } from "@/components/avatar"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/collapsible"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/accordion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/radio-group"
import { ToggleGroup, ToggleGroupItem } from "@/components/toggle-group"

// Component to render Planks HTML after mount
function PlanksDemo({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = html
    }
  }, [html])

  return <div ref={ref} className="p-4 border rounded-lg bg-background" />
}

// Comparison row component
function ComparisonRow({
  title,
  reactContent,
  planksHtml,
}: {
  title: string
  reactContent: React.ReactNode
  planksHtml: string
}) {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            React (shadcn/ui)
          </h3>
          <div className="p-4 border rounded-lg bg-background">
            {reactContent}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Web Component (Planks)
          </h3>
          <PlanksDemo html={planksHtml} />
        </div>
      </div>
    </div>
  )
}

// Main comparison component
function ComparisonPage() {
  return (
    <div className="space-y-8">
      {/* Button */}
      <ComparisonRow
        title="Button"
        reactContent={
          <div className="flex gap-2 flex-wrap">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        }
        planksHtml={`
          <div class="flex gap-2 flex-wrap">
            <plank-button>Default</plank-button>
            <plank-button variant="secondary">Secondary</plank-button>
            <plank-button variant="destructive">Destructive</plank-button>
            <plank-button variant="outline">Outline</plank-button>
            <plank-button variant="ghost">Ghost</plank-button>
          </div>
        `}
      />

      {/* Badge */}
      <ComparisonRow
        title="Badge"
        reactContent={
          <div className="flex gap-2 flex-wrap">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
          </div>
        }
        planksHtml={`
          <div class="flex gap-2 flex-wrap">
            <plank-badge>Default</plank-badge>
            <plank-badge variant="secondary">Secondary</plank-badge>
            <plank-badge variant="destructive">Destructive</plank-badge>
            <plank-badge variant="outline">Outline</plank-badge>
          </div>
        `}
      />

      {/* Input */}
      <ComparisonRow
        title="Input"
        reactContent={
          <Input placeholder="Enter text..." className="max-w-xs" />
        }
        planksHtml={`<plank-input placeholder="Enter text..." class="max-w-xs"></plank-input>`}
      />

      {/* Textarea */}
      <ComparisonRow
        title="Textarea"
        reactContent={
          <Textarea placeholder="Enter text..." className="max-w-xs" rows={3} />
        }
        planksHtml={`<plank-textarea placeholder="Enter text..." class="max-w-xs" rows="3"></plank-textarea>`}
      />

      {/* Label */}
      <ComparisonRow
        title="Label"
        reactContent={<Label>Email address</Label>}
        planksHtml={`<plank-label>Email address</plank-label>`}
      />

      {/* Separator */}
      <ComparisonRow
        title="Separator"
        reactContent={
          <div className="w-full max-w-xs">
            <Separator />
          </div>
        }
        planksHtml={`<div class="w-full max-w-xs"><plank-separator></plank-separator></div>`}
      />

      {/* Skeleton */}
      <ComparisonRow
        title="Skeleton"
        reactContent={
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        }
        planksHtml={`
          <div class="flex items-center gap-4">
            <plank-skeleton class="h-12 w-12 rounded-full"></plank-skeleton>
            <div class="space-y-2">
              <plank-skeleton class="h-4 w-32"></plank-skeleton>
              <plank-skeleton class="h-4 w-24"></plank-skeleton>
            </div>
          </div>
        `}
      />

      {/* Switch */}
      <ComparisonRow
        title="Switch"
        reactContent={
          <div className="flex items-center gap-2">
            <Switch defaultChecked />
            <span className="text-sm">Enabled</span>
          </div>
        }
        planksHtml={`
          <div class="flex items-center gap-2">
            <plank-switch checked></plank-switch>
            <span class="text-sm">Enabled</span>
          </div>
        `}
      />

      {/* Checkbox */}
      <ComparisonRow
        title="Checkbox"
        reactContent={
          <div className="flex items-center gap-2">
            <Checkbox defaultChecked id="react-cb" />
            <Label htmlFor="react-cb">Accept terms</Label>
          </div>
        }
        planksHtml={`
          <div class="flex items-center gap-2">
            <plank-checkbox checked id="plank-cb"></plank-checkbox>
            <plank-label for="plank-cb">Accept terms</plank-label>
          </div>
        `}
      />

      {/* Toggle */}
      <ComparisonRow
        title="Toggle"
        reactContent={
          <div className="flex gap-2">
            <Toggle defaultPressed aria-label="Bold">
              B
            </Toggle>
            <Toggle aria-label="Italic">I</Toggle>
          </div>
        }
        planksHtml={`
          <div class="flex gap-2">
            <plank-toggle pressed aria-label="Bold">B</plank-toggle>
            <plank-toggle aria-label="Italic">I</plank-toggle>
          </div>
        `}
      />

      {/* Progress */}
      <ComparisonRow
        title="Progress"
        reactContent={<Progress value={66} className="max-w-xs" />}
        planksHtml={`<plank-progress value="66" class="max-w-xs"></plank-progress>`}
      />

      {/* Slider */}
      <ComparisonRow
        title="Slider"
        reactContent={<Slider defaultValue={[50]} className="max-w-xs" />}
        planksHtml={`<plank-slider value="50" class="max-w-xs"></plank-slider>`}
      />

      {/* Card */}
      <ComparisonRow
        title="Card"
        reactContent={
          <Card className="max-w-xs">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text</CardDescription>
            </CardHeader>
            <CardContent>Card content goes here</CardContent>
          </Card>
        }
        planksHtml={`
          <plank-card class="max-w-xs">
            <plank-card-header>
              <plank-card-title>Card Title</plank-card-title>
              <plank-card-description>Card description text</plank-card-description>
            </plank-card-header>
            <plank-card-content>Card content goes here</plank-card-content>
          </plank-card>
        `}
      />

      {/* Alert */}
      <ComparisonRow
        title="Alert"
        reactContent={
          <Alert className="max-w-sm">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>This is an important message.</AlertDescription>
          </Alert>
        }
        planksHtml={`
          <plank-alert class="max-w-sm">
            <plank-alert-title>Heads up!</plank-alert-title>
            <plank-alert-description>This is an important message.</plank-alert-description>
          </plank-alert>
        `}
      />

      {/* Avatar */}
      <ComparisonRow
        title="Avatar"
        reactContent={
          <div className="flex -space-x-2">
            <Avatar className="ring-2 ring-background">
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <Avatar className="ring-2 ring-background">
              <AvatarFallback>B</AvatarFallback>
            </Avatar>
            <Avatar className="ring-2 ring-background">
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
          </div>
        }
        planksHtml={`
          <div class="flex -space-x-2">
            <plank-avatar class="ring-2 ring-background">
              <plank-avatar-fallback>A</plank-avatar-fallback>
            </plank-avatar>
            <plank-avatar class="ring-2 ring-background">
              <plank-avatar-fallback>B</plank-avatar-fallback>
            </plank-avatar>
            <plank-avatar class="ring-2 ring-background">
              <plank-avatar-fallback>C</plank-avatar-fallback>
            </plank-avatar>
          </div>
        `}
      />

      {/* Collapsible */}
      <ComparisonRow
        title="Collapsible"
        reactContent={
          <Collapsible className="w-full max-w-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Click to toggle</span>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  Toggle
                </Button>
              </CollapsibleTrigger>
            </div>
            <CollapsibleContent>
              <div className="rounded-md border px-3 py-2 text-sm">
                Hidden content
              </div>
            </CollapsibleContent>
          </Collapsible>
        }
        planksHtml={`
          <plank-collapsible class="w-full max-w-xs flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">Click to toggle</span>
              <plank-collapsible-trigger>
                <plank-button variant="ghost" size="sm">Toggle</plank-button>
              </plank-collapsible-trigger>
            </div>
            <plank-collapsible-content>
              <div class="rounded-md border px-3 py-2 text-sm">Hidden content</div>
            </plank-collapsible-content>
          </plank-collapsible>
        `}
      />

      {/* Accordion */}
      <ComparisonRow
        title="Accordion"
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
        planksHtml={`
          <plank-accordion collapsible class="w-full max-w-xs">
            <plank-accordion-item value="item-1">
              <plank-accordion-trigger>Is it accessible?</plank-accordion-trigger>
              <plank-accordion-content>Yes. It follows WAI-ARIA patterns.</plank-accordion-content>
            </plank-accordion-item>
            <plank-accordion-item value="item-2">
              <plank-accordion-trigger>Is it styled?</plank-accordion-trigger>
              <plank-accordion-content>Yes. It uses Tailwind CSS classes.</plank-accordion-content>
            </plank-accordion-item>
          </plank-accordion>
        `}
      />

      {/* Tabs */}
      <ComparisonRow
        title="Tabs"
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
        planksHtml={`
          <plank-tabs value="tab1" class="w-full max-w-xs">
            <plank-tabs-list>
              <plank-tabs-trigger value="tab1">Account</plank-tabs-trigger>
              <plank-tabs-trigger value="tab2">Password</plank-tabs-trigger>
            </plank-tabs-list>
            <plank-tabs-content value="tab1">
              <p class="text-sm text-muted-foreground">Account settings here</p>
            </plank-tabs-content>
            <plank-tabs-content value="tab2">
              <p class="text-sm text-muted-foreground">Password settings here</p>
            </plank-tabs-content>
          </plank-tabs>
        `}
      />

      {/* Radio Group */}
      <ComparisonRow
        title="Radio Group"
        reactContent={
          <RadioGroup defaultValue="option1">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="option1" id="r1" />
              <Label htmlFor="r1">Option 1</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="option2" id="r2" />
              <Label htmlFor="r2">Option 2</Label>
            </div>
          </RadioGroup>
        }
        planksHtml={`
          <plank-radio-group value="option1">
            <div class="flex items-center gap-2">
              <plank-radio-group-item value="option1" id="pr1"></plank-radio-group-item>
              <plank-label for="pr1">Option 1</plank-label>
            </div>
            <div class="flex items-center gap-2">
              <plank-radio-group-item value="option2" id="pr2"></plank-radio-group-item>
              <plank-label for="pr2">Option 2</plank-label>
            </div>
          </plank-radio-group>
        `}
      />

      {/* Toggle Group */}
      <ComparisonRow
        title="Toggle Group"
        reactContent={
          <ToggleGroup type="multiple" defaultValue={["bold"]}>
            <ToggleGroupItem value="bold" aria-label="Bold">
              B
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" aria-label="Italic">
              I
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" aria-label="Underline">
              U
            </ToggleGroupItem>
          </ToggleGroup>
        }
        planksHtml={`
          <plank-toggle-group type="multiple" value="bold">
            <plank-toggle-group-item value="bold" aria-label="Bold">B</plank-toggle-group-item>
            <plank-toggle-group-item value="italic" aria-label="Italic">I</plank-toggle-group-item>
            <plank-toggle-group-item value="underline" aria-label="Underline">U</plank-toggle-group-item>
          </plank-toggle-group>
        `}
      />
    </div>
  )
}

// Mount React app
const container = document.getElementById("react-root")
if (container) {
  const root = createRoot(container)
  root.render(<ComparisonPage />)
}
