import type { DebugElement } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from '@jest/globals';
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { provideDotLottieWebSSROptions } from '../../../../../public-api-ssr';
import { DotLottieWebWorkerComponent } from '../../../../../webworker/src/lib/components/dotlottie-webworker/dotlottie-webworker.component';
import type { DotLottieWebComponentInputType } from '../../@types/dotlottie-web';
import { DotLottieWebComponent } from './dotlottie-web.component';

describe.each([
  { component: DotLottieWebComponent, instanceType: DotLottie },
  { component: DotLottieWebWorkerComponent, instanceType: DotLottieWorker },
])('$component.name', ({ component: Component }) => {
  const rootDir = resolve(__dirname, '../../../../../../../');
  const fixturesDir = resolve(rootDir, 'ngx-dotlottie-demo/cypress/fixtures');

  function createComponent<T = unknown>(
    options: Partial<DotLottieWebComponentInputType> = {},
    beforeSetInput?: (
      fixture: ComponentFixture<DotLottieWebComponent>,
    ) => Promise<T>,
  ): {
    fixture: ComponentFixture<DotLottieWebComponent>;
    beforeInput: Promise<T | null>;
  } {
    const fixture = TestBed.createComponent(Component);

    const component = fixture.componentRef;

    const beforeInput = beforeSetInput
      ? beforeSetInput(fixture)
      : Promise.resolve(null);

    Object.entries(options).forEach(([key, value]) =>
      component.setInput(key, value),
    );

    fixture.detectChanges();

    return { fixture, beforeInput };
  }

  function getCanvas(element: DebugElement): HTMLCanvasElement | null {
    return (element.nativeElement as HTMLElement).querySelector('canvas');
  }

  describe('Client Side Rendering', () => {
    beforeEach(async () => {
      await TestBed.resetTestingModule()
        .configureTestingModule({
          teardown: { destroyAfterEach: true },
          imports: [DotLottieWebComponent, DotLottieWebWorkerComponent],
        })
        .compileComponents();
    });

    const src = pathToFileURL(resolve(fixturesDir, 'lottie.lottie')).href;
    const jsonSrc = pathToFileURL(resolve(fixturesDir, 'test.json')).href;

    it('should create component with inputs', () => {
      const { fixture } = createComponent({ src });
      const { componentInstance } = fixture;

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
      const { fixture } = createComponent();
      const { componentInstance } = fixture;

      expect(componentInstance).toBeTruthy();
      expect(componentInstance.src).toThrow();
    });

    it('should should render a lottie file', async () => {
      const { fixture, beforeInput } = createComponent<DotLottie | null>(
        { src, canvasClass: 'test' },
        async ({ componentInstance }) => {
          const lottie = await new Promise<DotLottie | null>((resolve) => {
            const subscription = componentInstance.lottieInit.subscribe(
              (lottie) => {
                if (lottie) resolve(lottie);
                subscription.unsubscribe();
              },
            );
          });

          return lottie;
        },
      );

      const lottie = await beforeInput;

      const { componentInstance, debugElement } = fixture;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();
    });

    it('should should render a lottie JSON file', async () => {
      const { fixture, beforeInput } = createComponent<DotLottie | null>(
        { src: jsonSrc, canvasClass: 'test' },
        async ({ componentInstance }) => {
          const lottie = await new Promise<DotLottie | null>((resolve) => {
            const subscription = componentInstance.lottieInit.subscribe(
              (lottie) => {
                if (lottie) resolve(lottie);
                subscription.unsubscribe();
              },
            );
          });

          return lottie;
        },
      );

      const lottie = await beforeInput;

      const { componentInstance, debugElement } = fixture;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();
    });

    it.skip('should re-render a lottie file on src input change', async () => {
      const { fixture, beforeInput } = createComponent<DotLottie | null>(
        { src, canvasClass: 'test' },
        async ({ componentInstance }) => {
          const lottie = await new Promise<DotLottie | null>((resolve) => {
            const subscription = componentInstance.lottieInit.subscribe(
              (lottie) => {
                if (lottie) resolve(lottie);
                subscription.unsubscribe();
              },
            );
          });

          return lottie;
        },
      );

      const lottie = await beforeInput;

      const { componentInstance, debugElement } = fixture;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();

      // const beforeRerender = new Promise<DotLottie | null>((resolve) => {
      //   const subscription = componentInstance.lottieInit.subscribe(
      //     (lottie) => {
      //       if (lottie) resolve(lottie);
      //       subscription.unsubscribe();
      //     },
      //   );
      // });

      // componentRef.setInput('src', jsonSrc);
      // const lottieRerender = await beforeRerender;

      // const rerenderedCanvas = getCanvas(debugElement);

      // expect(lottieRerender).toBeDefined();
      // expect(rerenderedCanvas).toBeDefined();
      // expect(rerenderedCanvas?.toDataURL()).toBeDefined();
      // expect(lottie).not.toEqual(lottieRerender);
    });
  });

  describe.skip('Server Side Rendering', () => {
    beforeEach(async () => {
      await TestBed.resetTestingModule()
        .configureTestingModule({
          teardown: { destroyAfterEach: true },
          imports: [
            Component,
            provideDotLottieWebSSROptions({
              preloadAnimations: {
                folder: fixturesDir,
                animations: ['lottie.json', 'lottie.lottie'],
              },
            }),
          ],
        })
        .compileComponents();
    });

    it('should create component with inputs', () => {});
  });
});
