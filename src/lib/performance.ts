/**
 * Performance utilities for TaskFlow AI.
 * Splitting heavy computations or rendering into smaller chunks to avoid long tasks.
 */

/**
 * Executes a function when the browser is idle.
 * Fallback to setTimeout if requestIdleCallback is not available.
 */
export const runIdle = (fn: (deadline?: any) => void) => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback((deadline) => fn(deadline));
  } else {
    setTimeout(() => fn({ timeRemaining: () => 0, didTimeout: true }), 1);
  }
};

/**
 * Processes an array in chunks using requestIdleCallback to keep UI responsive.
 * @param items The items to process
 * @param processor Function to call for each item
 * @param chunkSize Number of items to process per idle slice
 */
export function processInChunks<T>(
  items: T[], 
  processor: (item: T, index: number) => void, 
  chunkSize: number = 10
) {
  let index = 0;

  function doWork(deadline: any) {
    while ((deadline.timeRemaining() > 0 || deadline.didTimeout) && index < items.length) {
      const end = Math.min(index + chunkSize, items.length);
      for (; index < end; index++) {
        processor(items[index], index);
      }
    }

    if (index < items.length) {
      runIdle(doWork);
    }
  }

  runIdle(doWork);
}
