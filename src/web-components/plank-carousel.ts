import { LitElement, html, nothing } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { cn } from "@/lib/utils"
import EmblaCarousel, { type EmblaCarouselType } from "embla-carousel"

/**
 * PlankCarousel - Container component that manages carousel state
 *
 * @fires select - Fired when the selected slide changes
 *
 * @example
 * ```html
 * <plank-carousel>
 *   <plank-carousel-content>
 *     <plank-carousel-item>Slide 1</plank-carousel-item>
 *     <plank-carousel-item>Slide 2</plank-carousel-item>
 *   </plank-carousel-content>
 *   <plank-carousel-previous></plank-carousel-previous>
 *   <plank-carousel-next></plank-carousel-next>
 * </plank-carousel>
 * ```
 */
@customElement("plank-carousel")
export class PlankCarousel extends LitElement {
  @property({ type: String, reflect: true }) orientation:
    | "horizontal"
    | "vertical" = "horizontal"
  @property({ type: String }) class: string = ""

  @state() private _canScrollPrev = false
  @state() private _canScrollNext = false

  private _emblaApi: EmblaCarouselType | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("keydown", this._handleKeydown)
    this._emblaApi?.destroy()
    this._emblaApi = null
  }

  willUpdate() {
    this.dataset.slot = "carousel"
    this.setAttribute("role", "region")
    this.setAttribute("aria-roledescription", "carousel")
    this.className = cn("relative block", this.class)
  }

  firstUpdated() {
    this._initEmbla()
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("orientation")) {
      // Re-initialize embla when orientation changes
      this._emblaApi?.destroy()
      this._initEmbla()
    }
  }

  private _initEmbla() {
    const content = this.querySelector("plank-carousel-content")
    if (!content) return

    this._emblaApi = EmblaCarousel(content as HTMLElement, {
      axis: this.orientation === "horizontal" ? "x" : "y",
    })

    this._emblaApi.on("select", this._onSelect)
    this._emblaApi.on("reInit", this._onSelect)

    // Update initial state
    this._onSelect()
    this._updateChildren()
  }

  private _onSelect = () => {
    if (!this._emblaApi) return
    this._canScrollPrev = this._emblaApi.canScrollPrev()
    this._canScrollNext = this._emblaApi.canScrollNext()
    this._updateButtons()
    this.dispatchEvent(new CustomEvent("select", { bubbles: true }))
  }

  private _updateChildren() {
    // Update content and items with orientation
    const content = this.querySelector(
      "plank-carousel-content"
    ) as PlankCarouselContent
    if (content) {
      content._setOrientation(this.orientation)
    }

    const items = this.querySelectorAll("plank-carousel-item")
    items.forEach((item) => {
      ;(item as PlankCarouselItem)._setOrientation(this.orientation)
    })
  }

  private _updateButtons() {
    const prev = this.querySelector(
      "plank-carousel-previous"
    ) as PlankCarouselPrevious
    const next = this.querySelector("plank-carousel-next") as PlankCarouselNext

    if (prev) {
      prev._setDisabled(!this._canScrollPrev)
      prev._setOrientation(this.orientation)
    }
    if (next) {
      next._setDisabled(!this._canScrollNext)
      next._setOrientation(this.orientation)
    }
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      this.scrollPrev()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      this.scrollNext()
    }
  }

  scrollPrev() {
    this._emblaApi?.scrollPrev()
  }

  scrollNext() {
    this._emblaApi?.scrollNext()
  }

  getApi() {
    return this._emblaApi
  }

  render() {
    return html``
  }
}

/**
 * PlankCarouselContent - Container for carousel items
 *
 * This component uses a manual DOM approach because:
 * 1. Embla expects a specific structure: wrapper > container > slides
 * 2. Lit's rendering would interfere with embla's initialization
 * 3. Children need to be inside the inner container before embla initializes
 */
@customElement("plank-carousel-content")
export class PlankCarouselContent extends LitElement {
  @property({ type: String }) class: string = ""

  @state() private _orientation: "horizontal" | "vertical" = "horizontal"

