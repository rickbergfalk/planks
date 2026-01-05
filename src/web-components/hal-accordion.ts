import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

let accordionContentId = 0

/**
 * HalAccordion - Container component that manages accordion state
 *
 * @fires value-change - Fired when the value changes, with detail: { value: string }
 *
 * @example
 * ```html
 * <hal-accordion>
 *   <hal-accordion-item value="item-1">
 *     <hal-accordion-trigger>Title</hal-accordion-trigger>
 *     <hal-accordion-content>Content</hal-accordion-content>
 *   </hal-accordion-item>
 * </hal-accordion>
 * ```
 */
@customElement("hal-accordion")
export class HalAccordion extends LitElement {
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
    const items = this.querySelectorAll("hal-accordion-item")
    const openValues = this._getOpenValues()
    items.forEach((item) => {
      const accordionItem = item as HalAccordionItem
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
 * HalAccordionItem - Individual accordion item
 */
@customElement("hal-accordion-item")
export class HalAccordionItem extends LitElement {
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
      "hal-accordion-trigger"
    ) as HalAccordionTrigger | null
    const content = this.querySelector(
      "hal-accordion-content"
    ) as HalAccordionContent | null

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
    const accordion = this.closest("hal-accordion") as HalAccordion
    accordion?._toggleItem(this.value)
  }

  render() {
    return html``
  }
}

/**
 * HalAccordionTrigger - Button that toggles the accordion item
 */
@customElement("hal-accordion-trigger")
export class HalAccordionTrigger extends LitElement {
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
    if (this.querySelector("svg.hal-accordion-chevron")) return

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
      "hal-accordion-chevron",
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
    const chevron = this.querySelector("svg.hal-accordion-chevron")
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
    const item = this.closest("hal-accordion-item") as HalAccordionItem
    item?._toggle()
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      const item = this.closest("hal-accordion-item") as HalAccordionItem
      item?._toggle()
    }
  }

  render() {
    return html``
  }
}

/**
 * HalAccordionContent - Content that is shown/hidden
 */
@customElement("hal-accordion-content")
export class HalAccordionContent extends LitElement {
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
      this.id = `hal-accordion-content-${++accordionContentId}`
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
        ? "animate-hal-accordion-down"
        : "animate-hal-accordion-up"
    }

    // Filter out previous animation classes from user-provided classes
    // (cn/tailwind-merge doesn't know these are mutually exclusive)
    const userClasses = (this.class || "")
      .split(" ")
      .filter((c) => !c.startsWith("animate-hal-accordion-"))
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
        this.style.setProperty("--hal-accordion-content-height", `${height}px`)
        // Clear inline height so CSS animation can control it
        this.style.height = ""
      }
    } else if (!open && wasOpen) {
      // Closing: prepare for smooth animation
      this._isAnimating = true

      // Re-measure current height for the close animation
      const height = this.scrollHeight
      this.style.setProperty("--hal-accordion-content-height", `${height}px`)

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
      this.style.setProperty("--hal-accordion-content-height", `${height}px`)
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
    "hal-accordion": HalAccordion
    "hal-accordion-item": HalAccordionItem
    "hal-accordion-trigger": HalAccordionTrigger
    "hal-accordion-content": HalAccordionContent
  }
}
