import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Same variant definitions as React component
const buttonGroupVariants = cva(
  "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2",
  {
    variants: {
      orientation: {
        horizontal:
          "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
        vertical:
          "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

type ButtonGroupOrientation = VariantProps<
  typeof buttonGroupVariants
>["orientation"]

/**
 * HalButtonGroup - a button group container web component that mirrors shadcn/ui ButtonGroup
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Compose with hal-button, hal-button-group-text, hal-button-group-separator.
 */
@customElement("hal-button-group")
export class HalButtonGroup extends LitElement {
  @property({ type: String, reflect: true })
  orientation: ButtonGroupOrientation = "horizontal"

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "group")
  }

  willUpdate() {
    this.dataset.slot = "button-group"
    this.dataset.orientation = this.orientation ?? "horizontal"
    this.className = cn(
      buttonGroupVariants({ orientation: this.orientation }),
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalButtonGroupText - text element within a button group
 */
@customElement("hal-button-group-text")
export class HalButtonGroupText extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.className = cn(
      "bg-muted flex items-center gap-2 rounded-md border px-4 text-sm font-medium shadow-xs [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalButtonGroupSeparator - separator within a button group
 */
@customElement("hal-button-group-separator")
export class HalButtonGroupSeparator extends LitElement {
  @property({ type: String, reflect: true })
  orientation: "horizontal" | "vertical" = "vertical"

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "button-group-separator"
    this.dataset.orientation = this.orientation
    this.className = cn(
      "block bg-input relative !m-0 self-stretch shrink-0",
      this.orientation === "vertical" ? "h-auto w-px" : "h-px w-full",
      this.class
    )
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-button-group": HalButtonGroup
    "hal-button-group-text": HalButtonGroupText
    "hal-button-group-separator": HalButtonGroupSeparator
  }
}
