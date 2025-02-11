import type { ApplicationConfig } from '@angular/core';
import { mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRoutesConfig } from '@angular/ssr';
import { resolve } from 'node:path';
import { provideDotLottieWebSSROptions } from '../../../ngx-dotlottie-web/src/ssr/src/lib/providers/dotlottie-web-ssr.provider';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRoutesConfig(serverRoutes),
    provideDotLottieWebSSROptions({
      preloadAnimations: {
        folder: resolve('ngx-dotlottie-demo', 'cypress', 'fixtures'),
        animations: ['example.json', 'lottie.json', 'test.json', 'test.lottie'],
      },
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
