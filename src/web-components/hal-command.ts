import { LitElement, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { cn } from "@/lib/utils"

let commandId = 0

/**
 * HalCommand - Root container for command palette
 *
 * @fires select - Fired when an item is selected
 *
 * @example
 * ```html
 * <hal-command>
 *   <hal-command-input placeholder="Search..."></hal-command-input>
 *   <hal-command-list>
 *     <hal-command-empty>No results found.</hal-command-empty>
 *     <hal-command-item>Item 1</hal-command-item>
 *   </hal-command-list>
 * </hal-command>
 * ```
 */
@customElement("hal-command")
export class HalCommand extends LitElement {
  @state() private _searchValue = ""
  @state() private _selectedIndex = 0

  private _instanceId = `hal-command-${++commandId}`
  private _input: HalCommandInput | null = null
  private _list: HalCommandList | null = null
  private _items: HalCommandItem[] = []
  private _visibleItems: HalCommandItem[] = []

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.className = cn(
      "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
      this.getAttribute("class") || ""
    )
  }

  willUpdate() {
    this.dataset.slot = "command"
  }

  firstUpdated() {
    this._updateChildren()
    // Use queueMicrotask to ensure child elements are connected
    queueMicrotask(() => {
      this._collectItems()
      this._filterItems()
    })
  }

  private _updateChildren() {
    this._input = this.querySelector(
      "hal-command-input"
    ) as HalCommandInput | null
    this._list = this.querySelector("hal-command-list") as HalCommandList | null

    if (this._input) {
      this._input._setCommand(this)
    }
    if (this._list) {
      this._list._setCommand(this)
      this._list._setId(`${this._instanceId}-list`)
    }
  }

  private _collectItems() {
    this._items = Array.from(
      this.querySelectorAll("hal-command-item")
    ) as HalCommandItem[]
    this._items.forEach((item) => item._setCommand(this))
  }

  _getListId() {
    return `${this._instanceId}-list`
  }

  _getSearchValue() {
    return this._searchValue
  }

  _setSearchValue(value: string) {
    this._searchValue = value
    this._filterItems()
    this._selectedIndex = 0
    this._updateSelectedItem()
  }

  private _filterItems() {
    const search = this._searchValue.toLowerCase().trim()

    // Update item visibility
    this._items.forEach((item) => {
      const text = item.textContent?.toLowerCase() || ""
      const value = item.value?.toLowerCase() || ""
      const matches = !search || text.includes(search) || value.includes(search)
      item._setVisible(matches)
    })

    // Collect visible items
    this._visibleItems = this._items.filter(
      (item) => item._isVisible() && !item.disabled
    )

    // Update empty state
    const empty = this.querySelector(
      "hal-command-empty"
    ) as HalCommandEmpty | null
    if (empty) {
      empty._setVisible(this._visibleItems.length === 0)
    }

    // Update groups
    const groups = this.querySelectorAll("hal-command-group")
    groups.forEach((group) => {
      const groupEl = group as HalCommandGroup
      const items = groupEl.querySelectorAll("hal-command-item")
      const hasVisibleItems = Array.from(items).some((item) =>
        (item as HalCommandItem)._isVisible()
      )
      groupEl._setVisible(hasVisibleItems)
    })

    // Update selected item
    this._updateSelectedItem()
  }

  private _updateSelectedItem() {
    this._items.forEach((item) => {
      const visibleIndex = this._visibleItems.indexOf(item)
      item._setSelected(visibleIndex === this._selectedIndex)
    })
  }

  _navigateDown() {
    this._ensureItemsInitialized()
    if (this._visibleItems.length === 0) return
    this._selectedIndex = (this._selectedIndex + 1) % this._visibleItems.length
    this._updateSelectedItem()
  }

  private _ensureItemsInitialized() {
    if (this._items.length === 0) {
      this._collectItems()
      this._filterItems()
    }
  }

  _navigateUp() {
    this._ensureItemsInitialized()
    if (this._visibleItems.length === 0) return
    this._selectedIndex =
      this._selectedIndex <= 0
        ? this._visibleItems.length - 1
        : this._selectedIndex - 1
    this._updateSelectedItem()
  }

  _navigateHome() {
    this._ensureItemsInitialized()
    if (this._visibleItems.length === 0) return
    this._selectedIndex = 0
    this._updateSelectedItem()
  }

  _navigateEnd() {
    this._ensureItemsInitialized()
    if (this._visibleItems.length === 0) return
    this._selectedIndex = this._visibleItems.length - 1
    this._updateSelectedItem()
  }

  _selectCurrent() {
    this._ensureItemsInitialized()
    if (
      this._selectedIndex >= 0 &&
      this._selectedIndex < this._visibleItems.length
    ) {
      const item = this._visibleItems[this._selectedIndex]
      this._selectItem(item)
    }
  }

  _selectItem(item: HalCommandItem) {
    const value = item.value || item.textContent?.trim().toLowerCase() || ""
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { value },
        bubbles: true,
      })
    )
  }

  render() {
    return html``
  }
}

