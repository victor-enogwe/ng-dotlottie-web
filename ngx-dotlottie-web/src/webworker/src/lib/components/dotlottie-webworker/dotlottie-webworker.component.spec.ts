import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { setWasmURL } from '../../../../../ssr/src/lib/utils/set-wasm/set-wasm';
import { DotLottieWebWorkerComponent } from './dotlottie-webworker.component';

describe('DotLottieWebworkerComponent', () => {
  beforeAll(async () => setWasmURL());

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: true },
      imports: [DotLottieWebWorkerComponent],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  const src =
    'https://lottie.host/0cbdb3ef-2fa5-4d1d-9e4e-f66c879e010d/D0bRr9d93F.lottie';
  const workerId = 'test';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotLottieWebWorkerComponent],
    }).compileComponents();
  });

  it('should create component with workerId input', () => {
    const fixture = TestBed.createComponent(DotLottieWebWorkerComponent);
    const { componentRef, componentInstance } = fixture;

    componentRef.setInput('src', src);
    componentRef.setInput('workerId', workerId);

    fixture.detectChanges();

    expect(componentInstance).toBeTruthy();
    expect(componentInstance.workerId()).toBe(workerId);
  });
});
