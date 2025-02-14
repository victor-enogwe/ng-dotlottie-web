import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      teardown: { destroyAfterEach: true },
      imports: [AppComponent],
      providers: [provideNoopAnimations()],
    }).compileComponents();
  });

  afterEach(() => TestBed.resetTestingModule());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges(true);

    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it("should have the 'ngx-dotlottie-demo' title", () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges(true);

    const app = fixture.componentInstance;
    expect(app.title).toEqual('ngx-dotlottie-demo');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'ngx-dotlottie-demo',
    );
  });
});
