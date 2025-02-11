import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { resolve } from 'node:path';
import type { DotLottieWebworkerComponentInputType } from '../../../../../web/src/lib/@types/dotlottie-web';
import { DotLottieWebWorkerComponent } from './dotlottie-webworker.component';

describe.skip('DotLottieWebworkerComponent', () => {
  const rootDir = resolve(__dirname, '../../../../../');
  const fixturesDir = resolve(rootDir, 'ngx-dotlottie-demo/cypress/fixtures');
  const src = resolve(fixturesDir, 'lottie.json');
  const workerId = 'test';

  function createComponent(
    options: Partial<DotLottieWebworkerComponentInputType> = {},
  ): ComponentFixture<DotLottieWebWorkerComponent> {
    const fixture = TestBed.createComponent(DotLottieWebWorkerComponent);
    const component = fixture.componentRef;

    Object.entries(options).forEach(([key, value]) =>
      component.setInput(key, value),
    );

    fixture.detectChanges();

    return fixture;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotLottieWebWorkerComponent],
    }).compileComponents();
  });

  it('should create component with inputs', () => {
    const { componentInstance } = createComponent({ src, workerId });

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
    expect(componentInstance.workerId()).toBe(workerId);
  });

  it('should require the "src" input', () => {
    const { componentInstance } = createComponent({ workerId });

    expect(componentInstance).toBeTruthy();
    expect(componentInstance.workerId()).toBe(workerId);
    expect(componentInstance.src).toThrow();
  });

  it.skip('should should render a lottie file', async () => {
    const src = resolve(fixturesDir, 'lottie.json');

    const fixture = createComponent({ src, workerId });
    const { componentInstance, componentRef, debugElement } = fixture;

    // const lottie = await new Promise<DotLottie | DotLottieWorker | null>(
    //   (resolve) => {
    //     const subscription = componentInstance.lottieLoad.subscribe(
    //       (lottie) => {
    //         resolve(lottie);
    //         subscription.unsubscribe();
    //       },
    //     );
    //   },
    // );

    // expect(componentInstance).toBeTruthy();
    // expect(componentInstance.workerId()).toBe(workerId);
    // expect(lottie).toBeDefined();
  });
});
