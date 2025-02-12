import type { NgClass } from '@angular/common';
import type { DebugElement } from '@angular/core';
import { Component, input, output } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import type {
  BaseEvent,
  Config,
  DotLottie,
  RenderConfig,
} from '@lottiefiles/dotlottie-web';
import { resolve } from 'node:path';
import { URL, pathToFileURL } from 'node:url';
import type {
  DotLottieWebComponentInput,
  DotLottieWebComponentInputType,
  DotLottieWebComponentOutput,
} from '../../@types/dotlottie-web';
import { DotLottieWebComponent } from './dotlottie-web.component';

@Component({
  template: `
    <dotlottie-web
      [canvasClass]="canvasClass()"
      [hostClass]="hostClass()"
      [autoplay]="autoplay()"
      [play]="play()"
      [stop]="stop()"
      [src]="src()"
      [freeze]="freeze()"
      [backgroundColor]="backgroundColor()"
      [layout]="layout()"
      [loop]="loop()"
      [marker]="marker()"
      [mode]="mode()"
      [autoResize]="autoResize()"
      [freezeOnOffscreen]="freezeOnOffscreen()"
      [devicePixelRatio]="devicePixelRatio()"
      [segment]="segment()"
      [speed]="speed()"
      [themeId]="themeId()"
      [useFrameInterpolation]="useFrameInterpolation()"
      (lottieLoad)="onEvent($event)"
      (lottieLoadError)="onEvent($event)"
      (lottiePlay)="onEvent($event)"
      (lottiePause)="onEvent($event)"
      (lottieStop)="onEvent($event)"
      (lottieLoop)="onEvent($event)"
      (lottieComplete)="onEvent($event)"
      (lottieFrame)="onEvent($event)"
      (lottieDestroy)="onEvent($event)"
      (lottieFreeze)="onEvent($event)"
      (lottieUnfreeze)="onEvent($event)"
      (lottieRender)="onEvent($event)"
    ></dotlottie-web>
  `,
  standalone: true,
  imports: [DotLottieWebComponent],
})
export class TestComponent implements DotLottieWebComponentInput {
  canvasClass = input<NgClass['ngClass']>({ 'w-full': true, 'h-full': true });
  hostClass = input<NgClass['ngClass']>({ 'd-block': true, relative: true });
  autoplay = input<Config['autoplay']>(true);
  play = input<boolean>(true);
  stop = input<boolean>(false);
  src = input.required<Config['src']>();
  freeze = input<boolean>(false);
  backgroundColor = input<Config['backgroundColor']>('#FFFFFF');
  layout = input<Config['layout']>(undefined);
  loop = input<Config['loop']>(true);
  marker = input<Config['marker']>(undefined);
  mode = input<Config['mode']>(undefined);
  autoResize = input<RenderConfig['autoResize']>(true);
  freezeOnOffscreen = input<RenderConfig['freezeOnOffscreen']>(true);
  devicePixelRatio = input<RenderConfig['devicePixelRatio']>(undefined);
  segment = input<Config['segment']>(undefined);
  speed = input<Config['speed']>(undefined);
  themeId = input<Config['themeId']>(undefined);
  useFrameInterpolation = input<Config['useFrameInterpolation']>(undefined);

  readonly events$ = output<{
    name: keyof DotLottieWebComponentOutput;
    data: unknown;
  }>();

  onEvent({ type, ...data }: BaseEvent): void {
    const name = `lottie${type[0].toUpperCase()}${type.substring(1)}`;

    this.events$.emit({
      name: name as keyof DotLottieWebComponentOutput,
      data,
    });
  }
}

describe('DotLottieWebComponent', () => {
  const rootDir = resolve(__dirname, '../../../../../../../');
  const fixturesDir = resolve(rootDir, 'ngx-dotlottie-demo/cypress/fixtures');
  const fixturesDirExternal =
    'https://github.com/victor-enogwe/ngx-dotlottie-web/tree/main/ngx-dotlottie-demo/cypress/fixtures/';

  function createComponent(
    options: Partial<DotLottieWebComponentInputType> = {},
  ): ComponentFixture<DotLottieWebComponent> {
    const fixture = TestBed.createComponent(DotLottieWebComponent);
    const component = fixture.componentRef;

    Object.entries(options).forEach(([key, value]) =>
      component.setInput(key, value),
    );

    fixture.detectChanges();

    return fixture;
  }

  function getCanvas(element: DebugElement): HTMLCanvasElement | null {
    return (element.nativeElement as HTMLElement).querySelector('canvas');
  }

  describe('Client Side Rendering', () => {
    const src = new URL('lottie.json', fixturesDirExternal).href;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [DotLottieWebComponent],
      }).compileComponents();
    });

    it('should create component with inputs', () => {
      const { componentInstance } = createComponent({ src });

      const hostClass = expect.objectContaining({
        'd-block': true,
        relative: true,
      });

      const canvasClass = expect.objectContaining({
        'h-full': true,
        'w-full': true,
      });

      expect(componentInstance).toBeTruthy();
      expect(componentInstance.autoplay()).toBeTruthy();
      expect(componentInstance.backgroundColor()).toEqual('#FFFFFF');
      expect(componentInstance.src()).toBe(src);
      expect(componentInstance.layout()).toBeUndefined();
      expect(componentInstance.loop()).toBeTruthy();
      expect(componentInstance.marker()).toBeUndefined();
      expect(componentInstance.mode()).toBeUndefined();
      expect(componentInstance.devicePixelRatio()).toEqual(undefined);
      expect(componentInstance.autoResize()).toEqual(true);
      expect(componentInstance.freezeOnOffscreen()).toEqual(true);
      expect(componentInstance.segment()).toBeUndefined();
      expect(componentInstance.speed()).toBeUndefined();
      expect(componentInstance.themeId()).toBeUndefined();
      expect(componentInstance.useFrameInterpolation()).toBeUndefined();
      expect(componentInstance.canvasClass()).toEqual(canvasClass);
      expect(componentInstance.hostClass()).toEqual(hostClass);
      expect(componentInstance.freeze()).toBeFalsy();
      expect(componentInstance.play()).toBeTruthy();
      expect(componentInstance.stop()).toBeFalsy();
    });

    it('should require the "src" input', () => {
      const { componentInstance } = createComponent();

      expect(componentInstance).toBeTruthy();
      expect(componentInstance.src).toThrow();
    });

    it.only('should should render a lottie file', async () => {
      const fixture = createComponent({ src, canvasClass: 'test' });
      const { componentInstance, debugElement } = fixture;

      await fetch(src).then((response) =>
        response.arrayBuffer().then(console.log),
      );

      await fixture.whenRenderingDone();

      // const canvas = getCanvas(debugElement);

      const lottie = await new Promise<DotLottie | null>((resolve) => {
        const subscription = componentInstance.lottieInit.subscribe(
          (lottie) => {
            if (lottie) resolve(lottie);
            subscription.unsubscribe();
          },
        );
      });

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
    });
  });

  describe('Server Side Rendering', () => {
    const src = pathToFileURL(resolve(fixturesDir, 'lottie.json')).href;
  });
});
