import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  input,
  model,
  output,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatButtonToggle,
  MatButtonToggleChange,
  MatButtonToggleGroup,
} from '@angular/material/button-toggle';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { DotLottieWebComponentInputType } from '../../../../../ngx-dotlottie-web/src/web/src/lib/@types/dotlottie-web';

@Component({
  selector: 'dotlottie-web-controls',
  templateUrl: './dotlottie-web-controls.component.html',
  styleUrl: './dotlottie-web-controls.component.css',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [MatButtonToggleGroup, MatButtonToggle, MatIcon, MatTooltip],
  standalone: true,
})
export class DotlottieWebControlsComponent {
  name = input.required<string>();

  change = output<{
    name: keyof DotLottieWebComponentInputType;
    active: boolean;
  }>();

  model = model<Partial<DotLottieWebComponentInputType>>({});

  controls: Array<{
    name: keyof DotLottieWebComponentInputType;
    icon: string;
  }> = [
    { name: 'play', icon: 'play_arrow' },
    { name: 'stop', icon: 'stop_circle' },
    { name: 'freeze', icon: 'ac_unit' },
    { name: 'loop', icon: 'repeat' },
    { name: 'autoResize', icon: 'aspect_ratio' },
    { name: 'freezeOnOffscreen', icon: 'preview' },
    { name: 'useFrameInterpolation', icon: '60fps' },
  ];

  onChange(change: MatButtonToggleChange) {
    this.change.emit(change.value);
  }
}
