import type { DebugElement } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from '@jest/globals';
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { setWasmURL } from '../../../../../ssr/src/lib/utils/set-wasm/set-wasm';
import { DotLottieWebWorkerComponent } from '../../../../../webworker/src/lib/components/dotlottie-webworker/dotlottie-webworker.component';
import type { DotLottieWebComponentInputType } from '../../@types/dotlottie-web';
import { DotLottieWebComponent } from './dotlottie-web.component';

describe.each([
  { component: DotLottieWebComponent, instanceType: DotLottie },
  { component: DotLottieWebWorkerComponent, instanceType: DotLottieWorker },
])('$component.name', ({ component: Component }) => {
  beforeAll(async () => setWasmURL());

  const rootDir = resolve(__dirname, '../../../../../../../');
  const fixturesDir = resolve(rootDir, 'ngx-dotlottie-demo/cypress/fixtures');

  function createComponent(): ComponentFixture<DotLottieWebComponent> {
    return TestBed.createComponent(Component);
  }

  function setComponentInput(
    fixture: ComponentFixture<DotLottieWebComponent>,
    options: Partial<DotLottieWebComponentInputType> = {},
  ): void {
    const component = fixture.componentRef;

    Object.entries(options).forEach(([key, value]) =>
      component.setInput(key, value),
    );

    fixture.detectChanges(true);
  }

  function getCanvas(element: DebugElement): HTMLCanvasElement | null {
    return (element.nativeElement as HTMLElement).querySelector('canvas');
  }

  describe('Client Side Rendering', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        teardown: { destroyAfterEach: true },
        imports: [DotLottieWebComponent, DotLottieWebWorkerComponent],
      }).compileComponents();
    });

    afterEach(() => TestBed.resetTestingModule());

    const src = pathToFileURL(resolve(fixturesDir, 'lottie.lottie')).href;
    const jsonSrc = pathToFileURL(resolve(fixturesDir, 'lottie.json')).href;

    it('should create component with inputs', () => {
      const fixture = createComponent();
      const { componentInstance } = fixture;

      setComponentInput(fixture, { src });

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
      const fixture = createComponent();
      const { componentInstance } = fixture;

      expect(componentInstance).toBeTruthy();
      expect(componentInstance.src).toThrow();
    });

    it('should should render a lottie file', async () => {
      const fixture = createComponent();

      const { componentInstance, debugElement } = fixture;

      const lottieInit = new Promise<DotLottie | null>((resolve) => {
        const subscription = componentInstance.lottieInit.subscribe(
          (lottie) => {
            if (lottie) resolve(lottie);
            subscription.unsubscribe();
          },
        );
      });

      setComponentInput(fixture, { src, canvasClass: 'test' });

      const lottie = await lottieInit;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(lottie?.canvas).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();
    });

    it('should should render a lottie JSON file', async () => {
      const fixture = createComponent();

      const { componentInstance, debugElement } = fixture;

      const lottieInit = new Promise<DotLottie | null>((resolve) => {
        const subscription = componentInstance.lottieInit.subscribe(
          (lottie) => {
            if (lottie) resolve(lottie);
            subscription.unsubscribe();
          },
        );
      });

      setComponentInput(fixture, { src: jsonSrc, canvasClass: 'test' });

      const lottie = await lottieInit;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(lottie?.canvas).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();
    });

    it('should re-render a lottie file on src input change', async () => {
      const fixture = createComponent();

      const { componentInstance, debugElement } = fixture;

      const lottieInit = new Promise<DotLottie | null>((resolve) => {
        const subscription = componentInstance.lottieInit.subscribe(
          (lottie) => {
            if (lottie) resolve(lottie);
            subscription.unsubscribe();
          },
        );
      });

      setComponentInput(fixture, { src, canvasClass: 'test' });

      const lottie = await lottieInit;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();

      const beforeRerender = new Promise<DotLottie | null>((resolve) => {
        const subscription = componentInstance.lottieInit.subscribe(
          (lottie) => {
            if (lottie) resolve(lottie);
            subscription.unsubscribe();
          },
        );
      });

      setComponentInput(fixture, { src: jsonSrc, canvasClass: 'json-src' });

      const lottieRerender = await beforeRerender;

      const rerenderedCanvas = getCanvas(debugElement);
      const rerenderedLottieCanvas = lottieRerender?.canvas;

      expect(lottieRerender).toBeDefined();
      expect(rerenderedCanvas).toBeDefined();
      expect(rerenderedCanvas?.className).toEqual('json-src');
      expect(rerenderedLottieCanvas).toBeDefined();
      expect(lottie).not.toEqual(lottieRerender);
    });
  });
});
