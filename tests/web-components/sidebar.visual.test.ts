import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { page } from "vitest/browser"
import "@/web-components/hal-sidebar"
import "@/web-components/hal-button"
import "@/web-components/hal-separator"
import "@/web-components/hal-skeleton"
import "@/web-components/hal-input"
import "@/web-components/hal-sheet"
import "@/web-components/hal-tooltip"

/**
 * Visual tests for hal-sidebar web component.
 *
 * These tests compare against the React component screenshots directly
 * (configured in vitest.config.ts via resolveScreenshotPath).
 * The React screenshots serve as the baseline/source of truth.
 */
describe("hal-sidebar visual", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.id = "test-container"
    container.setAttribute("data-testid", "container")
    document.body.appendChild(container)
  })

  afterEach(() => {
    container.remove()
  })

  it("matches basic sidebar layout", async () => {
    container.innerHTML = `
      <div style="width: 800px; height: 500px; position: relative;" data-testid="sidebar-area">
        <hal-sidebar-provider>
          <hal-sidebar collapsible="none">
            <hal-sidebar-header>
              <span class="font-bold text-lg">App Name</span>
            </hal-sidebar-header>
            <hal-sidebar-content>
              <hal-sidebar-group>
                <hal-sidebar-group-label>Navigation</hal-sidebar-group-label>
                <hal-sidebar-group-content>
                  <hal-sidebar-menu>
                    <hal-sidebar-menu-item>
                      <hal-sidebar-menu-button active>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                        <span>Home</span>
                      </hal-sidebar-menu-button>
                    </hal-sidebar-menu-item>
                    <hal-sidebar-menu-item>
                      <hal-sidebar-menu-button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                        <span>Settings</span>
                      </hal-sidebar-menu-button>
                    </hal-sidebar-menu-item>
                  </hal-sidebar-menu>
                </hal-sidebar-group-content>
              </hal-sidebar-group>
            </hal-sidebar-content>
            <hal-sidebar-footer>
              <hal-sidebar-separator></hal-sidebar-separator>
              <span class="text-xs text-muted-foreground p-2">v1.0.0</span>
            </hal-sidebar-footer>
          </hal-sidebar>
        </hal-sidebar-provider>
      </div>
    `
    await customElements.whenDefined("hal-sidebar-provider")
    const provider = container.querySelector("hal-sidebar-provider")! as any
    await provider.updateComplete

    // Wait for all nested elements
    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("sidebar-area")).toMatchScreenshot(
      "sidebar-basic"
    )
  })

  it("matches sidebar menu with badges", async () => {
    container.innerHTML = `
      <div style="width: 300px; padding: 8px; background: var(--sidebar);" data-testid="sidebar-area">
        <hal-sidebar-provider>
          <hal-sidebar-menu>
            <hal-sidebar-menu-item>
              <hal-sidebar-menu-button active>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>Inbox</span>
              </hal-sidebar-menu-button>
              <hal-sidebar-menu-badge>12</hal-sidebar-menu-badge>
            </hal-sidebar-menu-item>
            <hal-sidebar-menu-item>
              <hal-sidebar-menu-button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                <span>Starred</span>
              </hal-sidebar-menu-button>
              <hal-sidebar-menu-badge>3</hal-sidebar-menu-badge>
            </hal-sidebar-menu-item>
            <hal-sidebar-menu-item>
              <hal-sidebar-menu-button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
                <span>Archive</span>
              </hal-sidebar-menu-button>
            </hal-sidebar-menu-item>
          </hal-sidebar-menu>
        </hal-sidebar-provider>
      </div>
    `
    await customElements.whenDefined("hal-sidebar-provider")
    const provider = container.querySelector("hal-sidebar-provider")! as any
    await provider.updateComplete

    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("sidebar-area")).toMatchScreenshot(
      "sidebar-badges"
    )
  })

  it("matches sidebar with submenu", async () => {
    container.innerHTML = `
      <div style="width: 300px; padding: 8px; background: var(--sidebar);" data-testid="sidebar-area">
        <hal-sidebar-provider>
          <hal-sidebar-menu>
            <hal-sidebar-menu-item>
              <hal-sidebar-menu-button active>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <span>Documents</span>
              </hal-sidebar-menu-button>
              <hal-sidebar-menu-sub>
                <hal-sidebar-menu-sub-item>
                  <hal-sidebar-menu-sub-button active>
                    <span>Getting Started</span>
                  </hal-sidebar-menu-sub-button>
                </hal-sidebar-menu-sub-item>
                <hal-sidebar-menu-sub-item>
                  <hal-sidebar-menu-sub-button>
                    <span>Components</span>
                  </hal-sidebar-menu-sub-button>
                </hal-sidebar-menu-sub-item>
                <hal-sidebar-menu-sub-item>
                  <hal-sidebar-menu-sub-button>
                    <span>API Reference</span>
                  </hal-sidebar-menu-sub-button>
                </hal-sidebar-menu-sub-item>
              </hal-sidebar-menu-sub>
            </hal-sidebar-menu-item>
            <hal-sidebar-menu-item>
              <hal-sidebar-menu-button>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                <span>Settings</span>
              </hal-sidebar-menu-button>
            </hal-sidebar-menu-item>
          </hal-sidebar-menu>
        </hal-sidebar-provider>
      </div>
    `
    await customElements.whenDefined("hal-sidebar-provider")
    const provider = container.querySelector("hal-sidebar-provider")! as any
    await provider.updateComplete

    await new Promise((r) => setTimeout(r, 100))

    await expect(page.getByTestId("sidebar-area")).toMatchScreenshot(
      "sidebar-submenu"
    )
  })
})
