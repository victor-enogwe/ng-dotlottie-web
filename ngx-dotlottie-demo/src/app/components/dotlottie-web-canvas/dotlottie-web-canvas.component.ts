import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DotLottieWebComponent } from '../../../../../ngx-dotlottie-web/src/web/src/lib/components/dotlottie-web/dotlottie-web.component';
import { DotLottieWebWorkerComponent } from '../../../../../ngx-dotlottie-web/src/webworker/src/lib/components/dotlottie-webworker/dotlottie-webworker.component';
import { DotlottieWebControlsComponent } from '../dotlottie-web-controls/dotlottie-web-controls.component';
import { DotLottieWebComponentInputType } from '../../../../../ngx-dotlottie-web/src/web/src/lib/@types/dotlottie-web';

@Component({
  selector: 'dotlottie-web-canvas',
  imports: [
    DotLottieWebComponent,
    DotLottieWebWorkerComponent,
    DotlottieWebControlsComponent,
    MatDivider,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    NgIf,
  ],
  providers: [NgModel],
  templateUrl: './dotlottie-web-canvas.component.html',
  styleUrl: './dotlottie-web-canvas.component.css',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DotlottieWebCanvasComponent {
  title = input<string>();

  dotlottieURL = model.required<string>();

  showDivider = input(false);

  useWebWorker = input(false);

  options = model<Partial<DotLottieWebComponentInputType>>({
    autoplay: true,
    autoResize: false,
    freeze: false,
    freezeOnOffscreen: false,
    loop: true,
    play: true,
    useFrameInterpolation: true,
  });

  onChange(change: {
    name: keyof DotLottieWebComponentInputType;
    active: boolean;
  }): void {
    if (change.name === 'stop') {
      this.options.update((options) => ({
        ...options,
        play: !change.active,
        freeze: false,
        autoplay: false,
      }));
    }

    if (change.name === 'play') {
      this.options.update((options) => ({
        ...options,
        stop: false,
        freeze: false,
        autoplay: false,
      }));
    }

    if (change.name === 'loop') {
      this.options.update((options) => ({
        ...options,
        stop: false,
        freeze: false,
        autoplay: false,
        play: false,
      }));
    }

    this.options.update((options) => ({
      ...options,
      [change.name]: change.active,
    }));
  }
}
