import { expect } from '@jest/globals';
import { isTwoEqualArrayBuffers } from './is-two-equal-array-buffers';

describe('isTwoEqualArrayBuffers', () => {
  const createArrayBuffer = (elements: number[]): ArrayBuffer => {
    const buffer = new ArrayBuffer(elements.length);
    const view = new Uint8Array(buffer);
    elements.forEach((num, index) => {
      view[index] = num;
    });
    return buffer;
  };

  it('should return true for two empty ArrayBuffers', () => {
    const ab1 = new ArrayBuffer(0);
    const ab2 = new ArrayBuffer(0);

    expect(isTwoEqualArrayBuffers(ab1, ab2)).toEqual(true);
  });

  it('should return true for identical ArrayBuffers (same content)', () => {
    const ab1 = createArrayBuffer([1, 2, 3]);
    const ab2 = createArrayBuffer([1, 2, 3]);

    expect(isTwoEqualArrayBuffers(ab1, ab2)).toEqual(true);
    expect(isTwoEqualArrayBuffers(ab1, ab1)).toEqual(true);
    expect(isTwoEqualArrayBuffers(ab2, ab2)).toEqual(true);
  });

  it('should return false for buffers of same size but diff content', () => {
    const ab1 = createArrayBuffer([1, 2, 3]);
    const ab2 = createArrayBuffer([1, 2, 4]);
    expect(isTwoEqualArrayBuffers(ab1, ab2)).toEqual(false);
  });

  it('should return false for ArrayBuffers with different lengths', () => {
    const ab1 = createArrayBuffer([1, 2, 3]);
    const ab2 = createArrayBuffer([1, 2, 3, 4]);
    expect(isTwoEqualArrayBuffers(ab1, ab2)).toEqual(false);
  });
});
