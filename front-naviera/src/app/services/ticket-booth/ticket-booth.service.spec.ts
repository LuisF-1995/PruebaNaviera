import { TestBed } from '@angular/core/testing';

import { TicketBoothService } from './ticket-booth.service';

describe('TicketBoothService', () => {
  let service: TicketBoothService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketBoothService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
