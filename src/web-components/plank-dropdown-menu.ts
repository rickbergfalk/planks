import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
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

let dropdownMenuId = 0

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

/**
 * PlankDropdownMenu - Root container that manages dropdown menu state
 *
 * @fires open-change - Fired when the menu opens or closes
 * @fires select - Fired when a menu item is selected
 * @fires checked-change - Fired when a checkbox item changes
 * @fires value-change - Fired when a radio group value changes
 *
 * @example
 * ```html
 * <plank-dropdown-menu>
 *   <plank-dropdown-menu-trigger>
 *     <button>Open</button>
 *   </plank-dropdown-menu-trigger>
 *   <plank-dropdown-menu-content>
 *     <plank-dropdown-menu-item>Item</plank-dropdown-menu-item>
 *   </plank-dropdown-menu-content>
 * </plank-dropdown-menu>
 * ```
 */
@customElement("plank-dropdown-menu")
export class PlankDropdownMenu extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  private _trigger: PlankDropdownMenuTrigger | null = null
  private _content: PlankDropdownMenuContent | null = null
  private _contentId = `plank-dropdown-menu-content-${++dropdownMenuId}`

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu"
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
      "plank-dropdown-menu-trigger"
    ) as PlankDropdownMenuTrigger | null
    this._content = this.querySelector(
      "plank-dropdown-menu-content"
    ) as PlankDropdownMenuContent | null

    if (this._trigger) {
      this._trigger._setDropdownMenu(this)
    }
    if (this._content) {
      this._content._setDropdownMenu(this)
      this._content._setId(this._contentId)
      this._content._updateOpenState(this.open)
    }

    // Update trigger's aria attributes
    if (this._trigger) {
      const triggerEl = this._trigger._getTriggerElement()
      if (triggerEl) {
        triggerEl.setAttribute("aria-haspopup", "menu")
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
    this._setOpen(!this.open)
  }

  _close() {
    this._setOpen(false)
  }

  _open() {
    this._setOpen(true)
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

  _getTrigger() {
    return this._trigger
  }

  _getContent() {
    return this._content
  }

  _getContentId() {
    return this._contentId
  }

  _dispatchSelect(item: PlankDropdownMenuItem) {
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { item },
        bubbles: true,
      })
    )
  }

  _dispatchCheckedChange(
    item: PlankDropdownMenuCheckboxItem,
    checked: boolean
  ) {
    this.dispatchEvent(
      new CustomEvent("checked-change", {
        detail: { item, checked },
        bubbles: true,
      })
    )
  }

  _dispatchValueChange(value: string) {
    this.dispatchEvent(
      new CustomEvent("value-change", {
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
 * PlankDropdownMenuTrigger - Element that triggers the dropdown menu on click
 */
@customElement("plank-dropdown-menu-trigger")
export class PlankDropdownMenuTrigger extends LitElement {
  private _dropdownMenu: PlankDropdownMenu | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
    this.addEventListener("click", this._handleClick)
    this.addEventListener("keydown", this._handleKeyDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
    this.removeEventListener("keydown", this._handleKeyDown)
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-trigger"
  }

  _setDropdownMenu(dropdownMenu: PlankDropdownMenu) {
    this._dropdownMenu = dropdownMenu
  }

  _getTriggerElement(): HTMLElement | null {
    return (
      this.querySelector("button, a, [tabindex]") ||
      (this.firstElementChild as HTMLElement)
    )
  }

  private _handleClick = (e: Event) => {
    e.stopPropagation()
    this._dropdownMenu?._toggle()
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (["Enter", " ", "ArrowDown"].includes(e.key)) {
      e.preventDefault()
      this._dropdownMenu?._open()
    }
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuContent - The floating dropdown menu content
 */
@customElement("plank-dropdown-menu-content")
export class PlankDropdownMenuContent extends LitElement {
  @property({ type: String }) side: Side = "bottom"
  @property({ type: String }) align: Align = "start"
  @property({ type: Number }) sideOffset = 4
  @property({ type: String }) class: string = ""

  private _dropdownMenu: PlankDropdownMenu | null = null
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
    this.dataset.slot = "dropdown-menu-content"
  }

  _setDropdownMenu(dropdownMenu: PlankDropdownMenu) {
    this._dropdownMenu = dropdownMenu
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
    this._contentEl.setAttribute("role", "menu")
    this._contentEl.setAttribute("tabindex", "-1")
    this._contentEl.dataset.slot = "dropdown-menu-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.dataset.side = this.side
    this._contentEl.className = cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
      this.class
    )
    this._contentEl.style.cssText = "position: fixed; top: 0; left: 0;"

    // Render menu items into content element
    this._renderItems()

    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Set up positioning
    const trigger = this._dropdownMenu?._getTrigger()?._getTriggerElement()
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
  }

  private _renderItems() {
    if (!this._contentEl) return

    // Clear existing content
    this._contentEl.innerHTML = ""

    // Clone and process children
    const children = Array.from(this.children)
    children.forEach((child) => {
      const renderedChild = this._renderChild(child as HTMLElement)
      if (renderedChild) {
        this._contentEl!.appendChild(renderedChild)
      }
    })
  }

  private _renderChild(child: HTMLElement): HTMLElement | null {
    const tagName = child.tagName.toLowerCase()

    if (tagName === "plank-dropdown-menu-item") {
      return this._renderMenuItem(child as PlankDropdownMenuItem)
    } else if (tagName === "plank-dropdown-menu-checkbox-item") {
      return this._renderCheckboxItem(child as PlankDropdownMenuCheckboxItem)
    } else if (tagName === "plank-dropdown-menu-radio-group") {
      return this._renderRadioGroup(child as PlankDropdownMenuRadioGroup)
    } else if (tagName === "plank-dropdown-menu-label") {
      return this._renderLabel(child as PlankDropdownMenuLabel)
    } else if (tagName === "plank-dropdown-menu-separator") {
      return this._renderSeparator()
    } else if (tagName === "plank-dropdown-menu-group") {
      return this._renderGroup(child as PlankDropdownMenuGroup)
    } else if (tagName === "plank-dropdown-menu-sub") {
      return this._renderSub(child as PlankDropdownMenuSub)
    }

    return null
  }

  private _renderMenuItem(item: PlankDropdownMenuItem): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menuitem")
    el.setAttribute("tabindex", "-1")
    el.dataset.slot = "dropdown-menu-item"

    if (item.disabled) {
      el.dataset.disabled = ""
      el.setAttribute("aria-disabled", "true")
    }
    if (item.variant) {
      el.dataset.variant = item.variant
    }
    if (item.inset) {
      el.dataset.inset = ""
    }

    el.className = cn(
      "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    )

    // Render item content with shortcuts
    this._renderItemContent(el, item)

    if (!item.disabled) {
      el.addEventListener("click", () => {
        this._dropdownMenu?._dispatchSelect(item)
        this._dropdownMenu?._close()
      })
      el.addEventListener("pointerenter", () => {
        this._highlightItem(el)
      })
    }

    return el
  }

  private _renderItemContent(el: HTMLElement, item: HTMLElement) {
    Array.from(item.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        el.appendChild(document.createTextNode(node.textContent || ""))
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as HTMLElement
        if (element.tagName.toLowerCase() === "plank-dropdown-menu-shortcut") {
          el.appendChild(this._renderShortcut(element))
        } else {
          el.appendChild(element.cloneNode(true))
        }
      }
    })
  }

  private _renderCheckboxItem(
    item: PlankDropdownMenuCheckboxItem
  ): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menuitemcheckbox")
    el.setAttribute("tabindex", "-1")
    el.setAttribute("aria-checked", String(item.checked))
    el.dataset.slot = "dropdown-menu-checkbox-item"

    if (item.disabled) {
      el.dataset.disabled = ""
      el.setAttribute("aria-disabled", "true")
    }

    el.className = cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    )

    // Render checkbox indicator
    const indicator = document.createElement("span")
    indicator.className =
      "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
    if (item.checked) {
      indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M20 6 9 17l-5-5"/></svg>`
    }
    el.appendChild(indicator)

    // Render text content
    Array.from(item.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        el.appendChild(document.createTextNode(node.textContent || ""))
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        el.appendChild((node as HTMLElement).cloneNode(true))
      }
    })

    if (!item.disabled) {
      el.addEventListener("click", () => {
        const newChecked = !item.checked
        item.checked = newChecked
        this._dropdownMenu?._dispatchCheckedChange(item, newChecked)
        // Don't close menu for checkbox items
      })
      el.addEventListener("pointerenter", () => {
        this._highlightItem(el)
      })
    }

    return el
  }

  private _renderRadioGroup(group: PlankDropdownMenuRadioGroup): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "group")
    el.dataset.slot = "dropdown-menu-radio-group"

    const radioItems = group.querySelectorAll("plank-dropdown-menu-radio-item")
    radioItems.forEach((item) => {
      const radioEl = this._renderRadioItem(
        item as PlankDropdownMenuRadioItem,
        group.value
      )
      el.appendChild(radioEl)
    })

    return el
  }

  private _renderRadioItem(
    item: PlankDropdownMenuRadioItem,
    groupValue: string
  ): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menuitemradio")
    el.setAttribute("tabindex", "-1")
    const isChecked = item.value === groupValue
    el.setAttribute("aria-checked", String(isChecked))
    el.dataset.slot = "dropdown-menu-radio-item"

    if (item.disabled) {
      el.dataset.disabled = ""
      el.setAttribute("aria-disabled", "true")
    }

    el.className = cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    )

    // Render radio indicator
    const indicator = document.createElement("span")
    indicator.className =
      "pointer-events-none absolute left-2 flex size-3.5 items-center justify-center"
    if (isChecked) {
      indicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-2"><circle cx="12" cy="12" r="10"/></svg>`
    }
    el.appendChild(indicator)

    // Render text content
    el.appendChild(document.createTextNode(item.textContent?.trim() || ""))

    if (!item.disabled) {
      el.addEventListener("click", () => {
        // Find parent radio group and update
        const radioGroup = item.closest("plank-dropdown-menu-radio-group") as
          | PlankDropdownMenuRadioGroup
          | undefined
        if (radioGroup) {
          radioGroup.value = item.value
          this._dropdownMenu?._dispatchValueChange(item.value)
        }
        this._dropdownMenu?._close()
      })
      el.addEventListener("pointerenter", () => {
        this._highlightItem(el)
      })
    }

    return el
  }

  private _renderLabel(item: PlankDropdownMenuLabel): HTMLElement {
    const el = document.createElement("div")
    el.dataset.slot = "dropdown-menu-label"

    if (item.inset) {
      el.dataset.inset = ""
    }

    el.className = cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8")
    el.textContent = item.textContent?.trim() || ""

    return el
  }

  private _renderSeparator(): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "separator")
    el.dataset.slot = "dropdown-menu-separator"
    el.className = cn("bg-border -mx-1 my-1 h-px")

    return el
  }

  private _renderShortcut(item: HTMLElement): HTMLElement {
    const el = document.createElement("span")
    el.dataset.slot = "dropdown-menu-shortcut"
    el.className = cn("text-muted-foreground ml-auto text-xs tracking-widest")
    el.textContent = item.textContent?.trim() || ""

    return el
  }

  private _renderGroup(group: PlankDropdownMenuGroup): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "group")
    el.dataset.slot = "dropdown-menu-group"

    Array.from(group.children).forEach((child) => {
      const renderedChild = this._renderChild(child as HTMLElement)
      if (renderedChild) {
        el.appendChild(renderedChild)
      }
    })

    return el
  }

  private _renderSub(sub: PlankDropdownMenuSub): HTMLElement {
    const el = document.createElement("div")
    el.dataset.slot = "dropdown-menu-sub"

    const subTrigger = sub.querySelector("plank-dropdown-menu-sub-trigger")
    const subContent = sub.querySelector("plank-dropdown-menu-sub-content")

    if (subTrigger) {
      const triggerEl = this._renderSubTrigger(
        subTrigger as PlankDropdownMenuSubTrigger
      )
      el.appendChild(triggerEl)

      if (subContent && sub.open) {
        const contentEl = this._renderSubContent(
          subContent as PlankDropdownMenuSubContent,
          triggerEl
        )
        el.appendChild(contentEl)
      } else if (subContent) {
        // Set up hover to open submenu
        triggerEl.addEventListener("pointerenter", () => {
          sub.open = true
          this._renderItems()
        })
      }
    }

    return el
  }

  private _renderSubTrigger(trigger: PlankDropdownMenuSubTrigger): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menuitem")
    el.setAttribute("tabindex", "-1")
    el.dataset.slot = "dropdown-menu-sub-trigger"

    if (trigger.inset) {
      el.dataset.inset = ""
    }

    el.className = cn(
      "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    )

    // Render text content
    el.appendChild(document.createTextNode(trigger.textContent?.trim() || ""))

    // Add chevron icon
    const chevron = document.createElement("span")
    chevron.className = "ml-auto"
    chevron.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m9 18 6-6-6-6"/></svg>`
    el.appendChild(chevron)

    el.addEventListener("pointerenter", () => {
      this._highlightItem(el)
    })

    return el
  }

  private _renderSubContent(
    content: PlankDropdownMenuSubContent,
    triggerEl: HTMLElement
  ): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menu")
    el.dataset.slot = "dropdown-menu-sub-content"
    el.dataset.state = "open"
    el.dataset.side = "right"

    el.className = cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg"
    )

    // Position submenu
    el.style.cssText = "position: fixed; top: 0; left: 0;"

    // Render submenu items
    Array.from(content.children).forEach((child) => {
      const renderedChild = this._renderChild(child as HTMLElement)
      if (renderedChild) {
        el.appendChild(renderedChild)
      }
    })

    // Position after next frame
    requestAnimationFrame(() => {
      this._positionSubContent(el, triggerEl)
    })

    return el
  }

  private async _positionSubContent(el: HTMLElement, trigger: HTMLElement) {
    const { x, y, placement } = await computePosition(trigger, el, {
      strategy: "fixed",
      placement: "right-start",
      middleware: [
        offset({ mainAxis: 0, alignmentAxis: -4 }),
        shift({ limiter: limitShift(), padding: 8 }),
        flip(),
      ],
    })

    el.dataset.side = placement.split("-")[0]
    Object.assign(el.style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  }

  private _collectItems() {
    if (!this._contentEl) return
    this._items = Array.from(
      this._contentEl.querySelectorAll(
        '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]'
      )
    ).filter((el) => !el.hasAttribute("aria-disabled")) as HTMLElement[]
    this._highlightedIndex = -1
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
        ],
      }
    )

    if (!this._contentEl) return

    this._placedSide = placement.split("-")[0] as Side
    this._contentEl.dataset.side = this._placedSide

    Object.assign(this._contentEl.style, {
      left: `${x}px`,
      top: `${y}px`,
    })
  }

  private _handleOutsideClick(e: PointerEvent) {
    const target = e.target as HTMLElement

    if (this._contentEl?.contains(target)) {
      return
    }

    const triggerEl = this._dropdownMenu?._getTrigger()?._getTriggerElement()
    if (triggerEl?.contains(target)) {
      return
    }

    this._dropdownMenu?._close()
  }

  private _handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      this._dropdownMenu?._close()
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
 * PlankDropdownMenuItem - A menu item
 */
