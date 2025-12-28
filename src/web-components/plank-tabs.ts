import { LitElement, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { cn } from "@/lib/utils"

let tabsContentId = 0
let tabsTriggerId = 0

/**
 * PlankTabs - Container component that manages tab state
 *
 * @fires value-change - Fired when the value changes, with detail: { value: string }
 *
 * @example
 * ```html
 * <plank-tabs value="tab1">
 *   <plank-tabs-list>
 *     <plank-tabs-trigger value="tab1">Tab 1</plank-tabs-trigger>
 *     <plank-tabs-trigger value="tab2">Tab 2</plank-tabs-trigger>
 *   </plank-tabs-list>
 *   <plank-tabs-content value="tab1">Content 1</plank-tabs-content>
 *   <plank-tabs-content value="tab2">Content 2</plank-tabs-content>
 * </plank-tabs>
 * ```
 */
@customElement("plank-tabs")
export class PlankTabs extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "tabs"
    this.className = cn("flex flex-col gap-2", this.class)
  }

  updated() {
    this._updateChildren()
  }

  private _updateChildren() {
    const triggers = this.querySelectorAll("plank-tabs-trigger")
    const contents = this.querySelectorAll("plank-tabs-content")

    // Build a map of value -> trigger id and content id
    const triggerMap = new Map<string, PlankTabsTrigger>()
    const contentMap = new Map<string, PlankTabsContent>()

    triggers.forEach((t) => {
      const trigger = t as PlankTabsTrigger
      triggerMap.set(trigger.value, trigger)
    })

    contents.forEach((c) => {
      const content = c as PlankTabsContent
      contentMap.set(content.value, content)
    })

    // Update triggers
    triggers.forEach((t) => {
      const trigger = t as PlankTabsTrigger
      const isActive = trigger.value === this.value
      trigger._setActive(isActive)

      // Set aria-controls to content id
      const content = contentMap.get(trigger.value)
      if (content) {
        trigger._setContentId(content.id)
      }
    })

    // Update contents
    contents.forEach((c) => {
      const content = c as PlankTabsContent
      const isActive = content.value === this.value
      content._setActive(isActive)

      // Set aria-labelledby to trigger id
      const trigger = triggerMap.get(content.value)
      if (trigger) {
        content._setTriggerId(trigger.id)
      }
    })
  }

  _selectTab(value: string) {
    if (this.value !== value) {
      this.value = value
      this.dispatchEvent(
        new CustomEvent("value-change", {
          detail: { value: this.value },
          bubbles: true,
        })
      )
    }
  }

  render() {
    return html``
  }
}

/**
 * PlankTabsList - Container for tab triggers
 */
@customElement("plank-tabs-list")
export class PlankTabsList extends LitElement {
  @property({ type: String }) class: string = ""

  createRenderRoot() {
    return this
  }

  willUpdate() {
    this.dataset.slot = "tabs-list"
    this.setAttribute("role", "tablist")
    this.className = cn(
      "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
      this.class
    )
  }

  render() {
    return html``
  }
}

/**
 * PlankTabsTrigger - Button that selects a tab
 */
@customElement("plank-tabs-trigger")
export class PlankTabsTrigger extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: Boolean, reflect: true }) disabled = false
  private _active = false
  private _contentId = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Assign unique ID if not present
    if (!this.id) {
      this.id = `plank-tabs-trigger-${++tabsTriggerId}`
    }
    this.addEventListener("click", this._handleClick)
    this.addEventListener("keydown", this._handleKeydown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener("click", this._handleClick)
    this.removeEventListener("keydown", this._handleKeydown)
  }

  willUpdate() {
    this.dataset.slot = "tabs-trigger"
    this.dataset.state = this._active ? "active" : "inactive"
    this.setAttribute("role", "tab")
    this.setAttribute("tabindex", this._active ? "0" : "-1")
    this.setAttribute("aria-selected", String(this._active))
    if (this._contentId) {
      this.setAttribute("aria-controls", this._contentId)
    }
    this.className = cn(
      "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
    )
  }

  _setActive(active: boolean) {
    this._active = active
    this.requestUpdate()
  }

  _setContentId(id: string) {
    this._contentId = id
    this.requestUpdate()
  }

  private _handleClick = () => {
    if (this.disabled) return
    const tabs = this.closest("plank-tabs") as PlankTabs
    tabs?._selectTab(this.value)
  }

  private _handleKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      if (this.disabled) return
      const tabs = this.closest("plank-tabs") as PlankTabs
      tabs?._selectTab(this.value)
    } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault()
      this._navigateTabs(e.key === "ArrowRight" ? 1 : -1)
    }
  }

  private _navigateTabs(direction: 1 | -1) {
    const list = this.closest("plank-tabs-list")
    if (!list) return

    const triggers = Array.from(
      list.querySelectorAll("plank-tabs-trigger:not([disabled])")
    ) as PlankTabsTrigger[]
    const currentIndex = triggers.indexOf(this)
    if (currentIndex === -1) return

    let nextIndex = currentIndex + direction
    if (nextIndex < 0) nextIndex = triggers.length - 1
    if (nextIndex >= triggers.length) nextIndex = 0

    triggers[nextIndex].focus()
  }

  render() {
    return html``
  }
}

/**
 * PlankTabsContent - Content panel associated with a tab
 */
@customElement("plank-tabs-content")
export class PlankTabsContent extends LitElement {
  @property({ type: String, reflect: true }) value = ""
  @property({ type: String }) class: string = ""
  private _active = false
  private _triggerId = ""

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    if (!this.id) {
      this.id = `plank-tabs-content-${++tabsContentId}`
    }
  }

  willUpdate() {
    this.dataset.slot = "tabs-content"
    this.dataset.state = this._active ? "active" : "inactive"
    this.setAttribute("role", "tabpanel")
    if (this._triggerId) {
      this.setAttribute("aria-labelledby", this._triggerId)
    }
    if (this._active) {
      this.removeAttribute("hidden")
    } else {
      this.setAttribute("hidden", "")
    }
    this.className = cn(
      "flex-1 outline-none",
      this._active ? "block" : "",
      this.class
    )
  }

  _setActive(active: boolean) {
    this._active = active
    this.requestUpdate()
  }

  _setTriggerId(id: string) {
    this._triggerId = id
    this.requestUpdate()
  }

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-tabs": PlankTabs
    "plank-tabs-list": PlankTabsList
    "plank-tabs-trigger": PlankTabsTrigger
    "plank-tabs-content": PlankTabsContent
  }
}
