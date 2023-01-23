import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarteraCasosComponent } from './cartera-casos.component';

describe('CarteraInsumosComponent', () => {
  let component: CarteraCasosComponent;
  let fixture: ComponentFixture<CarteraCasosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarteraCasosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteraCasosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
