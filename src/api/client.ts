/**
 * Utilities that make the local data layer behave like a remote API:
 * artificial latency and id generation. Swapping this module (and the
 * resource modules) for real `fetch` calls should not require UI changes.
 */

const MIN_LATENCY = 150
const MAX_LATENCY = 450

function randomLatency(): number {
  return MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY)
}

// Resolves after a short, randomized delay to simulate a network round-trip.
export function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), randomLatency())
  })
}

export function generateId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8)
  return `${prefix}-${Date.now().toString(36)}-${random}`
}

// Error type thrown by the mock API for domain-level failures.
export class ApiError extends Error {
  status: number

  constructor(message: string, status: number = 400) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}
