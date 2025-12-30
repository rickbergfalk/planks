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
import type { Placement, VirtualElement } from "@floating-ui/dom"
import { cn } from "@/lib/utils"

let contextMenuId = 0

type Side = "top" | "right" | "bottom" | "left"
type Align = "start" | "center" | "end"

/**
 * PlankContextMenu - Root container that manages context menu state
 *
 * @fires open-change - Fired when the menu opens or closes
 * @fires select - Fired when a menu item is selected
 * @fires checked-change - Fired when a checkbox item changes
 * @fires value-change - Fired when a radio group value changes
 *
 * @example
 * ```html
 * <plank-context-menu>
 *   <plank-context-menu-trigger>
 *     <div>Right click here</div>
 *   </plank-context-menu-trigger>
 *   <plank-context-menu-content>
 *     <plank-context-menu-item>Item</plank-context-menu-item>
 *   </plank-context-menu-content>
 * </plank-context-menu>
 * ```
 */
@customElement("plank-context-menu")
export class PlankContextMenu extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  private _trigger: PlankContextMenuTrigger | null = null
  private _content: PlankContextMenuContent | null = null
  private _contentId = `plank-context-menu-content-${++contextMenuId}`
  private _clickPosition: { x: number; y: number } = { x: 0, y: 0 }

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "context-menu"
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
      "plank-context-menu-trigger"
    ) as PlankContextMenuTrigger | null
    this._content = this.querySelector(
      "plank-context-menu-content"
    ) as PlankContextMenuContent | null

    if (this._trigger) {
      this._trigger._setContextMenu(this)
    }
    if (this._content) {
      this._content._setContextMenu(this)
      this._content._setId(this._contentId)
      this._content._updateOpenState(this.open, this._clickPosition)
    }
  }

  _openAtPosition(x: number, y: number) {
    this._clickPosition = { x, y }
    this._setOpen(true)
  }

  _close() {
    this._setOpen(false)
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

  _getClickPosition() {
    return this._clickPosition
  }

  _dispatchSelect(item: PlankContextMenuItem) {
    this.dispatchEvent(
      new CustomEvent("select", {
        detail: { item },
        bubbles: true,
      })
    )
  }

  _dispatchCheckedChange(item: PlankContextMenuCheckboxItem, checked: boolean) {
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
 * PlankContextMenuTrigger - Element that triggers the context menu on right-click
 */
@customElement("plank-context-menu-trigger")
export class PlankContextMenuTrigger extends LitElement {
  private _contextMenu: PlankContextMenu | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "contents"
    this.addEventListener("contextmenu", this._handleContextMenu)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("contextmenu", this._handleContextMenu)
  }

  willUpdate() {
    this.dataset.slot = "context-menu-trigger"
  }

  _setContextMenu(contextMenu: PlankContextMenu) {
    this._contextMenu = contextMenu
  }

  private _handleContextMenu = (e: MouseEvent) => {
    e.preventDefault()
    this._contextMenu?._openAtPosition(e.clientX, e.clientY)
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuContent - The floating context menu content
 */
@customElement("plank-context-menu-content")
export class PlankContextMenuContent extends LitElement {
  @property({ type: String }) side: Side = "right"
  @property({ type: String }) align: Align = "start"
  @property({ type: Number }) sideOffset = 2
  @property({ type: String }) class: string = ""

  private _contextMenu: PlankContextMenu | null = null
  private _portal: HTMLDivElement | null = null
  private _contentEl: HTMLDivElement | null = null
  private _cleanup: (() => void) | null = null
  private _id = ""
  private _placedSide: Side = "right"
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
    this.dataset.slot = "context-menu-content"
  }

  _setContextMenu(contextMenu: PlankContextMenu) {
    this._contextMenu = contextMenu
  }

  _setId(id: string) {
    this._id = id
  }

  _updateOpenState(open: boolean, position?: { x: number; y: number }) {
    if (open) {
      this._showContent(position)
    } else {
      this._hideContent()
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._hideContent()
  }

  private _showContent(position?: { x: number; y: number }) {
    if (this._portal) return

    const clickPos = position ||
      this._contextMenu?._getClickPosition() || { x: 0, y: 0 }

    // Create portal container
    this._portal = document.createElement("div")
    this._portal.style.cssText =
      "position: fixed; top: 0; left: 0; z-index: 50;"

    // Create content element
    this._contentEl = document.createElement("div")
    this._contentEl.id = this._id
    this._contentEl.setAttribute("role", "menu")
    this._contentEl.setAttribute("tabindex", "-1")
    this._contentEl.dataset.slot = "context-menu-content"
    this._contentEl.dataset.state = "open"
    this._contentEl.dataset.side = this.side
    this._contentEl.className = cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-context-menu-content-available-height) min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
      this.class
    )
    this._contentEl.style.cssText = "position: fixed; top: 0; left: 0;"

    // Render menu items into content element
    this._renderItems()

    this._portal.appendChild(this._contentEl)
    document.body.appendChild(this._portal)

    // Create virtual element at click position for Floating UI
    const virtualEl: VirtualElement = {
      getBoundingClientRect: () => ({
        width: 0,
        height: 0,
        x: clickPos.x,
        y: clickPos.y,
        top: clickPos.y,
        left: clickPos.x,
        right: clickPos.x,
        bottom: clickPos.y,
      }),
    }

    // Set up positioning
    if (this._contentEl) {
      this._cleanup = autoUpdate(virtualEl, this._contentEl, () => {
        this._updatePosition(virtualEl)
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

    if (tagName === "plank-context-menu-item") {
      return this._renderMenuItem(child as PlankContextMenuItem)
    } else if (tagName === "plank-context-menu-checkbox-item") {
      return this._renderCheckboxItem(child as PlankContextMenuCheckboxItem)
    } else if (tagName === "plank-context-menu-radio-group") {
      return this._renderRadioGroup(child as PlankContextMenuRadioGroup)
    } else if (tagName === "plank-context-menu-label") {
      return this._renderLabel(child as PlankContextMenuLabel)
    } else if (tagName === "plank-context-menu-separator") {
      return this._renderSeparator()
    } else if (tagName === "plank-context-menu-group") {
      return this._renderGroup(child as PlankContextMenuGroup)
    } else if (tagName === "plank-context-menu-sub") {
      return this._renderSub(child as PlankContextMenuSub)
    }

    return null
  }

  private _renderMenuItem(item: PlankContextMenuItem): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menuitem")
    el.setAttribute("tabindex", "-1")
    el.dataset.slot = "context-menu-item"

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
        this._contextMenu?._dispatchSelect(item)
        this._contextMenu?._close()
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
        if (element.tagName.toLowerCase() === "plank-context-menu-shortcut") {
          el.appendChild(this._renderShortcut(element))
        } else {
          el.appendChild(element.cloneNode(true))
        }
      }
    })
  }

  private _renderCheckboxItem(item: PlankContextMenuCheckboxItem): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menuitemcheckbox")
    el.setAttribute("tabindex", "-1")
    el.setAttribute("aria-checked", String(item.checked))
    el.dataset.slot = "context-menu-checkbox-item"

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
        this._contextMenu?._dispatchCheckedChange(item, newChecked)
        // Don't close menu for checkbox items
      })
      el.addEventListener("pointerenter", () => {
        this._highlightItem(el)
      })
    }

    return el
  }

  private _renderRadioGroup(group: PlankContextMenuRadioGroup): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "group")
    el.dataset.slot = "context-menu-radio-group"

    const radioItems = group.querySelectorAll("plank-context-menu-radio-item")
    radioItems.forEach((item) => {
      const radioEl = this._renderRadioItem(
        item as PlankContextMenuRadioItem,
        group.value
      )
      el.appendChild(radioEl)
    })

    return el
  }

  private _renderRadioItem(
    item: PlankContextMenuRadioItem,
    groupValue: string
  ): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menuitemradio")
    el.setAttribute("tabindex", "-1")
    const isChecked = item.value === groupValue
    el.setAttribute("aria-checked", String(isChecked))
    el.dataset.slot = "context-menu-radio-item"

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
        const radioGroup = item.closest("plank-context-menu-radio-group") as
          | PlankContextMenuRadioGroup
          | undefined
        if (radioGroup) {
          radioGroup.value = item.value
          this._contextMenu?._dispatchValueChange(item.value)
        }
        this._contextMenu?._close()
      })
      el.addEventListener("pointerenter", () => {
        this._highlightItem(el)
      })
    }

    return el
  }

  private _renderLabel(item: PlankContextMenuLabel): HTMLElement {
    const el = document.createElement("div")
    el.dataset.slot = "context-menu-label"

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
    el.dataset.slot = "context-menu-separator"
    el.className = cn("bg-border -mx-1 my-1 h-px")

    return el
  }

  private _renderShortcut(item: HTMLElement): HTMLElement {
    const el = document.createElement("span")
    el.dataset.slot = "context-menu-shortcut"
    el.className = cn("text-muted-foreground ml-auto text-xs tracking-widest")
    el.textContent = item.textContent?.trim() || ""

    return el
  }

  private _renderGroup(group: PlankContextMenuGroup): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "group")
    el.dataset.slot = "context-menu-group"

    Array.from(group.children).forEach((child) => {
      const renderedChild = this._renderChild(child as HTMLElement)
      if (renderedChild) {
        el.appendChild(renderedChild)
      }
    })

    return el
  }

  private _renderSub(sub: PlankContextMenuSub): HTMLElement {
    const el = document.createElement("div")
    el.dataset.slot = "context-menu-sub"

    const subTrigger = sub.querySelector("plank-context-menu-sub-trigger")
    const subContent = sub.querySelector("plank-context-menu-sub-content")

    if (subTrigger) {
      const triggerEl = this._renderSubTrigger(
        subTrigger as PlankContextMenuSubTrigger
      )
      el.appendChild(triggerEl)

      if (subContent && sub.open) {
        const contentEl = this._renderSubContent(
          subContent as PlankContextMenuSubContent,
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

  private _renderSubTrigger(trigger: PlankContextMenuSubTrigger): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menuitem")
    el.setAttribute("tabindex", "-1")
    el.dataset.slot = "context-menu-sub-trigger"

    if (trigger.inset) {
      el.dataset.inset = ""
    }

    el.className = cn(
      "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
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
    content: PlankContextMenuSubContent,
    triggerEl: HTMLElement
  ): HTMLElement {
    const el = document.createElement("div")
    el.setAttribute("role", "menu")
    el.dataset.slot = "context-menu-sub-content"
    el.dataset.state = "open"
    el.dataset.side = "right"

    el.className = cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-context-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg"
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

  private async _updatePosition(virtualEl: VirtualElement) {
    if (!this._contentEl) return

    const { x, y, placement } = await computePosition(
      virtualEl,
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

    this._contextMenu?._close()
  }

  private _handleEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault()
      this._contextMenu?._close()
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
 * PlankContextMenuItem - A menu item
 */
@customElement("plank-context-menu-item")
export class PlankContextMenuItem extends LitElement {
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
    this.dataset.slot = "context-menu-item"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuCheckboxItem - A checkbox menu item
 */
@customElement("plank-context-menu-checkbox-item")
export class PlankContextMenuCheckboxItem extends LitElement {
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
    this.dataset.slot = "context-menu-checkbox-item"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuRadioGroup - A radio group container
 */
@customElement("plank-context-menu-radio-group")
export class PlankContextMenuRadioGroup extends LitElement {
  @property({ type: String, reflect: true }) value = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "context-menu-radio-group"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuRadioItem - A radio menu item
 */
@customElement("plank-context-menu-radio-item")
export class PlankContextMenuRadioItem extends LitElement {
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
    this.dataset.slot = "context-menu-radio-item"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuLabel - A label for menu items
 */
@customElement("plank-context-menu-label")
export class PlankContextMenuLabel extends LitElement {
  @property({ type: Boolean, reflect: true }) inset = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "context-menu-label"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuSeparator - A separator between menu items
 */
@customElement("plank-context-menu-separator")
export class PlankContextMenuSeparator extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "context-menu-separator"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuShortcut - A keyboard shortcut hint
 */
@customElement("plank-context-menu-shortcut")
export class PlankContextMenuShortcut extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "context-menu-shortcut"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuGroup - A group of menu items
 */
@customElement("plank-context-menu-group")
export class PlankContextMenuGroup extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "context-menu-group"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuSub - A submenu container
 */
@customElement("plank-context-menu-sub")
export class PlankContextMenuSub extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "context-menu-sub"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuSubTrigger - A trigger for submenu
 */
@customElement("plank-context-menu-sub-trigger")
export class PlankContextMenuSubTrigger extends LitElement {
  @property({ type: Boolean, reflect: true }) inset = false

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "context-menu-sub-trigger"
  }

  render() {
    return html``
  }
}

/**
 * PlankContextMenuSubContent - The content of a submenu
 */
@customElement("plank-context-menu-sub-content")
export class PlankContextMenuSubContent extends LitElement {
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this.style.display = "none"
  }

  willUpdate() {
    this.dataset.slot = "context-menu-sub-content"
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-context-menu": PlankContextMenu
    "plank-context-menu-trigger": PlankContextMenuTrigger
    "plank-context-menu-content": PlankContextMenuContent
    "plank-context-menu-item": PlankContextMenuItem
    "plank-context-menu-checkbox-item": PlankContextMenuCheckboxItem
    "plank-context-menu-radio-group": PlankContextMenuRadioGroup
    "plank-context-menu-radio-item": PlankContextMenuRadioItem
    "plank-context-menu-label": PlankContextMenuLabel
    "plank-context-menu-separator": PlankContextMenuSeparator
    "plank-context-menu-shortcut": PlankContextMenuShortcut
    "plank-context-menu-group": PlankContextMenuGroup
    "plank-context-menu-sub": PlankContextMenuSub
    "plank-context-menu-sub-trigger": PlankContextMenuSubTrigger
    "plank-context-menu-sub-content": PlankContextMenuSubContent
  }
}
