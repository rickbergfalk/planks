import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

let accordionContentId = 0

/**
 * PlankAccordion - Container component that manages accordion state
 *
 * @fires value-change - Fired when the value changes, with detail: { value: string }
 *
 * @example
 * ```html
 * <plank-accordion>
 *   <plank-accordion-item value="item-1">
 *     <plank-accordion-trigger>Title</plank-accordion-trigger>
 *     <plank-accordion-content>Content</plank-accordion-content>
 *   </plank-accordion-item>
 * </plank-accordion>
 * ```
 */
@customElement("plank-accordion")
export class PlankAccordion extends LitElement {
  @property({ type: String, reflect: true }) type: "single" | "multiple" =
    "single"
  @property({ type: Boolean, reflect: true }) collapsible = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String, reflect: true }) value = ""
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "accordion"
    if (this.class) {
      this.className = cn(this.class)
    }
  }

  updated() {
    this._updateChildren()
  }

  private _updateChildren() {
    const items = this.querySelectorAll("plank-accordion-item")
    const openValues = this._getOpenValues()
    items.forEach((item) => {
      const accordionItem = item as PlankAccordionItem
      const isOpen = openValues.includes(accordionItem.value)
      accordionItem._setOpen(isOpen)
    })
  }

  private _getOpenValues(): string[] {
    if (this.type === "multiple") {
      return this.value.split(" ").filter((v) => v.length > 0)
    }
    return this.value ? [this.value] : []
  }

  _toggleItem(itemValue: string) {
    if (this.disabled) return

    const openValues = this._getOpenValues()
    const isOpen = openValues.includes(itemValue)

    if (this.type === "single") {
      if (isOpen) {
        // Try to close
        if (this.collapsible) {
          this.value = ""
          this._fireValueChange()
        }
      } else {
        // Open this item (closes others automatically in single mode)
        this.value = itemValue
        this._fireValueChange()
      }
    } else {
      // Multiple mode
      if (isOpen) {
        // Remove from list
        this.value = openValues.filter((v) => v !== itemValue).join(" ")
      } else {
        // Add to list
        this.value = [...openValues, itemValue].join(" ")
      }
      this._fireValueChange()
    }
  }

  private _fireValueChange() {
    this.dispatchEvent(
      new CustomEvent("value-change", {
        detail: { value: this.value },
        bubbles: true,
      })
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankAccordionItem - Individual accordion item
 */
@customElement("plank-accordion-item")
export class PlankAccordionItem extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String }) class: string = ""
  private _open = false

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "accordion-item"
    this.dataset.state = this._open ? "open" : "closed"
    this.className = cn("border-b last:border-b-0 block", this.class)
  }

  updated() {
    this._updateChildren()
  }

  _setOpen(open: boolean) {
    if (this._open === open) return // Guard: no change
    this._open = open
    this.requestUpdate()
  }

  private _updateChildren() {
    const trigger = this.querySelector(
      "plank-accordion-trigger"
    ) as PlankAccordionTrigger | null
    const content = this.querySelector(
      "plank-accordion-content"
    ) as PlankAccordionContent | null

    if (trigger) {
      trigger._setOpen(this._open)
      if (content) {
        trigger._setContentId(content.id)
      }
    }
    if (content) {
      content._setOpen(this._open)
    }
  }

  _toggle() {
    if (this.disabled) return
    const accordion = this.closest("plank-accordion") as PlankAccordion
    accordion?._toggleItem(this.value)
  }

  render() {
    return html``
  }
}

/**
 * PlankAccordionTrigger - Button that toggles the accordion item
 */
