import { TestBed } from '@angular/core/testing';
import { DotLottieWebService } from './dotlottie-web.service';

describe('DotLottieWebService', () => {
  let service: DotLottieWebService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DotLottieWebService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
