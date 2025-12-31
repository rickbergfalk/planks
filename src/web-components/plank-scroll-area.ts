import { LitElement, html } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { cn } from "@/lib/utils"

/**
 * PlankScrollArea - A scrollable area with custom styled scrollbars
 *
 * @example
 * ```html
 * <plank-scroll-area class="h-72 w-48 rounded-md border">
 *   <div class="p-4">
 *     <!-- Long content here -->
 *   </div>
 * </plank-scroll-area>
 * ```
 */
@customElement("plank-scroll-area")
export class PlankScrollArea extends LitElement {
  @property({ type: String }) class: string = ""
  @property({ type: String }) type: "hover" | "scroll" | "auto" | "always" =
    "hover"
  @property({ type: Number, attribute: "scroll-hide-delay" })
  scrollHideDelay: number = 600

  @state() private _hasHorizontalScrollbar = false
  @state() private _hasVerticalScrollbar = false

  private _viewport: HTMLDivElement | null = null
  private _content: HTMLDivElement | null = null
  private _resizeObserver: ResizeObserver | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Inject global styles for viewport scrollbar hiding
    this._injectGlobalStyles()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._resizeObserver?.disconnect()
  }

  private _injectGlobalStyles() {
    const styleId = "plank-scroll-area-styles"
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style")
      style.id = styleId
      style.textContent = `
        [data-plank-scroll-viewport] {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        [data-plank-scroll-viewport]::-webkit-scrollbar {
          display: none;
        }
      `
      document.head.appendChild(style)
    }
  }

  firstUpdated() {
    this._viewport = this.querySelector("[data-plank-scroll-viewport]")
    this._content = this._viewport?.querySelector(
      "[data-plank-scroll-content]"
    ) as HTMLDivElement | null

    if (this._viewport && this._content) {
      this._setupResizeObserver()
      this._checkOverflow()
    }
  }

  private _setupResizeObserver() {
    this._resizeObserver = new ResizeObserver(() => {
      this._checkOverflow()
    })
    if (this._viewport) this._resizeObserver.observe(this._viewport)
    if (this._content) this._resizeObserver.observe(this._content)
  }

  private _checkOverflow() {
    if (!this._viewport) return
    this._hasHorizontalScrollbar =
      this._viewport.scrollWidth > this._viewport.clientWidth
    this._hasVerticalScrollbar =
      this._viewport.scrollHeight > this._viewport.clientHeight

    // Notify scrollbars
    this._notifyScrollbars()
  }

  private _notifyScrollbars() {
    const scrollbars = this.querySelectorAll("plank-scroll-bar")
    scrollbars.forEach((sb) => {
      const scrollbar = sb as PlankScrollBar
      if (scrollbar.orientation === "horizontal") {
        scrollbar._setEnabled(this._hasHorizontalScrollbar)
      } else {
        scrollbar._setEnabled(this._hasVerticalScrollbar)
      }
    })
  }

  getViewport(): HTMLDivElement | null {
    return this._viewport
  }

  willUpdate() {
    this.dataset.slot = "scroll-area"
    // Block display required for custom elements to size to content
    this.className = cn("block relative", this.class)
  }

  render() {
    return html``
  }
}

/**
 * PlankScrollAreaViewport - The scrollable viewport container
 */
@customElement("plank-scroll-area-viewport")
export class PlankScrollAreaViewport extends LitElement {
  @property({ type: String }) class: string = ""

  private _scrollArea: PlankScrollArea | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this._scrollArea = this.closest("plank-scroll-area") as PlankScrollArea

    // Wrap children in content div synchronously to ensure proper layout
    if (!this.querySelector("[data-plank-scroll-content]")) {
      const contentWrapper = document.createElement("div")
      contentWrapper.setAttribute("data-plank-scroll-content", "")
      contentWrapper.style.minWidth = "100%"
      contentWrapper.style.display = "table"
      while (this.firstChild) {
        contentWrapper.appendChild(this.firstChild)
      }
      this.appendChild(contentWrapper)
    }
  }

  willUpdate() {
    this.dataset.slot = "scroll-area-viewport"
    this.setAttribute("data-plank-scroll-viewport", "")

    // Check if vertical scrollbar exists to determine sizing behavior
    const hasVerticalScrollbar = this._scrollArea?.querySelector(
      'plank-scroll-bar:not([orientation="horizontal"])'
    )

    // Use size-full for vertical scrollbars, w-full for horizontal-only (lets height be content-driven)
    const sizeClasses = hasVerticalScrollbar ? "size-full" : "w-full"

    this.className = cn(
      "block",
      sizeClasses,
      "rounded-[inherit] outline-none",
      "focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-1",
      "transition-[color,box-shadow]",
      this.class
    )

    // Set overflow to scroll to match Radix behavior
    this.style.overflow = "scroll"
  }

  render() {
    return html``
  }
}

/**
 * PlankScrollBar - Custom scrollbar component
 */
