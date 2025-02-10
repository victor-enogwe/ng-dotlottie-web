import type { EnvironmentProviders } from '@angular/core';
import {
  inject,
  makeEnvironmentProviders,
  provideAppInitializer,
} from '@angular/core';
import { DotLottieWebSSROptions } from '../@types/dotlottie-web';
import { DOT_LOTTIE_WEB_SSR_OPTIONS } from '../constants';
import { DotLottieWebSSRService } from '../services/dotlottie-web-ssr/dotlottie-web-ssr.service';

export function provideDotLottieWebSSROptions(
  options: DotLottieWebSSROptions,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DOT_LOTTIE_WEB_SSR_OPTIONS,
      useValue: options,
    },
    provideAppInitializer(async (): Promise<void> => {
      const lottieService = inject(DotLottieWebSSRService);

      await lottieService.appInitializer();
    }),
  ]);
}
