import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Same variant definitions as React component
const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm grid has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] grid-cols-[0_1fr] has-[>svg]:gap-x-3 gap-y-0.5 items-start [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        destructive:
          "text-destructive bg-card [&>svg]:text-current *:data-[slot=alert-description]:text-destructive/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

type AlertVariant = VariantProps<typeof alertVariants>["variant"]

/**
 * HalAlert - an alert container web component that mirrors shadcn/ui Alert
 *
 * Uses light DOM so Tailwind classes apply directly.
 * Compose with hal-alert-title and hal-alert-description.
 *
 * Pattern: Self-styled (purely presentational)
 * - Styles the custom element itself
 * - Children stay in place naturally (no slot needed in light DOM)
 */
@customElement("hal-alert")
export class HalAlert extends LitElement {
  @property({ type: String })
  variant: AlertVariant = "default"

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "alert"
    this.setAttribute("role", "alert")
    this.className = cn(alertVariants({ variant: this.variant }), this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalAlertTitle - title section of an alert
 */
@customElement("hal-alert-title")
export class HalAlertTitle extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "alert-title"
    this.className = cn(
      "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalAlertDescription - description section of an alert
 */
@customElement("hal-alert-description")
export class HalAlertDescription extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "alert-description"
    this.className = cn(
      "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
      this.class
    )
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-alert": HalAlert
    "hal-alert-title": HalAlertTitle
    "hal-alert-description": HalAlertDescription
  }
}
