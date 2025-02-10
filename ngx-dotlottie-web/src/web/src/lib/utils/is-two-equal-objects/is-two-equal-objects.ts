export function isTwoEqualObjects<
  A extends Record<string, unknown>,
  B extends Record<string, unknown>,
>(a: A, b: B): boolean {
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  const sameKeys = new Set([...keysA, ...keysB]).size === keysA.length;

  if (!sameKeys) return false;

  return keysA.every((key) => a[key] === b[key]);
}
