import { NgClass, NgTemplateOutlet } from '@angular/common';
import type { ElementRef } from '@angular/core';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostListener,
  TemplateRef,
  ViewContainerRef,
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
  EMPTY,
  ReplaySubject,
  Subject,
  distinctUntilChanged,
  filter,
  iif,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { DotLottieWebTransferStateService } from '../../../../../common/src/lib/services/dotlottie-web-transfer-state/dotlottie-web-transfer-state.service';
import type {
  DotLottieWebComponentInput,
  DotLottieWebComponentInputType,
  DotLottieWebComponentOutput,
} from '../../@types/dotlottie-web';
import { isTwoEqualObjects } from '../../utils/is-two-equal-objects/is-two-equal-objects';

@Component({
  selector: 'dotlottie-web',
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
        part="part dotlottie-web"
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
export class DotLottieWebComponent
  implements DotLottieWebComponentInput, DotLottieWebComponentOutput
{
  protected Lottie = DotLottie;

  private readonly outletRef = viewChild.required<unknown, ViewContainerRef>(
    'outlet',
    { read: ViewContainerRef },
  );

  private readonly contentRef = viewChild.required<
    unknown,
    TemplateRef<unknown>
  >('content', { read: TemplateRef });

  private readonly canvas =
    viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  private readonly destroyRef = inject(DestroyRef);

  private readonly dotlottie = signal<DotLottie | null>(null);

  private readonly transferState = inject(DotLottieWebTransferStateService);

  private readonly dotlottieConfigEvents$ = new ReplaySubject<{
    name: Exclude<keyof DotLottieWebComponentInputType, 'src'>;
    value: unknown;
  }>();

  private readonly viewChildReady$ = new Subject<boolean>();

  private readonly processEvents$ = this.viewChildReady$.pipe(
    startWith(false),
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

  hostClass = input<NgClass['ngClass']>({ 'd-block': true, relative: true });

  autoplay = input<Config['autoplay']>(true);

  play = input<boolean, boolean>(true, { transform: this.transform('play') });

  stop = input<boolean, boolean>(false, { transform: this.transform('stop') });

  src = input.required<Config['src']>();

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

  useFrameInterpolation = input<
    Config['useFrameInterpolation'],
    Config['useFrameInterpolation']
  >(undefined, { transform: this.transform('useFrameInterpolation') });

  readonly lottieInit = output<DotLottie>();

  private src$ = toObservable(this.src).pipe(
    takeUntilDestroyed(),
    filter((src = '') => src.length > 0),
    distinctUntilChanged(),
    tap((src) => this.setSrc(src)),
  );

  constructor() {
    this.processEvents$.subscribe();

    afterNextRender(() => this.src$.subscribe());

    this.destroyRef.onDestroy(() => this.dotlottie()?.destroy());
  }

  protected loadConfig(): Omit<Config, 'canvas' | 'data' | 'src'> {
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

  private setSrc(value: Config['src']): void {
    this.dotlottie()?.destroy();

    const data = value ? this.transferState.get(value) : undefined;

    const config = this.loadConfig();

    if (data) {
      Object.assign(config, { data });
    } else {
      Object.assign(config, { src: value });
    }

    const outletRef = this.outletRef();
    const contentRef = this.contentRef();

    outletRef.clear();
    outletRef.createEmbeddedView(contentRef);

    const dotlottie = new this.Lottie({
      ...config,
      canvas: this.canvas().nativeElement,
    });

    dotlottie.addEventListener('load', () => {
      this.dotlottie.set(dotlottie);
      this.viewChildReady$.next(true);
    });

    dotlottie.addEventListener('destroy', () => {
      this.viewChildReady$.next(false);
      this.dotlottie.set(null);
    });

    this.lottieInit.emit(dotlottie);
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
