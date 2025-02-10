import { InjectionToken } from '@angular/core';
import { DotLottieWebSSROptions } from '../@types/dotlottie-web';

export const DOT_LOTTIE_WEB_SSR_OPTIONS =
  new InjectionToken<DotLottieWebSSROptions>('LottieServerOptions');
