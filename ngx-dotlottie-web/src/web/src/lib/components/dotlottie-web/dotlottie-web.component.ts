import { NgClass } from '@angular/common';
import type { ElementRef } from '@angular/core';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  ViewEncapsulation,
  afterNextRender,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import type { Config, RenderConfig } from '@lottiefiles/dotlottie-web';
import { DotLottie } from '@lottiefiles/dotlottie-web';
import {
  BehaviorSubject,
  EMPTY,
  ReplaySubject,
  distinctUntilChanged,
  filter,
  iif,
  switchMap,
  tap,
} from 'rxjs';
import { DotLottieWebTransferStateService } from '../../../../../common/src/lib/services/dotlottie-web-transfer-state/dotlottie-web-transfer-state.service';
import type {
  DotLottieWebComponentInput,
  DotLottieWebComponentInputType,
  DotLottieWebComponentOutput,
} from '../../@types/dotlottie-web';
import { getSrcLength } from '../../utils/get-src-length/get-src-length';
import { isTwoEqualArrayBuffers } from '../../utils/is-two-equal-array-buffers/is-two-equal-array-buffers';
import { isTwoEqualObjects } from '../../utils/is-two-equal-objects/is-two-equal-objects';
import { isURLOrPath } from '../../utils/is-url-or-path/is-url-or-path';

