import { LitElement, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import {
  computePosition,
  autoUpdate,
  offset,
  flip,
  shift,
  limitShift,
} from "@floating-ui/dom"
import { cn } from "@/lib/utils"

let comboboxId = 0

type Side = "top" | "right" | "bottom" | "left"

/**
 * HalCombobox - A searchable dropdown select component
 *
 * Autocomplete pattern: type in the input to filter, select from dropdown.
 *
 * @fires value-change - Fired when the selected value changes
 * @fires open-change - Fired when the dropdown opens or closes
 *
 * @example
 * ```html
 * <hal-combobox placeholder="Select framework...">
 *   <hal-combobox-item value="next">Next.js</hal-combobox-item>
 *   <hal-combobox-item value="svelte">SvelteKit</hal-combobox-item>
 *   <hal-combobox-item value="nuxt">Nuxt.js</hal-combobox-item>
 * </hal-combobox>
 * ```
 */
@customElement("hal-combobox")
export class HalCombobox extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false
  @property({ type: String, reflect: true }) value = ""
  @property({ type: String }) placeholder = "Select..."
  @property({ type: String }) emptyText = "No results found."
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String }) class: string = ""

  @state() private _searchValue = ""
  @state() private _selectedIndex = -1
  private _justSelected = false

  private _instanceId = `hal-combobox-${++comboboxId}`
  private _inputGroupEl: HTMLDivElement | null = null
  private _inputEl: HTMLInputElement | null = null
  private _triggerButtonEl: HTMLButtonElement | null = null
  private _portal: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _cleanup: (() => void) | null = null
  private _items: HalComboboxItem[] = []
  private _visibleItems: HalComboboxItem[] = []
  private _boundHandleOutsideClick: ((e: PointerEvent) => void) | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "inline-block"
  }

  willUpdate() {
    this.dataset.slot = "combobox"
  }

  firstUpdated() {
    this._renderInputGroup()
    this._collectItems()
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("open")) {
      if (this._inputEl) {
        this._inputEl.setAttribute("aria-expanded", String(this.open))
      }
      if (this.open) {
        this._showContent()
      } else {
        this._hideContent()
      }
    }
    if (changedProperties.has("value")) {
      this._updateInputDisplay()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._hideContent()
  }

  private _collectItems() {
    this._items = Array.from(
      this.querySelectorAll("hal-combobox-item")
    ) as HalComboboxItem[]
    this._items.forEach((item) => item._setCombobox(this))
  }

  private _renderInputGroup() {
    // Create InputGroup wrapper (matches React's InputGroup structure)
    this._inputGroupEl = document.createElement("div")
    this._inputGroupEl.dataset.slot = "input-group"
    this._inputGroupEl.setAttribute("role", "group")
    this._inputGroupEl.className = cn(
      "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
      "h-9 min-w-0",
      // Focus state
      "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",
      this.class
    )

    // Create the input element
    this._inputEl = document.createElement("input")
    this._inputEl.type = "text"
    this._inputEl.setAttribute("role", "combobox")
    this._inputEl.setAttribute("aria-autocomplete", "list")
    this._inputEl.setAttribute("aria-haspopup", "listbox")
    this._inputEl.setAttribute("aria-expanded", String(this.open))
    this._inputEl.setAttribute("aria-controls", `${this._instanceId}-listbox`)
    this._inputEl.dataset.slot = "input-group-control"
    this._inputEl.className = cn(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-9 w-full min-w-0 rounded-md bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
    )
    this._inputEl.placeholder = this.placeholder

    if (this.disabled) {
      this._inputEl.disabled = true
    }

    this._inputEl.addEventListener("input", this._handleInputChange)
    this._inputEl.addEventListener("keydown", this._handleInputKeyDown)
    this._inputEl.addEventListener("focus", this._handleInputFocus)
    this._inputEl.addEventListener("blur", this._handleInputBlur)

    this._inputGroupEl.appendChild(this._inputEl)

    // Create addon container for trigger button
    const addon = document.createElement("div")
    addon.dataset.slot = "input-group-addon"
    addon.dataset.align = "inline-end"
    addon.className =
      "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none order-last pr-3 has-[>button]:mr-[-0.45rem]"

    // Create trigger button
    this._triggerButtonEl = document.createElement("button")
    this._triggerButtonEl.type = "button"
    this._triggerButtonEl.dataset.slot = "input-group-button"
    this._triggerButtonEl.className = cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md text-sm shadow-none",
      "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0"
    )

    if (this.disabled) {
      this._triggerButtonEl.disabled = true
    }

    // Add chevron icon
    this._triggerButtonEl.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground pointer-events-none size-4"><path d="m6 9 6 6 6-6"/></svg>`

    this._triggerButtonEl.addEventListener("click", this._handleTriggerClick)
    this._triggerButtonEl.addEventListener(
      "mousedown",
      this._handleTriggerMouseDown
    )

    addon.appendChild(this._triggerButtonEl)
    this._inputGroupEl.appendChild(addon)

    this.appendChild(this._inputGroupEl)

    // Set initial display
    this._updateInputDisplay()
  }

  private _updateInputDisplay() {
    if (!this._inputEl) return

    // When not focused and has value, show selected text
    if (document.activeElement !== this._inputEl) {
      if (this.value) {
        const selectedItem = this._items.find(
          (item) => item.value === this.value
        )
        this._inputEl.value = selectedItem?.textContent?.trim() || this.value
      } else {
        this._inputEl.value = ""
      }
    }
  }

  private _handleInputChange = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    this._searchValue = value
    this._selectedIndex = -1

    // Open dropdown when typing
    if (!this.open && value.length > 0) {
      this._setOpen(true)
    }

    // Update filtering
    if (this.open) {
      this._filterItems()
    }
  }

  private _handleInputFocus = () => {
    // Don't reopen if we just selected something
    if (this._justSelected) {
      this._justSelected = false
      return
    }
    // Show search value when typing, or selected value when not
    // Don't clear if we just selected something (searchValue is empty and value exists)
    if (this._inputEl && (this._searchValue || !this.value)) {
      this._inputEl.value = this._searchValue
    }
    // Open on focus
    if (!this.open) {
      this._setOpen(true)
    }
  }

  private _handleInputBlur = () => {
    // Delay to allow click events to fire first
    setTimeout(() => {
      if (!this.open) {
        this._searchValue = ""
        this._updateInputDisplay()
      }
    }, 150)
  }

  private _handleInputKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (!this.open) {
          this._setOpen(true)
        } else if (this._visibleItems.length > 0) {
          if (this._selectedIndex < 0) {
            this._selectedIndex = 0
          } else {
            this._selectedIndex =
              (this._selectedIndex + 1) % this._visibleItems.length
          }
          this._updateHighlight()
        }
        break
      case "ArrowUp":
        e.preventDefault()
        if (!this.open) {
          this._setOpen(true)
        } else if (this._visibleItems.length > 0) {
          if (this._selectedIndex < 0) {
            this._selectedIndex = this._visibleItems.length - 1
          } else {
            this._selectedIndex =
              this._selectedIndex <= 0
                ? this._visibleItems.length - 1
                : this._selectedIndex - 1
          }
          this._updateHighlight()
        }
        break
      case "Enter":
        e.preventDefault()
        if (
          this.open &&
          this._selectedIndex >= 0 &&
          this._selectedIndex < this._visibleItems.length
        ) {
          const item = this._visibleItems[this._selectedIndex]
          this._selectValue(item.value)
        }
        break
      case "Escape":
        e.preventDefault()
        this._setOpen(false)
        break
      case "Home":
        if (this.open) {
          e.preventDefault()
          this._selectedIndex = 0
          this._updateHighlight()
        }
        break
      case "End":
        if (this.open) {
          e.preventDefault()
          this._selectedIndex = Math.max(0, this._visibleItems.length - 1)
          this._updateHighlight()
        }
        break
    }
  }

  private _handleTriggerClick = () => {
    if (!this.disabled) {
      this._toggle()
    }
  }

  private _handleTriggerMouseDown = (e: MouseEvent) => {
    // Prevent input blur when clicking trigger
    e.preventDefault()
  }

  private _toggle() {
    this._setOpen(!this.open)
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

  private _showContent() {
    if (this._portal) return

    // Reset selection
    this._selectedIndex = -1
    this._filterItems()

    // Create portal container
    this._portal = document.createElement("div")
    this._portal.style.cssText =
      "position: fixed; top: 0; left: 0; z-index: 50;"

    // Create content element (dropdown) - matches React's ComboboxContent/ComboboxList
    this._contentEl = document.createElement("div")
    this._contentEl.id = `${this._instanceId}-content`
    this._contentEl.dataset.slot = "combobox-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.className = cn(
      "bg-popover text-popover-foreground ring-foreground/10 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 overflow-hidden rounded-md shadow-md ring-1"
    )
    this._contentEl.style.cssText = "position: fixed; top: 0; left: 0;"

    // Create list container directly (no search input - that's the main input)
    const listContainer = document.createElement("div")
    listContainer.id = `${this._instanceId}-listbox`
    listContainer.dataset.slot = "combobox-list"
    listContainer.setAttribute("role", "listbox")
    listContainer.className = "max-h-[300px] scroll-py-1 overflow-y-auto p-1"

    // Render items
    this._renderItems(listContainer)

    this._contentEl.appendChild(listContainer)
    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Set up positioning
    if (this._inputGroupEl && this._contentEl) {
      this._cleanup = autoUpdate(this._inputGroupEl, this._contentEl, () => {
        this._updatePosition()
      })
    }

    // Set up outside click handler
    this._boundHandleOutsideClick = this._handleOutsideClick.bind(this)
    setTimeout(() => {
      document.addEventListener("pointerdown", this._boundHandleOutsideClick!)
    }, 0)
  }

  private _renderItems(container: HTMLElement) {
    container.innerHTML = ""

    // Add empty state
    const emptyEl = document.createElement("div")
    emptyEl.dataset.slot = "combobox-empty"
    emptyEl.className =
      "text-muted-foreground hidden w-full justify-center py-2 text-center text-sm"
    emptyEl.textContent = this.emptyText
    container.appendChild(emptyEl)

    // Render each item
    this._items.forEach((item, index) => {
      const el = document.createElement("div")
      el.setAttribute("role", "option")
      el.setAttribute("tabindex", "-1")
      el.dataset.slot = "combobox-item"
      el.dataset.value = item.value
      el.dataset.index = String(index)

      const isSelected = this.value === item.value
      el.setAttribute("aria-selected", String(isSelected))

      if (item.disabled) {
        el.dataset.disabled = ""
        el.setAttribute("aria-disabled", "true")
      }

      el.className = cn(
        "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      )

      // Text content
      const textSpan = document.createElement("span")
      textSpan.textContent = item.textContent?.trim() || ""
      el.appendChild(textSpan)

      // Check indicator
      const indicator = document.createElement("span")
      indicator.className =
        "pointer-events-none absolute right-2 flex size-4 items-center justify-center"
      if (isSelected) {
        indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none size-4"><path d="M20 6 9 17l-5-5"/></svg>`
      }
      el.appendChild(indicator)

      if (!item.disabled) {
        el.addEventListener("click", () => {
          this._selectValue(item.value)
        })
        el.addEventListener("pointerenter", () => {
          this._highlightIndex(index)
        })
      }

      container.appendChild(el)
    })

    this._updateItemVisibility(container)
  }

  private _updateItemVisibility(container?: HTMLElement) {
    const listContainer =
      container ||
      (this._contentEl?.querySelector('[role="listbox"]') as HTMLElement)
    if (!listContainer) return

    const search = this._searchValue.toLowerCase().trim()
    let visibleCount = 0

    this._items.forEach((item, index) => {
      const el = listContainer.querySelector(
        `[data-index="${index}"]`
      ) as HTMLElement
      if (!el) return

      const text = item.textContent?.toLowerCase() || ""
      const value = item.value?.toLowerCase() || ""
      const matches = !search || text.includes(search) || value.includes(search)

      if (matches) {
        el.style.display = ""
        visibleCount++
      } else {
        el.style.display = "none"
      }
    })

    // Update empty state
    const emptyEl = listContainer.querySelector(
      '[data-slot="combobox-empty"]'
    ) as HTMLElement
    if (emptyEl) {
      emptyEl.style.display = visibleCount === 0 ? "flex" : "none"
    }

    // Update visible items list
    this._visibleItems = this._items.filter((item, index) => {
      const el = listContainer.querySelector(
        `[data-index="${index}"]`
      ) as HTMLElement
      return el && el.style.display !== "none" && !item.disabled
    })

    // Clamp selection
    if (
      this._selectedIndex >= 0 &&
      this._selectedIndex >= this._visibleItems.length
    ) {
      this._selectedIndex = Math.max(0, this._visibleItems.length - 1)
    }
    this._updateHighlight(listContainer)
  }

  private _filterItems() {
    this._updateItemVisibility()
  }

  private _highlightIndex(index: number) {
    const visibleIndex = this._visibleItems.findIndex(
      (item) => this._items.indexOf(item) === index
    )
    if (visibleIndex >= 0) {
      this._selectedIndex = visibleIndex
      this._updateHighlight()
    }
  }

  private _updateHighlight(container?: HTMLElement) {
    const listContainer =
      container ||
      (this._contentEl?.querySelector('[role="listbox"]') as HTMLElement)
    if (!listContainer) return

    listContainer
      .querySelectorAll("[data-highlighted]")
      .forEach((el) => el.removeAttribute("data-highlighted"))

    if (
      this._selectedIndex >= 0 &&
      this._selectedIndex < this._visibleItems.length
    ) {
      const item = this._visibleItems[this._selectedIndex]
      const index = this._items.indexOf(item)
      const el = listContainer.querySelector(
        `[data-index="${index}"]`
      ) as HTMLElement
      if (el) {
        el.setAttribute("data-highlighted", "")
        el.scrollIntoView({ block: "nearest" })
      }
    }
  }

  private _selectValue(value: string) {
    const newValue = this.value === value ? "" : value
    if (this.value !== newValue) {
      this.value = newValue
      this.dispatchEvent(
        new CustomEvent("value-change", {
          detail: { value: this.value },
          bubbles: true,
        })
      )
    }
    this._searchValue = ""
    this._setOpen(false)
    // Force update the input with selected value (not search value)
    if (this._inputEl) {
      if (this.value) {
        const selectedItem = this._items.find(
          (item) => item.value === this.value
        )
        this._inputEl.value = selectedItem?.textContent?.trim() || this.value
      } else {
        this._inputEl.value = ""
      }
    }
    // Prevent focus from reopening
    this._justSelected = true
    this._inputEl?.focus()
  }

  private async _updatePosition() {
    if (!this._inputGroupEl || !this._contentEl) return

    const { x, y, placement } = await computePosition(
      this._inputGroupEl,
      this._contentEl,
      {
        strategy: "fixed",
        placement: "bottom-start",
        middleware: [
          offset({ mainAxis: 6, alignmentAxis: 0 }),
          shift({
            mainAxis: true,
            crossAxis: false,
            limiter: limitShift(),
            padding: 0,
          }),
          flip(),
        ],
      }
    )

    if (!this._contentEl) return

    const side = placement.split("-")[0] as Side
    this._contentEl.dataset.side = side

    Object.assign(this._contentEl.style, {
      left: `${x}px`,
      top: `${y}px`,
      minWidth: `${this._inputGroupEl.offsetWidth}px`,
    })
  }

  private _handleOutsideClick(e: PointerEvent) {
    const target = e.target as HTMLElement

    if (this._contentEl?.contains(target)) {
      return
    }

    if (this._inputGroupEl?.contains(target)) {
      return
    }

    this._setOpen(false)
    this._searchValue = ""
    this._updateInputDisplay()
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

    if (this._portal) {
      this._portal.remove()
      this._portal = null
      this._contentEl = null
    }
  }

  getDisplayText(): string {
    if (!this.value) return ""
    const item = this._items.find((i) => i.value === this.value)
    return item?.textContent?.trim() || this.value
  }

  render() {
    return html``
  }
}

/**
 * HalComboboxItem - An item in the combobox dropdown
 */
@customElement("hal-combobox-item")
export class HalComboboxItem extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false

  private _combobox: HalCombobox | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "combobox-item"
  }

  _setCombobox(combobox: HalCombobox) {
    this._combobox = combobox
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-combobox": HalCombobox
    "hal-combobox-item": HalComboboxItem
  }
}
