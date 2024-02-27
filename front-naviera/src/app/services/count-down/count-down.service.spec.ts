import { TestBed } from '@angular/core/testing';

import { CountDownService } from './count-down.service';

describe('CountDownService', () => {
  let service: CountDownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CountDownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
