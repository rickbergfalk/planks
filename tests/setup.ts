/**
 * Test setup file for Vitest browser mode
 *
 * This file is automatically loaded before tests run.
 * Add global test utilities and setup here.
 */
import { beforeEach } from "vitest"
import "./styles.css"

// Ensure clean DOM between tests
beforeEach(() => {
  document.body.innerHTML = ""
})
