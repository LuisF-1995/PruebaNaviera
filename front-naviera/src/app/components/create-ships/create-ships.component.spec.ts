import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateShipsComponent } from './create-ships.component';

describe('CreateShipsComponent', () => {
  let component: CreateShipsComponent;
  let fixture: ComponentFixture<CreateShipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateShipsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateShipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
