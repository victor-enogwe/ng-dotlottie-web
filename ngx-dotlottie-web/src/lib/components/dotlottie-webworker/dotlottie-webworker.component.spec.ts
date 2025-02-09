import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DotLottie, DotLottieWorker } from '@lottiefiles/dotlottie-web';
import { resolve } from 'node:path';
import { DotLottieWebworkerComponentInputType } from '../../@types/dotlottie-web';
import { DotLottieWebWorkerComponent } from './dotlottie-webworker.component';

describe('DotLottieWebworkerComponent', () => {
  const rootDir = resolve(__dirname, '../../../../../');
  const fixturesDir = resolve(rootDir, 'ngx-dotlottie-demo/cypress/fixtures');
  const wasmURL = '@lottiefiles/dotlottie-web/dist/dotlottie-player.wasm';
  const wasmModule = require.resolve(wasmURL);

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

  it('should create ngx-dotlottie-component with inputs', () => {
    const { componentInstance } = createComponent({
      src: '',
      workerId: 'test',
    });

    const renderConfig = expect.objectContaining({
      autoResize: true,
      freezeOnOffscreen: true,
    });

    const hostClass = expect.objectContaining({ 'w-full': true });

    expect(componentInstance).toBeTruthy();
    expect(componentInstance.autoplay()).toBeTruthy();
    expect(componentInstance.backgroundColor()).toEqual('#FFFFFF');
    expect(componentInstance.src()).toBe('');
    expect(componentInstance.layout()).toBeUndefined();
    expect(componentInstance.loop()).toBeTruthy();
    expect(componentInstance.marker()).toBeUndefined();
    expect(componentInstance.mode()).toBeUndefined();
    expect(componentInstance.devicePixelRatio()).toEqual(renderConfig);
    expect(componentInstance.segment()).toBeUndefined();
    expect(componentInstance.speed()).toBeUndefined();
    expect(componentInstance.themeId()).toBeUndefined();
    expect(componentInstance.useFrameInterpolation()).toBeUndefined();
    expect(componentInstance.canvasClass()).toBeUndefined();
    expect(componentInstance.hostClass()).toEqual(hostClass);
    expect(componentInstance.freeze()).toBeFalsy();
    expect(componentInstance.play()).toBeTruthy();
    expect(componentInstance.stop()).toBeFalsy();
    expect(componentInstance.workerId()).toBe('test');
  });

  it('should require the "src" input', () => {
    const { componentInstance } = createComponent();

    expect(componentInstance).toBeTruthy();
    expect(componentInstance.src).toThrow();
  });

  it('should should render a lottie file', async () => {
    const src = resolve(fixturesDir, 'lottie.json');

    const fixture = createComponent({ src });
    const { componentInstance, componentRef, debugElement } = fixture;

    const main = fixture.debugElement.query(By.css('main'));
    const svg = main.nativeElement.querySelector('svg');

    console.log(svg);

    componentRef.setInput('useWebWorkers', false);

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