@customElement("plank-dropdown-menu-item")
export class PlankDropdownMenuItem extends LitElement {
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: String, reflect: true }) variant:
    | "default"
    | "destructive" = "default"
  @property({ type: Boolean, reflect: true }) inset = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-item"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuCheckboxItem - A checkbox menu item
 */
@customElement("plank-dropdown-menu-checkbox-item")
export class PlankDropdownMenuCheckboxItem extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false
  @property({ type: Boolean, reflect: true }) disabled = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-checkbox-item"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuRadioGroup - A radio group container
 */
@customElement("plank-dropdown-menu-radio-group")
export class PlankDropdownMenuRadioGroup extends LitElement {
  @property({ type: String, reflect: true }) value = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-radio-group"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuRadioItem - A radio menu item
 */
@customElement("plank-dropdown-menu-radio-item")
export class PlankDropdownMenuRadioItem extends LitElement {
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
    this.dataset.slot = "dropdown-menu-radio-item"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuLabel - A label for menu items
 */
@customElement("plank-dropdown-menu-label")
export class PlankDropdownMenuLabel extends LitElement {
  @property({ type: Boolean, reflect: true }) inset = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-label"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuSeparator - A separator between menu items
 */
@customElement("plank-dropdown-menu-separator")
export class PlankDropdownMenuSeparator extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-separator"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuShortcut - A keyboard shortcut hint
 */
@customElement("plank-dropdown-menu-shortcut")
export class PlankDropdownMenuShortcut extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-shortcut"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuGroup - A group of menu items
 */
@customElement("plank-dropdown-menu-group")
export class PlankDropdownMenuGroup extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-group"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuSub - A submenu container
 */
@customElement("plank-dropdown-menu-sub")
export class PlankDropdownMenuSub extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-sub"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuSubTrigger - A trigger for submenu
 */
@customElement("plank-dropdown-menu-sub-trigger")
export class PlankDropdownMenuSubTrigger extends LitElement {
  @property({ type: Boolean, reflect: true }) inset = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-sub-trigger"
  }

