import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalItemGroup - groups items in a list
 * Uses role="list" for accessibility
 */
@customElement("hal-item-group")
export class HalItemGroup extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-group"
    this.setAttribute("role", "list")
    this.className = cn("group/item-group flex flex-col", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalItemSeparator - separator between items
 * Wraps hal-separator with item-specific styling
 */
@customElement("hal-item-separator")
export class HalItemSeparator extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-separator"
  }

  render() {
    return html`<hal-separator
      orientation="horizontal"
      class=${cn("my-0", this.class)}
    ></hal-separator>`
  }
}

/**
 * HalItem - main item component with variants
 */
@customElement("hal-item")
export class HalItem extends LitElement {
  @property({ type: String })
  variant: "default" | "outline" | "muted" = "default"

  @property({ type: String })
  size: "default" | "sm" = "default"

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item"
    this.dataset.variant = this.variant
    this.dataset.size = this.size

    const baseClasses =
      "group/item flex items-center border border-transparent text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"

    const variantClasses = {
      default: "bg-transparent",
      outline: "border-border",
      muted: "bg-muted/50",
    }

    const sizeClasses = {
      default: "p-4 gap-4 ",
      sm: "py-3 px-4 gap-2.5",
    }

    this.className = cn(
      "block",
      baseClasses,
      variantClasses[this.variant],
      sizeClasses[this.size],
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalItemMedia - media container for icons/images
 */
@customElement("hal-item-media")
export class HalItemMedia extends LitElement {
  @property({ type: String })
  variant: "default" | "icon" | "image" = "default"

  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-media"
    this.dataset.variant = this.variant

    const baseClasses =
      "flex shrink-0 items-center justify-center gap-2 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none group-has-[[data-slot=item-description]]/item:translate-y-0.5"

    const variantClasses = {
      default: "bg-transparent",
      icon: "size-8 border rounded-sm bg-muted [&_svg:not([class*='size-'])]:size-4",
      image:
        "size-10 rounded-sm overflow-hidden [&_img]:size-full [&_img]:object-cover",
    }

    this.className = cn(baseClasses, variantClasses[this.variant], this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalItemContent - content container
 */
@customElement("hal-item-content")
export class HalItemContent extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-content"
    this.className = cn(
      "flex flex-1 flex-col gap-1 [&+[data-slot=item-content]]:flex-none",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalItemTitle - title text
 */
@customElement("hal-item-title")
export class HalItemTitle extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-title"
    this.className = cn(
      "flex w-fit items-center gap-2 text-sm leading-snug font-medium",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalItemDescription - description text
 */
@customElement("hal-item-description")
export class HalItemDescription extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-description"
    this.className = cn(
      "text-muted-foreground line-clamp-2 text-sm leading-normal font-normal text-balance",
      "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalItemActions - actions container
 */
@customElement("hal-item-actions")
export class HalItemActions extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-actions"
    this.className = cn("flex items-center gap-2", this.class)
  }

  render() {
    return html``
  }
}

/**
 * HalItemHeader - header row
 */
@customElement("hal-item-header")
export class HalItemHeader extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-header"
    this.className = cn(
      "flex basis-full items-center justify-between gap-2",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalItemFooter - footer row
 */
@customElement("hal-item-footer")
export class HalItemFooter extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-footer"
    this.className = cn(
      "flex basis-full items-center justify-between gap-2",
      this.class
    )
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-item-group": HalItemGroup
    "hal-item-separator": HalItemSeparator
    "hal-item": HalItem
    "hal-item-media": HalItemMedia
    "hal-item-content": HalItemContent
    "hal-item-title": HalItemTitle
    "hal-item-description": HalItemDescription
    "hal-item-actions": HalItemActions
    "hal-item-header": HalItemHeader
    "hal-item-footer": HalItemFooter
  }
}
