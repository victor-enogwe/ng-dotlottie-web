import type { Config } from '@lottiefiles/dotlottie-web';

export function isURLOrPath(value: Config['data']): boolean {
  try {
    return new URL(value as string).href.startsWith(value as string);
  } catch {
    return (
      typeof value === 'string' &&
      (value.startsWith('/') ||
        value.startsWith('./') ||
        value.startsWith('../') ||
        value.endsWith('.json') ||
        value.endsWith('.lottie'))
    );
  }
}