/**
 * HalCommandInput - Search input for command palette
 */
@customElement("hal-command-input")
export class HalCommandInput extends LitElement {
  @property({ type: String }) placeholder = ""
  @property({ type: String }) class: string = ""

  private _command: HalCommand | null = null
  private _inputEl: HTMLInputElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
  }

  willUpdate() {
    this.dataset.slot = "command-input"
  }

  firstUpdated() {
    this._render()
  }

  _setCommand(command: HalCommand) {
    this._command = command
    this._render()
  }

  private _render() {
    if (!this._inputEl) {
      // Create wrapper
      const wrapper = document.createElement("div")
      wrapper.dataset.slot = "command-input-wrapper"
      wrapper.className = "flex h-9 items-center gap-2 border-b px-3"

      // Create search icon
      const iconSpan = document.createElement("span")
      iconSpan.className = "size-4 shrink-0 opacity-50"
      iconSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
      wrapper.appendChild(iconSpan)

      // Create input
      this._inputEl = document.createElement("input")
      this._inputEl.type = "text"
      this._inputEl.setAttribute("role", "combobox")
      this._inputEl.setAttribute("aria-expanded", "true")
      this._inputEl.setAttribute("aria-autocomplete", "list")
      this._inputEl.dataset.slot = "command-input"
      this._inputEl.className = cn(
        "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
        this.class
      )
      this._inputEl.placeholder = this.placeholder

      // Set aria-controls when command is available
      if (this._command) {
        this._inputEl.setAttribute("aria-controls", this._command._getListId())
      }

      this._inputEl.addEventListener("input", this._handleInput)
      this._inputEl.addEventListener("keydown", this._handleKeyDown)
      wrapper.appendChild(this._inputEl)

      this.appendChild(wrapper)
    } else {
      // Update attributes
      this._inputEl.placeholder = this.placeholder
      if (this._command) {
        this._inputEl.setAttribute("aria-controls", this._command._getListId())
      }
    }
  }

  private _handleInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value
    this._command?._setSearchValue(value)
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        this._command?._navigateDown()
        break
      case "ArrowUp":
        e.preventDefault()
        this._command?._navigateUp()
        break
      case "Enter":
        e.preventDefault()
        this._command?._selectCurrent()
        break
      case "Home":
        e.preventDefault()
        this._command?._navigateHome()
        break
      case "End":
        e.preventDefault()
        this._command?._navigateEnd()
        break
    }
  }

  render() {
    return html``
  }
}

/**
 * HalCommandList - Container for command items
 */
@customElement("hal-command-list")
export class HalCommandList extends LitElement {
  @property({ type: String }) class: string = ""

  private _command: HalCommand | null = null
  private _id = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "block"
    this.className = cn(
      "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
      this.getAttribute("class") || ""
    )
  }

  willUpdate() {
    this.dataset.slot = "command-list"
    this.setAttribute("role", "listbox")
    if (this._id) {
      this.id = this._id
    }
  }

  _setCommand(command: HalCommand) {
    this._command = command
  }

  _setId(id: string) {
    this._id = id
    this.id = id
  }

  render() {
    return html``
  }
}

/**
 * HalCommandEmpty - Shown when no items match search
 */
@customElement("hal-command-empty")
export class HalCommandEmpty extends LitElement {
  @property({ type: String }) class: string = ""

  // Start hidden - HalCommand will show us if needed
  private _visible = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "block"
    this._updateClassName()
    // Start hidden
    this.setAttribute("hidden", "")
  }

  willUpdate() {
    this.dataset.slot = "command-empty"
    this._updateClassName()
  }

  private _updateClassName() {
    this.className = cn(
      "py-6 text-center text-sm",
      this._visible ? "" : "hidden",
      this.getAttribute("class") || ""
    )
  }

  _setVisible(visible: boolean) {
    this._visible = visible
    this._updateClassName()
    if (visible) {
      this.removeAttribute("hidden")
    } else {
      this.setAttribute("hidden", "")
    }
  }

  render() {
    return html``
  }
}

