import type { DebugElement } from '@angular/core';
import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from '@jest/globals';
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { lastValueFrom, timer } from 'rxjs';
import { setWasmURL } from '../../../../../ssr/src/lib/utils/set-wasm/set-wasm';
import { DotLottieWebWorkerComponent } from '../../../../../webworker/src/lib/components/dotlottie-webworker/dotlottie-webworker.component';
import type { DotLottieWebComponentInputType } from '../../@types/dotlottie-web';
import { DotLottieWebComponent } from './dotlottie-web.component';

describe.each([
  { component: DotLottieWebComponent, instanceType: DotLottie },
  { component: DotLottieWebWorkerComponent, instanceType: DotLottieWorker },
])('$component.name', ({ component: Component, instanceType }) => {
  beforeAll(async () => setWasmURL());

  const isWorkerComponent = instanceType.name === DotLottieWorker.name;
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

    const src =
      'https://lottie.host/0cbdb3ef-2fa5-4d1d-9e4e-f66c879e010d/D0bRr9d93F.lottie';

    const jsonSrc =
      'https://lottie.host/647eb023-6040-4b60-a275-e2546994dd7f/zDCfp5lhLe.json';

    it('should create component with inputs', () => {
      const fixture = createComponent();
      const { componentInstance } = fixture;

      setComponentInput(fixture, { src });

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

    it('should render a lottie file from url(.lottie)', async () => {
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

      const load = jest.spyOn(lottie!, 'load');

      setComponentInput(fixture, { src, canvasClass: 'test' });

      expect(load).toHaveBeenLastCalledWith(expect.objectContaining({ src }));
    });

    it('should render a lottie JSON file from url(JSON)', async () => {
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

      const load = jest.spyOn(lottie!, 'load');

      setComponentInput(fixture, { src: jsonSrc, canvasClass: 'test' });

      await lastValueFrom(timer(1000));

      expect(load).toHaveBeenLastCalledWith(
        expect.objectContaining({ src: jsonSrc }),
      );
    });

    it(
      `should not re-render if same URL is consecutively set in the src prop
      `.trim(),
      async () => {
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

        const load = jest.spyOn(lottie!, 'load');

        setComponentInput(fixture, { src, canvasClass: 'test' });

        await lastValueFrom(timer(1000));

        setComponentInput(fixture, { src, canvasClass: 'test' });

        await lastValueFrom(timer(1000));

        expect(load).toHaveBeenCalledTimes(1);
      },
    );

    it('should render a lottie from ArrayBuffer', async () => {
      const buffer = await readFile(resolve(fixturesDir, 'test.lottie'));

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

      const load = jest.spyOn(lottie!, 'load');

      setComponentInput(fixture, { src: buffer.buffer, canvasClass: 'test' });

      await lastValueFrom(timer(1000));

      setComponentInput(fixture, { src: buffer.buffer, canvasClass: 'test' });

      await lastValueFrom(timer(1000));

      expect(load).toHaveBeenLastCalledWith(
        expect.objectContaining({ data: buffer.buffer }),
      );
    });

    it(
      `should not re-render if same ArrayBuffer is consecutively set in the src prop
      `.trim(),
      async () => {
        const buffer = await readFile(resolve(fixturesDir, 'test.lottie'));

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

        const load = jest.spyOn(lottie!, 'load');

        setComponentInput(fixture, { src: buffer.buffer, canvasClass: 'test' });

        await lastValueFrom(timer(1000));

        setComponentInput(fixture, { src: buffer.buffer, canvasClass: 'test' });

        await lastValueFrom(timer(1000));

        expect(load).toHaveBeenCalledTimes(1);
      },
    );

    it('should render a lottie from JSON', async () => {
      const buffer = await readFile(resolve(fixturesDir, 'test.json'), {
        encoding: 'utf-8',
      });

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

      setComponentInput(fixture, {
        src: JSON.parse(buffer) as Record<string, unknown>,
        canvasClass: 'test',
      });

      const lottie = await lottieInit;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(lottie?.canvas).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();
    });

    // @TODO fix complex object comparison then this test will pass
    it.skip(
      `should not re-render if the same JSON is consecutively in the src prop
      `.trim(),
      async () => {
        const buffer = await readFile(resolve(fixturesDir, 'test.json'), {
          encoding: 'utf-8',
        });

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

        const load = jest.spyOn(lottie!, 'load');

        setComponentInput(fixture, {
          src: JSON.parse(buffer) as Record<string, unknown>,
          canvasClass: 'test',
        });

        await lastValueFrom(timer(1000));

        setComponentInput(fixture, {
          src: JSON.parse(buffer) as Record<string, unknown>,
          canvasClass: 'test',
        });

        await lastValueFrom(timer(1000));

        expect(load).toHaveBeenCalledTimes(1);
      },
    );

    // lottie web-tests
    it('calls dotLottie.play when play prop changes to true', async () => {
      if (isWorkerComponent) return;

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

      setComponentInput(fixture, { src, canvasClass: 'test', play: false });

      const lottie = await lottieInit;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();

      const play = jest.spyOn(lottie!, 'play');

      setComponentInput(fixture, { play: true });

      await lastValueFrom(timer(1000));

      expect(play).toHaveBeenCalled();
      expect(lottie?.isPlaying).toStrictEqual(true);
      expect(lottie?.isPaused).toStrictEqual(false);
    });

    it('calls dotLottie.pause when play prop changes to false', async () => {
      if (isWorkerComponent) return;

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

      setComponentInput(fixture, { src, canvasClass: 'test', play: true });

      const lottie = await lottieInit;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();

      const pause = jest.spyOn(lottie!, 'pause');

      setComponentInput(fixture, { play: false });

      await lastValueFrom(timer(1000));

      expect(pause).toHaveBeenCalled();
    });

    it('calls dotLottie.stop when stop prop changes to true', async () => {
      if (isWorkerComponent) return;

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

      setComponentInput(fixture, { src, canvasClass: 'test', play: true });

      const lottie = await lottieInit;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();

      const stop = jest.spyOn(lottie!, 'stop');

      setComponentInput(fixture, { stop: true });

      await lastValueFrom(timer(1000));

      expect(stop).toHaveBeenCalled();
    });

    it('calls dotLottie.freeze when freeze prop changes to true', async () => {
      if (isWorkerComponent) return;

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

      setComponentInput(fixture, { src, canvasClass: 'test', play: true });

      const lottie = await lottieInit;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();

      const freeze = jest.spyOn(lottie!, 'freeze');

      setComponentInput(fixture, { freeze: true });

      await lastValueFrom(timer(1000));

      expect(freeze).toHaveBeenCalled();
    });

    it(
      `calls dotLottie.unfreeze when freeze prop changes to false
      `.trim(),
      async () => {
        if (isWorkerComponent) return;

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

        setComponentInput(fixture, { src, canvasClass: 'test', play: true });

        const lottie = await lottieInit;
        const canvas = getCanvas(debugElement);

        expect(componentInstance).toBeTruthy();
        expect(lottie).toBeDefined();
        expect(canvas).toBeDefined();
        expect(canvas?.className).toEqual('test');
        expect(canvas?.toDataURL()).toBeDefined();

        const unfreeze = jest.spyOn(lottie!, 'unfreeze');

        setComponentInput(fixture, { freeze: false });

        await lastValueFrom(timer(1000));

        expect(unfreeze).toHaveBeenCalled();
      },
    );

    it('calls dotLottie.setLoop when loop prop changes', async () => {
      if (isWorkerComponent) return;

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

      const setLoop = jest.spyOn(lottie!, 'setLoop');

      setComponentInput(fixture, { loop: false });

      await lastValueFrom(timer(1000));

      expect(setLoop).toHaveBeenLastCalledWith(false);
      expect(lottie?.loop).toStrictEqual(false);
    });

    it('calls dotLottie.setSpeed when speed prop changes', async () => {
      if (isWorkerComponent) return;

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

      const setSpeed = jest.spyOn(lottie!, 'setSpeed');

      setComponentInput(fixture, { speed: 3 });

      await lastValueFrom(timer(1000));

      expect(setSpeed).toHaveBeenLastCalledWith(3);
      expect(lottie?.speed).toStrictEqual(3);
    });

    it('calls dotLottie.setMode when mode prop changes', async () => {
      if (isWorkerComponent) return;

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

      const setMode = jest.spyOn(lottie!, 'setMode');

      setComponentInput(fixture, { mode: 'reverse-bounce' });

      await lastValueFrom(timer(1000));

      expect(setMode).toHaveBeenLastCalledWith('reverse-bounce');
      expect(lottie?.mode).toStrictEqual('reverse-bounce');
    });

    it(
      `
      calls dotLottie.setUseFrameInterpolation when mode useFrameInterpolation changes
      `.trim(),
      async () => {
        if (isWorkerComponent) return;

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

        const setUseFrameInterpolation = jest.spyOn(
          lottie!,
          'setUseFrameInterpolation',
        );

        setComponentInput(fixture, { useFrameInterpolation: true });

        await lastValueFrom(timer(1000));

        expect(setUseFrameInterpolation).toHaveBeenLastCalledWith(true);
        expect(lottie?.useFrameInterpolation).toStrictEqual(true);
      },
    );

    it(
      `calls dotLottie.setBackgroundColor when backgroundColor prop changes
      `.trim(),
      async () => {
        if (isWorkerComponent) return;

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

        const setBackgroundColor = jest.spyOn(lottie!, 'setBackgroundColor');

        setComponentInput(fixture, { backgroundColor: '#3004e0' });

        await lastValueFrom(timer(1000));

        expect(setBackgroundColor).toHaveBeenLastCalledWith('#3004e0');
        expect(lottie?.backgroundColor).toStrictEqual('#3004e0');
      },
    );

    it('calls dotLottie.setMarker when marker prop changes', async () => {
      if (isWorkerComponent) return;

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

      const setMarker = jest.spyOn(lottie!, 'setMarker');

      setComponentInput(fixture, { marker: 'Marker_1' });

      await lastValueFrom(timer(1000));

      expect(setMarker).toHaveBeenLastCalledWith('Marker_1');
      expect(lottie?.marker).toStrictEqual('Marker_1');
    });

    it('calls dotLottie.setSegment when segment prop changes', async () => {
      if (isWorkerComponent) return;

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

      const setSegment = jest.spyOn(lottie!, 'setSegment');

      setComponentInput(fixture, { segment: [0, 10] });

      await lastValueFrom(timer(1000));

      expect(setSegment).toHaveBeenLastCalledWith(0, 10);
    });

    it('calls dotLottie.setTheme when themeId prop changes', async () => {
      if (isWorkerComponent) return;

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

      const setTheme = jest.spyOn(lottie!, 'setTheme');

      setComponentInput(fixture, { themeId: 'Theme_1' });

      await lastValueFrom(timer(1000));

      expect(setTheme).toHaveBeenLastCalledWith('Theme_1');
    });

    it(
      `calls dotLottie.loadAnimation when animationId prop changes
      `.trim(),
      async () => {
        if (isWorkerComponent) return;

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

        setComponentInput(fixture, {
          src,
          canvasClass: 'test',
          animationId: 'Animation_2',
        });

        const lottie = await lottieInit;
        const canvas = getCanvas(debugElement);

        expect(componentInstance).toBeTruthy();
        expect(lottie).toBeDefined();
        expect(canvas).toBeDefined();
        expect(canvas?.className).toEqual('test');
        expect(canvas?.toDataURL()).toBeDefined();

        const loadAnimation = jest.spyOn(lottie!, 'loadAnimation');

        setComponentInput(fixture, { animationId: 'Animation_1' });

        await lastValueFrom(timer(1000));

        expect(loadAnimation).toHaveBeenLastCalledWith('Animation_1');
      },
    );

    it(
      `calls dotLottie.setRenderConfig when autoResize prop changes
      `.trim(),
      async () => {
        if (isWorkerComponent) return;

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

        const autoResize = jest.spyOn(lottie!, 'setRenderConfig');

        setComponentInput(fixture, { autoResize: true });

        await lastValueFrom(timer(1000));

        expect(autoResize).toHaveBeenLastCalledWith(
          expect.objectContaining({ autoResize: true }),
        );

        expect(lottie?.renderConfig.autoResize).toStrictEqual(true);
      },
    );

    it(
      `calls dotLottie.setRenderConfig when freezeOnOffscreen prop changes
      `.trim(),
      async () => {
        if (isWorkerComponent) return;

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

        const freezeOnOffscreen = jest.spyOn(lottie!, 'setRenderConfig');

        setComponentInput(fixture, { freezeOnOffscreen: true });

        await lastValueFrom(timer(1000));

        expect(freezeOnOffscreen).toHaveBeenLastCalledWith(
          expect.objectContaining({ freezeOnOffscreen: true }),
        );

        expect(lottie?.renderConfig.freezeOnOffscreen).toStrictEqual(true);
      },
    );

    it(
      `calls dotLottie.setRenderConfig when devicePixelRatio prop changes
      `.trim(),
      async () => {
        if (isWorkerComponent) return;

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

        const devicePixelRatio = jest.spyOn(lottie!, 'setRenderConfig');

        setComponentInput(fixture, { devicePixelRatio: 2 });

        await lastValueFrom(timer(1000));

        expect(devicePixelRatio).toHaveBeenLastCalledWith(
          expect.objectContaining({ devicePixelRatio: 2 }),
        );

        expect(lottie?.renderConfig.devicePixelRatio).toStrictEqual(2);
      },
    );

    it('calls dotLottie.load when data prop changes', async () => {
      if (isWorkerComponent) return;

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

      const load = jest.spyOn(lottie!, 'load');

      const buffer = await readFile(resolve(fixturesDir, 'test.lottie'));

      setComponentInput(fixture, { src: buffer.buffer });

      await lastValueFrom(timer(1000));

      expect(load).toHaveBeenLastCalledWith(
        expect.objectContaining({ data: buffer.buffer }),
      );
    });

    it('calls dotLottie.load when src prop changes', async () => {
      if (isWorkerComponent) return;

      const buffer = await readFile(resolve(fixturesDir, 'test.lottie'));

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

      setComponentInput(fixture, { src: buffer.buffer, canvasClass: 'test' });

      const lottie = await lottieInit;
      const canvas = getCanvas(debugElement);

      expect(componentInstance).toBeTruthy();
      expect(lottie).toBeDefined();
      expect(canvas).toBeDefined();
      expect(canvas?.className).toEqual('test');
      expect(canvas?.toDataURL()).toBeDefined();

      const load = jest.spyOn(lottie!, 'load');

      setComponentInput(fixture, { src });

      await lastValueFrom(timer(1000));

      expect(load).toHaveBeenLastCalledWith(expect.objectContaining({ src }));
    });

    it('calls dotLottie.setLayout when layout prop changes', async () => {
      if (isWorkerComponent) return;

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

      const setLayout = jest.spyOn(lottie!, 'setLayout');

      setComponentInput(fixture, {
        layout: { align: [0.5, 0.5], fit: 'contain' },
      });

      await lastValueFrom(timer(1000));

      expect(setLayout).toHaveBeenLastCalledWith(
        expect.objectContaining({ align: [0.5, 0.5], fit: 'contain' }),
      );
    });

    it('should set canvas class when canvasClass prop changes', async () => {
      const fixture = createComponent();

      const { componentInstance } = fixture;

      setComponentInput(fixture, { src });

      expect(componentInstance).toBeTruthy();

      expect(componentInstance.canvasClass()).toEqual(
        expect.objectContaining({
          'h-full': true,
          'w-full': true,
        }),
      );

      setComponentInput(fixture, { canvasClass: { hello: 'world' } });

      await lastValueFrom(timer(1000));

      expect(componentInstance.canvasClass()).toEqual(
        expect.objectContaining({ hello: 'world' }),
      );
    });

    it(
      `should freeze lottie if window is not visible class when freezeOnOffscreen prop is true
      `.trim(),
      async () => {
        const fixture = createComponent();

        const { componentInstance } = fixture;

        const lottieInit = new Promise<DotLottie | null>((resolve) => {
          const subscription = componentInstance.lottieInit.subscribe(
            (lottie) => {
              if (lottie) resolve(lottie);
              subscription.unsubscribe();
            },
          );
        });

        setComponentInput(fixture, { src, freezeOnOffscreen: true });

        const lottie = await lottieInit;

        expect(componentInstance).toBeTruthy();

        const freeze = jest.spyOn(lottie!, 'freeze');

        Object.defineProperty(window, 'visibilityState', {
          configurable: true,
          get: () => 'prerender',
        });

        window.dispatchEvent(new Event('visibilitychange'));

        await lastValueFrom(timer(1000));

        expect(freeze).toHaveBeenCalled();
      },
    );

    it(
      `should unfreeze lottie if window is return to after visibility change when freezeOnOffscreen prop is true
      `.trim(),
      async () => {
        const fixture = createComponent();

        const { componentInstance } = fixture;

        const lottieInit = new Promise<DotLottie | null>((resolve) => {
          const subscription = componentInstance.lottieInit.subscribe(
            (lottie) => {
              if (lottie) resolve(lottie);
              subscription.unsubscribe();
            },
          );
        });

        setComponentInput(fixture, { src, freezeOnOffscreen: true });

        const lottie = await lottieInit;

        expect(componentInstance).toBeTruthy();

        const unfreeze = jest.spyOn(lottie!, 'unfreeze');

        Object.defineProperty(window, 'visibilityState', {
          configurable: true,
          get: () => 'prerender',
        });

        window.dispatchEvent(new Event('visibilitychange'));

        await lastValueFrom(timer(1000));

        Object.defineProperty(window, 'visibilityState', {
          configurable: true,
          get: () => 'visible',
        });

        window.dispatchEvent(new Event('visibilitychange'));

        expect(unfreeze).toHaveBeenCalled();
      },
    );

    it(
      `should not freeze or unfreeze lottie if window visibility changes when freezeOnOffscreen prop is false
      `.trim(),
      async () => {
        const fixture = createComponent();

        const { componentInstance } = fixture;

        const lottieInit = new Promise<DotLottie | null>((resolve) => {
          const subscription = componentInstance.lottieInit.subscribe(
            (lottie) => {
              if (lottie) resolve(lottie);
              subscription.unsubscribe();
            },
          );
        });

        setComponentInput(fixture, { src, freezeOnOffscreen: false });

        const lottie = await lottieInit;

        expect(componentInstance).toBeTruthy();

        const freeze = jest.spyOn(lottie!, 'freeze');
        const unfreeze = jest.spyOn(lottie!, 'unfreeze');

        Object.defineProperty(window, 'visibilityState', {
          configurable: true,
          get: () => 'prerender',
        });

        window.dispatchEvent(new Event('visibilitychange'));

        await lastValueFrom(timer(1000));

        Object.defineProperty(window, 'visibilityState', {
          configurable: true,
          get: () => 'visible',
        });

        window.dispatchEvent(new Event('visibilitychange'));

        expect(freeze).not.toHaveBeenCalled();
        expect(unfreeze).not.toHaveBeenCalled();
      },
    );
  });
});
