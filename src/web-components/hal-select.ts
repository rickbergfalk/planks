import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  limitShift,
  size,
} from "@floating-ui/dom"
import type { Placement } from "@floating-ui/dom"
import { cn } from "@/lib/utils"

let selectId = 0

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

/**
 * HalSelect - Root container that manages select state
 *
 * @fires open-change - Fired when the select opens or closes
 * @fires value-change - Fired when the selection changes
 *
 * @example
 * ```html
 * <hal-select>
 *   <hal-select-trigger>
 *     <hal-select-value placeholder="Select"></hal-select-value>
 *   </hal-select-trigger>
 *   <hal-select-content>
 *     <hal-select-item value="apple">Apple</hal-select-item>
 *   </hal-select-content>
 * </hal-select>
 * ```
 */
@customElement("hal-select")
export class HalSelect extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false

  private _trigger: HalSelectTrigger | null = null
  private _content: HalSelectContent | null = null
  private _value: HalSelectValue | null = null
  private _contentId = `hal-select-content-${++selectId}`

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "select"
  }

  updated() {
    this._updateChildren()
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
  }

  private _updateChildren() {
    this._trigger = this.querySelector(
      "hal-select-trigger"
    ) as HalSelectTrigger | null
    this._content = this.querySelector(
      "hal-select-content"
    ) as HalSelectContent | null
    this._value = this.querySelector(
      "hal-select-value"
    ) as HalSelectValue | null

    if (this._trigger) {
      this._trigger._setSelect(this)
    }
    if (this._content) {
      this._content._setSelect(this)
      this._content._setId(this._contentId)
      this._content._updateOpenState(this.open)
    }
    if (this._value) {
      this._value._setSelect(this)
      this._value._updateValue(this.value)
    }

    // Update trigger's aria attributes
    if (this._trigger) {
      const triggerEl = this._trigger._getTriggerElement()
      if (triggerEl) {
        triggerEl.setAttribute("aria-haspopup", "listbox")
        triggerEl.setAttribute("aria-expanded", String(this.open))
        if (this.open) {
          triggerEl.setAttribute("aria-controls", this._contentId)
        } else {
          triggerEl.removeAttribute("aria-controls")
        }
      }
    }
  }

  _toggle() {
    if (!this.disabled) {
      this._setOpen(!this.open)
    }
  }

  _close() {
    this._setOpen(false)
  }

  _open() {
    if (!this.disabled) {
      this._setOpen(true)
    }
  }

  private _setOpen(open: boolean) {
    if (this.open !== open) {
      this.open = open
      this.dispatchEvent(
        new CustomEvent("open-change", {
          detail: { open: this.open },
          bubbles: true,
        })
      )
    }
  }

  _setValue(value: string) {
    if (this.value !== value) {
      this.value = value
      this.dispatchEvent(
        new CustomEvent("value-change", {
          detail: { value: this.value },
          bubbles: true,
        })
      )
      // Update the value component to show selected text
      if (this._value) {
        this._value._updateValue(value)
      }
    }
  }

  _getTrigger() {
    return this._trigger
  }

  _getContent() {
    return this._content
  }

  _getContentId() {
    return this._contentId
  }

  _getValue() {
    return this.value
  }

  _isDisabled() {
    return this.disabled
  }

  // Get the text content for a value from items
  _getTextForValue(value: string): string {
    const items = this.querySelectorAll("hal-select-item")
    for (const item of items) {
      if ((item as HalSelectItem).value === value) {
        return item.textContent?.trim() || value
      }
    }
    return value
  }

  render() {
    return html``
  }
}

/**
 * HalSelectTrigger - Element that triggers the select on click
 */
@customElement("hal-select-trigger")
export class HalSelectTrigger extends LitElement {
  @property({ type: String, reflect: true }) size: "sm" | "default" = "default"
  @property({ type: String }) class: string = ""

