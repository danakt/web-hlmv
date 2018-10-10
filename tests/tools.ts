import { performance } from 'perf_hooks'

/**
 * Returns performance of code running
 */
export const getPerformance = (func: (...args: any[]) => any) => {
  const now = performance.now()
  func()
  return performance.now() - now
}
