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
 * PlankCombobox - A searchable dropdown select component
 *
 * Combines popover and command patterns into a single combobox component.
 *
 * @fires value-change - Fired when the selected value changes
 * @fires open-change - Fired when the dropdown opens or closes
 *
 * @example
 * ```html
 * <plank-combobox placeholder="Select framework...">
 *   <plank-combobox-item value="next">Next.js</plank-combobox-item>
 *   <plank-combobox-item value="svelte">SvelteKit</plank-combobox-item>
 *   <plank-combobox-item value="nuxt">Nuxt.js</plank-combobox-item>
 * </plank-combobox>
 * ```
 */
@customElement("plank-combobox")
export class PlankCombobox extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false
  @property({ type: String, reflect: true }) value = ""
  @property({ type: String }) placeholder = "Select..."
  @property({ type: String }) searchPlaceholder = "Search..."
  @property({ type: String }) emptyText = "No results found."
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String }) class: string = ""

  @state() private _searchValue = ""
  @state() private _selectedIndex = 0

  private _instanceId = `plank-combobox-${++comboboxId}`
  private _triggerEl: HTMLButtonElement | null = null
  private _portal: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _inputEl: HTMLInputElement | null = null
  private _cleanup: (() => void) | null = null
  private _items: PlankComboboxItem[] = []
  private _visibleItems: PlankComboboxItem[] = []
  private _boundHandleOutsideClick: ((e: PointerEvent) => void) | null = null
  private _boundHandleEscape: ((e: KeyboardEvent) => void) | null = null

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
    this._renderTrigger()
    this._collectItems()
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("open")) {
      // Update aria-expanded on trigger
      if (this._triggerEl) {
        this._triggerEl.setAttribute("aria-expanded", String(this.open))
      }
      if (this.open) {
        this._showContent()
      } else {
        this._hideContent()
      }
    }
    if (changedProperties.has("value")) {
      this._updateTriggerText()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._hideContent()
  }

  private _collectItems() {
    this._items = Array.from(
      this.querySelectorAll("plank-combobox-item")
    ) as PlankComboboxItem[]
    this._items.forEach((item) => item._setCombobox(this))
  }

  private _renderTrigger() {
    if (!this._triggerEl) {
      this._triggerEl = document.createElement("button")
      this._triggerEl.type = "button"
      this._triggerEl.setAttribute("role", "combobox")
      this._triggerEl.setAttribute("aria-autocomplete", "list")
      this._triggerEl.setAttribute("aria-haspopup", "listbox")
      this._triggerEl.addEventListener("click", this._handleTriggerClick)
      this._triggerEl.addEventListener("keydown", this._handleTriggerKeyDown)
      this.appendChild(this._triggerEl)
    }

    this._triggerEl.dataset.slot = "combobox-trigger"
    this._triggerEl.setAttribute("aria-expanded", String(this.open))
    this._triggerEl.setAttribute("aria-controls", `${this._instanceId}-listbox`)

    if (this.disabled) {
      this._triggerEl.disabled = true
      this._triggerEl.dataset.disabled = ""
    } else {
      this._triggerEl.disabled = false
      delete this._triggerEl.dataset.disabled
    }

    this._triggerEl.className = cn(
      "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex w-full items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
      this.class
    )

    this._updateTriggerText()
  }

  private _updateTriggerText() {
    if (!this._triggerEl) return

    // Clear existing content
    this._triggerEl.innerHTML = ""

    // Add text span
    const textSpan = document.createElement("span")
    textSpan.className = "truncate"

    if (this.value) {
      const selectedItem = this._items.find((item) => item.value === this.value)
      textSpan.textContent = selectedItem?.textContent?.trim() || this.value
      delete this._triggerEl.dataset.placeholder
    } else {
      textSpan.textContent = this.placeholder
      this._triggerEl.dataset.placeholder = ""
    }
    this._triggerEl.appendChild(textSpan)

    // Add chevron icon
    const chevron = document.createElement("span")
    chevron.className = "shrink-0 opacity-50"
    chevron.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>`
    this._triggerEl.appendChild(chevron)
  }

  private _handleTriggerClick = () => {
    if (!this.disabled) {
      this._toggle()
    }
  }

  private _handleTriggerKeyDown = (e: KeyboardEvent) => {
    if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
      e.preventDefault()
      if (!this.open) {
        this._setOpen(true)
      }
    }
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

    // Reset search and selection
    this._searchValue = ""
    this._selectedIndex = -1 // -1 means nothing highlighted initially
    this._filterItems()

    // Create portal container
    this._portal = document.createElement("div")
    this._portal.style.cssText =
      "position: fixed; top: 0; left: 0; z-index: 50;"

    // Create content element
    this._contentEl = document.createElement("div")
    this._contentEl.id = `${this._instanceId}-content`
    this._contentEl.dataset.slot = "combobox-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.className = cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border shadow-md"
    )
    this._contentEl.style.cssText = "position: fixed; top: 0; left: 0;"

    // Create command structure inside
    const command = document.createElement("div")
    command.className = "flex h-full w-full flex-col overflow-hidden rounded-md"

    // Create input wrapper
    const inputWrapper = document.createElement("div")
    inputWrapper.className = "flex h-9 items-center gap-2 border-b px-3"

    // Search icon
    const searchIcon = document.createElement("span")
    searchIcon.className = "size-4 shrink-0 opacity-50"
    searchIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
    inputWrapper.appendChild(searchIcon)

    // Search input
    this._inputEl = document.createElement("input")
    this._inputEl.type = "text"
    this._inputEl.placeholder = this.searchPlaceholder
    this._inputEl.className =
      "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden"
    this._inputEl.addEventListener("input", this._handleSearchInput)
    this._inputEl.addEventListener("keydown", this._handleSearchKeyDown)
    inputWrapper.appendChild(this._inputEl)

    command.appendChild(inputWrapper)

    // Create list container
    const listContainer = document.createElement("div")
    listContainer.id = `${this._instanceId}-listbox`
    listContainer.setAttribute("role", "listbox")
    listContainer.className =
      "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto p-1"

    // Render items
    this._renderItems(listContainer)

    command.appendChild(listContainer)
    this._contentEl.appendChild(command)
    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Set up positioning
    if (this._triggerEl && this._contentEl) {
      this._cleanup = autoUpdate(this._triggerEl, this._contentEl, () => {
        this._updatePosition()
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

    // Focus input
    setTimeout(() => {
      this._inputEl?.focus()
    }, 0)
  }

  private _renderItems(container: HTMLElement) {
    // Clear existing
    container.innerHTML = ""

    // Add empty state
    const emptyEl = document.createElement("div")
    emptyEl.dataset.slot = "combobox-empty"
    emptyEl.className = "py-6 text-center text-sm hidden"
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
        "absolute right-2 flex size-4 items-center justify-center"
      if (isSelected) {
        indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M20 6 9 17l-5-5"/></svg>`
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

    // Update visibility
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
      emptyEl.style.display = visibleCount === 0 ? "block" : "none"
    }

    // Update visible items list
    this._visibleItems = this._items.filter((item, index) => {
      const el = listContainer.querySelector(
        `[data-index="${index}"]`
      ) as HTMLElement
      return el && el.style.display !== "none" && !item.disabled
    })

    // Update selection - clamp to valid range but keep -1 if nothing was highlighted
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

    // Remove all highlights
    listContainer
      .querySelectorAll("[data-highlighted]")
      .forEach((el) => el.removeAttribute("data-highlighted"))

    // Add highlight to selected
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

  private _handleSearchInput = (e: Event) => {
    this._searchValue = (e.target as HTMLInputElement).value
    this._selectedIndex = -1 // Reset to no selection when typing
    this._filterItems()
  }

  private _handleSearchKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        if (this._visibleItems.length > 0) {
          // If nothing highlighted yet, highlight first item
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
        if (this._visibleItems.length > 0) {
          // If nothing highlighted yet, highlight last item
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
          this._selectedIndex >= 0 &&
          this._selectedIndex < this._visibleItems.length
        ) {
          const item = this._visibleItems[this._selectedIndex]
          this._selectValue(item.value)
        }
        break
      case "Home":
        e.preventDefault()
        this._selectedIndex = 0
        this._updateHighlight()
        break
      case "End":
        e.preventDefault()
        this._selectedIndex = Math.max(0, this._visibleItems.length - 1)
        this._updateHighlight()
        break
      case "Escape":
        e.preventDefault()
        this._setOpen(false)
        this._triggerEl?.focus()
        break
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
    this._setOpen(false)
    this._triggerEl?.focus()
  }

  private async _updatePosition() {
    if (!this._triggerEl || !this._contentEl) return

    const { x, y, placement } = await computePosition(
      this._triggerEl,
      this._contentEl,
      {
        strategy: "fixed",
        placement: "bottom-start",
        middleware: [
          offset({ mainAxis: 4, alignmentAxis: 0 }),
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
      minWidth: `${this._triggerEl.offsetWidth}px`,
    })
  }

  private _handleOutsideClick(e: PointerEvent) {
    const target = e.target as HTMLElement

    if (this._contentEl?.contains(target)) {
      return
    }

    if (this._triggerEl?.contains(target)) {
      return
    }

    this._setOpen(false)
  }

  private _handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      this._setOpen(false)
      this._triggerEl?.focus()
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

    if (this._portal) {
      this._portal.remove()
      this._portal = null
      this._contentEl = null
      this._inputEl = null
    }
  }

  // Public method to get display text for current value
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
 * PlankComboboxItem - An item in the combobox dropdown
 */
@customElement("plank-combobox-item")
export class PlankComboboxItem extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false

  private _combobox: PlankCombobox | null = null

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

  _setCombobox(combobox: PlankCombobox) {
    this._combobox = combobox
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-combobox": PlankCombobox
    "plank-combobox-item": PlankComboboxItem
  }
}
