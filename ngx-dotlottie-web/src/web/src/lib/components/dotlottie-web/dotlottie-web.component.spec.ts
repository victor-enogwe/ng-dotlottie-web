import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { resolve } from 'node:path';
import { DotLottieWebComponentInputType } from '../../@types/dotlottie-web';
import { DotLottieWebComponent } from './dotlottie-web.component';

describe('DotLottieWebComponent', () => {
  const rootDir = resolve(__dirname, '../../../../../');
  const fixturesDir = resolve(rootDir, 'ngx-dotlottie-demo/cypress/fixtures');
  const src =
    'https://github.com/LottieFiles/dotlottie-web/blob/1c925ceec9fbc0d0a08b2ccbc2ca712a2bf750c0/packages/web/tests/__fixtures__/test.json';

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

  it('should should render a lottie file', async () => {
    const fixture = createComponent({ src });
    const { componentInstance, debugElement } = fixture;

    fixture.getDeferBlocks();

    const canvas = debugElement.nativeElement.querySelector('canvas');
    const svg = debugElement.nativeElement.querySelector('svg');

    console.log('canvas', svg, canvas);

    const lottie = await new Promise<DotLottie | DotLottieWorker | null>(
      (resolve) => {
        const subscription = componentInstance.lottieInit.subscribe(
          (lottie) => {
            resolve(lottie);
            subscription.unsubscribe();
          },
        );
      },
    );

    expect(componentInstance).toBeTruthy();
    expect(lottie).toBeDefined();
  });
});
