import { InjectionToken } from '@angular/core';
import type { DotLottieWebSSROptions } from '../@types/dotlottie-ssr';

export const DOT_LOTTIE_WEB_SSR_OPTIONS =
  new InjectionToken<DotLottieWebSSROptions>('LottieServerOptions');
