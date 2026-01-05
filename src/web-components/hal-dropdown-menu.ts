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
 * HalDropdownMenu - Root container that manages dropdown menu state
 *
 * @fires open-change - Fired when the menu opens or closes
 * @fires select - Fired when a menu item is selected
 * @fires checked-change - Fired when a checkbox item changes
 * @fires value-change - Fired when a radio group value changes
 *
 * @example
 * ```html
 * <hal-dropdown-menu>
 *   <hal-dropdown-menu-trigger>
 *     <button>Open</button>
 *   </hal-dropdown-menu-trigger>
 *   <hal-dropdown-menu-content>
 *     <hal-dropdown-menu-item>Item</hal-dropdown-menu-item>
 *   </hal-dropdown-menu-content>
 * </hal-dropdown-menu>
 * ```
 */
@customElement("hal-dropdown-menu")
export class HalDropdownMenu extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  private _trigger: HalDropdownMenuTrigger | null = null
  private _content: HalDropdownMenuContent | null = null
  private _contentId = `hal-dropdown-menu-content-${++dropdownMenuId}`

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
      "hal-dropdown-menu-trigger"
    ) as HalDropdownMenuTrigger | null
    this._content = this.querySelector(
      "hal-dropdown-menu-content"
    ) as HalDropdownMenuContent | null

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

  _dispatchSelect(item: HalDropdownMenuItem) {
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { item },
        bubbles: true,
      })
    )
  }

  _dispatchCheckedChange(item: HalDropdownMenuCheckboxItem, checked: boolean) {
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
 * HalDropdownMenuTrigger - Element that triggers the dropdown menu on click
 */
@customElement("hal-dropdown-menu-trigger")
export class HalDropdownMenuTrigger extends LitElement {
  private _dropdownMenu: HalDropdownMenu | null = null

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

  _setDropdownMenu(dropdownMenu: HalDropdownMenu) {
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
 * HalDropdownMenuContent - The floating dropdown menu content
 */
@customElement("hal-dropdown-menu-content")
export class HalDropdownMenuContent extends LitElement {
  @property({ type: String }) side: Side = "bottom"
  @property({ type: String }) align: Align = "start"
  @property({ type: Number }) sideOffset = 4
  @property({ type: String }) class: string = ""

  private _dropdownMenu: HalDropdownMenu | null = null
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

  _setDropdownMenu(dropdownMenu: HalDropdownMenu) {
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

    if (tagName === "hal-dropdown-menu-item") {
      return this._renderMenuItem(child as HalDropdownMenuItem)
    } else if (tagName === "hal-dropdown-menu-checkbox-item") {
      return this._renderCheckboxItem(child as HalDropdownMenuCheckboxItem)
    } else if (tagName === "hal-dropdown-menu-radio-group") {
      return this._renderRadioGroup(child as HalDropdownMenuRadioGroup)
    } else if (tagName === "hal-dropdown-menu-label") {
      return this._renderLabel(child as HalDropdownMenuLabel)
    } else if (tagName === "hal-dropdown-menu-separator") {
      return this._renderSeparator()
    } else if (tagName === "hal-dropdown-menu-group") {
      return this._renderGroup(child as HalDropdownMenuGroup)
    } else if (tagName === "hal-dropdown-menu-sub") {
      return this._renderSub(child as HalDropdownMenuSub)
    }

    return null
  }

  private _renderMenuItem(item: HalDropdownMenuItem): HTMLElement {
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
        if (element.tagName.toLowerCase() === "hal-dropdown-menu-shortcut") {
          el.appendChild(this._renderShortcut(element))
        } else {
          el.appendChild(element.cloneNode(true))
        }
      }
    })
  }

  private _renderCheckboxItem(item: HalDropdownMenuCheckboxItem): HTMLElement {
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

  private _renderRadioGroup(group: HalDropdownMenuRadioGroup): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "group")
    el.dataset.slot = "dropdown-menu-radio-group"

    const radioItems = group.querySelectorAll("hal-dropdown-menu-radio-item")
    radioItems.forEach((item) => {
      const radioEl = this._renderRadioItem(
        item as HalDropdownMenuRadioItem,
        group.value
      )
      el.appendChild(radioEl)
    })

    return el
  }

  private _renderRadioItem(
    item: HalDropdownMenuRadioItem,
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
        const radioGroup = item.closest("hal-dropdown-menu-radio-group") as
          | HalDropdownMenuRadioGroup
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

  private _renderLabel(item: HalDropdownMenuLabel): HTMLElement {
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

  private _renderGroup(group: HalDropdownMenuGroup): HTMLElement {
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

  private _renderSub(sub: HalDropdownMenuSub): HTMLElement {
    const el = document.createElement("div")
    el.dataset.slot = "dropdown-menu-sub"

    const subTrigger = sub.querySelector("hal-dropdown-menu-sub-trigger")
    const subContent = sub.querySelector("hal-dropdown-menu-sub-content")

    if (subTrigger) {
      const triggerEl = this._renderSubTrigger(
        subTrigger as HalDropdownMenuSubTrigger
      )
      el.appendChild(triggerEl)

      if (subContent && sub.open) {
        const contentEl = this._renderSubContent(
          subContent as HalDropdownMenuSubContent,
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

  private _renderSubTrigger(trigger: HalDropdownMenuSubTrigger): HTMLElement {
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
    content: HalDropdownMenuSubContent,
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
 * HalDropdownMenuItem - A menu item
 */
@customElement("hal-dropdown-menu-item")
export class HalDropdownMenuItem extends LitElement {
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
 * HalDropdownMenuCheckboxItem - A checkbox menu item
 */
@customElement("hal-dropdown-menu-checkbox-item")
export class HalDropdownMenuCheckboxItem extends LitElement {
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
 * HalDropdownMenuRadioGroup - A radio group container
 */
@customElement("hal-dropdown-menu-radio-group")
export class HalDropdownMenuRadioGroup extends LitElement {
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
 * HalDropdownMenuRadioItem - A radio menu item
 */
@customElement("hal-dropdown-menu-radio-item")
export class HalDropdownMenuRadioItem extends LitElement {
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
 * HalDropdownMenuLabel - A label for menu items
 */
@customElement("hal-dropdown-menu-label")
export class HalDropdownMenuLabel extends LitElement {
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
 * HalDropdownMenuSeparator - A separator between menu items
 */
@customElement("hal-dropdown-menu-separator")
export class HalDropdownMenuSeparator extends LitElement {
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
 * HalDropdownMenuShortcut - A keyboard shortcut hint
 */
@customElement("hal-dropdown-menu-shortcut")
export class HalDropdownMenuShortcut extends LitElement {
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
 * HalDropdownMenuGroup - A group of menu items
 */
@customElement("hal-dropdown-menu-group")
export class HalDropdownMenuGroup extends LitElement {
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
 * HalDropdownMenuSub - A submenu container
 */
@customElement("hal-dropdown-menu-sub")
export class HalDropdownMenuSub extends LitElement {
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
 * HalDropdownMenuSubTrigger - A trigger for submenu
 */
@customElement("hal-dropdown-menu-sub-trigger")
export class HalDropdownMenuSubTrigger extends LitElement {
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
 * HalDropdownMenuSubContent - The content of a submenu
 */
@customElement("hal-dropdown-menu-sub-content")
export class HalDropdownMenuSubContent extends LitElement {
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
    "hal-dropdown-menu": HalDropdownMenu
    "hal-dropdown-menu-trigger": HalDropdownMenuTrigger
    "hal-dropdown-menu-content": HalDropdownMenuContent
    "hal-dropdown-menu-item": HalDropdownMenuItem
    "hal-dropdown-menu-checkbox-item": HalDropdownMenuCheckboxItem
    "hal-dropdown-menu-radio-group": HalDropdownMenuRadioGroup
    "hal-dropdown-menu-radio-item": HalDropdownMenuRadioItem
    "hal-dropdown-menu-label": HalDropdownMenuLabel
    "hal-dropdown-menu-separator": HalDropdownMenuSeparator
    "hal-dropdown-menu-shortcut": HalDropdownMenuShortcut
    "hal-dropdown-menu-group": HalDropdownMenuGroup
    "hal-dropdown-menu-sub": HalDropdownMenuSub
    "hal-dropdown-menu-sub-trigger": HalDropdownMenuSubTrigger
    "hal-dropdown-menu-sub-content": HalDropdownMenuSubContent
  }
}
