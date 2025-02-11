import {
  inject,
  Injectable,
  makeStateKey,
  StateKey,
  TransferState,
} from '@angular/core';
import { AnimationFilename } from '../../@types/dotlottie-common';

@Injectable({ providedIn: 'root' })
export class DotLottieWebTransferStateService {
  private readonly transferState = inject(TransferState);

  private bufferFrom(data: number[]): ArrayBuffer {
    const buffer = new ArrayBuffer(data.length);
    const view = new Uint8Array(buffer);

    data.forEach((byte, index) => view.set([byte], index));

    return buffer;
  }

  get(
    animation: AnimationFilename,
  ): Record<string, unknown> | ArrayBuffer | undefined {
    const animationKey = this.transformAnimationFilenameToKey(animation);
    const data = this.transferState.get(animationKey, undefined)!;

    if (!data) return data;

    const isBuffer = Object.hasOwn(data, 'type') && data['type'] === 'Buffer';

    if (isBuffer) return this.bufferFrom(data['data'] as number[]);

    return data;
  }

  transformAnimationFilenameToKey(
    animation: AnimationFilename,
  ): StateKey<Record<string, unknown>> {
    const [animationName] = animation.split(/.json$/);

    return makeStateKey<Record<string, unknown>>(`animation-${animationName}`);
  }
}
