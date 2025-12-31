import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * PlankBreadcrumb - Container for breadcrumb navigation
 *
 * @example
 * ```html
 * <plank-breadcrumb>
 *   <plank-breadcrumb-list>
 *     <plank-breadcrumb-item>
 *       <plank-breadcrumb-link href="#">Home</plank-breadcrumb-link>
 *     </plank-breadcrumb-item>
 *     <plank-breadcrumb-separator></plank-breadcrumb-separator>
 *     <plank-breadcrumb-item>
 *       <plank-breadcrumb-page>Current</plank-breadcrumb-page>
 *     </plank-breadcrumb-item>
 *   </plank-breadcrumb-list>
 * </plank-breadcrumb>
 * ```
 */
@customElement("plank-breadcrumb")
export class PlankBreadcrumb extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "breadcrumb"
    this.setAttribute("aria-label", "breadcrumb")
    this.className = cn("block", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankBreadcrumbList - Ordered list container for breadcrumb items
 */
@customElement("plank-breadcrumb-list")
export class PlankBreadcrumbList extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "breadcrumb-list"
    this.className = cn(
      "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankBreadcrumbItem - Individual breadcrumb item wrapper
 */
@customElement("plank-breadcrumb-item")
export class PlankBreadcrumbItem extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "breadcrumb-item"
    this.className = cn("inline-flex items-center gap-1.5", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankBreadcrumbLink - A link to a breadcrumb page
 */
@customElement("plank-breadcrumb-link")
export class PlankBreadcrumbLink extends LitElement {
  @property({ type: String }) href: string = ""
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
    this.dataset.slot = "breadcrumb-link"
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
    const linkClass = cn("hover:text-foreground transition-colors", this.class)

    return html`<a
      href=${this.href}
      class=${linkClass}
      aria-label="Breadcrumb link"
    ></a>`
  }
}

/**
 * PlankBreadcrumbPage - The current page in the breadcrumb (not a link)
 */
@customElement("plank-breadcrumb-page")
export class PlankBreadcrumbPage extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "breadcrumb-page"
    this.setAttribute("role", "link")
    this.setAttribute("aria-disabled", "true")
    this.setAttribute("aria-current", "page")
    this.className = cn("text-foreground font-normal", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankBreadcrumbSeparator - Separator between breadcrumb items
 */
@customElement("plank-breadcrumb-separator")
export class PlankBreadcrumbSeparator extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "breadcrumb-separator"
    this.setAttribute("role", "presentation")
    this.setAttribute("aria-hidden", "true")
    this.className = cn("[&>svg]:size-3.5", this.class)
  }

  render() {
    // Default chevron separator
    return html`
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-3.5"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    `
  }
}

/**
 * PlankBreadcrumbEllipsis - Ellipsis indicator for collapsed breadcrumb items
 */
@customElement("plank-breadcrumb-ellipsis")
export class PlankBreadcrumbEllipsis extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "breadcrumb-ellipsis"
    this.setAttribute("role", "presentation")
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
      <span class="sr-only">More</span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-breadcrumb": PlankBreadcrumb
    "plank-breadcrumb-list": PlankBreadcrumbList
    "plank-breadcrumb-item": PlankBreadcrumbItem
    "plank-breadcrumb-link": PlankBreadcrumbLink
    "plank-breadcrumb-page": PlankBreadcrumbPage
    "plank-breadcrumb-separator": PlankBreadcrumbSeparator
    "plank-breadcrumb-ellipsis": PlankBreadcrumbEllipsis
  }
}
