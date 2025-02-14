import { expect } from '@jest/globals';
import { pathToFileURL } from 'node:url';
import { isURLOrPath } from './is-url-or-path';

describe('isURLOrPath', () => {
  it('should accept a valid http url', () => {
    expect(
      isURLOrPath('https://github.com/victor-enogwe/ngx-dotlottie-web'),
    ).toBe(true);
  });

  it('should accept a valid file url', () => {
    expect(isURLOrPath(pathToFileURL('lottie.lottie').href)).toBe(true);
  });

  it('should accept a valid relative path', () => {
    expect(isURLOrPath('../is-two-equal-objects.spec.ts')).toBe(true);

    expect(isURLOrPath('./is-two-equal-objects.spec.ts')).toBe(true);
  });

  it('should accept a valid absolute path', () => {
    expect(isURLOrPath('/is-two-equal-objects.spec.ts')).toBe(true);
  });

  it('should accept a string ending with the ".lottie" extension', () => {
    expect(isURLOrPath('lottie.lottie')).toBe(true);
  });

  it('should accept a string ending with the ".json" extension', () => {
    expect(isURLOrPath('lottie.json')).toBe(true);
  });

  it('should reject an invalid url', () => {
    expect(
      isURLOrPath('https:/github.com/ victor-enogwe/ngx-dotlottie-web'),
    ).toBe(false);
  });

  it('should accept a reject an invalid path', () => {
    expect(isURLOrPath('lottie.hello')).toBe(false);
  });
});
