import { NgClass } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  input,
} from '@angular/core';
import type { Config } from '@lottiefiles/dotlottie-web';
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import {
  DotLottieWebworkerComponentInput,
  DotLottieWorkerId,
} from '../../@types/dotlottie-web';
import { DotLottieWebComponent } from '../dotlottie-web/dotlottie-web.component';

@Component({
  selector: 'dotlottie-webworker',
  template: '<canvas [ngClass]="canvasClass()" #canvas part="canvas"></canvas>',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgClass],
  styleUrls: ['./dotlottie-webworker.component.css'],
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
