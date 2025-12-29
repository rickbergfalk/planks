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
    this._open = open
    this.requestUpdate()
  }

  _setContentId(id: string) {
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

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    if (!this.id) {
      this.id = `plank-accordion-content-${++accordionContentId}`
    }
  }

  willUpdate() {
    this.dataset.slot = "accordion-content"
    this.dataset.state = this._open ? "open" : "closed"
    if (this._open) {
      this.removeAttribute("hidden")
    } else {
      this.setAttribute("hidden", "")
    }
    this.className = cn(
      "data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm pt-0 pb-4",
      this._open ? "block" : "",
      this.class
    )
  }

  _setOpen(open: boolean) {
    this._open = open
    this.requestUpdate()
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
