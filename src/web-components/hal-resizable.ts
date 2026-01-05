import { LitElement, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * HalResizablePanelGroup - Container for resizable panels
 *
 * @example
 * ```html
 * <hal-resizable-panel-group direction="horizontal" class="rounded-lg border">
 *   <hal-resizable-panel default-size="50">
 *     <div>Panel 1</div>
 *   </hal-resizable-panel>
 *   <hal-resizable-handle></hal-resizable-handle>
 *   <hal-resizable-panel default-size="50">
 *     <div>Panel 2</div>
 *   </hal-resizable-panel>
 * </hal-resizable-panel-group>
 * ```
 */
@customElement("hal-resizable-panel-group")
export class HalResizablePanelGroup extends LitElement {
  @property({ type: String }) direction: "horizontal" | "vertical" =
    "horizontal"
  @property({ type: String }) class: string = ""

  // Not using @state since these don't need to trigger re-renders
  private _panels: HalResizablePanel[] = []
  private _handles: HalResizableHandle[] = []

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Set direction attribute for data attribute selectors
    this.setAttribute("data-panel-group-direction", this.direction)
  }

  firstUpdated() {
    this._collectPanels()
    this._initializePanelSizes()
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has("direction")) {
      this.setAttribute("data-panel-group-direction", this.direction)
      this._updatePanelLayout()
    }
  }

  private _collectPanels() {
    this._panels = Array.from(
      this.querySelectorAll(":scope > hal-resizable-panel")
    ) as HalResizablePanel[]
    this._handles = Array.from(
      this.querySelectorAll(":scope > hal-resizable-handle")
    ) as HalResizableHandle[]

    // Register panels and handles with this group
    this._panels.forEach((panel) => {
      panel._setGroup(this)
    })
    this._handles.forEach((handle, index) => {
      handle._setGroup(this, index)
    })
  }

  private _initializePanelSizes() {
    // Calculate total default size
    let totalSize = 0
    const panelsWithoutDefault: HalResizablePanel[] = []

    this._panels.forEach((panel) => {
      if (panel.defaultSize !== undefined) {
        totalSize += panel.defaultSize
      } else {
        panelsWithoutDefault.push(panel)
      }
    })

    // Distribute remaining size to panels without default
    if (panelsWithoutDefault.length > 0) {
      const remainingSize = 100 - totalSize
      const sizePerPanel = remainingSize / panelsWithoutDefault.length
      panelsWithoutDefault.forEach((panel) => {
        panel._setSize(sizePerPanel)
      })
    }

    // Set initial sizes
    this._panels.forEach((panel) => {
      if (panel.defaultSize !== undefined && panel._size === 0) {
        panel._setSize(panel.defaultSize)
      }
    })

    this._updatePanelLayout()
  }

  private _updatePanelLayout() {
    this._panels.forEach((panel) => {
      panel._updateLayout()
    })
  }

  _handleResize(handleIndex: number, delta: number) {
    const panelBefore = this._panels[handleIndex]
    const panelAfter = this._panels[handleIndex + 1]

    if (!panelBefore || !panelAfter) return

    const isHorizontal = this.direction === "horizontal"
    const groupSize = isHorizontal ? this.offsetWidth : this.offsetHeight
    const deltaPercent = (delta / groupSize) * 100

    const newSizeBefore = panelBefore._size + deltaPercent
    const newSizeAfter = panelAfter._size - deltaPercent

    // Respect min/max constraints
    const minBefore = panelBefore.minSize ?? 0
    const maxBefore = panelBefore.maxSize ?? 100
    const minAfter = panelAfter.minSize ?? 0
    const maxAfter = panelAfter.maxSize ?? 100

    if (
      newSizeBefore >= minBefore &&
      newSizeBefore <= maxBefore &&
      newSizeAfter >= minAfter &&
      newSizeAfter <= maxAfter
    ) {
      panelBefore._setSize(newSizeBefore)
      panelAfter._setSize(newSizeAfter)
      this._updatePanelLayout()

      this.dispatchEvent(
        new CustomEvent("resize", {
          detail: {
            sizes: this._panels.map((p) => p._size),
          },
          bubbles: true,
        })
      )
    }
  }

  getDirection(): "horizontal" | "vertical" {
    return this.direction
  }

  willUpdate() {
    this.dataset.slot = "resizable-panel-group"
    this.className = cn(
      "flex h-full w-full",
      this.direction === "vertical" && "flex-col",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * HalResizablePanel - A resizable panel within a group
 */
@customElement("hal-resizable-panel")
export class HalResizablePanel extends LitElement {
  @property({ type: Number, attribute: "default-size" }) defaultSize?: number
  @property({ type: Number, attribute: "min-size" }) minSize?: number
  @property({ type: Number, attribute: "max-size" }) maxSize?: number
  @property({ type: String }) class: string = ""

  @state() _size: number = 0

  private _group: HalResizablePanelGroup | null = null

  createRenderRoot() {
    return this
  }

  _setGroup(group: HalResizablePanelGroup) {
    this._group = group
  }

  _setSize(size: number) {
    this._size = size
  }

  _updateLayout() {
    const direction = this._group?.getDirection() ?? "horizontal"
    if (direction === "horizontal") {
      this.style.width = `${this._size}%`
      this.style.height = ""
    } else {
      this.style.height = `${this._size}%`
      this.style.width = ""
    }
  }

  willUpdate() {
    this.dataset.slot = "resizable-panel"
  }

  render() {
    return html``
  }
}

/**
 * HalResizableHandle - A drag handle for resizing panels
 */
@customElement("hal-resizable-handle")
export class HalResizableHandle extends LitElement {
  @property({ type: Boolean, attribute: "with-handle" }) withHandle = false
  @property({ type: String }) class: string = ""

  @state() private _isDragging = false

  private _group: HalResizablePanelGroup | null = null
  private _handleIndex: number = 0
  private _startPos: number = 0

  createRenderRoot() {
    return this
  }

  _setGroup(group: HalResizablePanelGroup, index: number) {
    this._group = group
    this._handleIndex = index
  }

  private _handlePointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return

    e.preventDefault()
    this._isDragging = true
    this.setPointerCapture(e.pointerId)

    const direction = this._group?.getDirection() ?? "horizontal"
    this._startPos = direction === "horizontal" ? e.clientX : e.clientY

    document.body.style.cursor =
      direction === "horizontal" ? "col-resize" : "row-resize"
    document.body.style.userSelect = "none"

    this.setAttribute("data-state", "dragging")
  }

  private _handlePointerMove = (e: PointerEvent) => {
    if (!this._isDragging || !this._group) return

    const direction = this._group.getDirection()
    const currentPos = direction === "horizontal" ? e.clientX : e.clientY
    const delta = currentPos - this._startPos
    this._startPos = currentPos

    this._group._handleResize(this._handleIndex, delta)
  }

  private _handlePointerUp = (e: PointerEvent) => {
    if (!this._isDragging) return

    this._isDragging = false
    this.releasePointerCapture(e.pointerId)

    document.body.style.cursor = ""
    document.body.style.userSelect = ""

    this.removeAttribute("data-state")
  }

  private _handleKeyDown = (e: KeyboardEvent) => {
    if (!this._group) return

    const direction = this._group.getDirection()
    const step = e.shiftKey ? 10 : 1
    let delta = 0

    if (direction === "horizontal") {
      if (e.key === "ArrowLeft") delta = -step
      else if (e.key === "ArrowRight") delta = step
    } else {
      if (e.key === "ArrowUp") delta = -step
      else if (e.key === "ArrowDown") delta = step
    }

    if (delta !== 0) {
      e.preventDefault()
      // Convert step to pixels (assume roughly 5px per step)
      const groupSize =
        direction === "horizontal"
          ? this._group.offsetWidth
          : this._group.offsetHeight
      const pixelDelta = (delta / 100) * groupSize
      this._group._handleResize(this._handleIndex, pixelDelta)
    }
  }

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute("tabindex", "0")
    this.setAttribute("role", "separator")
    this.addEventListener("pointerdown", this._handlePointerDown)
    this.addEventListener("pointermove", this._handlePointerMove)
    this.addEventListener("pointerup", this._handlePointerUp)
    this.addEventListener("keydown", this._handleKeyDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("pointerdown", this._handlePointerDown)
    this.removeEventListener("pointermove", this._handlePointerMove)
    this.removeEventListener("pointerup", this._handlePointerUp)
    this.removeEventListener("keydown", this._handleKeyDown)
  }

  willUpdate() {
    this.dataset.slot = "resizable-handle"

    const direction = this._group?.getDirection() ?? "horizontal"
    this.setAttribute("data-panel-group-direction", direction)
    this.setAttribute("aria-orientation", direction)

    // Using data attribute variants to match React exactly
    this.className = cn(
      "bg-border focus-visible:ring-ring relative flex w-px items-center justify-center",
      "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
      "focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:outline-hidden",
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
      "data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1",
      "data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:translate-x-0",
      "data-[panel-group-direction=vertical]:after:-translate-y-1/2",
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      // Cursor classes need JS conditional since they're not data-attribute based in React
      direction === "horizontal" ? "cursor-col-resize" : "cursor-row-resize",
      this.class
    )
  }

  render() {
    if (!this.withHandle) {
      return html``
    }

    // Rotation is handled by CSS selector [&[data-panel-group-direction=vertical]>div]:rotate-90
    return html`
      <div
        class="bg-border z-10 flex h-4 w-3 items-center justify-center rounded-xs border"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="size-2.5"
        >
          <circle cx="9" cy="12" r="1" />
          <circle cx="9" cy="5" r="1" />
          <circle cx="9" cy="19" r="1" />
          <circle cx="15" cy="12" r="1" />
          <circle cx="15" cy="5" r="1" />
          <circle cx="15" cy="19" r="1" />
        </svg>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "hal-resizable-panel-group": HalResizablePanelGroup
    "hal-resizable-panel": HalResizablePanel
    "hal-resizable-handle": HalResizableHandle
  }
}
