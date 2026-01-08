/**
 * Adds anchor links to headings in the documentation.
 * On hover, a link icon appears that copies the section URL to clipboard when clicked.
 */

import { toast } from "@/web-components/hal-sonner"
import type { HalButton } from "@/web-components/hal-button"

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function createAnchorButton(): HalButton {
  const btn = document.createElement("hal-button") as HalButton
  btn.variant = "ghost"
  btn.size = "icon-sm"
  btn.className = "heading-anchor"
  btn.title = "Copy link to section"
  btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`
  return btn
}

function initHeadingAnchors() {
  const main = document.querySelector("main")
  if (!main) return

  const headings = main.querySelectorAll<HTMLHeadingElement>("h1, h2, h3, h4")

  headings.forEach((heading) => {
    // Skip if already processed
    if (heading.querySelector(".heading-anchor")) return

    // Skip headings inside links (e.g., card links on home page)
    if (heading.closest("a")) return

    // Generate ID if missing
    if (!heading.id) {
      heading.id = slugify(heading.textContent || "")
    }

    // Make heading inline-flex so anchor stays on same line
    heading.style.display = "inline-flex"
    heading.style.alignItems = "center"

    // Create anchor button
    const btn = createAnchorButton()
    btn.addEventListener("click", async () => {
      const url = `${window.location.origin}${window.location.pathname}#${heading.id}`
      try {
        await navigator.clipboard.writeText(url)
        toast.success("Link copied to clipboard")
      } catch {
        // Fallback for older browsers
        const input = document.createElement("input")
        input.value = url
        document.body.appendChild(input)
        input.select()
        document.execCommand("copy")
        document.body.removeChild(input)
        toast.success("Link copied to clipboard")
      }
    })

    heading.appendChild(btn)
  })
}

// Wait for docs-layout to render content into main
function waitForMain() {
  const main = document.querySelector("main")
  if (main && main.children.length > 0) {
    initHeadingAnchors()
  } else {
    // docs-layout hasn't rendered yet, wait a frame
    requestAnimationFrame(waitForMain)
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", waitForMain)
} else {
  waitForMain()
}
