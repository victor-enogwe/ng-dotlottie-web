import { expect } from '@jest/globals';
import { getSrcLength } from './get-src-length';

describe('getSrcLength', () => {
  it('should return the length of a string src', () => {
    expect(
      getSrcLength('https://github.com/victor-enogwe/ngx-dotlottie-web'),
    ).toStrictEqual(50);
  });

  it('should return the length of an object src', () => {
    expect(getSrcLength({ hello: 'world' })).toStrictEqual(1);
  });

  it('should return the length of an ArrayBuffer src', () => {
    expect(getSrcLength(new ArrayBuffer(20))).toStrictEqual(20);
  });

  it('should return zero for an empty ArrayBuffer src', () => {
    expect(getSrcLength(new ArrayBuffer(0))).toBe(0);
  });

  it('should return zero for an empty object src', () => {
    expect(getSrcLength({})).toStrictEqual(0);
  });

  it('should return zero for an empty string src', () => {
    expect(getSrcLength('')).toBe(0);
  });

  it('should return zero for an undefined src', () => {
    expect(getSrcLength(undefined)).toStrictEqual(0);
  });
});
