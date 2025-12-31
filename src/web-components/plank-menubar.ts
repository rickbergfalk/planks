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
import type { Placement } from "@floating-ui/dom"
import { cn } from "@/lib/utils"

let menubarId = 0

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

/**
 * PlankMenubar - A visually persistent menu common in desktop applications
 *
 * @fires open-change - Fired when a menu opens or closes
 * @fires select - Fired when a menu item is selected
 * @fires checked-change - Fired when a checkbox item changes
 * @fires value-change - Fired when a radio group value changes
 *
 * @example
 * ```html
 * <plank-menubar>
 *   <plank-menubar-menu>
 *     <plank-menubar-trigger>File</plank-menubar-trigger>
 *     <plank-menubar-content>
 *       <plank-menubar-item>New</plank-menubar-item>
 *       <plank-menubar-item>Open</plank-menubar-item>
 *     </plank-menubar-content>
 *   </plank-menubar-menu>
 * </plank-menubar>
 * ```
 */
@customElement("plank-menubar")
export class PlankMenubar extends LitElement {
  @property({ type: String }) class: string = ""

  private _menus: PlankMenubarMenu[] = []
  private _activeMenuIndex: number = -1

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "menubar")
    document.addEventListener("keydown", this._handleDocumentKeydown)
    document.addEventListener("click", this._handleDocumentClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener("keydown", this._handleDocumentKeydown)
    document.removeEventListener("click", this._handleDocumentClick)
  }

  firstUpdated() {
    this._collectMenus()
  }

  private _collectMenus() {
    this._menus = Array.from(
      this.querySelectorAll(":scope > plank-menubar-menu")
    ) as PlankMenubarMenu[]
    this._menus.forEach((menu, index) => {
      menu._setMenubar(this, index)
    })
  }

  private _handleDocumentKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      this._closeAll()
    }
  }

  private _handleDocumentClick = (e: MouseEvent) => {
    if (!this.contains(e.target as Node)) {
      this._closeAll()
    }
  }

  _closeAll() {
    this._menus.forEach((menu) => menu._close())
    this._activeMenuIndex = -1
  }

  _openMenu(index: number) {
    if (index >= 0 && index < this._menus.length) {
      // Close other menus
      this._menus.forEach((menu, i) => {
        if (i !== index) menu._close()
      })
      this._menus[index]._openMenu()
      this._activeMenuIndex = index
    }
  }

  _handleTriggerHover(index: number) {
    // If any menu is open, opening another on hover
    if (this._activeMenuIndex >= 0 && this._activeMenuIndex !== index) {
      this._openMenu(index)
    }
  }

  _handleArrowNavigation(direction: "left" | "right") {
    if (this._activeMenuIndex < 0) return

    let newIndex: number
    if (direction === "left") {
      newIndex =
        this._activeMenuIndex <= 0
          ? this._menus.length - 1
          : this._activeMenuIndex - 1
    } else {
      newIndex =
        this._activeMenuIndex >= this._menus.length - 1
          ? 0
          : this._activeMenuIndex + 1
    }

    this._openMenu(newIndex)
    // Focus the new trigger
    this._menus[newIndex]?._focusTrigger()
  }

  _getMenus() {
    return this._menus
  }

  _dispatchSelect(item: PlankMenubarItem) {
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { item },
        bubbles: true,
      })
    )
  }

  _dispatchCheckedChange(item: PlankMenubarCheckboxItem, checked: boolean) {
    this.dispatchEvent(
      new CustomEvent("checked-change", {
        detail: { item, checked },
        bubbles: true,
      })
    )
  }

  _dispatchValueChange(group: PlankMenubarRadioGroup, value: string) {
    this.dispatchEvent(
      new CustomEvent("value-change", {
        detail: { group, value },
        bubbles: true,
      })
    )
  }

  willUpdate() {
    this.dataset.slot = "menubar"
    this.className = cn(
      "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarMenu - Container for a single menu within the menubar
 */
@customElement("plank-menubar-menu")
export class PlankMenubarMenu extends LitElement {
  @state() private _isMenuOpen = false

  private _menubar: PlankMenubar | null = null
  private _menuIndex: number = 0
  private _trigger: PlankMenubarTrigger | null = null
  private _content: PlankMenubarContent | null = null
  private _contentId = `plank-menubar-content-${++menubarId}`

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
  }

  firstUpdated() {
    this._trigger = this.querySelector(
      "plank-menubar-trigger"
    ) as PlankMenubarTrigger | null
    this._content = this.querySelector(
      "plank-menubar-content"
    ) as PlankMenubarContent | null

    if (this._trigger) {
      this._trigger._setMenu(this)
    }
    if (this._content) {
      this._content._setMenu(this)
      this._content._setId(this._contentId)
    }
  }

  _setMenubar(menubar: PlankMenubar, index: number) {
    this._menubar = menubar
    this._menuIndex = index
  }

  _getMenubar() {
    return this._menubar
  }

  _getIndex() {
    return this._menuIndex
  }

  _isOpen() {
    return this._isMenuOpen
  }

  _toggle() {
    if (this._isMenuOpen) {
      this._close()
    } else {
      this._openMenu()
    }
  }

  _openMenu() {
    if (!this._isMenuOpen) {
      this._isMenuOpen = true
      this._content?._updateOpenState(true)
      this._updateTriggerAria()
      this._menubar?.dispatchEvent(
        new CustomEvent("open-change", {
          detail: { open: true, menu: this },
          bubbles: true,
        })
      )
    }
  }

  _close() {
    if (this._isMenuOpen) {
      this._isMenuOpen = false
      this._content?._updateOpenState(false)
      this._updateTriggerAria()
      this._menubar?.dispatchEvent(
        new CustomEvent("open-change", {
          detail: { open: false, menu: this },
          bubbles: true,
        })
      )
    }
  }

  _focusTrigger() {
    this._trigger?._focus()
  }

  private _updateTriggerAria() {
    if (this._trigger) {
      const triggerEl = this._trigger
      triggerEl.setAttribute("aria-expanded", String(this._isMenuOpen))
      if (this._isMenuOpen) {
        triggerEl.setAttribute("aria-controls", this._contentId)
      } else {
        triggerEl.removeAttribute("aria-controls")
      }
    }
  }

  _getContentId() {
    return this._contentId
  }

  _getTrigger() {
    return this._trigger
  }

  willUpdate() {
    this.dataset.slot = "menubar-menu"
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarTrigger - The button that opens a menubar menu
 */
@customElement("plank-menubar-trigger")
export class PlankMenubarTrigger extends LitElement {
  @property({ type: String }) class: string = ""

  private _menu: PlankMenubarMenu | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "menuitem")
    this.setAttribute("tabindex", "0")
    this.setAttribute("aria-haspopup", "menu")
    this.addEventListener("click", this._handleClick)
    this.addEventListener("mouseenter", this._handleMouseEnter)
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
    this.removeEventListener("mouseenter", this._handleMouseEnter)
    this.removeEventListener("keydown", this._handleKeydown)
  }

  _setMenu(menu: PlankMenubarMenu) {
    this._menu = menu
  }

  _focus() {
    this.focus()
  }

  private _handleClick = () => {
    if (this._menu) {
      const menubar = this._menu._getMenubar()
      if (this._menu._isOpen()) {
        this._menu._close()
      } else {
        menubar?._openMenu(this._menu._getIndex())
      }
    }
  }

  private _handleMouseEnter = () => {
    if (this._menu) {
      this._menu._getMenubar()?._handleTriggerHover(this._menu._getIndex())
    }
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    const menubar = this._menu?._getMenubar()

    switch (e.key) {
      case "Enter":
      case " ":
      case "ArrowDown":
        e.preventDefault()
        if (this._menu) {
          menubar?._openMenu(this._menu._getIndex())
        }
        break
      case "ArrowLeft":
        e.preventDefault()
        menubar?._handleArrowNavigation("left")
        break
      case "ArrowRight":
        e.preventDefault()
        menubar?._handleArrowNavigation("right")
        break
    }
  }

  willUpdate() {
    this.dataset.slot = "menubar-trigger"
    this.dataset.state = this._menu?._isOpen() ? "open" : "closed"
    this.className = cn(
      "focus:bg-accent focus:text-accent-foreground",
      "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      "flex cursor-pointer items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarContent - The dropdown content for a menubar menu
 */
@customElement("plank-menubar-content")
export class PlankMenubarContent extends LitElement {
  @property({ type: String }) side: Side = "bottom"
  @property({ type: String }) align: Align = "start"
  @property({ type: Number, attribute: "side-offset" }) sideOffset = 8
  @property({ type: Number, attribute: "align-offset" }) alignOffset = -4
  @property({ type: String }) class: string = ""

  @state() private _isOpen = false

  private _menu: PlankMenubarMenu | null = null
  private _side: Side = "bottom"
  private _cleanup: (() => void) | null = null
  private _items: HTMLElement[] = []
  private _focusedIndex = -1

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "menu")
    this.style.display = "none"
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._cleanup?.()
    this.removeEventListener("keydown", this._handleKeydown)
  }

  _setMenu(menu: PlankMenubarMenu) {
    this._menu = menu
  }

  _setId(id: string) {
    this.id = id
  }

  _updateOpenState(open: boolean) {
    this._isOpen = open

    if (open) {
      this.style.display = "block"
      this._collectItems()
      this._focusedIndex = -1
      this._positionContent()
    } else {
      this.style.display = "none"
      this._cleanup?.()
      this._cleanup = null
    }
  }

  private _collectItems() {
    this._items = Array.from(
      this.querySelectorAll(
        "plank-menubar-item:not([disabled]), plank-menubar-checkbox-item:not([disabled]), plank-menubar-radio-item:not([disabled]), plank-menubar-sub-trigger:not([disabled])"
      )
    ) as HTMLElement[]
  }

  private _positionContent() {
    const trigger = this._menu?._getTrigger()
    if (!trigger) return

    const placement = `${this.side}-${this.align}` as Placement

    this._cleanup = autoUpdate(trigger, this, () => {
      computePosition(trigger, this, {
        placement,
        middleware: [
          offset({
            mainAxis: this.sideOffset,
            alignmentAxis: this.alignOffset,
          }),
          flip(),
          shift({ limiter: limitShift() }),
        ],
      }).then(({ x, y, placement: actualPlacement }) => {
        Object.assign(this.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
        })
        this._side = actualPlacement.split("-")[0] as Side
        this.dataset.side = this._side
        this.dataset.state = "open"
      })
    })
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    const menubar = this._menu?._getMenubar()

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        this._focusNextItem()
        break
      case "ArrowUp":
        e.preventDefault()
        this._focusPrevItem()
        break
      case "ArrowLeft":
        e.preventDefault()
        menubar?._handleArrowNavigation("left")
        break
      case "ArrowRight": {
        e.preventDefault()
        // Check if focused item is a sub-trigger
        const focusedItem = this._items[this._focusedIndex]
        if (focusedItem?.tagName === "PLANK-MENUBAR-SUB-TRIGGER") {
          ;(focusedItem as PlankMenubarSubTrigger)._openSub()
        } else {
          menubar?._handleArrowNavigation("right")
        }
        break
      }
      case "Enter":
      case " ":
        e.preventDefault()
        this._selectFocusedItem()
        break
      case "Home":
        e.preventDefault()
        this._focusFirstItem()
        break
      case "End":
        e.preventDefault()
        this._focusLastItem()
        break
    }
  }

  private _focusNextItem() {
    if (this._items.length === 0) return
    this._focusedIndex = (this._focusedIndex + 1) % this._items.length
    this._focusItem(this._focusedIndex)
  }

  private _focusPrevItem() {
    if (this._items.length === 0) return
    this._focusedIndex =
      this._focusedIndex <= 0 ? this._items.length - 1 : this._focusedIndex - 1
    this._focusItem(this._focusedIndex)
  }

  private _focusFirstItem() {
    if (this._items.length === 0) return
    this._focusedIndex = 0
    this._focusItem(0)
  }

  private _focusLastItem() {
    if (this._items.length === 0) return
    this._focusedIndex = this._items.length - 1
    this._focusItem(this._focusedIndex)
  }

  private _focusItem(index: number) {
    this._items.forEach((item, i) => {
      item.setAttribute("data-highlighted", String(i === index))
    })
    this._items[index]?.focus()
  }

  private _selectFocusedItem() {
    const item = this._items[this._focusedIndex]
    if (item) {
      item.click()
    }
  }

  willUpdate() {
    this.dataset.slot = "menubar-content"
    if (this._isOpen) {
      this.className = cn(
        "bg-popover text-popover-foreground",
        "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "z-50 min-w-[12rem] overflow-hidden rounded-md border p-1 shadow-md",
        this.class
      )
    }
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarItem - A menu item within a menubar menu
 */
@customElement("plank-menubar-item")
export class PlankMenubarItem extends LitElement {
  @property({ type: Boolean }) disabled = false
  @property({ type: Boolean }) inset = false
  @property({ type: String }) variant: "default" | "destructive" = "default"
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "menuitem")
    this.setAttribute("tabindex", "-1")
    this.addEventListener("click", this._handleClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
  }

  private _handleClick = () => {
    if (this.disabled) return

    // Find parent menubar
    const menubar = this.closest("plank-menubar") as PlankMenubar | null
    menubar?._dispatchSelect(this)
    menubar?._closeAll()
  }

  willUpdate() {
    this.dataset.slot = "menubar-item"
    this.dataset.inset = String(this.inset)
    this.dataset.variant = this.variant
    this.dataset.disabled = String(this.disabled)
    if (this.disabled) {
      this.setAttribute("aria-disabled", "true")
    } else {
      this.removeAttribute("aria-disabled")
    }
    this.className = cn(
      "focus:bg-accent focus:text-accent-foreground",
      "data-[variant=destructive]:text-destructive",
      "data-[variant=destructive]:focus:bg-destructive/10",
      "dark:data-[variant=destructive]:focus:bg-destructive/20",
      "data-[variant=destructive]:focus:text-destructive",
      "data-[variant=destructive]:*:[svg]:!text-destructive",
      "[&_svg:not([class*='text-'])]:text-muted-foreground",
      "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "data-[inset=true]:pl-8",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarCheckboxItem - A checkbox item within a menubar menu
 */
@customElement("plank-menubar-checkbox-item")
export class PlankMenubarCheckboxItem extends LitElement {
  @property({ type: Boolean }) checked = false
  @property({ type: Boolean }) disabled = false
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "menuitemcheckbox")
    this.setAttribute("tabindex", "-1")
    this.addEventListener("click", this._handleClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
  }

  private _handleClick = () => {
    if (this.disabled) return

    this.checked = !this.checked
    this.setAttribute("aria-checked", String(this.checked))

    const menubar = this.closest("plank-menubar") as PlankMenubar | null
    menubar?._dispatchCheckedChange(this, this.checked)
  }

  willUpdate() {
    this.dataset.slot = "menubar-checkbox-item"
    this.dataset.disabled = String(this.disabled)
    this.setAttribute("aria-checked", String(this.checked))
    if (this.disabled) {
      this.setAttribute("aria-disabled", "true")
    } else {
      this.removeAttribute("aria-disabled")
    }
    this.className = cn(
      "focus:bg-accent focus:text-accent-foreground",
      "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground",
      this.class
    )
  }

  render() {
    const checkIcon = this.checked
      ? html`<span
          class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
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
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </span>`
      : html`<span
          class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
        ></span>`

    return checkIcon
  }
}

/**
 * PlankMenubarRadioGroup - A radio group within a menubar menu
 */
@customElement("plank-menubar-radio-group")
export class PlankMenubarRadioGroup extends LitElement {
  @property({ type: String }) value = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "group")
  }

  firstUpdated() {
    this._updateItems()
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("value")) {
      this._updateItems()
    }
  }

  private _updateItems() {
    const items = this.querySelectorAll(
      "plank-menubar-radio-item"
    ) as NodeListOf<PlankMenubarRadioItem>
    items.forEach((item) => {
      item._setGroup(this)
      item._setChecked(item.value === this.value)
    })
  }

  _setValue(value: string) {
    this.value = value
    this._updateItems()

    const menubar = this.closest("plank-menubar") as PlankMenubar | null
    menubar?._dispatchValueChange(this, value)
  }

  willUpdate() {
    this.dataset.slot = "menubar-radio-group"
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarRadioItem - A radio item within a menubar radio group
 */
@customElement("plank-menubar-radio-item")
export class PlankMenubarRadioItem extends LitElement {
  @property({ type: String }) value = ""
  @property({ type: Boolean }) disabled = false
  @property({ type: String }) class: string = ""

  @state() private _checked = false

  private _group: PlankMenubarRadioGroup | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "menuitemradio")
    this.setAttribute("tabindex", "-1")
    this.addEventListener("click", this._handleClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
  }

  _setGroup(group: PlankMenubarRadioGroup) {
    this._group = group
  }

  _setChecked(checked: boolean) {
    this._checked = checked
    this.setAttribute("aria-checked", String(checked))
  }

  private _handleClick = () => {
    if (this.disabled) return
    this._group?._setValue(this.value)
  }

  willUpdate() {
    this.dataset.slot = "menubar-radio-item"
    this.dataset.disabled = String(this.disabled)
    this.setAttribute("aria-checked", String(this._checked))
    if (this.disabled) {
      this.setAttribute("aria-disabled", "true")
    } else {
      this.removeAttribute("aria-disabled")
    }
    this.className = cn(
      "focus:bg-accent focus:text-accent-foreground",
      "relative flex cursor-default items-center gap-2 rounded-xs py-1.5 pr-2 pl-8 text-sm outline-hidden select-none",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground",
      this.class
    )
  }

  render() {
    const radioIcon = this._checked
      ? html`<span
          class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="8"
            height="8"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            stroke-width="2"
            class="size-2"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        </span>`
      : html`<span
          class="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
        ></span>`

    return radioIcon
  }
}

/**
 * PlankMenubarLabel - A label within a menubar menu
 */
@customElement("plank-menubar-label")
export class PlankMenubarLabel extends LitElement {
  @property({ type: Boolean }) inset = false
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "menubar-label"
    this.dataset.inset = String(this.inset)
    this.className = cn(
      "px-2 py-1.5 text-sm font-medium",
      "data-[inset=true]:pl-8",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarSeparator - A separator line within a menubar menu
 */
@customElement("plank-menubar-separator")
export class PlankMenubarSeparator extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "separator")
  }

  willUpdate() {
    this.dataset.slot = "menubar-separator"
    this.className = cn("bg-border -mx-1 my-1 h-px", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarShortcut - A keyboard shortcut indicator
 */
@customElement("plank-menubar-shortcut")
export class PlankMenubarShortcut extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "menubar-shortcut"
    this.className = cn(
      "text-muted-foreground ml-auto text-xs tracking-widest",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarGroup - A group of items within a menubar menu
 */
@customElement("plank-menubar-group")
export class PlankMenubarGroup extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "group")
  }

  willUpdate() {
    this.dataset.slot = "menubar-group"
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarSub - A submenu container
 */
@customElement("plank-menubar-sub")
export class PlankMenubarSub extends LitElement {
  @state() private _isSubOpen = false

  private _trigger: PlankMenubarSubTrigger | null = null
  private _content: PlankMenubarSubContent | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
  }

  firstUpdated() {
    this._trigger = this.querySelector(
      "plank-menubar-sub-trigger"
    ) as PlankMenubarSubTrigger | null
    this._content = this.querySelector(
      "plank-menubar-sub-content"
    ) as PlankMenubarSubContent | null

    if (this._trigger) {
      this._trigger._setSub(this)
    }
    if (this._content) {
      this._content._setSub(this)
    }
  }

  _isOpen() {
    return this._isSubOpen
  }

  _openSub() {
    this._isSubOpen = true
    this._content?._updateOpenState(true)
    this._trigger?.setAttribute("data-state", "open")
  }

  _close() {
    this._isSubOpen = false
    this._content?._updateOpenState(false)
    this._trigger?.setAttribute("data-state", "closed")
  }

  _toggle() {
    if (this._isSubOpen) {
      this._close()
    } else {
      this._openSub()
    }
  }

  _getTrigger() {
    return this._trigger
  }

  willUpdate() {
    this.dataset.slot = "menubar-sub"
  }

  render() {
    return html``
  }
}

/**
 * PlankMenubarSubTrigger - The trigger for a submenu
 */
@customElement("plank-menubar-sub-trigger")
export class PlankMenubarSubTrigger extends LitElement {
  @property({ type: Boolean }) inset = false
  @property({ type: Boolean }) disabled = false
  @property({ type: String }) class: string = ""

  private _sub: PlankMenubarSub | null = null
  private _hoverTimer: number | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "menuitem")
    this.setAttribute("aria-haspopup", "menu")
    this.setAttribute("tabindex", "-1")
    this.addEventListener("mouseenter", this._handleMouseEnter)
    this.addEventListener("mouseleave", this._handleMouseLeave)
    this.addEventListener("click", this._handleClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("mouseenter", this._handleMouseEnter)
    this.removeEventListener("mouseleave", this._handleMouseLeave)
    this.removeEventListener("click", this._handleClick)
    if (this._hoverTimer) {
      clearTimeout(this._hoverTimer)
    }
  }

  _setSub(sub: PlankMenubarSub) {
    this._sub = sub
  }

  _openSub() {
    this._sub?._openSub()
  }

  private _handleMouseEnter = () => {
    if (this.disabled) return
    this._hoverTimer = window.setTimeout(() => {
      this._sub?._openSub()
    }, 100)
  }

  private _handleMouseLeave = () => {
    if (this._hoverTimer) {
      clearTimeout(this._hoverTimer)
      this._hoverTimer = null
    }
  }

  private _handleClick = () => {
    if (this.disabled) return
    this._sub?._toggle()
  }

  willUpdate() {
    this.dataset.slot = "menubar-sub-trigger"
    this.dataset.inset = String(this.inset)
    this.dataset.state = this._sub?._isOpen() ? "open" : "closed"
    this.dataset.disabled = String(this.disabled)
    if (this.disabled) {
      this.setAttribute("aria-disabled", "true")
    } else {
      this.removeAttribute("aria-disabled")
    }
    this.className = cn(
      "focus:bg-accent focus:text-accent-foreground",
      "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      "flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-none select-none",
      "data-[inset=true]:pl-8",
      "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
      "data-[highlighted=true]:bg-accent data-[highlighted=true]:text-accent-foreground",
      this.class
    )
  }

  render() {
    return html`<svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="ml-auto h-4 w-4"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>`
  }
}

/**
 * PlankMenubarSubContent - The content for a submenu
 */
@customElement("plank-menubar-sub-content")
export class PlankMenubarSubContent extends LitElement {
  @property({ type: String }) class: string = ""

  @state() private _isOpen = false

  private _sub: PlankMenubarSub | null = null
  private _side: Side = "right"
  private _cleanup: (() => void) | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("role", "menu")
    this.style.display = "none"
    this.addEventListener("mouseleave", this._handleMouseLeave)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._cleanup?.()
    this.removeEventListener("mouseleave", this._handleMouseLeave)
  }

  _setSub(sub: PlankMenubarSub) {
    this._sub = sub
  }

  _updateOpenState(open: boolean) {
    this._isOpen = open

    if (open) {
      this.style.display = "block"
      this._positionContent()
    } else {
      this.style.display = "none"
      this._cleanup?.()
      this._cleanup = null
    }
  }

  private _positionContent() {
    const trigger = this._sub?._getTrigger()
    if (!trigger) return

    const placement: Placement = "right-start"

    this._cleanup = autoUpdate(trigger, this, () => {
      computePosition(trigger, this, {
        placement,
        middleware: [offset({ mainAxis: 2 }), flip(), shift()],
      }).then(({ x, y, placement: actualPlacement }) => {
        Object.assign(this.style, {
          position: "absolute",
          left: `${x}px`,
          top: `${y}px`,
        })
        this._side = actualPlacement.split("-")[0] as Side
        this.dataset.side = this._side
        this.dataset.state = "open"
      })
    })
  }

  private _handleMouseLeave = () => {
    // Delay closing to allow moving to content
    setTimeout(() => {
      if (
        !this.matches(":hover") &&
        !this._sub?._getTrigger()?.matches(":hover")
      ) {
        this._sub?._close()
      }
    }, 100)
  }

  willUpdate() {
    this.dataset.slot = "menubar-sub-content"
    if (this._isOpen) {
      this.className = cn(
        "bg-popover text-popover-foreground",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2",
        "data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        "z-50 min-w-[8rem] overflow-hidden rounded-md border p-1 shadow-lg",
        this.class
      )
    }
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-menubar": PlankMenubar
    "plank-menubar-menu": PlankMenubarMenu
    "plank-menubar-trigger": PlankMenubarTrigger
    "plank-menubar-content": PlankMenubarContent
    "plank-menubar-item": PlankMenubarItem
    "plank-menubar-checkbox-item": PlankMenubarCheckboxItem
    "plank-menubar-radio-group": PlankMenubarRadioGroup
    "plank-menubar-radio-item": PlankMenubarRadioItem
    "plank-menubar-label": PlankMenubarLabel
    "plank-menubar-separator": PlankMenubarSeparator
    "plank-menubar-shortcut": PlankMenubarShortcut
    "plank-menubar-group": PlankMenubarGroup
    "plank-menubar-sub": PlankMenubarSub
    "plank-menubar-sub-trigger": PlankMenubarSubTrigger
    "plank-menubar-sub-content": PlankMenubarSubContent
  }
}
