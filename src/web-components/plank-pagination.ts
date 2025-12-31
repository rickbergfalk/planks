import { LitElement, html, nothing } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

// Button variants for link styling (reused from plank-button)
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
 * PlankPagination - Container for pagination navigation
 *
 * @example
 * ```html
 * <plank-pagination>
 *   <plank-pagination-content>
 *     <plank-pagination-item>
 *       <plank-pagination-previous href="#"></plank-pagination-previous>
 *     </plank-pagination-item>
 *     <plank-pagination-item>
 *       <plank-pagination-link href="#" active>1</plank-pagination-link>
 *     </plank-pagination-item>
 *     <plank-pagination-item>
 *       <plank-pagination-next href="#"></plank-pagination-next>
 *     </plank-pagination-item>
 *   </plank-pagination-content>
 * </plank-pagination>
 * ```
 */
@customElement("plank-pagination")
export class PlankPagination extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "pagination"
    this.setAttribute("role", "navigation")
    this.setAttribute("aria-label", "pagination")
    this.className = cn("mx-auto flex w-full justify-center", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankPaginationContent - Container for pagination items
 */
@customElement("plank-pagination-content")
export class PlankPaginationContent extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "pagination-content"
    this.className = cn("flex flex-row items-center gap-1", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankPaginationItem - Wrapper for individual pagination elements
 */
@customElement("plank-pagination-item")
export class PlankPaginationItem extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "pagination-item"
    this.className = cn("contents", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankPaginationLink - A page number link
 */
@customElement("plank-pagination-link")
export class PlankPaginationLink extends LitElement {
  @property({ type: String }) href: string = ""
  @property({ type: Boolean, reflect: true }) active: boolean = false
  @property({ type: String }) size: ButtonSize = "icon"
  @property({ type: String }) class: string = ""

  // Store original children before any render
  private _originalChildren: Node[] = []

  createRenderRoot() {
    return this
  }

  connectedCallback() {
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
      this.class
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
 * PlankPaginationPrevious - Previous page link
 */
@customElement("plank-pagination-previous")
export class PlankPaginationPrevious extends LitElement {
  @property({ type: String }) href: string = ""
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "pagination-previous"
    this.className = "contents"
  }

  render() {
    const linkClass = cn(
      buttonVariants({ variant: "ghost", size: "default" }),
      "gap-1 px-2.5 sm:pl-2.5",
      this.class
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
 * PlankPaginationNext - Next page link
 */
@customElement("plank-pagination-next")
export class PlankPaginationNext extends LitElement {
  @property({ type: String }) href: string = ""
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "pagination-next"
    this.className = "contents"
  }

  render() {
    const linkClass = cn(
      buttonVariants({ variant: "ghost", size: "default" }),
      "gap-1 px-2.5 sm:pr-2.5",
      this.class
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
 * PlankPaginationEllipsis - Ellipsis indicator for hidden pages
 */
@customElement("plank-pagination-ellipsis")
export class PlankPaginationEllipsis extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "pagination-ellipsis"
    this.setAttribute("aria-hidden", "true")
    this.className = cn("flex size-9 items-center justify-center", this.class)
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
    "plank-pagination": PlankPagination
    "plank-pagination-content": PlankPaginationContent
    "plank-pagination-item": PlankPaginationItem
    "plank-pagination-link": PlankPaginationLink
    "plank-pagination-previous": PlankPaginationPrevious
    "plank-pagination-next": PlankPaginationNext
    "plank-pagination-ellipsis": PlankPaginationEllipsis
  }
}