@customElement("plank-accordion-trigger")
export class PlankAccordionTrigger extends LitElement {
  private _open = false
  private _contentId = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener("click", this._handleClick)
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
    this.removeEventListener("keydown", this._handleKeydown)
  }

  willUpdate() {
    this.dataset.slot = "accordion-trigger"
    this.dataset.state = this._open ? "open" : "closed"
    this.setAttribute("role", "button")
    this.setAttribute("tabindex", "0")
    this.setAttribute("aria-expanded", String(this._open))
    if (this._contentId) {
      this.setAttribute("aria-controls", this._contentId)
    }
    this.className = cn(
      "focus-visible:border-ring focus-visible:ring-ring/50 flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50"
    )
  }

  firstUpdated() {
    // Add the chevron icon
    this._addChevronIcon()
  }

  private _addChevronIcon() {
    // Check if icon already exists
    if (this.querySelector("svg.plank-accordion-chevron")) return

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg")
    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
    svg.setAttribute("width", "16")
    svg.setAttribute("height", "16")
    svg.setAttribute("viewBox", "0 0 24 24")
    svg.setAttribute("fill", "none")
    svg.setAttribute("stroke", "currentColor")
    svg.setAttribute("stroke-width", "2")
    svg.setAttribute("stroke-linecap", "round")
    svg.setAttribute("stroke-linejoin", "round")
    svg.classList.add(
      "plank-accordion-chevron",
      "text-muted-foreground",
      "pointer-events-none",
      "size-4",
      "shrink-0",
      "translate-y-0.5",
      "transition-transform",
      "duration-200"
    )

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path")
    path.setAttribute("d", "m6 9 6 6 6-6")
    svg.appendChild(path)

    this.appendChild(svg)
  }

  updated() {
    // Update chevron rotation based on open state
    const chevron = this.querySelector("svg.plank-accordion-chevron")
    if (chevron) {
      if (this._open) {
        chevron.classList.add("rotate-180")
      } else {
        chevron.classList.remove("rotate-180")
      }
    }
  }

  _setOpen(open: boolean) {
    if (this._open === open) return // Guard: no change
    this._open = open
    this.requestUpdate()
  }

  _setContentId(id: string) {
    if (this._contentId === id) return // Guard: no change
    this._contentId = id
    this.requestUpdate()
  }

  private _handleClick = () => {
    const item = this.closest("plank-accordion-item") as PlankAccordionItem
    item?._toggle()
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const item = this.closest("plank-accordion-item") as PlankAccordionItem
      item?._toggle()
    }
  }

  render() {
    return html``
  }
}

/**
 * PlankAccordionContent - Content that is shown/hidden
 */
@customElement("plank-accordion-content")
export class PlankAccordionContent extends LitElement {
  @property({ type: String }) class: string = ""
  private _open = false
  private _isAnimating = false
  private _hasBeenOpened = false // Track if content has ever been opened
  private _initialized = false // Track if initial render is complete

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    if (!this.id) {
      this.id = `plank-accordion-content-${++accordionContentId}`
    }
    // Listen for animation end to handle cleanup
    this.addEventListener("animationend", this._handleAnimationEnd)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("animationend", this._handleAnimationEnd)
  }

  willUpdate() {
    this.dataset.slot = "accordion-content"
    this.dataset.state = this._open ? "open" : "closed"

    // Only apply animation classes after content has been opened at least once
    // This prevents the close animation from running on initial render
    let animationClass = ""
    if (this._hasBeenOpened) {
      animationClass = this._open
        ? "animate-plank-accordion-down"
        : "animate-plank-accordion-up"
    }

    // Filter out previous animation classes from user-provided classes
    // (cn/tailwind-merge doesn't know these are mutually exclusive)
    const userClasses = (this.class || "")
      .split(" ")
      .filter((c) => !c.startsWith("animate-plank-accordion-"))
      .join(" ")

    this.className = cn(
      "overflow-hidden text-sm block pt-0 pb-4",
      animationClass,
      userClasses
    )
  }

  private _handleAnimationEnd = () => {
    this._isAnimating = false
    if (!this._open) {
      // After close animation completes, hide the content
      this.style.display = "none"
    }
  }

  _setOpen(open: boolean) {
    if (this._open === open) return // Guard: no change

    const wasOpen = this._open
    this._open = open

    if (open && !wasOpen) {
      this._hasBeenOpened = true

      // Only animate if already initialized (not initial load)
      if (this._initialized) {
        this._isAnimating = true

        // Cancel any running animations to ensure clean restart
        this.getAnimations().forEach((anim) => anim.cancel())

        // Set height to 0 BEFORE showing to prevent flash of full content
        this.style.height = "0"
        this.style.display = "block"

        // Measure content height (scrollHeight works even at height:0)
        const height = this.scrollHeight
        this.style.setProperty(
          "--plank-accordion-content-height",
          `${height}px`
        )
        // Clear inline height so CSS animation can control it
        this.style.height = ""
      }
    } else if (!open && wasOpen) {
      // Closing: prepare for smooth animation
      this._isAnimating = true

      // Re-measure current height for the close animation
      const height = this.scrollHeight
      this.style.setProperty("--plank-accordion-content-height", `${height}px`)

      // Cancel any running animations to ensure clean restart
      this.getAnimations().forEach((anim) => anim.cancel())
    }

    this.requestUpdate()
  }

  firstUpdated() {
    // Initially hide if not open, or show if open
    if (this._open) {
      // Item starts open - just show it, no animation
      this.style.display = "block"
      // Measure height for potential future close animation
      const height = this.scrollHeight
      this.style.setProperty("--plank-accordion-content-height", `${height}px`)
      this._hasBeenOpened = true
    } else {
      this.style.display = "none"
    }
    this._initialized = true
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-accordion": PlankAccordion
    "plank-accordion-item": PlankAccordionItem
    "plank-accordion-trigger": PlankAccordionTrigger
    "plank-accordion-content": PlankAccordionContent
  }
}
