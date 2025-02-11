import { isPlatformBrowser } from '@angular/common';
import type { EnvironmentProviders } from '@angular/core';
import {
  inject,
  makeEnvironmentProviders,
  PLATFORM_ID,
  provideAppInitializer,
} from '@angular/core';
import type { DotLottieWebSSROptions } from '../@types/dotlottie-ssr';
import { DOT_LOTTIE_WEB_SSR_OPTIONS } from '../constants';
import { DotLottieWebSSRService } from '../services/dotlottie-web-ssr/dotlottie-web-ssr.service';

function validatePlatform(): void {
  const platformId = inject(PLATFORM_ID);
  const isBrowserEnv = isPlatformBrowser(platformId);

  if (isBrowserEnv) {
    throw new Error(
      `dotlottie SSR provider is not supported in the browser environment
      Please use this provider in your app's server config`,
    );
  }
}

export function provideDotLottieWebSSROptions(
  options: DotLottieWebSSROptions,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: DOT_LOTTIE_WEB_SSR_OPTIONS,
      useFactory: (): DotLottieWebSSROptions => {
        validatePlatform();

        return options;
      },
    },
    provideAppInitializer(async (): Promise<void> => {
      validatePlatform();

      const dotlottieService = inject(DotLottieWebSSRService);

      await dotlottieService.appInitializer();
    }),
  ]);
}