  private _select: HalSelect | null = null
  private _triggerEl: HTMLButtonElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "select-trigger"
  }

  updated() {
    this._renderTrigger()
  }

  _setSelect(select: HalSelect) {
    this._select = select
    this._renderTrigger()
  }

  private _renderTrigger() {
    // Find or create the button element
    if (!this._triggerEl) {
      this._triggerEl = document.createElement("button")
      this._triggerEl.type = "button"
      this._triggerEl.setAttribute("role", "combobox")
      this._triggerEl.setAttribute("aria-autocomplete", "none")
      this._triggerEl.addEventListener("click", this._handleClick)
      this._triggerEl.addEventListener("keydown", this._handleKeyDown)
    }

    // Update attributes - read size from attribute if property not yet set
    const size = this.size || this.getAttribute("size") || "default"
    this._triggerEl.dataset.slot = "select-trigger"
    this._triggerEl.dataset.size = size
    this._triggerEl.setAttribute(
      "aria-expanded",
      String(this._select?.open || false)
    )

    const isDisabled = this._select?.disabled || false
    if (isDisabled) {
      this._triggerEl.disabled = true
      this._triggerEl.dataset.disabled = ""
    } else {
      this._triggerEl.disabled = false
      delete this._triggerEl.dataset.disabled
    }

    // Check if we have a value or placeholder
    const value = this._select?._getValue() || ""
    if (!value) {
      this._triggerEl.dataset.placeholder = ""
    } else {
      delete this._triggerEl.dataset.placeholder
    }

    this._triggerEl.className = cn(
      "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this.class
    )

    // Move children into button
    if (!this._triggerEl.parentElement) {
      // Move existing children into button
      const children = Array.from(this.childNodes).filter(
        (n) => n !== this._triggerEl
      )
      children.forEach((child) => this._triggerEl!.appendChild(child))

      // Add chevron icon
      const chevron = document.createElement("span")
      chevron.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4 opacity-50"><path d="m6 9 6 6 6-6"/></svg>`
      this._triggerEl.appendChild(chevron)

      this.appendChild(this._triggerEl)
    }
  }

  _getTriggerElement(): HTMLElement | null {
    return this._triggerEl
  }

  private _handleClick = (e: Event) => {
    e.stopPropagation()
    this._select?._toggle()
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault()
      this._select?._open()
    }
  }

  render() {
    return html``
  }
}

/**
 * HalSelectValue - Shows the selected value or placeholder
 */
@customElement("hal-select-value")
export class HalSelectValue extends LitElement {
  @property({ type: String }) placeholder = ""

  private _select: HalSelect | null = null
  private _displayText = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.pointerEvents = "none"
  }

  willUpdate() {
    this.dataset.slot = "select-value"
  }

  updated() {
    this._render()
  }

  _setSelect(select: HalSelect) {
    this._select = select
  }

  _updateValue(value: string) {
    if (value) {
      this._displayText = this._select?._getTextForValue(value) || value
    } else {
      this._displayText = ""
    }
    this._render()
  }

  private _render() {
    this.textContent = this._displayText || this.placeholder
  }

  render() {
    return html``
  }
}

/**
 * HalSelectContent - The floating select content
 */
@customElement("hal-select-content")
export class HalSelectContent extends LitElement {
  @property({ type: String }) side: Side = "bottom"
  @property({ type: String }) align: Align = "start"
  @property({ type: Number }) sideOffset = 4
  @property({ type: String }) class: string = ""

