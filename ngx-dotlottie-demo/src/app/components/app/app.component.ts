import {
  ChangeDetectionStrategy,
  Component,
  model,
  ViewEncapsulation,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DotlottieWebCanvasComponent } from '../dotlottie-web-canvas/dotlottie-web-canvas.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DotlottieWebCanvasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AppComponent {
  title = 'ngx-dotlottie-demo';

  dotlottieWebURL = model(
    'https://lottie.host/0cbdb3ef-2fa5-4d1d-9e4e-f66c879e010d/D0bRr9d93F.lottie',
  );
  dotlottieWebworkerURL = model(
    'https://lottie.host/15e35e6f-3291-448d-b0f2-263292034c73/cWqhH58Trk.lottie',
  );
}