/**
 * HalCommandGroup - Groups items with a heading
 */
@customElement("hal-command-group")
export class HalCommandGroup extends LitElement {
  @property({ type: String }) heading = ""
  @property({ type: String }) class: string = ""

  private _visible = true
  private _headingEl: HTMLDivElement | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "block"
    this._updateClassName()
  }

  willUpdate() {
    this.dataset.slot = "command-group"
    this.setAttribute("role", "group")
    this._updateClassName()
  }

  firstUpdated() {
    this._render()
  }

  private _updateClassName() {
    this.className = cn(
      "text-foreground overflow-hidden p-1",
      this._visible ? "" : "hidden",
      this.getAttribute("class") || ""
    )
  }

  private _render() {
    // Create heading if it doesn't exist and heading is provided
    if (this.heading && !this._headingEl) {
      this._headingEl = document.createElement("div")
      this._headingEl.dataset.slot = "command-group-heading"
      this._headingEl.className =
        "text-muted-foreground px-2 py-1.5 text-xs font-medium"
      this._headingEl.textContent = this.heading
      this.insertBefore(this._headingEl, this.firstChild)
    } else if (this._headingEl) {
      this._headingEl.textContent = this.heading
    }
  }

  _setVisible(visible: boolean) {
    this._visible = visible
    this._updateClassName()
    if (visible) {
      this.removeAttribute("hidden")
    } else {
      this.setAttribute("hidden", "")
    }
  }

  render() {
    return html``
  }
}

/**
 * HalCommandItem - A command item
 */
@customElement("hal-command-item")
export class HalCommandItem extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String }) class: string = ""

  private _command: HalCommand | null = null
  private _visible = true
  private _selected = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this._updateClassName()
    this.addEventListener("click", this._handleClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
  }

  willUpdate() {
    this.dataset.slot = "command-item"
    this.setAttribute("role", "option")
    this.setAttribute("aria-selected", String(this._selected))
    if (this.disabled) {
      this.setAttribute("aria-disabled", "true")
    } else {
      this.removeAttribute("aria-disabled")
    }
    this._updateClassName()
  }

  private _updateClassName() {
    this.className = cn(
      "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      this._visible ? "" : "hidden",
      this.getAttribute("class") || ""
    )

    // Update data attributes
    if (this._selected) {
      this.dataset.selected = "true"
    } else {
      delete this.dataset.selected
    }

    if (this.disabled) {
      this.dataset.disabled = "true"
    } else {
      delete this.dataset.disabled
    }
  }

  _setCommand(command: HalCommand) {
    this._command = command
  }

  _setVisible(visible: boolean) {
    this._visible = visible
    this._updateClassName()
    if (visible) {
      this.removeAttribute("hidden")
    } else {
      this.setAttribute("hidden", "")
    }
  }

  _isVisible() {
    return this._visible
  }

  _setSelected(selected: boolean) {
    this._selected = selected
    this.setAttribute("aria-selected", String(selected))
    this._updateClassName()
  }

  private _handleClick = () => {
    if (!this.disabled) {
      this._command?._selectItem(this)
    }
  }

  render() {
    return html``
  }
}

/**
 * HalCommandSeparator - Separator between items
 */
@customElement("hal-command-separator")
export class HalCommandSeparator extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "block"
    this.className = cn(
      "bg-border -mx-1 h-px",
      this.getAttribute("class") || ""
    )
  }

  willUpdate() {
    this.dataset.slot = "command-separator"
    this.setAttribute("role", "separator")
  }

  render() {
    return html``
  }
}

/**
 * HalCommandShortcut - Keyboard shortcut display
 */
@customElement("hal-command-shortcut")
export class HalCommandShortcut extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.className = cn(
      "text-muted-foreground ml-auto text-xs tracking-widest",
      this.getAttribute("class") || ""
    )
  }

  willUpdate() {
    this.dataset.slot = "command-shortcut"
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-command": HalCommand
    "hal-command-input": HalCommandInput
    "hal-command-list": HalCommandList
    "hal-command-empty": HalCommandEmpty
    "hal-command-group": HalCommandGroup
    "hal-command-item": HalCommandItem
    "hal-command-separator": HalCommandSeparator
    "hal-command-shortcut": HalCommandShortcut
  }
}
