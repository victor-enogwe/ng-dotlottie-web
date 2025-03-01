import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import type { Config, DotLottie } from '@lottiefiles/dotlottie-web';
import { DotLottieWorker } from '@lottiefiles/dotlottie-web';
import type { DotLottieWebworkerComponentInput } from '../../../../../web/src/lib/@types/dotlottie-web';
import { DotLottieWebComponent } from '../../../../../web/src/lib/components/dotlottie-web/dotlottie-web.component';
import type { DotLottieWorkerId } from '../../@types/dotlottie-webworker';

@Component({
  selector: 'dotlottie-webworker',
  template: `
    <canvas
      [ngClass]="canvasClass()"
      #canvas
      part="part dotlottie-web"
    ></canvas>
  `,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass],
  styles: `
    .w-full {
      width: 100%;
    }

    .h-full {
      height: 100%;
    }

    .d-block {
      display: block;
    }

    .relative {
      position: relative;
    }
  `,
})
export class DotLottieWebWorkerComponent
  extends DotLottieWebComponent
  implements DotLottieWebworkerComponentInput
{
  protected override Lottie = DotLottieWorker as unknown as typeof DotLottie;

  workerId = input<string>('ngx-dotlottie-webworker');

  protected override getConfig(): Omit<Config, 'canvas' | 'data' | 'src'> & {
    workerId?: DotLottieWorkerId;
  } {
    return {
      ...super.getConfig(),
      workerId: this.workerId(),
    };
  }
}
