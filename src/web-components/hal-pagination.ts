import { LitElement, html, nothing } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Button variants for link styling (reused from hal-button)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "ghost",
      size: "icon",
    },
  }
)

type ButtonSize = VariantProps<typeof buttonVariants>["size"]

/**
 * HalPagination - Container for pagination navigation
 *
 * @example
 * ```html
 * <hal-pagination>
 *   <hal-pagination-content>
 *     <hal-pagination-item>
 *       <hal-pagination-previous href="#"></hal-pagination-previous>
 *     </hal-pagination-item>
 *     <hal-pagination-item>
 *       <hal-pagination-link href="#" active>1</hal-pagination-link>
 *     </hal-pagination-item>
 *     <hal-pagination-item>
 *       <hal-pagination-next href="#"></hal-pagination-next>
 *     </hal-pagination-item>
 *   </hal-pagination-content>
 * </hal-pagination>
 * ```
 */
@customElement("hal-pagination")
export class HalPagination extends LitElement {
  private _userClass: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    this._userClass = this.getAttribute("class") || ""
    super.connectedCallback()
  }

  willUpdate() {
    this.dataset.slot = "pagination"
    this.setAttribute("role", "navigation")
    this.setAttribute("aria-label", "pagination")
    this.className = cn("mx-auto flex w-full justify-center", this._userClass)
  }

  render() {
    return html``
  }
}

/**
 * HalPaginationContent - Container for pagination items
 */
@customElement("hal-pagination-content")
export class HalPaginationContent extends LitElement {
  private _userClass: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    this._userClass = this.getAttribute("class") || ""
    super.connectedCallback()
  }

  willUpdate() {
    this.dataset.slot = "pagination-content"
    this.className = cn("flex flex-row items-center gap-1", this._userClass)
  }

  render() {
    return html``
  }
}

/**
 * HalPaginationItem - Wrapper for individual pagination elements
 */
@customElement("hal-pagination-item")
export class HalPaginationItem extends LitElement {
  private _userClass: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    this._userClass = this.getAttribute("class") || ""
    super.connectedCallback()
  }

  willUpdate() {
    this.dataset.slot = "pagination-item"
    this.className = cn("contents", this._userClass)
  }

  render() {
    return html``
  }
}

/**
 * HalPaginationLink - A page number link
 */
@customElement("hal-pagination-link")
export class HalPaginationLink extends LitElement {
  @property({ type: String }) href: string = ""
  @property({ type: Boolean, reflect: true }) active: boolean = false
  @property({ type: String }) size: ButtonSize = "icon"

  // Store original children and user class before any render
  private _originalChildren: Node[] = []
  private _userClass: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    // Capture user's class before super.connectedCallback() triggers updates
    this._userClass = this.getAttribute("class") || ""
    super.connectedCallback()
    // Capture children before first render
    this._originalChildren = [...this.childNodes]
  }

  willUpdate() {
    this.dataset.slot = "pagination-link"
    this.dataset.active = String(this.active)
    this.className = "contents"
  }

  firstUpdated() {
    // Move original children into the anchor
    const anchor = this.querySelector("a")
    if (anchor) {
      this._originalChildren.forEach((child) => {
        if (child !== anchor) {
          anchor.appendChild(child)
        }
      })
    }
  }

  render() {
    const linkClass = cn(
      buttonVariants({
        variant: this.active ? "outline" : "ghost",
        size: this.size,
      }),
      this._userClass
    )

    return html`
      <a
        href=${this.href}
        class=${linkClass}
        aria-current=${this.active ? "page" : nothing}
        data-active=${this.active}
        aria-label="Page"
      ></a>
    `
  }
}

/**
 * HalPaginationPrevious - Previous page link
 */
@customElement("hal-pagination-previous")
export class HalPaginationPrevious extends LitElement {
  @property({ type: String }) href: string = ""

  private _userClass: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    this._userClass = this.getAttribute("class") || ""
    super.connectedCallback()
  }

  willUpdate() {
    this.dataset.slot = "pagination-previous"
    this.className = "contents"
  }

  render() {
    const linkClass = cn(
      buttonVariants({ variant: "ghost", size: "default" }),
      "gap-1 px-2.5 sm:pl-2.5",
      this._userClass
    )

    return html`
      <a href=${this.href} class=${linkClass} aria-label="Go to previous page">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        <span class="hidden sm:block">Previous</span>
      </a>
    `
  }
}

/**
 * HalPaginationNext - Next page link
 */
@customElement("hal-pagination-next")
export class HalPaginationNext extends LitElement {
  @property({ type: String }) href: string = ""

  private _userClass: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    this._userClass = this.getAttribute("class") || ""
    super.connectedCallback()
  }

  willUpdate() {
    this.dataset.slot = "pagination-next"
    this.className = "contents"
  }

  render() {
    const linkClass = cn(
      buttonVariants({ variant: "ghost", size: "default" }),
      "gap-1 px-2.5 sm:pr-2.5",
      this._userClass
    )

    return html`
      <a href=${this.href} class=${linkClass} aria-label="Go to next page">
        <span class="hidden sm:block">Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-4"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </a>
    `
  }
}

/**
 * HalPaginationEllipsis - Ellipsis indicator for hidden pages
 */
@customElement("hal-pagination-ellipsis")
export class HalPaginationEllipsis extends LitElement {
  private _userClass: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    this._userClass = this.getAttribute("class") || ""
    super.connectedCallback()
  }

  willUpdate() {
    this.dataset.slot = "pagination-ellipsis"
    this.setAttribute("aria-hidden", "true")
    this.className = cn(
      "flex size-9 items-center justify-center",
      this._userClass
    )
  }

  render() {
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
      <span class="sr-only">More pages</span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-pagination": HalPagination
    "hal-pagination-content": HalPaginationContent
    "hal-pagination-item": HalPaginationItem
    "hal-pagination-link": HalPaginationLink
    "hal-pagination-previous": HalPaginationPrevious
    "hal-pagination-next": HalPaginationNext
    "hal-pagination-ellipsis": HalPaginationEllipsis
  }
}
