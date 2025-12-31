import { describe, it, expect, beforeEach } from "vitest"
import "../../src/web-components/plank-resizable"
import type {
  PlankResizablePanelGroup,
  PlankResizablePanel,
  PlankResizableHandle,
} from "../../src/web-components/plank-resizable"

describe("plank-resizable-panel-group", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.style.width = "400px"
    container.style.height = "200px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders with default direction (horizontal)", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-panel-group")
    const group = container.querySelector(
      "plank-resizable-panel-group"
    ) as PlankResizablePanelGroup
    await group.updateComplete

    expect(group.direction).toBe("horizontal")
    expect(group.getAttribute("data-panel-group-direction")).toBe("horizontal")
    expect(group.classList.contains("flex")).toBe(true)
  })

  it("renders with vertical direction", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group direction="vertical">
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-panel-group")
    const group = container.querySelector(
      "plank-resizable-panel-group"
    ) as PlankResizablePanelGroup
    await group.updateComplete

    expect(group.direction).toBe("vertical")
    expect(group.getAttribute("data-panel-group-direction")).toBe("vertical")
    expect(group.classList.contains("flex-col")).toBe(true)
  })

  it("sets initial panel sizes from default-size", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="30">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="70">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-panel-group")
    const group = container.querySelector(
      "plank-resizable-panel-group"
    ) as PlankResizablePanelGroup
    await group.updateComplete

    // Wait for layout
    await new Promise((resolve) => requestAnimationFrame(resolve))

    const panels = container.querySelectorAll("plank-resizable-panel")
    expect((panels[0] as PlankResizablePanel)._size).toBe(30)
    expect((panels[1] as PlankResizablePanel)._size).toBe(70)
  })

  it("distributes remaining size to panels without default-size", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel>
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-panel-group")
    const group = container.querySelector(
      "plank-resizable-panel-group"
    ) as PlankResizablePanelGroup
    await group.updateComplete

    await new Promise((resolve) => requestAnimationFrame(resolve))

    const panels = container.querySelectorAll("plank-resizable-panel")
    expect((panels[0] as PlankResizablePanel)._size).toBe(50)
    expect((panels[1] as PlankResizablePanel)._size).toBe(50)
  })

  it("has correct data-slot attribute", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-panel-group")
    const group = container.querySelector(
      "plank-resizable-panel-group"
    ) as PlankResizablePanelGroup
    await group.updateComplete

    expect(group.dataset.slot).toBe("resizable-panel-group")
  })
})

describe("plank-resizable-panel", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.style.width = "400px"
    container.style.height = "200px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders with data-slot attribute", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="100">
          <div>Panel</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-panel")
    const panel = container.querySelector(
      "plank-resizable-panel"
    ) as PlankResizablePanel
    await panel.updateComplete

    expect(panel.dataset.slot).toBe("resizable-panel")
  })

  it("respects min-size constraint", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="50" min-size="30">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-panel")
    const panel = container.querySelector(
      "plank-resizable-panel"
    ) as PlankResizablePanel
    await panel.updateComplete

    expect(panel.minSize).toBe(30)
  })

  it("respects max-size constraint", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="50" max-size="80">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-panel")
    const panel = container.querySelector(
      "plank-resizable-panel"
    ) as PlankResizablePanel
    await panel.updateComplete

    expect(panel.maxSize).toBe(80)
  })
})

describe("plank-resizable-handle", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.style.width = "400px"
    container.style.height = "200px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("renders with data-slot attribute", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-handle")
    const handle = container.querySelector(
      "plank-resizable-handle"
    ) as PlankResizableHandle
    await handle.updateComplete

    expect(handle.dataset.slot).toBe("resizable-handle")
  })

  it("renders with grip icon when with-handle is set", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle with-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-handle")
    const handle = container.querySelector(
      "plank-resizable-handle"
    ) as PlankResizableHandle
    await handle.updateComplete

    const svg = handle.querySelector("svg")
    expect(svg).toBeTruthy()
  })

  it("does not render grip icon without with-handle", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-handle")
    const handle = container.querySelector(
      "plank-resizable-handle"
    ) as PlankResizableHandle
    await handle.updateComplete

    const svg = handle.querySelector("svg")
    expect(svg).toBeNull()
  })

  it("has correct ARIA attributes", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group>
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-handle")
    const handle = container.querySelector(
      "plank-resizable-handle"
    ) as PlankResizableHandle
    await handle.updateComplete

    expect(handle.getAttribute("role")).toBe("separator")
    expect(handle.getAttribute("tabindex")).toBe("0")
    expect(handle.getAttribute("aria-orientation")).toBe("horizontal")
  })

  it("sets col-resize cursor for horizontal direction", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group direction="horizontal">
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-handle")
    const handle = container.querySelector(
      "plank-resizable-handle"
    ) as PlankResizableHandle
    await handle.updateComplete

    expect(handle.classList.contains("cursor-col-resize")).toBe(true)
  })

  it("sets row-resize cursor for vertical direction", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group direction="vertical">
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <div>Panel 2</div>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-handle")
    const handle = container.querySelector(
      "plank-resizable-handle"
    ) as PlankResizableHandle
    await handle.updateComplete

    expect(handle.classList.contains("cursor-row-resize")).toBe(true)
  })
})

describe("plank-resizable - nested groups", () => {
  let container: HTMLElement

  beforeEach(() => {
    container = document.createElement("div")
    container.style.width = "400px"
    container.style.height = "200px"
    document.body.appendChild(container)
    return () => {
      container.remove()
    }
  })

  it("supports nested panel groups", async () => {
    container.innerHTML = `
      <plank-resizable-panel-group direction="horizontal">
        <plank-resizable-panel default-size="50">
          <div>Panel 1</div>
        </plank-resizable-panel>
        <plank-resizable-handle></plank-resizable-handle>
        <plank-resizable-panel default-size="50">
          <plank-resizable-panel-group direction="vertical">
            <plank-resizable-panel default-size="50">
              <div>Panel 2a</div>
            </plank-resizable-panel>
            <plank-resizable-handle></plank-resizable-handle>
            <plank-resizable-panel default-size="50">
              <div>Panel 2b</div>
            </plank-resizable-panel>
          </plank-resizable-panel-group>
        </plank-resizable-panel>
      </plank-resizable-panel-group>
    `
    await customElements.whenDefined("plank-resizable-panel-group")

    const groups = container.querySelectorAll("plank-resizable-panel-group")
    expect(groups.length).toBe(2)
    expect((groups[0] as PlankResizablePanelGroup).direction).toBe("horizontal")
    expect((groups[1] as PlankResizablePanelGroup).direction).toBe("vertical")
  })
})
