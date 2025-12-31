import { LitElement, html, TemplateResult, nothing } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { cn } from "@/lib/utils"

export interface ToastOptions {
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface Toast {
  id: string
  type: "default" | "success" | "info" | "warning" | "error" | "loading"
  message: string
  description?: string
  duration: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Global toast state
let toasterInstance: PlankToaster | null = null
const toastQueue: Toast[] = []

// Toast API - similar to sonner's API
export const toast = Object.assign(
  (message: string, options?: ToastOptions) => {
    return addToast("default", message, options)
  },
  {
    success: (message: string, options?: ToastOptions) =>
      addToast("success", message, options),
    info: (message: string, options?: ToastOptions) =>
      addToast("info", message, options),
    warning: (message: string, options?: ToastOptions) =>
      addToast("warning", message, options),
    error: (message: string, options?: ToastOptions) =>
      addToast("error", message, options),
    loading: (message: string, options?: ToastOptions) =>
      addToast("loading", message, options),
    dismiss: (id?: string) => {
      if (toasterInstance) {
        if (id) {
          toasterInstance._removeToast(id)
        } else {
          toasterInstance._clearAll()
        }
      }
    },
    promise: async <T>(
      promise: Promise<T> | (() => Promise<T>),
      opts: {
        loading: string
        success: string | ((data: T) => string)
        error: string | ((err: unknown) => string)
      }
    ): Promise<T> => {
      const id = addToast("loading", opts.loading)
      try {
        const result = await (typeof promise === "function"
          ? promise()
          : promise)
        if (toasterInstance) {
          toasterInstance._updateToast(id, {
            type: "success",
            message:
              typeof opts.success === "function"
                ? opts.success(result)
                : opts.success,
          })
        }
        return result
      } catch (err) {
        if (toasterInstance) {
          toasterInstance._updateToast(id, {
            type: "error",
            message:
              typeof opts.error === "function" ? opts.error(err) : opts.error,
          })
        }
        throw err
      }
    },
  }
)

function addToast(
  type: Toast["type"],
  message: string,
  options?: ToastOptions
): string {
  const id = crypto.randomUUID()
  const toastData: Toast = {
    id,
    type,
    message,
    description: options?.description,
    duration: options?.duration ?? (type === "loading" ? Infinity : 4000),
    action: options?.action,
  }

  if (toasterInstance) {
    toasterInstance._addToast(toastData)
  } else {
    toastQueue.push(toastData)
  }

  return id
}

/**
 * plank-toaster: Container for toast notifications
 * Place this once at the root of your app
 */
@customElement("plank-toaster")
export class PlankToaster extends LitElement {
  @property({ type: String }) position:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right" = "bottom-right"
  @property({ type: String }) theme: "light" | "dark" | "system" = "system"
  @property({ type: Number, attribute: "visible-toasts" }) visibleToasts = 3

  @state() private _toasts: Toast[] = []

  private _timers: Map<string, number> = new Map()

  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    // Store reference to this instance for the toast API to use
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    toasterInstance = this
    // Process any queued toasts
    while (toastQueue.length > 0) {
      const t = toastQueue.shift()
      if (t) this._addToast(t)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    if (toasterInstance === this) {
      toasterInstance = null
    }
    // Clear all timers
    this._timers.forEach((timer) => window.clearTimeout(timer))
    this._timers.clear()
  }

  willUpdate() {
    const positionClasses = {
      "top-left": "top-4 left-4",
      "top-center": "top-4 left-1/2 -translate-x-1/2",
      "top-right": "top-4 right-4",
      "bottom-left": "bottom-4 left-4",
      "bottom-center": "bottom-4 left-1/2 -translate-x-1/2",
      "bottom-right": "bottom-4 right-4",
    }

    this.className = cn(
      "fixed z-[100] flex flex-col gap-2 w-[356px] max-w-[calc(100vw-2rem)]",
      positionClasses[this.position],
      this.className
    )
    this.dataset.slot = "toaster"
  }

  _addToast(t: Toast) {
    this._toasts = [...this._toasts, t]
    this.requestUpdate()

    // Set auto-dismiss timer
    if (t.duration !== Infinity) {
      const timer = window.setTimeout(() => {
        this._removeToast(t.id)
      }, t.duration)
      this._timers.set(t.id, timer)
    }
  }

  _removeToast(id: string) {
    const timer = this._timers.get(id)
    if (timer) {
      window.clearTimeout(timer)
      this._timers.delete(id)
    }
    this._toasts = this._toasts.filter((t) => t.id !== id)
    this.requestUpdate()
  }

  _updateToast(id: string, updates: Partial<Toast>) {
    this._toasts = this._toasts.map((t) =>
      t.id === id ? { ...t, ...updates } : t
    )

    // Reset timer if updating to a non-loading state
    const toast = this._toasts.find((t) => t.id === id)
    if (toast && updates.type && updates.type !== "loading") {
      const existingTimer = this._timers.get(id)
      if (existingTimer) {
        window.clearTimeout(existingTimer)
      }
      const timer = window.setTimeout(
        () => {
          this._removeToast(id)
        },
        toast.duration === Infinity ? 4000 : toast.duration
      )
      this._timers.set(id, timer)
    }

    this.requestUpdate()
  }

  _clearAll() {
    this._timers.forEach((timer) => window.clearTimeout(timer))
    this._timers.clear()
    this._toasts = []
    this.requestUpdate()
  }

  private _handleDismiss(id: string) {
    this._removeToast(id)
  }

  private _getIcon(type: Toast["type"]): TemplateResult | typeof nothing {
    switch (type) {
      case "success":
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
          class="text-green-500"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>`
      case "info":
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
          class="text-blue-500"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>`
      case "warning":
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
          class="text-yellow-500"
        >
          <path
            d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
          />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>`
      case "error":
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
          class="text-red-500"
        >
          <polygon
            points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"
          />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>`
      case "loading":
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
          class="animate-spin"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>`
      default:
        return nothing
    }
  }

  render() {
    // Only show the most recent visible toasts
    const visibleToasts = this._toasts.slice(-this.visibleToasts)

    return html`${visibleToasts.map(
      (t) => html`
        <div
          class=${cn(
            "relative flex items-start gap-3 rounded-lg border p-4 shadow-lg",
            "bg-popover text-popover-foreground",
            "animate-in slide-in-from-right-full"
          )}
          role="status"
          aria-live="polite"
        >
          ${this._getIcon(t.type)}
          <div class="flex-1 space-y-1">
            <p class="text-sm font-medium">${t.message}</p>
            ${t.description
              ? html`<p class="text-sm text-muted-foreground">
                  ${t.description}
                </p>`
              : nothing}
          </div>
          ${t.action
            ? html`<button
                class="text-sm font-medium text-primary hover:text-primary/80"
                @click=${() => t.action?.onClick()}
              >
                ${t.action.label}
              </button>`
            : nothing}
          <button
            class="absolute top-2 right-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            @click=${() => this._handleDismiss(t.id)}
            aria-label="Dismiss"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
      `
    )}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "plank-toaster": PlankToaster
  }
}
