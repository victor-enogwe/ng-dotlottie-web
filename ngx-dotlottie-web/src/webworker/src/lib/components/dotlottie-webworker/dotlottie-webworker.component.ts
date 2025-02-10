import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { DotLottieWebworkerComponentInput } from '../../../../../web/src/lib/@types/dotlottie-web';
import { DotLottieWebComponent } from '../../../../../web/src/lib/components/dotlottie-web/dotlottie-web.component';
import { DotLottieWorkerId } from '../../@types/dotlottie-webworker';

@Component({
  selector: 'dotlottie-webworker',
  template: `
    <div>
      <ng-container
        #outlet
        [ngTemplateOutlet]="content"
      ></ng-container>
    </div>

    <ng-template #content>
      <canvas
        [ngClass]="canvasClass()"
        #canvas
        part="part dotlottie-webworker"
      ></canvas>
    </ng-template>
  `,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgClass, NgTemplateOutlet],
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
  host: { '[class]': 'hostClass()' },
})
export class DotLottieWebWorkerComponent
  extends DotLottieWebComponent
  implements DotLottieWebworkerComponentInput
{
  protected override Lottie = DotLottieWorker as unknown as typeof DotLottie;

  workerId = input<string>('ngx-dotlottie-webworker');

  protected override loadConfig(): Omit<Config, 'canvas' | 'data' | 'src'> & {
    workerId?: DotLottieWorkerId;
  } {
    return {
      ...super.loadConfig(),
      workerId: this.workerId(),
    };
  }
}
