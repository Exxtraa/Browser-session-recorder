export function throttle<Func extends (...args: any[]) => any>(
  fn: Func,
  limit: number
) {
  let last = 0;

  return (...args: any[]) => {
    const now = Date.now();
    if (now - last >= limit) {
      last = now;
      return fn(...args);
    }
  };
}