@Component({
  selector: 'dotlottie-web',
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
export class DotLottieWebComponent
  implements DotLottieWebComponentInput, DotLottieWebComponentOutput
{
  protected Lottie = DotLottie;

  private readonly canvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly destroyRef = inject(DestroyRef);

  private readonly dotlottie = signal<DotLottie | null>(null);

  private readonly transferState = inject(DotLottieWebTransferStateService);

  private readonly dotlottieConfigEvents$ = new ReplaySubject<{
    name: Exclude<keyof DotLottieWebComponentInputType, 'src'>;
    value: unknown;
  }>();

  private readonly viewChildReady$ = new BehaviorSubject<boolean>(false);

  private readonly processEvents$ = this.viewChildReady$.pipe(
    takeUntilDestroyed(),
    switchMap((ready) =>
      iif(
        () => ready,
        this.dotlottieConfigEvents$.pipe(
          distinctUntilChanged(isTwoEqualObjects),
          tap(this.processEvents.bind(this)),
        ),
        EMPTY,
      ),
    ),
  );

  canvasClass = input<NgClass['ngClass']>({ 'w-full': true, 'h-full': true });

  autoplay = input<Config['autoplay']>(true);

  play = input<boolean, boolean>(true, { transform: this.transform('play') });

  stop = input<boolean, boolean>(false, { transform: this.transform('stop') });

  src = input.required<Config['src'] | Config['data']>();

  freeze = input<boolean, boolean>(false, {
    transform: this.transform('freeze'),
  });

  backgroundColor = input<Config['backgroundColor'], Config['backgroundColor']>(
    '#FFFFFF',
    { transform: this.transform('backgroundColor') },
  );

  layout = input<Config['layout'], Config['layout']>(undefined, {
    transform: this.transform('layout'),
  });

  loop = input<Config['loop'], Config['loop']>(true, {
    transform: this.transform('loop'),
  });

  marker = input<Config['marker'], Config['marker']>(undefined, {
    transform: this.transform('marker'),
  });

  mode = input<Config['mode'], Config['mode']>(undefined, {
    transform: this.transform('mode'),
  });

  autoResize = input<RenderConfig['autoResize'], RenderConfig['autoResize']>(
    true,
    { transform: this.transform('autoResize') },
  );

  freezeOnOffscreen = input<
    RenderConfig['freezeOnOffscreen'],
    RenderConfig['freezeOnOffscreen']
  >(true, { transform: this.transform('freezeOnOffscreen') });

  devicePixelRatio = input<
    RenderConfig['devicePixelRatio'],
    RenderConfig['devicePixelRatio']
  >(undefined, { transform: this.transform('devicePixelRatio') });

  segment = input<Config['segment'], Config['segment']>(undefined, {
    transform: this.transform('segment'),
  });

  speed = input<Config['speed'], Config['speed']>(undefined, {
    transform: this.transform('speed'),
  });

  themeId = input<Config['themeId'], Config['themeId']>(undefined, {
    transform: this.transform('themeId'),
  });

  animationId = input<Config['themeId'], Config['themeId']>(undefined, {
    transform: this.transform('animationId'),
  });

  useFrameInterpolation = input<
    Config['useFrameInterpolation'],
    Config['useFrameInterpolation']
  >(undefined, { transform: this.transform('useFrameInterpolation') });

  readonly lottieInit = output<DotLottie>();

  private src$ = toObservable(this.src).pipe(
    takeUntilDestroyed(),
    filter((src = '') => getSrcLength(src) > 0),
    distinctUntilChanged((a, b) => this.compareSrc(a, b)),
    tap((src) => this.setSrc(src)),
  );

  constructor() {
    this.processEvents$.subscribe();

    afterNextRender(() => this.src$.subscribe());

    this.destroyRef.onDestroy(() => this.dotlottie()?.destroy());
  }

  protected getConfig(): Omit<Config, 'canvas' | 'data' | 'src'> {
    return {
      autoplay: this.autoplay(),
      loop: this.loop(),
      layout: this.layout(),
      marker: this.marker(),
      mode: this.mode(),
      backgroundColor: this.backgroundColor(),
      segment: this.segment(),
      speed: this.speed(),
      themeId: this.themeId(),
      useFrameInterpolation: this.useFrameInterpolation(),
      renderConfig: {
        devicePixelRatio: this.devicePixelRatio(),
        autoResize: this.autoResize(),
        freezeOnOffscreen: this.freezeOnOffscreen(),
      },
    };
  }

  // eslint-disable-next-line complexity
  private compareSrc(a: Config['data'], b: Config['data']): boolean {
    switch (true) {
      case a instanceof ArrayBuffer && b instanceof ArrayBuffer:
        return isTwoEqualArrayBuffers(a, b);
      case typeof a === 'string' && typeof b === 'string':
      case a instanceof String && b instanceof String:
        return a.localeCompare(b as string) === 0;
      case Array.isArray(a) && Array.isArray(b):
      case typeof a === 'object' && typeof b === 'object':
        return isTwoEqualObjects(
          a as Record<string, unknown>,
          b as Record<string, unknown>,
        );
      default:
        return false;
    }
  }

  private setSrc(value: Config['data']): void {
    this.viewChildReady$.next(false);

    const isURL = isURLOrPath(value);

    const data = isURL
      ? value
        ? this.transferState.get(value as string)
        : undefined
      : value;

    const config = this.getConfig();

    if (data) {
      Object.assign(config, { data });
    } else {
      Object.assign(config, { src: value });
    }

    const dotLottie = this.dotlottie();

    if (dotLottie) {
      return dotLottie.load(config);
    }

    const dotlottie = new this.Lottie({
      ...config,
      canvas: this.canvas().nativeElement,
    });

    dotlottie.addEventListener('load', () => {
      this.viewChildReady$.next(true);
    });

    dotlottie.addEventListener('destroy', () => {
      this.viewChildReady$.next(false);
    });

    this.dotlottie.set(dotlottie);

    return this.lottieInit.emit(dotlottie);
  }

  private setBackgroundColor(value: Config['backgroundColor']): void {
    this.dotlottie()?.setBackgroundColor(value!);
  }

  private setLayout(value: Config['layout']): void {
    this.dotlottie()?.setLayout(value!);
  }

  private setMarker(value: Config['marker']): void {
    this.dotlottie()?.setMarker(value!);
  }

  private setMode(value: Config['mode']): void {
    this.dotlottie()?.setMode(value!);
  }

  private setSegment(value: Config['segment']): void {
    this.dotlottie()?.setSegment(...value!);
  }

  private setSpeed(value: Config['speed']): void {
    this.dotlottie()?.setSpeed(value!);
  }

  private setThemeId(value: Config['themeId']): void {
    this.dotlottie()?.setTheme(value!);
  }

  private setAnimationId(value: Config['themeId']): void {
    this.dotlottie()?.loadAnimation(value!);
  }

  private setAutoResize(value: RenderConfig['autoResize'] = false): void {
    this.dotlottie()?.setRenderConfig({
      ...(this.dotlottie()?.renderConfig ?? {}),
      autoResize: value,
    });
  }

  private setFreezeOnOffscreen(
    value: RenderConfig['freezeOnOffscreen'] = false,
  ): void {
    this.dotlottie()?.setRenderConfig({
      ...(this.dotlottie()?.renderConfig ?? {}),
      freezeOnOffscreen: value,
    });
  }

  private setDevicePixelRatio(value: RenderConfig['devicePixelRatio']): void {
    this.dotlottie()?.setRenderConfig({
      ...(this.dotlottie()?.renderConfig ?? {}),
      devicePixelRatio: value,
    });
  }

  private setLoop(value: Config['loop'] = false): void {
    this.dotlottie()?.setLoop(value);
  }

  private setUseFrameInterpolation(
    value: Config['useFrameInterpolation'] = false,
  ): void {
    this.dotlottie()?.setUseFrameInterpolation(value);
  }

  private setStop(value: boolean = false): void {
    if (value) this.dotlottie()?.stop();
  }

  private setFreeze(value: boolean = false): void {
    if (value) {
      this.dotlottie()?.freeze();
    } else {
      this.dotlottie()?.unfreeze();
    }
  }

  private setPlay(value: boolean = false): void {
    if (value) {
      this.dotlottie()?.play();
    } else {
      this.dotlottie()?.pause();
    }
  }

  private transform<T>(
    key: Exclude<keyof DotLottieWebComponentInputType, 'src'>,
  ): (value: T) => T {
    return (value: T) => {
      this.dotlottieConfigEvents$.next({ name: key, value });

      return value;
    };
  }

  // eslint-disable-next-line complexity
  private processEvents({
    name,
    value,
  }: {
    name: Exclude<keyof DotLottieWebComponentInputType, 'src'>;
    value: unknown;
  }): void {
    switch (name) {
      case 'backgroundColor':
        return this.setBackgroundColor(value as Config['backgroundColor']);
      case 'layout':
        return this.setLayout(value as Config['layout']);
      case 'loop':
        return this.setLoop(value as Config['loop']);
      case 'marker':
        return this.setMarker(value as Config['marker']);
      case 'mode':
        return this.setMode(value as Config['mode']);
      case 'devicePixelRatio':
        return this.setDevicePixelRatio(
          value as RenderConfig['devicePixelRatio'],
        );
      case 'segment':
        return this.setSegment(value as Config['segment']);
      case 'speed':
        return this.setSpeed(value as Config['speed']);
      case 'themeId':
        return this.setThemeId(value as Config['themeId']);
      case 'animationId':
        return this.setAnimationId(value as Config['themeId']);
      case 'stop':
        return this.setStop(value as boolean);
      case 'autoResize':
        return this.setAutoResize(value as RenderConfig['autoResize']);
      case 'freezeOnOffscreen':
        return this.setFreezeOnOffscreen(
          value as RenderConfig['freezeOnOffscreen'],
        );
      case 'freeze':
        return this.setFreeze(value as boolean);
      case 'play':
        return this.setPlay(value as boolean);
      case 'useFrameInterpolation':
        return this.setUseFrameInterpolation(
          value as Config['useFrameInterpolation'],
        );
      default:
        return undefined;
    }
  }

  @HostListener('window:visibilitychange', ['$event.target'])
  protected onVisibilityChange(element: Document): void {
    if (!this.freezeOnOffscreen()) return;

    const visible = element.visibilityState === 'visible';

    if (visible) {
      this.dotlottie()?.unfreeze();
    } else {
      this.dotlottie()?.freeze();
    }
  }
}
