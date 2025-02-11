import { inject, Injectable, TransferState } from '@angular/core';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { AnimationFilename } from '../../../../../common/src/lib/@types/dotlottie-common';
import { DotLottieWebTransferStateService } from '../../../../../common/src/lib/services/dotlottie-web-transfer-state/dotlottie-web-transfer-state.service';
import {
  AnimationData,
  DotLottieWebSSROptions,
  PathToAnimation,
} from '../../@types/dotlottie-ssr';
import { DOT_LOTTIE_WEB_SSR_OPTIONS } from '../../constants';
import { setWasmURL } from '../../utils/set-wasm/set-wasm';

/**
 * Will be provided through Terser global definitions
 * when the app is build in production mode.
 */
declare const ngDevMode: boolean;

@Injectable({ providedIn: 'root' })
export class DotLottieWebSSRService {
  private cache = new Map<string, AnimationData>();

  private readonly transferStateService = inject(
    DotLottieWebTransferStateService,
  );

  private async readFileWithAnimationData(
    path: string,
  ): Promise<AnimationData | undefined> {
    const existsInCache = this.cache.has(path);

    if (existsInCache) return Promise.resolve(this.cache.get(path));

    const buffer = await readFile(path);
    const dotLottieExt = path.endsWith('.lottie');

    const data = dotLottieExt
      ? JSON.stringify(buffer.toJSON())
      : buffer.toString();

    this.cache.set(path, data);

    return data;
  }

  private async readAndTransferAnimationData(
    transferState: TransferState,
    animations: AnimationFilename[],
    pathsToAnimations: PathToAnimation[],
  ): Promise<void[]> {
    return Promise.all(
      animations.map((animation, index) =>
        this.readFileWithAnimationData(pathsToAnimations[index])
          .then((animationData) =>
            this.transferAnimationData(
              transferState,
              animation,
              animationData!,
            ),
          )
          .catch((error) => {
            if (typeof ngDevMode !== 'undefined' && ngDevMode) {
              console.error(
                `Failed to read file(${pathsToAnimations[index]}). Error: `,
                error,
              );
            }
          }),
      ),
    );
  }

  private transferAnimationData(
    state: TransferState,
    animation: AnimationFilename,
    animationData: AnimationData,
  ): void {
    const key =
      this.transferStateService.transformAnimationFilenameToKey(animation);

    if (state.hasKey(key)) return;

    state.set<Record<string, unknown>>(key, JSON.parse(animationData));
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

    await this.readAndTransferAnimationData(
      transferState,
      options.preloadAnimations.animations,
      pathsToAnimations,
    );
  }
}
