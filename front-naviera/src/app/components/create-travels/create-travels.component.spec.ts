import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTravelsComponent } from './create-travels.component';

describe('CreateTravelsComponent', () => {
  let component: CreateTravelsComponent;
  let fixture: ComponentFixture<CreateTravelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTravelsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateTravelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