@customElement("plank-scroll-bar")
export class PlankScrollBar extends LitElement {
  @property({ type: String }) orientation: "horizontal" | "vertical" =
    "vertical"
  @property({ type: String }) class: string = ""

  @state() private _enabled = false
  @state() private _thumbSize = 0
  @state() private _thumbOffset = 0
  @state() private _isVisible = false
  @state() private _isDragging = false

  private _viewport: HTMLDivElement | null = null
  private _thumb: HTMLDivElement | null = null
  private _scrollArea: PlankScrollArea | null = null
  private _dragStartPointer = 0
  private _dragStartScroll = 0
  private _hideTimeout: number | null = null
  private _resizeObserver: ResizeObserver | null = null

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this._scrollArea = this.closest("plank-scroll-area") as PlankScrollArea
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._resizeObserver?.disconnect()
    if (this._hideTimeout) {
      window.clearTimeout(this._hideTimeout)
    }
  }

  firstUpdated() {
    this._viewport = this._scrollArea?.getViewport() || null
    this._thumb = this.querySelector("[data-scroll-thumb]")

    if (this._viewport) {
      this._viewport.addEventListener("scroll", this._handleScroll)
      this._setupResizeObserver()
      this._updateThumb()

      // Handle hover visibility
      const scrollArea = this._scrollArea
      if (scrollArea?.type === "hover") {
        scrollArea.addEventListener("pointerenter", this._handlePointerEnter)
        scrollArea.addEventListener("pointerleave", this._handlePointerLeave)
      } else if (scrollArea?.type === "always") {
        this._isVisible = true
      }
    }
  }

  private _setupResizeObserver() {
    this._resizeObserver = new ResizeObserver(() => {
      this._updateThumb()
    })
    if (this._viewport) {
      this._resizeObserver.observe(this._viewport)
      const content = this._viewport.querySelector(
        "[data-plank-scroll-content]"
      )
      if (content) {
        this._resizeObserver.observe(content)
      }
    }
  }

  _setEnabled(enabled: boolean) {
    this._enabled = enabled
    if (enabled) {
      this._updateThumb()
    }
  }

  private _handleScroll = () => {
    this._updateThumb()

    // Show scrollbar on scroll
    if (
      this._scrollArea?.type === "scroll" ||
      this._scrollArea?.type === "auto"
    ) {
      this._isVisible = true
      this._scheduleHide()
    }
  }

  private _handlePointerEnter = () => {
    if (this._hideTimeout) {
      window.clearTimeout(this._hideTimeout)
      this._hideTimeout = null
    }
    this._isVisible = true
  }

  private _handlePointerLeave = () => {
    this._scheduleHide()
  }

  private _scheduleHide() {
    if (this._hideTimeout) {
      window.clearTimeout(this._hideTimeout)
    }
    this._hideTimeout = window.setTimeout(() => {
      if (!this._isDragging) {
        this._isVisible = false
      }
    }, this._scrollArea?.scrollHideDelay || 600)
  }

  private _updateThumb() {
    if (!this._viewport) return

    const isHorizontal = this.orientation === "horizontal"
    const viewportSize = isHorizontal
      ? this._viewport.clientWidth
      : this._viewport.clientHeight
    const contentSize = isHorizontal
      ? this._viewport.scrollWidth
      : this._viewport.scrollHeight
    const scrollPos = isHorizontal
      ? this._viewport.scrollLeft
      : this._viewport.scrollTop

    // Calculate thumb size (minimum 18px)
    const ratio = viewportSize / contentSize
    const scrollbarSize = isHorizontal ? this.clientWidth : this.clientHeight
    this._thumbSize = Math.max(scrollbarSize * ratio, 18)

    // Calculate thumb offset
    const maxScrollPos = contentSize - viewportSize
    const maxThumbPos = scrollbarSize - this._thumbSize
    if (maxScrollPos > 0) {
      this._thumbOffset = (scrollPos / maxScrollPos) * maxThumbPos
    } else {
      this._thumbOffset = 0
    }

    // Update thumb element directly for performance
    if (this._thumb) {
      if (isHorizontal) {
        this._thumb.style.width = `${this._thumbSize}px`
        this._thumb.style.transform = `translate3d(${this._thumbOffset}px, 0, 0)`
      } else {
        this._thumb.style.height = `${this._thumbSize}px`
        this._thumb.style.transform = `translate3d(0, ${this._thumbOffset}px, 0)`
      }
    }
  }

  private _handleThumbPointerDown = (e: PointerEvent) => {
    if (e.button !== 0) return // Only left mouse button

    e.preventDefault()
    this._isDragging = true

    const thumb = e.target as HTMLElement
    thumb.setPointerCapture(e.pointerId)

    const isHorizontal = this.orientation === "horizontal"
    this._dragStartPointer = isHorizontal ? e.clientX : e.clientY
    this._dragStartScroll = isHorizontal
      ? this._viewport?.scrollLeft || 0
      : this._viewport?.scrollTop || 0

    document.body.style.userSelect = "none"
  }

  private _handleThumbPointerMove = (e: PointerEvent) => {
    if (!this._isDragging || !this._viewport) return

    const isHorizontal = this.orientation === "horizontal"
    const pointerPos = isHorizontal ? e.clientX : e.clientY
    const pointerDelta = pointerPos - this._dragStartPointer

    // Calculate scroll delta based on thumb/content ratio
    const viewportSize = isHorizontal
      ? this._viewport.clientWidth
      : this._viewport.clientHeight
    const contentSize = isHorizontal
      ? this._viewport.scrollWidth
      : this._viewport.scrollHeight
    const scrollbarSize = isHorizontal ? this.clientWidth : this.clientHeight

    const scrollRatio =
      (contentSize - viewportSize) / (scrollbarSize - this._thumbSize)
    const scrollDelta = pointerDelta * scrollRatio

    if (isHorizontal) {
      this._viewport.scrollLeft = this._dragStartScroll + scrollDelta
    } else {
      this._viewport.scrollTop = this._dragStartScroll + scrollDelta
    }
  }

  private _handleThumbPointerUp = (e: PointerEvent) => {
    this._isDragging = false

    const thumb = e.target as HTMLElement
    if (thumb.hasPointerCapture(e.pointerId)) {
      thumb.releasePointerCapture(e.pointerId)
    }

    document.body.style.userSelect = ""

    // Schedule hide after drag ends
    if (this._scrollArea?.type !== "always") {
      this._scheduleHide()
    }
  }

  private _handleTrackPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 || !this._viewport) return

    // Check if click was on thumb
    const thumb = this.querySelector("[data-scroll-thumb]")
    if (thumb && thumb.contains(e.target as Node)) return

    const rect = this.getBoundingClientRect()
    const isHorizontal = this.orientation === "horizontal"
    const clickPos = isHorizontal ? e.clientX - rect.left : e.clientY - rect.top

    // Jump to clicked position
    const viewportSize = isHorizontal
      ? this._viewport.clientWidth
      : this._viewport.clientHeight
    const contentSize = isHorizontal
      ? this._viewport.scrollWidth
      : this._viewport.scrollHeight
    const scrollbarSize = isHorizontal ? this.clientWidth : this.clientHeight

    // Center the thumb at click position
    const thumbCenter = this._thumbSize / 2
    const targetThumbPos = clickPos - thumbCenter
    const maxThumbPos = scrollbarSize - this._thumbSize
    const clampedThumbPos = Math.max(0, Math.min(targetThumbPos, maxThumbPos))

    const scrollRatio = (contentSize - viewportSize) / maxThumbPos
    const newScrollPos = clampedThumbPos * scrollRatio

    if (isHorizontal) {
      this._viewport.scrollLeft = newScrollPos
    } else {
      this._viewport.scrollTop = newScrollPos
    }
  }

  willUpdate() {
    this.dataset.slot = "scroll-bar"
    this.setAttribute("data-orientation", this.orientation)

    const baseClass = cn(
      "flex touch-none p-px transition-colors select-none",
      this.orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent",
      this.orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent",
      this.class
    )

    this.className = baseClass

    // Position the scrollbar
    this.style.position = "absolute"
    if (this.orientation === "vertical") {
      this.style.top = "0"
      this.style.right = "0"
      this.style.bottom = "0"
    } else {
      this.style.bottom = "0"
      this.style.left = "0"
      this.style.right = "0"
    }

    // Visibility
    const showScrollbar =
      this._enabled && (this._isVisible || this._scrollArea?.type === "always")
    this.style.opacity = showScrollbar ? "1" : "0"
    this.style.pointerEvents = showScrollbar ? "auto" : "none"
    this.setAttribute("data-state", showScrollbar ? "visible" : "hidden")
  }

  render() {
    const thumbClass = cn("bg-border relative flex-1 rounded-full")

    return html`
      <div
        class=${thumbClass}
        data-scroll-thumb
        data-state=${this._enabled ? "visible" : "hidden"}
        @pointerdown=${this._handleThumbPointerDown}
        @pointermove=${this._handleThumbPointerMove}
        @pointerup=${this._handleThumbPointerUp}
      ></div>
    `
  }

  updated() {
    // Add track click handler
    this.removeEventListener("pointerdown", this._handleTrackPointerDown)
    this.addEventListener("pointerdown", this._handleTrackPointerDown)
  }
}

/**
 * PlankScrollAreaCorner - Corner element when both scrollbars are visible
 */
@customElement("plank-scroll-area-corner")
export class PlankScrollAreaCorner extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "scroll-area-corner"
    this.className = cn("bg-background", this.class)
    this.style.position = "absolute"
    this.style.right = "0"
    this.style.bottom = "0"
    this.style.width = "10px"
    this.style.height = "10px"
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-scroll-area": PlankScrollArea
    "plank-scroll-area-viewport": PlankScrollAreaViewport
    "plank-scroll-bar": PlankScrollBar
    "plank-scroll-area-corner": PlankScrollAreaCorner
  }
}