  render() {
    return html``
  }
}

/**
 * PlankDropdownMenuSubContent - The content of a submenu
 */
@customElement("plank-dropdown-menu-sub-content")
export class PlankDropdownMenuSubContent extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "dropdown-menu-sub-content"
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-dropdown-menu": PlankDropdownMenu
    "plank-dropdown-menu-trigger": PlankDropdownMenuTrigger
    "plank-dropdown-menu-content": PlankDropdownMenuContent
    "plank-dropdown-menu-item": PlankDropdownMenuItem
    "plank-dropdown-menu-checkbox-item": PlankDropdownMenuCheckboxItem
    "plank-dropdown-menu-radio-group": PlankDropdownMenuRadioGroup
    "plank-dropdown-menu-radio-item": PlankDropdownMenuRadioItem
    "plank-dropdown-menu-label": PlankDropdownMenuLabel
    "plank-dropdown-menu-separator": PlankDropdownMenuSeparator
    "plank-dropdown-menu-shortcut": PlankDropdownMenuShortcut
    "plank-dropdown-menu-group": PlankDropdownMenuGroup
    "plank-dropdown-menu-sub": PlankDropdownMenuSub
    "plank-dropdown-menu-sub-trigger": PlankDropdownMenuSubTrigger
    "plank-dropdown-menu-sub-content": PlankDropdownMenuSubContent
  }
}
