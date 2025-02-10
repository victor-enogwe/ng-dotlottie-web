# ngx-dotlottie-web

A web component library for rendering dotLottie animations in Angular applications.

## Installation

You can install this package using npm:

```bash
npm install ngx-dotlottie-web
```

## Basic Usage

Import and use the components in your Angular application:

```typescript
// app.component.ts
import { DotLottieWebComponent } from 'ngx-dotlottie-web';
import { DotLottieWebWorkerComponent } from 'ngx-dotlottie-web/webworker';

@Component({
  // ...
  imports: [DotLottieWebComponent, DotLottieWebWorkerComponent],
  // ...
})
```

Basic usage in your template:

```html
<!-- Regular dotLottie player -->
<dotlottie-web
  [src]="'path/to/animation.lottie'"
  [autoplay]="true"
  [loop]="true"
></dotlottie-web>

<!-- Web Worker based player (better performance) -->
<dotlottie-webworker
  [src]="'path/to/animation.lottie'"
  [autoplay]="true"
  [loop]="true"
  workerId="unique-worker-id"
></dotlottie-webworker>
```

Available inputs for both components:

| Input              | Type      | Default   | Description                           |
|-------------------|-----------|-----------|---------------------------------------|
| src               | string    | required  | URL or path to .lottie file          |
| autoplay          | boolean   | true      | Auto-plays animation when loaded      |
| loop              | boolean   | true      | Loops the animation                   |
| autoResize        | boolean   | true      | Adjusts size to container             |
| backgroundColor   | string    | '#FFFFFF' | Background color of the canvas        |
| speed             | number    | undefined | Playback speed                        |

...

Additional inputs for webworker component:
| Input              | Type      | Default   | Description                           |

|-------------------|-----------|-----------|---------------------------------------|
| workerId          | string    | required  | Unique identifier for the web worker service      |

## License

MIT
