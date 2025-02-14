import type { Config } from '@lottiefiles/dotlottie-web';

export function getSrcLength(value: Config['data']): number {
  switch (true) {
    case value instanceof ArrayBuffer:
      return value.byteLength;
    case typeof value === 'string':
    case Array.isArray(value):
      return value.length;
    case typeof value === 'object':
      return Object.keys(value).length;
    default:
      return 0;
  }
}