  private _innerContainer: HTMLDivElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Create the inner container and move children into it
    this._setupStructure()
  }

  private _setupStructure() {
    // Create inner container
    this._innerContainer = document.createElement("div")
    this._innerContainer.setAttribute("data-carousel-inner", "")

    // Move all existing children into the inner container
    while (this.firstChild) {
      this._innerContainer.appendChild(this.firstChild)
    }

    // Append the inner container
    this.appendChild(this._innerContainer)
    this._updateInnerClass()
  }

  willUpdate() {
    this.dataset.slot = "carousel-content"
    this.className = cn("overflow-hidden block", this.class)
  }

  _setOrientation(orientation: "horizontal" | "vertical") {
    this._orientation = orientation
    this._updateInnerClass()
  }

  private _updateInnerClass() {
    if (this._innerContainer) {
      this._innerContainer.className = cn(
        "flex",
        this._orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col"
      )
    }
  }

  render() {
    // Don't render anything - structure is managed manually
    return nothing
  }
}

/**
 * PlankCarouselItem - Individual carousel slide
 */
@customElement("plank-carousel-item")
export class PlankCarouselItem extends LitElement {
  @property({ type: String }) class: string = ""

  @state() private _orientation: "horizontal" | "vertical" = "horizontal"

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "carousel-item"
    this.setAttribute("role", "group")
    this.setAttribute("aria-roledescription", "slide")
    this.className = cn(
      "min-w-0 shrink-0 grow-0 basis-full",
      this._orientation === "horizontal" ? "pl-4" : "pt-4",
      this.class
    )
  }

  _setOrientation(orientation: "horizontal" | "vertical") {
    this._orientation = orientation
    this.requestUpdate()
  }

  render() {
    return html``
  }
}

/**
 * PlankCarouselPrevious - Button to navigate to previous slide
 */
@customElement("plank-carousel-previous")
export class PlankCarouselPrevious extends LitElement {
  @property({ type: String }) class: string = ""

  @state() private _disabled = true
  @state() private _orientation: "horizontal" | "vertical" = "horizontal"

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "carousel-previous"
    this.className = "contents"
  }

  _setDisabled(disabled: boolean) {
    this._disabled = disabled
    this.requestUpdate()
  }

  _setOrientation(orientation: "horizontal" | "vertical") {
    this._orientation = orientation
    this.requestUpdate()
  }

  private _handleClick = () => {
    const carousel = this.closest("plank-carousel") as PlankCarousel
    carousel?.scrollPrev()
  }

  render() {
    // Button styling matching React: variant=outline, size=icon, rounded-full
    const buttonClass = cn(
      // Base button classes (outline variant, icon size)
      "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
      "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      "size-8 rounded-full",
      // Positioning
      "absolute",
      this._orientation === "horizontal"
        ? "top-1/2 -left-12 -translate-y-1/2"
        : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
      // Disabled state
      this._disabled ? "opacity-50 pointer-events-none" : "",
      this.class
    )

    return html`
      <button
        type="button"
        class=${buttonClass}
        ?disabled=${this._disabled}
        @click=${this._handleClick}
      >
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
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
        <span class="sr-only">Previous slide</span>
      </button>
    `
  }
}

/**
 * PlankCarouselNext - Button to navigate to next slide
 */
@customElement("plank-carousel-next")
export class PlankCarouselNext extends LitElement {
  @property({ type: String }) class: string = ""

  @state() private _disabled = true
  @state() private _orientation: "horizontal" | "vertical" = "horizontal"

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "carousel-next"
    this.className = "contents"
  }

  _setDisabled(disabled: boolean) {
    this._disabled = disabled
    this.requestUpdate()
  }

  _setOrientation(orientation: "horizontal" | "vertical") {
    this._orientation = orientation
    this.requestUpdate()
  }

  private _handleClick = () => {
    const carousel = this.closest("plank-carousel") as PlankCarousel
    carousel?.scrollNext()
  }

  render() {
    const buttonClass = cn(
      // Base button classes (outline variant, icon size)
      "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium",
      "ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      "size-8 rounded-full",
      // Positioning
      "absolute",
      this._orientation === "horizontal"
        ? "top-1/2 -right-12 -translate-y-1/2"
        : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
      // Disabled state
      this._disabled ? "opacity-50 pointer-events-none" : "",
      this.class
    )

    return html`
      <button
        type="button"
        class=${buttonClass}
        ?disabled=${this._disabled}
        @click=${this._handleClick}
      >
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
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
        <span class="sr-only">Next slide</span>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-carousel": PlankCarousel
    "plank-carousel-content": PlankCarouselContent
    "plank-carousel-item": PlankCarouselItem
    "plank-carousel-previous": PlankCarouselPrevious
    "plank-carousel-next": PlankCarouselNext
  }
}
