import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketBoothComponent } from './ticket-booth.component';

describe('TicketBoothComponent', () => {
  let component: TicketBoothComponent;
  let fixture: ComponentFixture<TicketBoothComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketBoothComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TicketBoothComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
