# ngx-dotlottie-web

## Contents

* [Introduction](#introduction)
  * [What is dotLottie?](#what-is-dotlottie)
* [Installation](#installation)
* [Basic Usage](#basic-usage)
* [Live Examples](#live-examples)
* [APIs](#apis)
  * [DotLottieWebComponent](#dotlottiewebcomponent-input-props)
  * [DotLottieWebworkerComponent](#dotlottiewebworkercomponent-input-props)
* [Listening to Events](#listening-to-events)
* [Development](#development)
  * [Setup](#setup)
  * [Dev](#dev)
  * [Build](#build)
  * [Test](#testing)

## Introduction

An Angular library for rendering [lottie](https://lottiefiles.github.io/lottie-docs/) and [dotLottie](https://dotlottie.io) animations in the browser.

### What is dotLottie?

dotLottie is an open-source file format that aggregates one or more Lottie files and their associated resources into a single file. They are ZIP archives compressed with the Deflate compression method and carry the file extension of ".lottie".

[Learn more about dotLottie](https://dotlottie.io/).

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

## Live Examples

[Demo](https://ngx-dotlottie-web.vercel.app)

## APIs

### DotLottieWebComponent

#### DotLottieWebComponent Input Props

The `DotLottieWebComponent` accepts the following props with their detailed primitive types:

| Prop                  | Type                   | Description                                                       |
|-----------------------|------------------------|-------------------------------------------------------------------|
| autoplay              | boolean                | Enables or disables automatic playback of the animation.          |
| backgroundColor       | string                 | Sets the background color of the animation.                       |
| src                   | string                 | Specifies the source URL or data for the animation.               |
| layout                | string                 | Determines the layout configuration for rendering.                |
| loop                  | boolean                | Controls whether the animation should loop.                      |
| marker                | string                 | Defines markers within the animation timeline.                    |
| mode                  | string                 | Sets the rendering mode for the animation.                        |
| autoResize            | boolean                | Enables automatic resizing of the animation canvas.               |
| freezeOnOffscreen     | boolean                | Freezes the animation when it goes offscreen.                       |
| devicePixelRatio      | number                 | Adjusts rendering based on the device’s pixel ratio.                |
| segment               | Array<number, number>       | Specifies starting and ending frames for segmented playback.        |
| speed                 | number                 | Sets the playback speed of the animation.                           |
| themeId               | string                 | Identifies the theme to be applied.                                |
| animationId           | string                 | Optional identifier for the animation instance.                     |
| useFrameInterpolation | boolean                | Enables frame interpolation for smoother animations.               |
| canvasClass           | string \| string[]      | CSS classes to be applied to the canvas element.                   |
| freeze                | boolean                | Manually freezes the animation playback.                           |
| play                  | boolean                | Triggers playback of the animation.                                |
| stop                  | boolean                | Stops the animation playback.                                      |

### DotLottieWebworkerComponent

#### DotLottieWebworkerComponent Input Props

Accepts the same input props as the `DotLottieWebComponent` in addition to the following:

| Prop    | Type   | Description                                      |
|---------|--------|--------------------------------------------------|
| workerId | string | Unique identifier for the web worker instance. |

### Listening to Events

#### Output Props

| Prop       | Type                                 | Description                                                         |
|------------|--------------------------------------|---------------------------------------------------------------------|
| lottieInit | DotLottie or DotLottieWorker instance | Emits the lottie instance when it's initialized (either rendered directly or via a web worker). |

You can listen to regular lottie events and perform direct actions with the lottie instance.

Here is an example. In your component's template, bind to the lottieInit output:

```html
<dotlottie-web
  [src]="'path/to/animation.lottie'"
  [autoplay]="true"
  (lottieInit)="onLottieInit($event)">
</dotlottie-web>
```

In the corresponding TypeScript file, define the handler:

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-animation',
  templateUrl: './animation.component.html'
})
export class AnimationComponent {
  onLottieInit(lottieInstance: any) {
    console.log('Lottie initialized:', lottieInstance);
    // Custom logic with the lottie instance
  }
}
```

[dotLottie](https://github.com/LottieFiles/dotlottie-web/tree/main/packages/webweb/README.md#apis) instance exposes multiple events that can be listened to. You can find the list of events [here](https://github.com/LottieFiles/dotlottie-web/tree/main/packages/webweb/README.md#events).

### Development

#### Setup

Clone the repository and install dependencies using your preferred package manager (e.g., pnpm):

```bash
git clone https://github.com/victor-enogwe/ngx-dotlottie-web.git
cd ngx-dotlottie-web
pnpm install
```

#### Dev

For local development, run the development server to see live changes:

```bash
pnpm start
```

#### Build

To compile the library for production, use:

```bash
pnpm run build
```

You can also build the demo project with:

```bash
pnpm run build:demo
```

## Testing

Run unit tests with Jest:

```bash
pnpm test
```

For end-to-end tests:

```bash
pnpm test:e2e
```

To launch Cypress for interactive testing:

```bash
pnpm cypress:open
```

## License

MIT
