import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { readFile } from 'node:fs';
import { resolve } from 'node:path';
import type {
  AnimationData,
  AnimationFilename,
  DotLottieWebSSROptions,
  PathToAnimation,
} from '../../@types/dotlottie-web';
import { DOT_LOTTIE_WEB_SSR_OPTIONS } from '../../providers/dotlottie-web.provider';
import { setWasmURL } from '../../utils/set-wasm/set-wasm';
import { DotLottieWebTransferStateService } from '../dotlottie-web-transfer-state/dotlottie-web-transfer-state.service';

/**
 * Will be provided through Terser global definitions
 * when the app is build in production mode.
 */
declare const ngDevMode: boolean;

@Injectable({ providedIn: 'root' })
export class DotLottieWebService {
  private cache = new Map<string, AnimationData>();
  private readonly transferStateService = inject(
    DotLottieWebTransferStateService,
  );

  private readFileWithAnimationData(
    path: string,
  ): Promise<AnimationData | undefined> {
    return this.cache.has(path)
      ? Promise.resolve(this.cache.get(path))
      : new Promise((resolve, reject) => {
          readFile(path, (error, buffer) => {
            if (error) {
              reject(error);
            } else {
              const data = buffer.toString();
              this.cache.set(path, data);
              resolve(data);
            }
          });
        });
  }

  private readAndTransferAnimationData(
    transferState: TransferState,
    animations: AnimationFilename[],
    pathsToAnimations: PathToAnimation[],
  ): Promise<void>[] {
    const sources: Promise<void>[] = [];

    for (let i = 0, length = animations.length; i < length; i++) {
      const path = pathsToAnimations[i];

      const source = this.readFileWithAnimationData(path)
        .then((animationData) => {
          this.transferAnimationData(
            transferState,
            animations[i],
            animationData!,
          );
        })
        .catch((error) => {
          if (typeof ngDevMode !== 'undefined' && ngDevMode) {
            console.error(
              `Failed to read the following file ${path}. Error: `,
              error,
            );
          }
        });

      sources.push(source);
    }

    return sources;
  }

  private transferAnimationData(
    state: TransferState,
    animation: AnimationFilename,
    animationData: AnimationData,
  ): void {
    animation =
      this.transferStateService.transformAnimationFilenameToKey(animation);

    const key = makeStateKey(animation);

    if (state.hasKey(key)) return;

    state.set(key, JSON.parse(animationData));
  }

  private resolveLottiePaths({
    preloadAnimations,
  }: DotLottieWebSSROptions): PathToAnimation[] {
    const { folder, animations } = preloadAnimations;

    return animations.map((animation) => resolve(folder, animation));
  }

  async appInitializer(): Promise<void> {
    const options = inject(DOT_LOTTIE_WEB_SSR_OPTIONS);
    const transferState = inject(TransferState);

    await setWasmURL();

    const pathsToAnimations = this.resolveLottiePaths(options);

    const sources = this.readAndTransferAnimationData(
      transferState,
      options.preloadAnimations.animations,
      pathsToAnimations,
    );

    await Promise.all(sources);
  }
}
