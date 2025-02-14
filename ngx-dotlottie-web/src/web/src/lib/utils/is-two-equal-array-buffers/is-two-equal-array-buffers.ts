export function isTwoEqualArrayBuffers(
  a: ArrayBuffer,
  b: ArrayBuffer,
): boolean {
  if (a.byteLength !== b.byteLength) return false;

  const viewA = new Uint8Array(a);
  const viewB = new Uint8Array(b);

  for (let i = 0; i < a.byteLength; i++) {
    if (viewA[i] !== viewB[i]) return false;
  }

  return true;
}
