import React, { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

// Import React components
import { Button } from "@/components/button"
import { ButtonGroup, ButtonGroupText } from "@/components/button-group"
import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { Textarea } from "@/components/textarea"
import { Label } from "@/components/label"
import { NativeSelect, NativeSelectOption } from "@/components/native-select"
import { Separator } from "@/components/separator"
import { Skeleton } from "@/components/skeleton"
import { Spinner } from "@/components/spinner"
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
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/empty"
import { Avatar, AvatarFallback } from "@/components/avatar"
import { Field, FieldLabel, FieldDescription } from "@/components/field"
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
import { Kbd } from "@/components/kbd"
import { AspectRatio } from "@/components/aspect-ratio"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/dropdown-menu"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/context-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/sheet"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/drawer"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/hover-card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/command"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/table"
import { Calendar } from "@/components/calendar"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/carousel"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/pagination"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/breadcrumb"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/resizable"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/navigation-menu"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/menubar"
import { ScrollArea } from "@/components/scroll-area"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/input-otp"

// Component to render hallucn HTML after mount
function HallucnDemo({ html }: { html: string }) {
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
  hallucnHtml,
}: {
  title: string
  reactContent: React.ReactNode
  hallucnHtml: string
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
            Web Component (hallucn)
          </h3>
          <HallucnDemo html={hallucnHtml} />
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
        hallucnHtml={`
          <div class="flex gap-2 flex-wrap">
            <hal-button>Default</hal-button>
            <hal-button variant="secondary">Secondary</hal-button>
            <hal-button variant="destructive">Destructive</hal-button>
            <hal-button variant="outline">Outline</hal-button>
            <hal-button variant="ghost">Ghost</hal-button>
          </div>
        `}
      />

      {/* Button Group */}
      <ComparisonRow
        title="Button Group"
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
        hallucnHtml={`
          <div class="flex gap-2 flex-wrap">
            <hal-badge>Default</hal-badge>
            <hal-badge variant="secondary">Secondary</hal-badge>
            <hal-badge variant="destructive">Destructive</hal-badge>
            <hal-badge variant="outline">Outline</hal-badge>
          </div>
        `}
      />

      {/* Input */}
      <ComparisonRow
        title="Input"
        reactContent={
          <Input placeholder="Enter text..." className="max-w-xs" />
        }
        hallucnHtml={`<hal-input placeholder="Enter text..." class="max-w-xs"></hal-input>`}
      />

      {/* Textarea */}
      <ComparisonRow
        title="Textarea"
        reactContent={
          <Textarea placeholder="Enter text..." className="max-w-xs" rows={3} />
        }
        hallucnHtml={`<hal-textarea placeholder="Enter text..." class="max-w-xs" rows="3"></hal-textarea>`}
      />

      {/* Label */}
      <ComparisonRow
        title="Label"
        reactContent={<Label>Email address</Label>}
        hallucnHtml={`<hal-label>Email address</hal-label>`}
      />

      {/* Native Select */}
      <ComparisonRow
        title="Native Select"
        reactContent={
          <NativeSelect>
            <NativeSelectOption value="">Select an option</NativeSelectOption>
            <NativeSelectOption value="apple">Apple</NativeSelectOption>
            <NativeSelectOption value="banana">Banana</NativeSelectOption>
            <NativeSelectOption value="orange">Orange</NativeSelectOption>
          </NativeSelect>
        }
        hallucnHtml={`
          <hal-native-select>
            <hal-native-select-option value="">Select an option</hal-native-select-option>
            <hal-native-select-option value="apple">Apple</hal-native-select-option>
            <hal-native-select-option value="banana">Banana</hal-native-select-option>
            <hal-native-select-option value="orange">Orange</hal-native-select-option>
          </hal-native-select>
        `}
      />

      {/* Separator */}
      <ComparisonRow
        title="Separator"
        reactContent={
          <div className="w-full max-w-xs">
            <Separator />
          </div>
        }
        hallucnHtml={`<div class="w-full max-w-xs"><hal-separator></hal-separator></div>`}
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
        hallucnHtml={`
          <div class="flex items-center gap-4">
            <hal-skeleton class="h-12 w-12 rounded-full"></hal-skeleton>
            <div class="space-y-2">
              <hal-skeleton class="h-4 w-32"></hal-skeleton>
              <hal-skeleton class="h-4 w-24"></hal-skeleton>
            </div>
          </div>
        `}
      />

      {/* Spinner */}
      <ComparisonRow
        title="Spinner"
        reactContent={
          <div className="flex items-center gap-4">
            <Spinner />
            <Spinner className="size-6" />
            <Spinner className="size-8" />
          </div>
        }
        hallucnHtml={`
          <div class="flex items-center gap-4">
            <hal-spinner></hal-spinner>
            <hal-spinner class="size-6"></hal-spinner>
            <hal-spinner class="size-8"></hal-spinner>
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
        hallucnHtml={`
          <div class="flex items-center gap-2">
            <hal-switch checked></hal-switch>
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
        hallucnHtml={`
          <div class="flex items-center gap-2">
            <hal-checkbox checked id="hal-cb"></hal-checkbox>
            <hal-label for="hal-cb">Accept terms</hal-label>
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
        hallucnHtml={`
          <div class="flex gap-2">
            <hal-toggle pressed aria-label="Bold">B</hal-toggle>
            <hal-toggle aria-label="Italic">I</hal-toggle>
          </div>
        `}
      />

      {/* Progress */}
      <ComparisonRow
        title="Progress"
        reactContent={<Progress value={66} className="max-w-xs" />}
        hallucnHtml={`<hal-progress value="66" class="max-w-xs"></hal-progress>`}
      />

      {/* Slider */}
      <ComparisonRow
        title="Slider"
        reactContent={<Slider defaultValue={[50]} className="max-w-xs" />}
        hallucnHtml={`<hal-slider value="50" class="max-w-xs"></hal-slider>`}
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

      {/* Alert */}
      <ComparisonRow
        title="Alert"
        reactContent={
          <Alert className="max-w-sm">
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>This is an important message.</AlertDescription>
          </Alert>
        }
        hallucnHtml={`
          <hal-alert class="max-w-sm">
            <hal-alert-title>Heads up!</hal-alert-title>
            <hal-alert-description>This is an important message.</hal-alert-description>
          </hal-alert>
        `}
      />

      {/* Empty */}
      <ComparisonRow
        title="Empty"
        reactContent={
          <Empty className="border max-w-sm">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
              </EmptyMedia>
              <EmptyTitle>No messages</EmptyTitle>
              <EmptyDescription>
                Your inbox is empty. New messages will appear here.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button size="sm">Compose</Button>
            </EmptyContent>
          </Empty>
        }
        hallucnHtml={`
          <hal-empty class="border max-w-sm">
            <hal-empty-header>
              <hal-empty-media variant="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
                  <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
                </svg>
              </hal-empty-media>
              <hal-empty-title>No messages</hal-empty-title>
              <hal-empty-description>Your inbox is empty. New messages will appear here.</hal-empty-description>
            </hal-empty-header>
            <hal-empty-content>
              <hal-button size="sm">Compose</hal-button>
            </hal-empty-content>
          </hal-empty>
        `}
      />

      {/* Field */}
      <ComparisonRow
        title="Field"
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
        hallucnHtml={`
          <div class="flex -space-x-2">
            <hal-avatar class="ring-2 ring-background">
              <hal-avatar-fallback>A</hal-avatar-fallback>
            </hal-avatar>
            <hal-avatar class="ring-2 ring-background">
              <hal-avatar-fallback>B</hal-avatar-fallback>
            </hal-avatar>
            <hal-avatar class="ring-2 ring-background">
              <hal-avatar-fallback>C</hal-avatar-fallback>
            </hal-avatar>
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
        hallucnHtml={`
          <hal-collapsible class="w-full max-w-xs flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">Click to toggle</span>
              <hal-collapsible-trigger>
                <hal-button variant="ghost" size="sm">Toggle</hal-button>
              </hal-collapsible-trigger>
            </div>
            <hal-collapsible-content>
              <div class="rounded-md border px-3 py-2 text-sm">Hidden content</div>
            </hal-collapsible-content>
          </hal-collapsible>
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
        hallucnHtml={`
          <hal-radio-group value="option1">
            <div class="flex items-center gap-2">
              <hal-radio-group-item value="option1" id="pr1"></hal-radio-group-item>
              <hal-label for="pr1">Option 1</hal-label>
            </div>
            <div class="flex items-center gap-2">
              <hal-radio-group-item value="option2" id="pr2"></hal-radio-group-item>
              <hal-label for="pr2">Option 2</hal-label>
            </div>
          </hal-radio-group>
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
        hallucnHtml={`
          <hal-toggle-group type="multiple" value="bold">
            <hal-toggle-group-item value="bold" aria-label="Bold">B</hal-toggle-group-item>
            <hal-toggle-group-item value="italic" aria-label="Italic">I</hal-toggle-group-item>
            <hal-toggle-group-item value="underline" aria-label="Underline">U</hal-toggle-group-item>
          </hal-toggle-group>
        `}
      />

      {/* Kbd */}
      <ComparisonRow
        title="Kbd"
        reactContent={
          <div className="flex items-center gap-2">
            <span className="text-sm">Press</span>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
            <span className="text-sm">to search</span>
          </div>
        }
        hallucnHtml={`
          <div class="flex items-center gap-2">
            <span class="text-sm">Press</span>
            <hal-kbd>⌘</hal-kbd>
            <hal-kbd>K</hal-kbd>
            <span class="text-sm">to search</span>
          </div>
        `}
      />

      {/* Aspect Ratio */}
      <ComparisonRow
        title="Aspect Ratio"
        reactContent={
          <div className="w-48">
            <AspectRatio ratio={16 / 9}>
              <div className="bg-muted rounded-md flex items-center justify-center h-full">
                16:9
              </div>
            </AspectRatio>
          </div>
        }
        hallucnHtml={`
          <div class="w-48">
            <hal-aspect-ratio ratio="1.778">
              <div class="bg-muted rounded-md flex items-center justify-center h-full">16:9</div>
            </hal-aspect-ratio>
          </div>
        `}
      />

      {/* Tooltip */}
      <ComparisonRow
        title="Tooltip"
        reactContent={
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">Hover me</Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to library</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        }
        hallucnHtml={`
          <hal-tooltip>
            <hal-tooltip-trigger>
              <hal-button variant="outline">Hover me</hal-button>
            </hal-tooltip-trigger>
            <hal-tooltip-content>Add to library</hal-tooltip-content>
          </hal-tooltip>
        `}
      />

      {/* Popover */}
      <ComparisonRow
        title="Popover"
        reactContent={
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Dimensions</h4>
                  <p className="text-sm text-muted-foreground">
                    Set the dimensions for the layer.
                  </p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        }
        hallucnHtml={`
          <hal-popover>
            <hal-popover-trigger>
              <hal-button variant="outline">Open popover</hal-button>
            </hal-popover-trigger>
            <hal-popover-content class="w-80">
              <div class="grid gap-4">
                <div class="space-y-2">
                  <h4 class="font-medium leading-none">Dimensions</h4>
                  <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                </div>
              </div>
            </hal-popover-content>
          </hal-popover>
        `}
      />

      {/* Dialog */}
      <ComparisonRow
        title="Dialog"
        reactContent={
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Open dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button>Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
        hallucnHtml={`
          <hal-dialog>
            <hal-dialog-trigger>
              <hal-button variant="outline">Open dialog</hal-button>
            </hal-dialog-trigger>
            <hal-dialog-content>
              <hal-dialog-header>
                <hal-dialog-title>Edit profile</hal-dialog-title>
                <hal-dialog-description>Make changes to your profile here.</hal-dialog-description>
              </hal-dialog-header>
              <hal-dialog-footer>
                <hal-button>Save changes</hal-button>
              </hal-dialog-footer>
            </hal-dialog-content>
          </hal-dialog>
        `}
      />

      {/* Alert Dialog */}
      <ComparisonRow
        title="Alert Dialog"
        reactContent={
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
        hallucnHtml={`
          <hal-alert-dialog>
            <hal-alert-dialog-trigger>
              <hal-button variant="destructive">Delete</hal-button>
            </hal-alert-dialog-trigger>
            <hal-alert-dialog-content>
              <hal-alert-dialog-header>
                <hal-alert-dialog-title>Are you absolutely sure?</hal-alert-dialog-title>
                <hal-alert-dialog-description>This action cannot be undone.</hal-alert-dialog-description>
              </hal-alert-dialog-header>
              <hal-alert-dialog-footer>
                <hal-alert-dialog-cancel>Cancel</hal-alert-dialog-cancel>
                <hal-alert-dialog-action>Continue</hal-alert-dialog-action>
              </hal-alert-dialog-footer>
            </hal-alert-dialog-content>
          </hal-alert-dialog>
        `}
      />

      {/* Dropdown Menu */}
      <ComparisonRow
        title="Dropdown Menu"
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

      {/* Context Menu */}
      <ComparisonRow
        title="Context Menu"
        reactContent={
          <ContextMenu>
            <ContextMenuTrigger className="flex h-24 w-48 items-center justify-center rounded-md border border-dashed text-sm">
              Right click here
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>Cut</ContextMenuItem>
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Paste</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        }
        hallucnHtml={`
          <hal-context-menu>
            <hal-context-menu-trigger>
              <div class="flex h-24 w-48 items-center justify-center rounded-md border border-dashed text-sm">
                Right click here
              </div>
            </hal-context-menu-trigger>
            <hal-context-menu-content>
              <hal-context-menu-item>Cut</hal-context-menu-item>
              <hal-context-menu-item>Copy</hal-context-menu-item>
              <hal-context-menu-item>Paste</hal-context-menu-item>
            </hal-context-menu-content>
          </hal-context-menu>
        `}
      />

      {/* Sheet */}
      <ComparisonRow
        title="Sheet"
        reactContent={
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Open sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here.
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        }
        hallucnHtml={`
          <hal-sheet>
            <hal-sheet-trigger>
              <hal-button variant="outline">Open sheet</hal-button>
            </hal-sheet-trigger>
            <hal-sheet-content>
              <hal-sheet-header>
                <hal-sheet-title>Edit profile</hal-sheet-title>
                <hal-sheet-description>Make changes to your profile here.</hal-sheet-description>
              </hal-sheet-header>
            </hal-sheet-content>
          </hal-sheet>
        `}
      />

      {/* Drawer */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Drawer</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Note: Up to 2% visual variance allowed due to differences between the
          vaul library (React) and Lit implementation.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              React (shadcn/ui)
            </h3>
            <div className="p-4 border rounded-lg bg-background">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Edit profile</DrawerTitle>
                    <DrawerDescription>
                      Make changes to your profile here.
                    </DrawerDescription>
                  </DrawerHeader>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Web Component (hallucn)
            </h3>
            <HallucnDemo
              html={`
                <hal-drawer>
                  <hal-drawer-trigger>
                    <hal-button variant="outline">Open drawer</hal-button>
                  </hal-drawer-trigger>
                  <hal-drawer-content>
                    <hal-drawer-header>
                      <hal-drawer-title>Edit profile</hal-drawer-title>
                      <hal-drawer-description>Make changes to your profile here.</hal-drawer-description>
                    </hal-drawer-header>
                  </hal-drawer-content>
                </hal-drawer>
              `}
            />
          </div>
        </div>
      </div>

      {/* Hover Card */}
      <ComparisonRow
        title="Hover Card"
        reactContent={
          <HoverCard>
            <HoverCardTrigger asChild>
              <Button variant="link">@shadcn</Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-x-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">@shadcn</h4>
                  <p className="text-sm">
                    The creator of shadcn/ui and related tools.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        }
        hallucnHtml={`
          <hal-hover-card>
            <hal-hover-card-trigger>
              <hal-button variant="link">@shadcn</hal-button>
            </hal-hover-card-trigger>
            <hal-hover-card-content class="w-80">
              <div class="flex justify-between space-x-4">
                <div class="space-y-1">
                  <h4 class="text-sm font-semibold">@shadcn</h4>
                  <p class="text-sm">The creator of shadcn/ui and related tools.</p>
                </div>
              </div>
            </hal-hover-card-content>
          </hal-hover-card>
        `}
      />

      {/* Select */}
      <ComparisonRow
        title="Select"
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

      {/* Command */}
      <ComparisonRow
        title="Command"
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

      {/* Table */}
      <ComparisonRow
        title="Table"
        reactContent={
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Alice</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Admin</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Bob</TableCell>
                <TableCell>Inactive</TableCell>
                <TableCell>User</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        }
        hallucnHtml={`
          <hal-table>
            <hal-table-header>
              <hal-table-row>
                <hal-table-head>Name</hal-table-head>
                <hal-table-head>Status</hal-table-head>
                <hal-table-head>Role</hal-table-head>
              </hal-table-row>
            </hal-table-header>
            <hal-table-body>
              <hal-table-row>
                <hal-table-cell>Alice</hal-table-cell>
                <hal-table-cell>Active</hal-table-cell>
                <hal-table-cell>Admin</hal-table-cell>
              </hal-table-row>
              <hal-table-row>
                <hal-table-cell>Bob</hal-table-cell>
                <hal-table-cell>Inactive</hal-table-cell>
                <hal-table-cell>User</hal-table-cell>
              </hal-table-row>
            </hal-table-body>
          </hal-table>
        `}
      />

      {/* Calendar */}
      <ComparisonRow
        title="Calendar"
        reactContent={<Calendar className="rounded-md border" />}
        hallucnHtml={`<hal-calendar class="rounded-md border"></hal-calendar>`}
      />

      {/* Carousel */}
      <ComparisonRow
        title="Carousel"
        reactContent={
          <Carousel className="w-full max-w-xs mx-auto">
            <CarouselContent>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">1</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">2</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-6">
                      <span className="text-4xl font-semibold">3</span>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        }
        hallucnHtml={`
          <hal-carousel class="w-full max-w-xs mx-auto">
            <hal-carousel-content>
              <hal-carousel-item>
                <div class="p-1">
                  <hal-card>
                    <hal-card-content class="flex aspect-square items-center justify-center p-6">
                      <span class="text-4xl font-semibold">1</span>
                    </hal-card-content>
                  </hal-card>
                </div>
              </hal-carousel-item>
              <hal-carousel-item>
                <div class="p-1">
                  <hal-card>
                    <hal-card-content class="flex aspect-square items-center justify-center p-6">
                      <span class="text-4xl font-semibold">2</span>
                    </hal-card-content>
                  </hal-card>
                </div>
              </hal-carousel-item>
              <hal-carousel-item>
                <div class="p-1">
                  <hal-card>
                    <hal-card-content class="flex aspect-square items-center justify-center p-6">
                      <span class="text-4xl font-semibold">3</span>
                    </hal-card-content>
                  </hal-card>
                </div>
              </hal-carousel-item>
            </hal-carousel-content>
            <hal-carousel-previous></hal-carousel-previous>
            <hal-carousel-next></hal-carousel-next>
          </hal-carousel>
        `}
      />

      {/* Pagination */}
      <ComparisonRow
        title="Pagination"
        reactContent={
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        }
        hallucnHtml={`
          <hal-pagination>
            <hal-pagination-content>
              <hal-pagination-item>
                <hal-pagination-previous href="#"></hal-pagination-previous>
              </hal-pagination-item>
              <hal-pagination-item>
                <hal-pagination-link href="#">1</hal-pagination-link>
              </hal-pagination-item>
              <hal-pagination-item>
                <hal-pagination-link href="#" active>2</hal-pagination-link>
              </hal-pagination-item>
              <hal-pagination-item>
                <hal-pagination-link href="#">3</hal-pagination-link>
              </hal-pagination-item>
              <hal-pagination-item>
                <hal-pagination-next href="#"></hal-pagination-next>
              </hal-pagination-item>
            </hal-pagination-content>
          </hal-pagination>
        `}
      />

      {/* Breadcrumb */}
      <ComparisonRow
        title="Breadcrumb"
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

      {/* Resizable */}
      <ComparisonRow
        title="Resizable"
        reactContent={
          <ResizablePanelGroup
            direction="horizontal"
            className="max-w-md rounded-lg border"
          >
            <ResizablePanel defaultSize={50}>
              <div className="flex h-24 items-center justify-center p-6">
                <span className="font-semibold">Panel 1</span>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <div className="flex h-24 items-center justify-center p-6">
                <span className="font-semibold">Panel 2</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        }
        hallucnHtml={`
          <hal-resizable-panel-group direction="horizontal" class="max-w-md rounded-lg border">
            <hal-resizable-panel default-size="50">
              <div class="flex h-24 items-center justify-center p-6">
                <span class="font-semibold">Panel 1</span>
              </div>
            </hal-resizable-panel>
            <hal-resizable-handle with-handle></hal-resizable-handle>
            <hal-resizable-panel default-size="50">
              <div class="flex h-24 items-center justify-center p-6">
                <span class="font-semibold">Panel 2</span>
              </div>
            </hal-resizable-panel>
          </hal-resizable-panel-group>
        `}
      />

      {/* Navigation Menu */}
      <ComparisonRow
        title="Navigation Menu"
        reactContent={
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-48">
                    <NavigationMenuLink href="#">
                      Introduction
                    </NavigationMenuLink>
                    <NavigationMenuLink href="#">
                      Installation
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-48">
                    <NavigationMenuLink href="#">Button</NavigationMenuLink>
                    <NavigationMenuLink href="#">Card</NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        }
        hallucnHtml={`
          <hal-navigation-menu>
            <hal-navigation-menu-list>
              <hal-navigation-menu-item>
                <hal-navigation-menu-trigger>Getting Started</hal-navigation-menu-trigger>
                <hal-navigation-menu-content>
                  <div class="grid gap-3 p-4 w-48">
                    <hal-navigation-menu-link href="#">Introduction</hal-navigation-menu-link>
                    <hal-navigation-menu-link href="#">Installation</hal-navigation-menu-link>
                  </div>
                </hal-navigation-menu-content>
              </hal-navigation-menu-item>
              <hal-navigation-menu-item>
                <hal-navigation-menu-trigger>Components</hal-navigation-menu-trigger>
                <hal-navigation-menu-content>
                  <div class="grid gap-3 p-4 w-48">
                    <hal-navigation-menu-link href="#">Button</hal-navigation-menu-link>
                    <hal-navigation-menu-link href="#">Card</hal-navigation-menu-link>
                  </div>
                </hal-navigation-menu-content>
              </hal-navigation-menu-item>
            </hal-navigation-menu-list>
          </hal-navigation-menu>
        `}
      />

      {/* Menubar */}
      <ComparisonRow
        title="Menubar"
        reactContent={
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>New File</MenubarItem>
                <MenubarItem>Open</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Save</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>Undo</MenubarItem>
                <MenubarItem>Redo</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        }
        hallucnHtml={`
          <hal-menubar>
            <hal-menubar-menu>
              <hal-menubar-trigger>File</hal-menubar-trigger>
              <hal-menubar-content>
                <hal-menubar-item>New File</hal-menubar-item>
                <hal-menubar-item>Open</hal-menubar-item>
                <hal-menubar-separator></hal-menubar-separator>
                <hal-menubar-item>Save</hal-menubar-item>
              </hal-menubar-content>
            </hal-menubar-menu>
            <hal-menubar-menu>
              <hal-menubar-trigger>Edit</hal-menubar-trigger>
              <hal-menubar-content>
                <hal-menubar-item>Undo</hal-menubar-item>
                <hal-menubar-item>Redo</hal-menubar-item>
              </hal-menubar-content>
            </hal-menubar-menu>
          </hal-menubar>
        `}
      />

      {/* Scroll Area */}
      <ComparisonRow
        title="Scroll Area"
        reactContent={
          <ScrollArea className="h-48 w-48 rounded-md border p-4">
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="text-sm">
                  Item {i + 1}
                </div>
              ))}
            </div>
          </ScrollArea>
        }
        hallucnHtml={`
          <hal-scroll-area class="h-48 w-48 rounded-md border p-4">
            <div class="space-y-4">
              <div class="text-sm">Item 1</div>
              <div class="text-sm">Item 2</div>
              <div class="text-sm">Item 3</div>
              <div class="text-sm">Item 4</div>
              <div class="text-sm">Item 5</div>
              <div class="text-sm">Item 6</div>
              <div class="text-sm">Item 7</div>
              <div class="text-sm">Item 8</div>
              <div class="text-sm">Item 9</div>
              <div class="text-sm">Item 10</div>
            </div>
          </hal-scroll-area>
        `}
      />

      {/* Input OTP */}
      <ComparisonRow
        title="Input OTP"
        reactContent={
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        }
        hallucnHtml={`
          <hal-input-otp maxlength="6">
            <hal-input-otp-group>
              <hal-input-otp-slot index="0"></hal-input-otp-slot>
              <hal-input-otp-slot index="1"></hal-input-otp-slot>
              <hal-input-otp-slot index="2"></hal-input-otp-slot>
            </hal-input-otp-group>
            <hal-input-otp-separator></hal-input-otp-separator>
            <hal-input-otp-group>
              <hal-input-otp-slot index="3"></hal-input-otp-slot>
              <hal-input-otp-slot index="4"></hal-input-otp-slot>
              <hal-input-otp-slot index="5"></hal-input-otp-slot>
            </hal-input-otp-group>
          </hal-input-otp>
        `}
      />

      {/* Note about components not included */}
      <div className="mb-12 p-4 border rounded-lg bg-muted/50">
        <h2 className="text-lg font-semibold mb-2">Additional Components</h2>
        <p className="text-sm text-muted-foreground">
          The following components are also available but are not shown in this
          comparison as they require more complex setup or runtime
          configuration:
        </p>
        <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
          <li>
            <strong>Combobox</strong> - Combines input with command/dropdown
          </li>
          <li>
            <strong>Sidebar</strong> - Full application sidebar layout
          </li>
          <li>
            <strong>Input Group</strong> - Grouped input with addons
          </li>
          <li>
            <strong>Sonner (Toast)</strong> - Toast notifications (requires
            toast trigger)
          </li>
          <li>
            <strong>Chart</strong> - Data visualization (requires data
            configuration)
          </li>
        </ul>
      </div>
    </div>
  )
}

// Mount React app
const container = document.getElementById("react-root")
if (container) {
  const root = createRoot(container)
  root.render(<ComparisonPage />)
}