  private _select: HalSelect | null = null
  private _portal: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _cleanup: (() => void) | null = null
  private _id = ""
  private _placedSide: Side = "bottom"
  private _boundHandleOutsideClick: ((e: PointerEvent) => void) | null = null
  private _boundHandleEscape: ((e: KeyboardEvent) => void) | null = null
  private _highlightedIndex = -1
  private _items: HTMLElement[] = []

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "select-content"
  }

  _setSelect(select: HalSelect) {
    this._select = select
  }

  _setId(id: string) {
    this._id = id
  }

  _updateOpenState(open: boolean) {
    if (open) {
      this._showContent()
    } else {
      this._hideContent()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._hideContent()
  }

  private _showContent() {
    if (this._portal) return

    // Create portal container
    this._portal = document.createElement("div")
    this._portal.style.cssText =
      "position: fixed; top: 0; left: 0; z-index: 50;"

    // Create content element
    this._contentEl = document.createElement("div")
    this._contentEl.id = this._id
    this._contentEl.setAttribute("role", "listbox")
    this._contentEl.setAttribute("tabindex", "-1")
    this._contentEl.dataset.slot = "select-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.dataset.side = this.side
    this._contentEl.className = cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
      this.class
    )
    this._contentEl.style.cssText = "position: fixed; top: 0; left: 0;"

    // Create viewport
    const viewport = document.createElement("div")
    viewport.className = "p-1"
    viewport.dataset.slot = "select-viewport"

    // Render items into viewport
    this._renderItems(viewport)

    this._contentEl.appendChild(viewport)
    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Set up positioning
    const trigger = this._select?._getTrigger()?._getTriggerElement()
    if (trigger && this._contentEl) {
      this._cleanup = autoUpdate(trigger, this._contentEl, () => {
        this._updatePosition(trigger)
      })
    }

    // Set up outside click handler
    this._boundHandleOutsideClick = this._handleOutsideClick.bind(this)
    setTimeout(() => {
      document.addEventListener("pointerdown", this._boundHandleOutsideClick!)
    }, 0)

    // Set up escape key handler
    this._boundHandleEscape = this._handleEscape.bind(this)
    document.addEventListener("keydown", this._boundHandleEscape)

    // Set up keyboard navigation on content
    this._contentEl.addEventListener("keydown", this._handleKeyDown)

    // Collect focusable items
    this._collectItems()

    // Focus first item or selected item
    this._focusInitialItem()
  }

  private _renderItems(viewport: HTMLElement) {
    const children = Array.from(this.children)
    children.forEach((child) => {
      const renderedChild = this._renderChild(child as HTMLElement)
      if (renderedChild) {
        viewport.appendChild(renderedChild)
      }
    })
  }

  private _renderChild(child: HTMLElement): HTMLElement | null {
    const tagName = child.tagName.toLowerCase()

    if (tagName === "hal-select-item") {
      return this._renderItem(child as HalSelectItem)
    } else if (tagName === "hal-select-group") {
      return this._renderGroup(child as HalSelectGroup)
    } else if (tagName === "hal-select-label") {
      return this._renderLabel(child as HalSelectLabel)
    } else if (tagName === "hal-select-separator") {
      return this._renderSeparator()
    }

    return null
  }

  private _renderItem(item: HalSelectItem): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "option")
    el.setAttribute("tabindex", "-1")
    el.dataset.slot = "select-item"
    el.dataset.value = item.value

    const isSelected = this._select?._getValue() === item.value
    el.setAttribute("aria-selected", String(isSelected))

    if (isSelected) {
      el.dataset.state = "checked"
    } else {
      el.dataset.state = "unchecked"
    }

    if (item.disabled) {
      el.dataset.disabled = ""
      el.setAttribute("aria-disabled", "true")
    }

    el.className = cn(
      "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
    )

    // Render check indicator
    const indicator = document.createElement("span")
    indicator.dataset.slot = "select-item-indicator"
    indicator.className =
      "absolute right-2 flex size-3.5 items-center justify-center"
    if (isSelected) {
      indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M20 6 9 17l-5-5"/></svg>`
    }
    el.appendChild(indicator)

    // Render text content
    const textSpan = document.createElement("span")
    textSpan.textContent = item.textContent?.trim() || ""
    el.appendChild(textSpan)

    if (!item.disabled) {
      el.addEventListener("click", () => {
        this._select?._setValue(item.value)
        this._select?._close()
      })
      el.addEventListener("pointerenter", () => {
        this._highlightItem(el)
      })
    }

    return el
  }

  private _renderGroup(group: HalSelectGroup): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "group")
    el.dataset.slot = "select-group"

    Array.from(group.children).forEach((child) => {
      const renderedChild = this._renderChild(child as HTMLElement)
      if (renderedChild) {
        el.appendChild(renderedChild)
      }
    })

    return el
  }

  private _renderLabel(label: HalSelectLabel): HTMLElement {
    const el = document.createElement("div")
    el.dataset.slot = "select-label"
    el.className = cn("text-muted-foreground px-2 py-1.5 text-xs")
    el.textContent = label.textContent?.trim() || ""

    return el
  }

  private _renderSeparator(): HTMLElement {
    const el = document.createElement("div")
    el.dataset.slot = "select-separator"
    el.className = cn("bg-border pointer-events-none -mx-1 my-1 h-px")

    return el
  }

  private _collectItems() {
    if (!this._contentEl) return
    this._items = Array.from(
      this._contentEl.querySelectorAll(
        '[role="option"]:not([aria-disabled="true"])'
      )
    ) as HTMLElement[]
    this._highlightedIndex = -1
  }

  private _focusInitialItem() {
    // Focus the selected item, or the first item
    const selectedValue = this._select?._getValue()
    if (selectedValue && this._items.length > 0) {
      const selectedIndex = this._items.findIndex(
        (item) => item.dataset.value === selectedValue
      )
      if (selectedIndex >= 0) {
        this._highlightedIndex = selectedIndex
        this._highlightItem(this._items[selectedIndex])
        return
      }
    }

    // Focus first item
    if (this._items.length > 0) {
      this._highlightedIndex = 0
      this._highlightItem(this._items[0])
    }
  }

  private _highlightItem(el: HTMLElement) {
    // Remove highlight from all items
    this._items.forEach((item) => {
      item.removeAttribute("data-highlighted")
      item.classList.remove("bg-accent", "text-accent-foreground")
    })

    // Add highlight to current item
    el.setAttribute("data-highlighted", "")
    el.classList.add("bg-accent", "text-accent-foreground")
    this._highlightedIndex = this._items.indexOf(el)
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (!this._contentEl || this._items.length === 0) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        this._highlightedIndex =
          (this._highlightedIndex + 1) % this._items.length
        this._highlightItem(this._items[this._highlightedIndex])
        break
      case "ArrowUp":
        e.preventDefault()
        this._highlightedIndex =
          this._highlightedIndex <= 0
            ? this._items.length - 1
            : this._highlightedIndex - 1
        this._highlightItem(this._items[this._highlightedIndex])
        break
      case "Enter":
      case " ":
        e.preventDefault()
        if (this._highlightedIndex >= 0) {
          this._items[this._highlightedIndex].click()
        }
        break
      case "Home":
        e.preventDefault()
        this._highlightedIndex = 0
        this._highlightItem(this._items[0])
        break
      case "End":
        e.preventDefault()
        this._highlightedIndex = this._items.length - 1
        this._highlightItem(this._items[this._highlightedIndex])
        break
      case "Tab":
        // Prevent tabbing out of select
        e.preventDefault()
        break
    }
  }

  private _getPlacement(): Placement {
    if (this.align === "center") {
      return this.side
    }
    return `${this.side}-${this.align}` as Placement
  }

  private async _updatePosition(trigger: HTMLElement) {
    if (!this._contentEl) return

    const { x, y, placement } = await computePosition(
      trigger,
      this._contentEl,
      {
        strategy: "fixed",
        placement: this._getPlacement(),
        middleware: [
          offset({ mainAxis: this.sideOffset, alignmentAxis: 0 }),
          shift({
            mainAxis: true,
            crossAxis: false,
            limiter: limitShift(),
            padding: 0,
          }),
          flip(),
          size({
            apply({ availableHeight, elements }) {
              Object.assign(elements.floating.style, {
                maxHeight: `${Math.min(availableHeight, 384)}px`,
              })
            },
            padding: 8,
          }),
        ],
      }
    )

    if (!this._contentEl) return

    this._placedSide = placement.split("-")[0] as Side
    this._contentEl.dataset.side = this._placedSide

    Object.assign(this._contentEl.style, {
      left: `${x}px`,
      top: `${y}px`,
      minWidth: `${trigger.offsetWidth}px`,
    })
  }

  private _handleOutsideClick(e: PointerEvent) {
    const target = e.target as HTMLElement

    if (this._contentEl?.contains(target)) {
      return
    }

    const triggerEl = this._select?._getTrigger()?._getTriggerElement()
    if (triggerEl?.contains(target)) {
      return
    }

    this._select?._close()
  }

  private _handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      this._select?._close()
    }
  }

  private _hideContent() {
    if (this._cleanup) {
      this._cleanup()
      this._cleanup = null
    }

    if (this._boundHandleOutsideClick) {
      document.removeEventListener("pointerdown", this._boundHandleOutsideClick)
      this._boundHandleOutsideClick = null
    }

    if (this._boundHandleEscape) {
      document.removeEventListener("keydown", this._boundHandleEscape)
      this._boundHandleEscape = null
    }

    if (this._contentEl) {
      this._contentEl.removeEventListener("keydown", this._handleKeyDown)
    }

    if (this._portal) {
      this._portal.remove()
      this._portal = null
      this._contentEl = null
    }

    this._items = []
    this._highlightedIndex = -1
  }

  render() {
    return html``
  }
}

/**
 * HalSelectItem - A select item
 */
@customElement("hal-select-item")
export class HalSelectItem extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "select-item"
  }

  render() {
    return html``
  }
}

/**
 * HalSelectGroup - A group of select items
 */
@customElement("hal-select-group")
export class HalSelectGroup extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "select-group"
  }

  render() {
    return html``
  }
}

/**
 * HalSelectLabel - A label for a group of select items
 */
@customElement("hal-select-label")
export class HalSelectLabel extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "select-label"
  }

  render() {
    return html``
  }
}

/**
 * HalSelectSeparator - A separator between select items
 */
@customElement("hal-select-separator")
export class HalSelectSeparator extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "select-separator"
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-select": HalSelect
    "hal-select-trigger": HalSelectTrigger
    "hal-select-value": HalSelectValue
    "hal-select-content": HalSelectContent
    "hal-select-item": HalSelectItem
    "hal-select-group": HalSelectGroup
    "hal-select-label": HalSelectLabel
    "hal-select-separator": HalSelectSeparator
  }
}
