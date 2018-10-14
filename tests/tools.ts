import { performance } from 'perf_hooks'

/**
 * Returns performance of code running
 */
export const getPerformance = (func: (...args: any[]) => any) => {
  const now = performance.now()
  func()
  return performance.now() - now
}

/**
 * ImageData class for running tests in node.js
 */
export class MockImageData {
  constructor(public data: Uint8ClampedArray, public width: number, public height: number) {}
}
