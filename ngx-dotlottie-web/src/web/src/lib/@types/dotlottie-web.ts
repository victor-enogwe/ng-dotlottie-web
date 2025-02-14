import type { NgClass } from '@angular/common';
import type {
  InputSignal,
  InputSignalWithTransform,
  OutputEmitterRef,
} from '@angular/core';
import type {
  Config,
  DotLottie,
  DotLottieWorker,
  RenderConfig,
} from '@lottiefiles/dotlottie-web';

export type AnimationFilename = string;

export interface DotLottieWebComponentInputType {
  autoplay: Config['autoplay'];
  backgroundColor: Config['backgroundColor'];
  src: Config['src'] | Config['data'];
  layout: Config['layout'];
  loop: Config['loop'];
  marker: Config['marker'];
  mode: Config['mode'];
  autoResize: RenderConfig['autoResize'];
  freezeOnOffscreen: RenderConfig['freezeOnOffscreen'];
  devicePixelRatio: RenderConfig['devicePixelRatio'];
  segment: Config['segment'];
  speed: Config['speed'];
  themeId: Config['themeId'];
  animationId: string | undefined;
  useFrameInterpolation: Config['useFrameInterpolation'];
  canvasClass: NgClass['ngClass'];
  freeze: boolean;
  play: boolean;
  stop: boolean;
}

export interface DotLottieWebworkerComponentInputType
  extends DotLottieWebComponentInputType {
  workerId: string;
}

export interface DotLottieWebComponentInput {
  autoplay: InputSignal<Config['autoplay']>;

  backgroundColor: InputSignalWithTransform<
    Config['backgroundColor'],
    Config['backgroundColor']
  >;

  src: InputSignal<Config['src'] | Config['data']>;

  layout: InputSignalWithTransform<Config['layout'], Config['layout']>;

  loop: InputSignalWithTransform<Config['loop'], Config['loop']>;

  marker: InputSignalWithTransform<Config['marker'], Config['marker']>;

  mode: InputSignalWithTransform<Config['mode'], Config['mode']>;

  autoResize: InputSignalWithTransform<
    RenderConfig['autoResize'],
    RenderConfig['autoResize']
  >;

  freezeOnOffscreen: InputSignalWithTransform<
    RenderConfig['freezeOnOffscreen'],
    RenderConfig['freezeOnOffscreen']
  >;

  devicePixelRatio: InputSignalWithTransform<
    RenderConfig['devicePixelRatio'],
    RenderConfig['devicePixelRatio']
  >;

  segment: InputSignalWithTransform<Config['segment'], Config['segment']>;

  speed: InputSignalWithTransform<Config['speed'], Config['speed']>;

  themeId: InputSignalWithTransform<Config['themeId'], Config['themeId']>;

  animationId: InputSignalWithTransform<Config['themeId'], Config['themeId']>;

  useFrameInterpolation: InputSignalWithTransform<
    Config['useFrameInterpolation'],
    Config['useFrameInterpolation']
  >;

  canvasClass: InputSignal<NgClass['ngClass']>;

  freeze: InputSignalWithTransform<boolean, boolean>;

  play: InputSignalWithTransform<boolean, boolean>;

  stop: InputSignalWithTransform<boolean, boolean>;
}

export interface DotLottieWebworkerComponentInput
  extends DotLottieWebComponentInput {
  workerId: InputSignal<string>;
}

export interface DotLottieWebComponentOutput {
  readonly lottieInit: OutputEmitterRef<DotLottie | DotLottieWorker>;
}
