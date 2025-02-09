import type { EnvironmentProviders } from '@angular/core';
import {
  inject,
  InjectionToken,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import type { DotLottieWebSSROptions } from '../@types/dotlottie-web';
import { DotLottieWebService } from '../services/dotlottie-web/dotlottie-web.service';

export const DOT_LOTTIE_WEB_SSR_OPTIONS =
  new InjectionToken<DotLottieWebSSROptions>('LottieServerOptions');

export function provideDotLottieWebSSROptions(
  options: DotLottieWebSSROptions,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DOT_LOTTIE_WEB_SSR_OPTIONS,
      useValue: options,
    },
    provideAppInitializer(async (): Promise<void> => {
      const lottieService = inject(DotLottieWebService);

      await lottieService.appInitializer();
    }),
  ]);
}
