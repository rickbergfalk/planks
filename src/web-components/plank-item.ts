import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * PlankItemGroup - groups items in a list
 * Uses role="list" for accessibility
 */
@customElement("plank-item-group")
export class PlankItemGroup extends LitElement {
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
 * PlankItemSeparator - separator between items
 * Wraps plank-separator with item-specific styling
 */
@customElement("plank-item-separator")
export class PlankItemSeparator extends LitElement {
  @property({ type: String })
  class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "item-separator"
  }

  render() {
    return html`<plank-separator
      orientation="horizontal"
      class=${cn("my-0", this.class)}
    ></plank-separator>`
  }
}

/**
 * PlankItem - main item component with variants
 */
@customElement("plank-item")
export class PlankItem extends LitElement {
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
 * PlankItemMedia - media container for icons/images
 */
@customElement("plank-item-media")
export class PlankItemMedia extends LitElement {
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
 * PlankItemContent - content container
 */
@customElement("plank-item-content")
export class PlankItemContent extends LitElement {
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
 * PlankItemTitle - title text
 */
@customElement("plank-item-title")
export class PlankItemTitle extends LitElement {
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
 * PlankItemDescription - description text
 */
@customElement("plank-item-description")
export class PlankItemDescription extends LitElement {
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
 * PlankItemActions - actions container
 */
@customElement("plank-item-actions")
export class PlankItemActions extends LitElement {
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
 * PlankItemHeader - header row
 */
@customElement("plank-item-header")
export class PlankItemHeader extends LitElement {
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
 * PlankItemFooter - footer row
 */
@customElement("plank-item-footer")
export class PlankItemFooter extends LitElement {
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
    "plank-item-group": PlankItemGroup
    "plank-item-separator": PlankItemSeparator
    "plank-item": PlankItem
    "plank-item-media": PlankItemMedia
    "plank-item-content": PlankItemContent
    "plank-item-title": PlankItemTitle
    "plank-item-description": PlankItemDescription
    "plank-item-actions": PlankItemActions
    "plank-item-header": PlankItemHeader
    "plank-item-footer": PlankItemFooter
  }
}
