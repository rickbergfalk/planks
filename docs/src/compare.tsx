import React, { useEffect, useRef } from "react"
import { createRoot } from "react-dom/client"

// Import React components
import { Button } from "@/components/button"
import { Badge } from "@/components/badge"
import { Input } from "@/components/input"
import { Textarea } from "@/components/textarea"
import { Label } from "@/components/label"
import { NativeSelect, NativeSelectOption } from "@/components/native-select"
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
        planksHtml={`
          <plank-native-select>
            <plank-native-select-option value="">Select an option</plank-native-select-option>
            <plank-native-select-option value="apple">Apple</plank-native-select-option>
            <plank-native-select-option value="banana">Banana</plank-native-select-option>
            <plank-native-select-option value="orange">Orange</plank-native-select-option>
          </plank-native-select>
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
        planksHtml={`
          <div class="flex items-center gap-2">
            <span class="text-sm">Press</span>
            <plank-kbd>⌘</plank-kbd>
            <plank-kbd>K</plank-kbd>
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
        planksHtml={`
          <div class="w-48">
            <plank-aspect-ratio ratio="1.778">
              <div class="bg-muted rounded-md flex items-center justify-center h-full">16:9</div>
            </plank-aspect-ratio>
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
        planksHtml={`
          <plank-tooltip>
            <plank-tooltip-trigger>
              <plank-button variant="outline">Hover me</plank-button>
            </plank-tooltip-trigger>
            <plank-tooltip-content>Add to library</plank-tooltip-content>
          </plank-tooltip>
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
        planksHtml={`
          <plank-popover>
            <plank-popover-trigger>
              <plank-button variant="outline">Open popover</plank-button>
            </plank-popover-trigger>
            <plank-popover-content class="w-80">
              <div class="grid gap-4">
                <div class="space-y-2">
                  <h4 class="font-medium leading-none">Dimensions</h4>
                  <p class="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
                </div>
              </div>
            </plank-popover-content>
          </plank-popover>
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
        planksHtml={`
          <plank-dialog>
            <plank-dialog-trigger>
              <plank-button variant="outline">Open dialog</plank-button>
            </plank-dialog-trigger>
            <plank-dialog-content>
              <plank-dialog-header>
                <plank-dialog-title>Edit profile</plank-dialog-title>
                <plank-dialog-description>Make changes to your profile here.</plank-dialog-description>
              </plank-dialog-header>
              <plank-dialog-footer>
                <plank-button>Save changes</plank-button>
              </plank-dialog-footer>
            </plank-dialog-content>
          </plank-dialog>
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
        planksHtml={`
          <plank-alert-dialog>
            <plank-alert-dialog-trigger>
              <plank-button variant="destructive">Delete</plank-button>
            </plank-alert-dialog-trigger>
            <plank-alert-dialog-content>
              <plank-alert-dialog-header>
                <plank-alert-dialog-title>Are you absolutely sure?</plank-alert-dialog-title>
                <plank-alert-dialog-description>This action cannot be undone.</plank-alert-dialog-description>
              </plank-alert-dialog-header>
              <plank-alert-dialog-footer>
                <plank-alert-dialog-cancel>Cancel</plank-alert-dialog-cancel>
                <plank-alert-dialog-action>Continue</plank-alert-dialog-action>
              </plank-alert-dialog-footer>
            </plank-alert-dialog-content>
          </plank-alert-dialog>
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
        planksHtml={`
          <plank-dropdown-menu>
            <plank-dropdown-menu-trigger>
              <plank-button variant="outline">Open menu</plank-button>
            </plank-dropdown-menu-trigger>
            <plank-dropdown-menu-content>
              <plank-dropdown-menu-label>My Account</plank-dropdown-menu-label>
              <plank-dropdown-menu-separator></plank-dropdown-menu-separator>
              <plank-dropdown-menu-item>Profile</plank-dropdown-menu-item>
              <plank-dropdown-menu-item>Settings</plank-dropdown-menu-item>
              <plank-dropdown-menu-item>Log out</plank-dropdown-menu-item>
            </plank-dropdown-menu-content>
          </plank-dropdown-menu>
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
        planksHtml={`
          <plank-context-menu>
            <plank-context-menu-trigger>
              <div class="flex h-24 w-48 items-center justify-center rounded-md border border-dashed text-sm">
                Right click here
              </div>
            </plank-context-menu-trigger>
            <plank-context-menu-content>
              <plank-context-menu-item>Cut</plank-context-menu-item>
              <plank-context-menu-item>Copy</plank-context-menu-item>
              <plank-context-menu-item>Paste</plank-context-menu-item>
            </plank-context-menu-content>
          </plank-context-menu>
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
        planksHtml={`
          <plank-sheet>
            <plank-sheet-trigger>
              <plank-button variant="outline">Open sheet</plank-button>
            </plank-sheet-trigger>
            <plank-sheet-content>
              <plank-sheet-header>
                <plank-sheet-title>Edit profile</plank-sheet-title>
                <plank-sheet-description>Make changes to your profile here.</plank-sheet-description>
              </plank-sheet-header>
            </plank-sheet-content>
          </plank-sheet>
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
              Web Component (Planks)
            </h3>
            <PlanksDemo
              html={`
                <plank-drawer>
                  <plank-drawer-trigger>
                    <plank-button variant="outline">Open drawer</plank-button>
                  </plank-drawer-trigger>
                  <plank-drawer-content>
                    <plank-drawer-header>
                      <plank-drawer-title>Edit profile</plank-drawer-title>
                      <plank-drawer-description>Make changes to your profile here.</plank-drawer-description>
                    </plank-drawer-header>
                  </plank-drawer-content>
                </plank-drawer>
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
        planksHtml={`
          <plank-hover-card>
            <plank-hover-card-trigger>
              <plank-button variant="link">@shadcn</plank-button>
            </plank-hover-card-trigger>
            <plank-hover-card-content class="w-80">
              <div class="flex justify-between space-x-4">
                <div class="space-y-1">
                  <h4 class="text-sm font-semibold">@shadcn</h4>
                  <p class="text-sm">The creator of shadcn/ui and related tools.</p>
                </div>
              </div>
            </plank-hover-card-content>
          </plank-hover-card>
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
        planksHtml={`
          <plank-select class="w-48">
            <plank-select-trigger>
              <plank-select-value placeholder="Select a fruit"></plank-select-value>
            </plank-select-trigger>
            <plank-select-content>
              <plank-select-item value="apple">Apple</plank-select-item>
              <plank-select-item value="banana">Banana</plank-select-item>
              <plank-select-item value="orange">Orange</plank-select-item>
            </plank-select-content>
          </plank-select>
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
        planksHtml={`
          <plank-command class="rounded-lg border shadow-md max-w-xs">
            <plank-command-input placeholder="Type a command..."></plank-command-input>
            <plank-command-list>
              <plank-command-empty>No results found.</plank-command-empty>
              <plank-command-group heading="Suggestions">
                <plank-command-item>Calendar</plank-command-item>
                <plank-command-item>Search</plank-command-item>
                <plank-command-item>Settings</plank-command-item>
              </plank-command-group>
            </plank-command-list>
          </plank-command>
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
        planksHtml={`
          <plank-table>
            <plank-table-header>
              <plank-table-row>
                <plank-table-head>Name</plank-table-head>
                <plank-table-head>Status</plank-table-head>
                <plank-table-head>Role</plank-table-head>
              </plank-table-row>
            </plank-table-header>
            <plank-table-body>
              <plank-table-row>
                <plank-table-cell>Alice</plank-table-cell>
                <plank-table-cell>Active</plank-table-cell>
                <plank-table-cell>Admin</plank-table-cell>
              </plank-table-row>
              <plank-table-row>
                <plank-table-cell>Bob</plank-table-cell>
                <plank-table-cell>Inactive</plank-table-cell>
                <plank-table-cell>User</plank-table-cell>
              </plank-table-row>
            </plank-table-body>
          </plank-table>
        `}
      />

      {/* Calendar */}
      <ComparisonRow
        title="Calendar"
        reactContent={<Calendar className="rounded-md border" />}
        planksHtml={`<plank-calendar class="rounded-md border"></plank-calendar>`}
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
        planksHtml={`
          <plank-carousel class="w-full max-w-xs mx-auto">
            <plank-carousel-content>
              <plank-carousel-item>
                <div class="p-1">
                  <plank-card>
                    <plank-card-content class="flex aspect-square items-center justify-center p-6">
                      <span class="text-4xl font-semibold">1</span>
                    </plank-card-content>
                  </plank-card>
                </div>
              </plank-carousel-item>
              <plank-carousel-item>
                <div class="p-1">
                  <plank-card>
                    <plank-card-content class="flex aspect-square items-center justify-center p-6">
                      <span class="text-4xl font-semibold">2</span>
                    </plank-card-content>
                  </plank-card>
                </div>
              </plank-carousel-item>
              <plank-carousel-item>
                <div class="p-1">
                  <plank-card>
                    <plank-card-content class="flex aspect-square items-center justify-center p-6">
                      <span class="text-4xl font-semibold">3</span>
                    </plank-card-content>
                  </plank-card>
                </div>
              </plank-carousel-item>
            </plank-carousel-content>
            <plank-carousel-previous></plank-carousel-previous>
            <plank-carousel-next></plank-carousel-next>
          </plank-carousel>
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
        planksHtml={`
          <plank-pagination>
            <plank-pagination-content>
              <plank-pagination-item>
                <plank-pagination-previous href="#"></plank-pagination-previous>
              </plank-pagination-item>
              <plank-pagination-item>
                <plank-pagination-link href="#">1</plank-pagination-link>
              </plank-pagination-item>
              <plank-pagination-item>
                <plank-pagination-link href="#" active>2</plank-pagination-link>
              </plank-pagination-item>
              <plank-pagination-item>
                <plank-pagination-link href="#">3</plank-pagination-link>
              </plank-pagination-item>
              <plank-pagination-item>
                <plank-pagination-next href="#"></plank-pagination-next>
              </plank-pagination-item>
            </plank-pagination-content>
          </plank-pagination>
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
        planksHtml={`
          <plank-breadcrumb>
            <plank-breadcrumb-list>
              <plank-breadcrumb-item>
                <plank-breadcrumb-link href="#">Home</plank-breadcrumb-link>
              </plank-breadcrumb-item>
              <plank-breadcrumb-separator></plank-breadcrumb-separator>
              <plank-breadcrumb-item>
                <plank-breadcrumb-link href="#">Components</plank-breadcrumb-link>
              </plank-breadcrumb-item>
              <plank-breadcrumb-separator></plank-breadcrumb-separator>
              <plank-breadcrumb-item>
                <plank-breadcrumb-page>Breadcrumb</plank-breadcrumb-page>
              </plank-breadcrumb-item>
            </plank-breadcrumb-list>
          </plank-breadcrumb>
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
        planksHtml={`
          <plank-resizable-panel-group direction="horizontal" class="max-w-md rounded-lg border">
            <plank-resizable-panel default-size="50">
              <div class="flex h-24 items-center justify-center p-6">
                <span class="font-semibold">Panel 1</span>
              </div>
            </plank-resizable-panel>
            <plank-resizable-handle with-handle></plank-resizable-handle>
            <plank-resizable-panel default-size="50">
              <div class="flex h-24 items-center justify-center p-6">
                <span class="font-semibold">Panel 2</span>
              </div>
            </plank-resizable-panel>
          </plank-resizable-panel-group>
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
        planksHtml={`
          <plank-navigation-menu>
            <plank-navigation-menu-list>
              <plank-navigation-menu-item>
                <plank-navigation-menu-trigger>Getting Started</plank-navigation-menu-trigger>
                <plank-navigation-menu-content>
                  <div class="grid gap-3 p-4 w-48">
                    <plank-navigation-menu-link href="#">Introduction</plank-navigation-menu-link>
                    <plank-navigation-menu-link href="#">Installation</plank-navigation-menu-link>
                  </div>
                </plank-navigation-menu-content>
              </plank-navigation-menu-item>
              <plank-navigation-menu-item>
                <plank-navigation-menu-trigger>Components</plank-navigation-menu-trigger>
                <plank-navigation-menu-content>
                  <div class="grid gap-3 p-4 w-48">
                    <plank-navigation-menu-link href="#">Button</plank-navigation-menu-link>
                    <plank-navigation-menu-link href="#">Card</plank-navigation-menu-link>
                  </div>
                </plank-navigation-menu-content>
              </plank-navigation-menu-item>
            </plank-navigation-menu-list>
          </plank-navigation-menu>
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
        planksHtml={`
          <plank-menubar>
            <plank-menubar-menu>
              <plank-menubar-trigger>File</plank-menubar-trigger>
              <plank-menubar-content>
                <plank-menubar-item>New File</plank-menubar-item>
                <plank-menubar-item>Open</plank-menubar-item>
                <plank-menubar-separator></plank-menubar-separator>
                <plank-menubar-item>Save</plank-menubar-item>
              </plank-menubar-content>
            </plank-menubar-menu>
            <plank-menubar-menu>
              <plank-menubar-trigger>Edit</plank-menubar-trigger>
              <plank-menubar-content>
                <plank-menubar-item>Undo</plank-menubar-item>
                <plank-menubar-item>Redo</plank-menubar-item>
              </plank-menubar-content>
            </plank-menubar-menu>
          </plank-menubar>
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
        planksHtml={`
          <plank-scroll-area class="h-48 w-48 rounded-md border p-4">
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
          </plank-scroll-area>
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
        planksHtml={`
          <plank-input-otp maxlength="6">
            <plank-input-otp-group>
              <plank-input-otp-slot index="0"></plank-input-otp-slot>
              <plank-input-otp-slot index="1"></plank-input-otp-slot>
              <plank-input-otp-slot index="2"></plank-input-otp-slot>
            </plank-input-otp-group>
            <plank-input-otp-separator></plank-input-otp-separator>
            <plank-input-otp-group>
              <plank-input-otp-slot index="3"></plank-input-otp-slot>
              <plank-input-otp-slot index="4"></plank-input-otp-slot>
              <plank-input-otp-slot index="5"></plank-input-otp-slot>
            </plank-input-otp-group>
          </plank-input-otp>
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
