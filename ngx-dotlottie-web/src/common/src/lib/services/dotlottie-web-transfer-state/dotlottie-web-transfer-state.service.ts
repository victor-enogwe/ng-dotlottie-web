import { inject, Injectable, makeStateKey, TransferState } from '@angular/core';
import { AnimationFilename } from '../../@types/dotlottie-common';

@Injectable({ providedIn: 'root' })
export class DotLottieWebTransferStateService {
  private readonly transferState = inject(TransferState);

  get<T>(animation: AnimationFilename): T | null {
    const animationKey = this.transformAnimationFilenameToKey(animation);
    const stateKey = makeStateKey<T>(animationKey);
    return this.transferState.get(stateKey, null);
  }

  transformAnimationFilenameToKey(animation: AnimationFilename): string {
    const [animationName] = animation.split('.json');
    return `animation-${animationName}`;
  }
}
